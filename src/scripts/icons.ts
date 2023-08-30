// Copyright 2023 J.W. Lagendijk. All rights reserved. MIT license.

import { exists, Image, join } from "../../deps.ts";

import check from "./check.ts";

const iconSize = 64;
const tileSize = [256, 192];

interface IconsOptions {
  fileUrl?: string;
  darkUrl?: string;
}

const icons = async ({ fileUrl, darkUrl }: IconsOptions, force = false) => {
  const { valid, widgetName, srcFolder } = await check();

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
      const fileImage = await Deno.readFile(fileUrl);
      const darkImage = darkUrl ? await Deno.readFile(darkUrl) : fileImage;

      const image = await Image.decode(fileImage);
      const dark = darkUrl
        ? await Image.decode(darkImage)
        : image.clone().invert();

      const smallImage = image.clone().fit(iconSize - 4, iconSize - 4);
      iconImage.composite(smallImage, 2, 2);
      const smallImageDark = dark.clone().fit(iconSize - 4, iconSize - 4);
      iconDarkImage.composite(smallImageDark, 2, 2);

      const largeImage = image.clone().fit(tileSize[0] - 4, tileSize[1] - 4);
      tileImage.composite(largeImage, 2, 2);
      const largeImageDark = dark.clone().fit(tileSize[0] - 4, tileSize[1] - 4);
      tileDarkImage.composite(largeImageDark, 2, 2);
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
