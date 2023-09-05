// Copyright 2023 J.W. Lagendijk. All rights reserved. MIT license.

import { exists, Image, join } from "../../deps.ts";

import check from "./check.ts";

const iconSize = 64;
const tileSize = [256, 192];

interface IconsOptions {
  fileUrl?: string;
  darkUrl?: string;
  iconPadding?: number;
  tilePadding?: number;
}

const readImage = async (fileUri: string): Promise<Image> => {
  if (fileUri.endsWith(".svg")) {
    const svg = await Deno.readTextFile(fileUri);
    const img = Image.renderSVG(svg, 1, Image.SVG_MODE_SCALE);
    return img.clone().fit(tileSize[1] - 10, tileSize[1] - 10);
  }
  const fileImage = await Deno.readFile(fileUri);
  return await Image.decode(fileImage);
};

const icons = async (
  { fileUrl, darkUrl, iconPadding, tilePadding }: IconsOptions,
  force = false,
) => {
  const { valid, widgetName, srcFolder } = await check();

  const pad = {
    icon: typeof iconPadding === "number" && !Number.isNaN(iconPadding) &&
        iconPadding >= 0
      ? iconPadding
      : 16,
    tile: typeof tilePadding === "number" && !Number.isNaN(tilePadding) &&
        tilePadding >= 0
      ? tilePadding
      : 48,
  };

  if (!valid || !srcFolder || !widgetName) {
    console.log("Not a valid widget folder");
    console.log(valid);
    return;
  }

  const iconUrl = join(srcFolder, `./${widgetName}.icon.png`);
  const iconDarkUrl = join(srcFolder, `./${widgetName}.icon.dark.png`);
  const tileUrl = join(srcFolder, `./${widgetName}.tile.png`);
  const tileDarkUrl = join(srcFolder, `./${widgetName}.tile.dark.png`);

  const anyExists = await Promise.all([
    exists(iconUrl, { isFile: true, isReadable: true }),
    exists(iconDarkUrl, { isFile: true, isReadable: true }),
    exists(tileUrl, { isFile: true, isReadable: true }),
    exists(tileDarkUrl, { isFile: true, isReadable: true }),
  ]);

  if (anyExists.includes(true) && !force) {
    console.log("Icons already exist");
    return;
  }

  const iconImage = new Image(iconSize, iconSize);
  const iconDarkImage = new Image(iconSize, iconSize);
  const tileImage = new Image(tileSize[0], tileSize[1]);
  const tileDarkImage = new Image(tileSize[0], tileSize[1]);

  if (fileUrl) {
    const fileExists = await exists(fileUrl, {
      isFile: true,
      isReadable: true,
    });
    if (!fileExists) {
      console.log("File does not exist");
      return;
    }

    if (darkUrl) {
      const darkExists = await exists(darkUrl, {
        isFile: true,
        isReadable: true,
      });
      if (!darkExists) {
        console.log("Dark file does not exist");
        return;
      }
    }

    try {
      const image = await readImage(fileUrl);
      const dark = darkUrl ? await readImage(darkUrl) : image.clone().invert();

      const smallImage = image.clone().fit(
        iconSize - pad.icon,
        iconSize - pad.icon,
      );
      iconImage.composite(smallImage, pad.icon / 2, pad.icon / 2);
      const smallImageDark = dark.clone().fit(
        iconSize - pad.icon,
        iconSize - pad.icon,
      );
      iconDarkImage.composite(smallImageDark, pad.icon / 2, pad.icon / 2);

      const largeImage = image.clone().fit(
        tileSize[0] - pad.tile,
        tileSize[1] - pad.tile,
      );
      tileImage.composite(largeImage, pad.tile / 2, pad.tile / 2);
      const largeImageDark = dark.clone().fit(
        tileSize[0] - pad.tile,
        tileSize[1] - pad.tile,
      );
      tileDarkImage.composite(largeImageDark, pad.tile / 2, pad.tile / 2);
    } catch (error) {
      console.error("Error generating icons", error);
    }
  }

  await Promise.all([
    Deno.writeFile(iconUrl, await iconImage.encode(3)),
    Deno.writeFile(iconDarkUrl, await iconDarkImage.encode(3)),
    Deno.writeFile(tileUrl, await tileImage.encode(3)),
    Deno.writeFile(tileDarkUrl, await tileDarkImage.encode(3)),
  ]);
};

export default icons;
