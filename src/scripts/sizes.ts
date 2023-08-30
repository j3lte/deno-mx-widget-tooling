// Copyright 2023 J.W. Lagendijk. All rights reserved. MIT license.

import { convert, exists, gzipSize, join, readZip, walk } from "../../deps.ts";

import check from "./check.ts";

const sizes = async () => {
  const { rootFolder, valid } = await check();

  if (!valid) {
    console.log("Not a valid widget folder");
    return;
  }

  const mpkFolder = join(rootFolder, "dist");
  const mpkFolderExists = await exists(mpkFolder, {
    isDirectory: true,
    isReadable: true,
  });

  if (!mpkFolderExists) {
    console.log("No dist folder found");
    return;
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
    return;
  }

  const sizes = Promise.all(
    mpks.map(async (mpk) => {
      const stat = await Deno.stat(mpk.path);
      const zip = await readZip(mpk.path);

      const files = zip.files();
      const paths = Object.keys(files).filter((path) => {
        return (path.endsWith(".js") || path.endsWith(".mjs")) &&
          !path.includes("editorConfig") && !path.includes("editorPreview");
      });
      const filesRead = await Promise.all(
        paths.map(async (path) => {
          const f = files[path];
          const content = await f.async("uint8array");
          const gzip = await gzipSize(content);
          return {
            path,
            gzip: convert.bytes(gzip, { accuracy: 2 }),
            size: convert.bytes(content.length, { accuracy: 2 }),
          };
        }),
      );

      return {
        version: mpk.version,
        size: convert.bytes(stat.size, { accuracy: 2 }),
        files: filesRead,
      };
    }),
  );

  console.log("Version\t\tSize\t\t(js)\t\t(gzip)");
  (await sizes).forEach((size) => {
    console.log(`${size.version}\t\t${size.size}`);
    size.files.forEach((file) => {
      console.log(`\t${file.path}\t\t${file.size}\t\t${file.gzip}`);
    });
  });
};

export default sizes;
