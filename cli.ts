// Copyright 2023 J.W. Lagendijk. All rights reserved. MIT license.

import {
  Command,
  GithubProvider,
  HelpCommand,
  UpgradeCommand,
} from "./deps.ts";

import { check, icons, setup, sizes, version } from "./src/mod.ts";

export const VERSION = "0.2.1";

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
      },
    )
    .command("version [version:string]", "Set the version of the widget")
    .option("-f, --force", "Force the version to be set")
    .action(
      async ({ force }, ver) => {
        await version(ver, force);
      },
    )
    .command(
      "setup",
      "Setup the current folder as a widget, include some goodies left behind by R&D",
    )
    .action(
      async (_opts) => {
        await setup();
      },
    )
    .command("sizes", "Show the sizes of the widget mpks")
    .action(
      async (_opts) => {
        await sizes();
      },
    )
    .command(
      "icons [file:string] [dark:string]",
      "Generate the icons for the widget",
    )
    .option("-f, --force", "Force the icons to be generated")
    .option("-i, --icon-padding <number>", "Padding for the icon")
    .option("-t, --tile-padding <number>", "Padding for the tile")
    .action(
      async ({ force, iconPadding, tilePadding }, file, dark) => {
        await icons({
          fileUrl: file,
          darkUrl: dark,
          iconPadding: iconPadding ? parseInt(iconPadding) : undefined,
          tilePadding: tilePadding ? parseInt(tilePadding) : undefined,
        }, force);
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
    .command("help", new HelpCommand().global())
    .parse();
}
