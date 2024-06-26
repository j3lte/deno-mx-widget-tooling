// Copyright 2023 J.W. Lagendijk. All rights reserved. MIT license.

import {
  Command,
  GithubProvider,
  HelpCommand,
  UpgradeCommand,
} from "./deps.ts";

import {
  check,
  copyRelease,
  icons,
  installWorkflows,
  renamePackage,
  setup,
  sizes,
  version,
} from "./src/mod.ts";

export const VERSION = "0.5.5";

if (import.meta.main) {
  await new Command()
    .name("mx-widget-tooling")
    .description("Some tools I use in widget building")
    .version(VERSION)
    .command("check", "Check the current folder if it is a proper setup")
    .action(
      async (_opts) => {
        const res = await check();
        console.log("\nCheck result:\n");
        console.log(res);
        Deno.exit(res.valid ? 0 : 1);
      },
    )
    .command(
      "copy-release [target:string] [version:string]",
      "Copy the latest release to a target folder",
    )
    .action(
      async (_opts, target, version) => {
        const ok = await copyRelease(target, version);
        Deno.exit(ok ? 0 : 1);
      },
    )
    .command("help", new HelpCommand().global())
    .command(
      "icons [file:string] [dark:string]",
      "Generate the icons for the widget",
    )
    .option("-f, --force", "Force the icons to be generated")
    .option("-i, --icon-padding <number>", "Padding for the icon")
    .option("-t, --tile-padding <number>", "Padding for the tile")
    .action(
      async ({ force, iconPadding, tilePadding }, file, dark) => {
        const ok = await icons({
          fileUrl: file,
          darkUrl: dark,
          iconPadding: iconPadding ? parseInt(iconPadding) : undefined,
          tilePadding: tilePadding ? parseInt(tilePadding) : undefined,
        }, force);
        Deno.exit(ok ? 0 : 1);
      },
    )
    .command("install-workflows", "Install Github workflows")
    .option("-f, --force", "Force the workflows to be installed")
    .action(
      async ({ force }) => {
        const ok = await installWorkflows(force);
        Deno.exit(ok ? 0 : 1);
      },
    )
    .command(
      "rename-package [newName:string]",
      "Rename the package name of the widget",
    )
    .action(
      async (_opts, newName) => {
        const ok = await renamePackage(newName);
        Deno.exit(ok ? 0 : 1);
      },
    )
    .command(
      "setup",
      "Setup the current folder as a widget, include some goodies left behind by R&D",
    )
    .action(
      async (_opts) => {
        const ok = await setup();
        Deno.exit(ok ? 0 : 1);
      },
    )
    .command("sizes", "Show the sizes of the widget mpks")
    .action(
      async (_opts) => {
        await sizes();
        Deno.exit(0);
      },
    )
    .command(
      "upgrade",
      new UpgradeCommand({
        main: "cli.ts",
        args: [
          "-A",
        ],
        provider: [
          new GithubProvider({
            repository: "j3lte/deno-mx-widget-tooling",
          }),
        ],
      }),
    )
    .command("version [version:string]", "Set the version of the widget")
    .option("-f, --force", "Force the version to be set")
    .action(
      async ({ force }, ver) => {
        const ok = await version(ver, force);
        Deno.exit(ok ? 0 : 1);
      },
    )
    .parse();
}
