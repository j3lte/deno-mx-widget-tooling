// Copyright 2023 J.W. Lagendijk. All rights reserved. MIT license.

import { ensureDir, exists, join } from "../../deps.ts";
import { VERSION } from "../../cli.ts";

import check from "./check.ts";
import type { CheckResultOK } from "./check.ts";

const workflows = [
  {
    file: `testbuild.yml`,
    url:
      `https://raw.githubusercontent.com/j3lte/deno-mx-widget-tooling/main/assets/workflows/testbuild.yml`,
  },
  {
    file: "version.yml",
    url:
      `https://raw.githubusercontent.com/j3lte/deno-mx-widget-tooling/main/assets/workflows/version.yml`,
  },
];

const installWorkflows = async (force?: boolean): Promise<boolean> => {
  const checked = await check();

  if (!checked.valid) {
    console.log("Not a valid widget folder");
    console.log(checked);
    return false;
  }

  const {
    rootFolder,
    widgetName,
    packagePath,
  } = checked as CheckResultOK;

  const fileName = `${packagePath}.${widgetName}.mpk`;

  // Check if workflows are already installed
  const workflowsFolder = join(rootFolder, ".github/workflows");
  const workflowFolderExists = await exists(workflowsFolder, {
    isDirectory: true,
    isReadable: true,
  });

  if (!workflowFolderExists) {
    await ensureDir(workflowsFolder);
  }

  await Promise.all(workflows.map(async (workflow) => {
    const workflowFile = join(workflowsFolder, workflow.file);
    const workflowFileExists = await exists(workflowFile, {
      isFile: true,
      isReadable: true,
    });

    if (!workflowFileExists || force) {
      console.log(`Installing workflow '${workflow.file}'`);
      try {
        const workflowContent = await fetch(workflow.url).then((res) =>
          res.text()
        );
        const replacedContent = workflowContent
          .replaceAll(
            "|REPLACE_VERSION|",
            VERSION,
          )
          .replaceAll(
            "|REPLACE_WIDGET_NAME|",
            fileName,
          );

        await Deno.writeTextFile(workflowFile, replacedContent);
      } catch (error) {
        console.log(`Error installing workflow '${workflow.file}'`);
        console.log(error);
      }
    } else {
      console.log(`Workflow '${workflow.file}' already exists`);
    }
  }));

  return true;
};

export default installWorkflows;
