// Copyright 2023 J.W. Lagendijk. All rights reserved. MIT license.

import { ensureDir, exists, join } from "../../deps.ts";

import check from "./check.ts";

const envFile = async (root: string) => {
  const envFileExists = await exists(join(root, ".env"), {
    isFile: true,
    isReadable: true,
  });

  if (!envFileExists) {
    await Deno.writeTextFile(
      join(root, ".env"),
      `# MX_PROJECT_PATH="/Volumes/[C] Windows 11/Projects/Mendix/MyFirstWidget"`,
    );
  } else {
    const envFile = await Deno.readTextFile(join(root, ".env"));
    if (!envFile.includes("MX_PROJECT_PATH")) {
      await Deno.writeTextFile(
        join(root, ".env"),
        [
          envFile,
          `# MX_PROJECT_PATH="/Volumes/[C] Windows 11/Projects/Mendix/MyFirstWidget"`,
        ].join("\n"),
      );
    }
  }
};

const vsCodeSettings = async (root: string) => {
  const vsCodeSettingsExists = await exists(
    join(root, ".vscode/settings.json"),
    {
      isFile: true,
      isReadable: true,
    },
  );

  if (!vsCodeSettingsExists) {
    await ensureDir(join(root, ".vscode"));
    await Deno.writeTextFile(
      join(root, ".vscode/settings.json"),
      JSON.stringify(
        {
          "typescript.tsdk": "node_modules/typescript/lib",
          "editor.formatOnSave": true,
        },
        null,
        4,
      ),
    );
  } else {
    const vsCodeSettings = JSON.parse(
      await Deno.readTextFile(join(root, ".vscode/settings.json")),
    );
    if (!vsCodeSettings["typescript.tsdk"]) {
      vsCodeSettings["typescript.tsdk"] = "node_modules/typescript/lib";
    }
    if (!vsCodeSettings["editor.formatOnSave"]) {
      vsCodeSettings["editor.formatOnSave"] = true;
    }
    await Deno.writeTextFile(
      join(root, ".vscode/settings.json"),
      JSON.stringify(vsCodeSettings, null, 4),
    );
  }
};

const rollupConfig = async (root: string) => {
  const ROLLUP_CONTENT = [
    "import { terser } from 'rollup-plugin-terser';",
    "import pkg from './package.json';",
    "",
    "export default args => {",
    "    const configArray = args.configDefaultConfig;",
    "    const result = configArray.map(config => {",
    "        const plugins = config.plugins.map(plugin => {",
    "            if (plugin && plugin.name && plugin.name === 'terser') {",
    "                return terser({",
    "                    format: {",
    "                        comments: false,",
    "                        preamble: `/* -> WIDGET_NAME v${pkg.version} | Build date: ${(new Date()).toISOString()} | Developer: ${pkg.author} | https://caffcode.com <- */`",
    "                    }",
    "                })",
    "            }",
    "            return plugin;",
    "        });",
    "        config.plugins = plugins;",
    "        return config;",
    "    });",
    "",
    "    return result;",
    "};",
    "",
  ].join("\n");

  const rollupConfigExists = await exists(
    join(root, "rollup.config.js"),
    {
      isFile: true,
      isReadable: true,
    },
  );

  if (!rollupConfigExists) {
    await Deno.writeTextFile(join(root, "rollup.config.js"), ROLLUP_CONTENT);
    console.log("rollup.config.js created");
  } else {
    // console.log("rollup.config.js already exists");
  }
};

const setup = async () => {
  const { rootFolder, valid } = await check();
  if (!valid) {
    console.log("Not a valid widget folder");
    return;
  }
  console.log(`Setting up in ${rootFolder}`);

  await envFile(rootFolder);
  await vsCodeSettings(rootFolder);
  await rollupConfig(rootFolder);
};

export default setup;
