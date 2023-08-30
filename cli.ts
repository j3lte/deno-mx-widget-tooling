// Copyright 2023 J.W. Lagendijk. All rights reserved. MIT license.

import { Command } from "./deps.ts";

import { check, setup, sizes, version } from "./src/mod.ts";

export const VERSION = "0.1.0";

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
    .parse();
}
