// Copyright 2023 J.W. Lagendijk. All rights reserved. MIT license.

import { basename, config, copy, exists, join } from "../../deps.ts";

import check from "./check.ts";
import type { CheckResultOK } from "./check.ts";

const copyRelease = async (
  target?: string,
  versionToCopy?: string,
): Promise<boolean> => {
  const checked = await check();
  let toTarget = target;

  if (!checked.valid) {
    console.log("Not a valid widget folder");
    console.log(checked);
    return false;
  }

  const { MX_PROJECT_PATH } = config();

  if (typeof toTarget === "undefined") {
    if (typeof MX_PROJECT_PATH === "string") {
      toTarget = MX_PROJECT_PATH;
    } else {
      console.log("No target folder specified");
      return false;
    }
  }

  const {
    rootFolder,
    widgetName,
    packagePath,
    version,
  } = checked as CheckResultOK;

  const fileName = `${packagePath}.${widgetName}.mpk`;

  const src = `${rootFolder}/dist/${versionToCopy ?? version}/${fileName}`;

  const srcExists = await exists(src, { isFile: true, isReadable: true });

  if (!srcExists) {
    console.log(`Source file ${src} does not exist`);
    return false;
  }

  const targetBase = basename(toTarget);
  if (targetBase !== "widgets") {
    // Assume we're targetting a project folder that has a widgets folder
    target = join(toTarget, "widgets");
  }

  const targetExists = await exists(toTarget, { isDirectory: true });

  if (!targetExists) {
    console.log(
      `Target folder (which should be a widgets folder) '${toTarget}' does not exist`,
    );
    return false;
  }

  try {
    await copy(src, join(toTarget, fileName), {
      overwrite: true,
    });
    console.log(
      `Copied ${fileName} version ${versionToCopy ?? version} to ${toTarget}`,
    );
  } catch (error) {
    console.log(`Error copying ${src} to ${toTarget}`);
    console.log(error);
    return false;
  }

  return true;
};

export default copyRelease;
