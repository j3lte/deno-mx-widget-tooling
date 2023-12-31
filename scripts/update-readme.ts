// Copyright 2023 J.W. Lagendijk. All rights reserved. MIT license.

import { stripAnsiCode } from "../dev_deps.ts";

import { updateText } from "./utils.ts";
import { VERSION } from "../cli.ts";

async function update() {
  const filePath = new URL(import.meta.url).pathname;
  const dirPath = filePath.split("/").slice(0, -1).join("/");
  const readmePath = `${dirPath}/../README.md`;
  const cliPath = `${dirPath}/../cli.ts`;
  const licensePath = `${dirPath}/../LICENSE`;

  const command = new Deno.Command(Deno.execPath(), {
    args: [
      "run",
      "-A",
      cliPath,
      "--help",
    ],
  });

  const readme = await Deno.readTextFile(readmePath);
  const license = await Deno.readTextFile(licensePath);

  const { code, stdout, stderr } = await command.output();

  const output = stripAnsiCode(new TextDecoder().decode(stdout)).replace(
    /\(New.*/,
    "",
  );

  const err = new TextDecoder().decode(stderr);

  if (code !== 0) {
    console.error(err);
    Deno.exit(1);
  }

  let updatedReadme = updateText(
    "SNIPPET",
    readme,
    `\`\`\`\n${output}\`\`\``,
  );
  updatedReadme = updateText(
    "LICENSE",
    updatedReadme,
    `\`\`\`\n${license}\n\`\`\``,
  );
  updatedReadme = updateText(
    "INSTALL",
    updatedReadme,
    "```bash\ndeno install -A -n mx-widget-tooling https://raw.githubusercontent.com/j3lte/deno-mx-widget-tooling/" +
      VERSION + "/cli.ts\n```\n",
  );

  await Deno.writeTextFile(readmePath, updatedReadme);
}

update();
