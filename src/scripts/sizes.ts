// Copyright 2023 J.W. Lagendijk. All rights reserved. MIT license.

import {
  convert,
  exists,
  gzipSize,
  join,
  Uint8ArrayReader,
  Uint8ArrayWriter,
  walk,
  ZipReader,
} from "../../deps.ts";

import check from "./check.ts";

const readMpkFile = async (fileUri: string): Promise<
  Array<{
    path: string;
    size: string;
    gzip: string;
  }>
> => {
  const file = await Deno.readFile(fileUri);
  const uintReader = new Uint8ArrayReader(file);
  const zipReader = new ZipReader(uintReader);

  const zipEntries = await zipReader.getEntries();

  const entries = Promise.all(
    zipEntries.filter((entry) =>
      (entry.filename.endsWith(".js") || entry.filename.endsWith(".mjs")) &&
      !entry.filename.includes("editorConfig") &&
      !entry.filename.includes("editorPreview")
    ).map(async (entry) => {
      const writer = new Uint8ArrayWriter();
      if (entry.compressedSize === 0 || entry.uncompressedSize === 0) {
        return {
          path: entry.filename,
          size: "0",
          gzip: "0",
        };
      }
      // Not using webworkers, as this seems to significantly slow down the reading progress
      await entry.getData!(writer, {
        transferStreams: false,
        useWebWorkers: false,
      });
      const data = await writer.getData();
      const gzip = await gzipSize(data);
      return {
        path: entry.filename,
        size: convert.bytes(data.length, { accuracy: 2 }),
        gzip: convert.bytes(gzip, { accuracy: 2 }),
      };
    }),
  );

  await zipReader.close();

  return entries;
};

const sizes = async (silent = false) => {
  const { rootFolder, valid } = await check();

  if (!valid) {
    console.log("Not a valid widget folder");
    return false;
  }

  const mpkFolder = join(rootFolder, "dist");
  const mpkFolderExists = await exists(mpkFolder, {
    isDirectory: true,
    isReadable: true,
  });

  if (!mpkFolderExists) {
    console.log("No dist folder found");
    return false;
  }

  const mpks = [];
  for await (const entry of walk(mpkFolder, { maxDepth: 2, exts: ["mpk"] })) {
    const path = entry.path;
    const version = entry.path.replace(`${mpkFolder}/`, "").split("/")[0];
    mpks.push({
      path,
      version,
    });
  }

  if (mpks.length === 0) {
    console.log("No mpks found");
    return false;
  }

  const sizes = Promise.all(
    mpks.map(async (mpk) => {
      const stat = await Deno.stat(mpk.path);
      const files = await readMpkFile(mpk.path);

      return {
        version: mpk.version,
        size: convert.bytes(stat.size, { accuracy: 2 }),
        files,
      };
    }),
  );

  if (silent) {
    return sizes;
  }

  console.log("Version\t\tSize\t\t(js)\t\t(gzip)");
  (await sizes).forEach((size) => {
    console.log(`${size.version}\t\t${size.size}`);
    size.files.forEach((file) => {
      console.log(`\t${file.path}\t\t${file.size}\t\t${file.gzip}`);
    });
  });

  return sizes;
};

export default sizes;
