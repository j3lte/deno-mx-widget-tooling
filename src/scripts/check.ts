// Copyright 2023 J.W. Lagendijk. All rights reserved. MIT license.

import { exists, join } from "../../deps.ts";

export interface CheckResult {
  rootFolder: string;
  pkg: false | string;
  name: false | string;
  packageXML: false | string;
  packageVersion: false | string;
  widgetXML: false | string;
  widgetName: false | string;
  srcFolder: false | string;
  packagePath: false | string;
  version: false | string;
  valid: boolean;
}

export interface CheckResultOK {
  rootFolder: string;
  pkg: string;
  name: false | string;
  packageVersion: string;
  packageXML: string;
  widgetXML: string;
  widgetName: string;
  srcFolder: string;
  packagePath: string;
  version: string;
  valid: true;
}

const check = async (): Promise<CheckResult | CheckResultOK> => {
  const cwd = Deno.cwd();

  const paths = {
    pkg: join(cwd, "./package.json"),
    packageXML: join(cwd, "./src/package.xml"),
    srcFolder: join(cwd, "./src"),
  };

  const pkgExists = await exists(paths.pkg, { isFile: true, isReadable: true });
  const packageXMLExists = await exists(paths.packageXML, {
    isFile: true,
    isReadable: true,
  });
  const srcFolderExists = await exists(paths.srcFolder, {
    isDirectory: true,
    isReadable: true,
  });

  const result: Partial<CheckResult> = {
    rootFolder: cwd,
    pkg: pkgExists ? paths.pkg : false,
    packageXML: packageXMLExists ? paths.packageXML : false,
    srcFolder: srcFolderExists ? paths.srcFolder : false,
  };

  if (result.pkg) {
    const pkg = JSON.parse(await Deno.readTextFile(result.pkg));
    result.name = pkg.name || false;
    result.widgetName = pkg.widgetName || false;
    result.packagePath = pkg.packagePath || false;
    result.version = pkg.version || false;
  }

  if (result.packageXML) {
    const packageXML = await Deno.readTextFile(result.packageXML);
    // Find the version that is formatted as version="1.0.0"
    const match = packageXML.match(/version="(\d+\.\d+\.\d+)"/);

    if (match) {
      const version = match[1];
      result.packageVersion = version;
      if (result.version && result.version !== version) {
        console.log(
          `Version mismatch: package.json version is ${result.version}, package.xml version is ${version}`,
        );
      }
    } else {
      result.packageVersion = false;
      console.log("no version found in package.xml");
    }
  }

  if (result.widgetName && result.srcFolder) {
    const widgetXML = join(result.srcFolder, `${result.widgetName}.xml`);
    const widgetXMLExists = await exists(widgetXML, {
      isFile: true,
      isReadable: true,
    });
    result.widgetXML = widgetXMLExists ? widgetXML : false;
  }

  const valid = !!result.widgetName && !!result.packagePath &&
    !!result.version && !!result.srcFolder && !!result.packageXML &&
    !!result.widgetXML &&
    !!result.pkg && !!result.rootFolder;

  result.valid = valid;

  if (valid) {
    return result as CheckResultOK;
  }

  return result as CheckResult;
};

export default check;
