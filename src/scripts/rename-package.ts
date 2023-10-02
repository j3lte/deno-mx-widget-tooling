// Copyright 2023 J.W. Lagendijk. All rights reserved. MIT license.

import check, { CheckResultOK } from "./check.ts";

const renamePackage = async (
  newName?: string,
  dryRun = false,
): Promise<boolean> => {
  const checked = await check();
  const isDryRun = dryRun || false;

  if (!checked.valid) {
    console.log("Not a valid widget folder");
    console.log(checked);
    return false;
  }

  if (typeof newName === "undefined") {
    console.log("No name for package specified");
    return false;
  }

  const trimmed = newName.trim();

  // Fail if newName contains spaces
  if (trimmed.indexOf(" ") > -1) {
    console.log("New name for package contains spaces");
    return false;
  }

  // Fail if newName contains anything else than lowercase letters and dots
  const regex = /^[a-z.]+$/;
  if (!regex.test(trimmed)) {
    console.log(
      "New name for package contains characters other than lowercase letters and dots",
    );
    return false;
  }

  const {
    pkg,
    name,
    widgetName,
    packageXML,
    packagePath,
    widgetXML,
  } = checked as CheckResultOK;

  // package.json

  console.log(`Renaming packagePath in package.json to '${trimmed}'`);

  if (!isDryRun) {
    const pkgFile = JSON.parse(await Deno.readTextFile(pkg));
    pkgFile.packagePath = trimmed;
    await Deno.writeTextFile(pkg, JSON.stringify(pkgFile, null, 2));
  }

  // package.xml

  const oldPath = `${packagePath.replaceAll(".", "/")}/${name}`;
  const newPath = `${trimmed.replaceAll(".", "/")}/${name}`;

  console.log(
    `Renaming file path in package.xml from '${oldPath}' to '${newPath}'`,
  );

  if (!isDryRun) {
    const packageXMLContent = await Deno.readTextFile(packageXML);
    const newPackageXML = packageXMLContent.replace(
      oldPath,
      newPath,
    );
    await Deno.writeTextFile(packageXML, newPackageXML);
  }

  // widget.xml

  const oldID = `${packagePath}.${name}.${widgetName}`;
  const newID = `${trimmed}.${name}.${widgetName}`;

  console.log(`Renaming package in widget.xml from '${oldID}' to '${newID}'`);

  if (!isDryRun) {
    const widgetXMLContent = await Deno.readTextFile(widgetXML);
    const newWidgetXML = widgetXMLContent.replace(
      new RegExp(oldID, "g"),
      newID,
    );
    await Deno.writeTextFile(widgetXML, newWidgetXML);
  }

  return true;
};

export default renamePackage;
