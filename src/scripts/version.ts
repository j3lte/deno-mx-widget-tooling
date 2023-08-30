// Copyright 2023 J.W. Lagendijk. All rights reserved. MIT license.

import { cmp, tryParse } from "../../deps.ts";
import check from "./check.ts";
import type { CheckResultOK } from "./check.ts";

const version = async (newVersion?: string, force = false) => {
  const checked = await check();

  if (!checked.valid) {
    console.log("Not a valid widget folder");
    console.log(checked);
    return;
  }

  const {
    pkg,
    version,
    packageVersion,
    packageXML,
    widgetXML,
  } = checked as CheckResultOK;

  if (typeof newVersion === "undefined") {
    console.log(`Current version in package.json =\t${version}`);
    console.log(`Current version in package.xml =\t${packageVersion}`);
    return;
  }

  const parsed = tryParse(newVersion);

  if (!parsed) {
    console.log(`Version ${newVersion} is not a valid semver version`);
    return;
  }

  const resVersion = tryParse(version);
  if (!resVersion) {
    console.log("Version in package.json is not a valid semver version");
    return;
  }

  if (cmp(parsed, "<=", resVersion) && !force) {
    console.log(
      `New version ${newVersion} is not higher than ${version}`,
    );
    return;
  }

  const pkgFile = JSON.parse(await Deno.readTextFile(pkg));
  pkgFile.version = newVersion;
  await Deno.writeTextFile(pkg, JSON.stringify(pkgFile, null, 2));

  const packageXMLContent = await Deno.readTextFile(packageXML);
  const newPackageXML = packageXMLContent.replace(
    /version="(\d+\.\d+\.\d+)"/,
    `version="${newVersion}"`,
  );
  await Deno.writeTextFile(packageXML, newPackageXML);

  const widgetXMLContent = await Deno.readTextFile(widgetXML);
  // check if version is in the widget name as     <name>Action Scheduler (1.0.1)</name>
  const newWidgetXML = widgetXMLContent.replace(
    /<name>(.*)\((\d+\.\d+\.\d+)\)<\/name>/,
    `<name>$1(${newVersion})</name>`,
  );
  await Deno.writeTextFile(widgetXML, newWidgetXML);

  console.log(`Version set to ${newVersion}`);
};

export default version;
