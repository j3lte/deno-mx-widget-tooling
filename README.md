MX Widget Tooling
====

Some tools I use for Mendix widget building. Conveniently wrapped in a Deno script that can be directly run from Github.

> This is intended for the power-users and should be used with caution. I do not take any responsibility for damaging you widget, computer or causing a global meltdown.

I use an alias for this in my `.bashrc`:

```bash
alias mx-widget-tooling="deno run -A https://raw.githubusercontent.com/j3lte/deno-mx-widget-tooling/main/cli.ts"
alias mx-widget-tooling-reload="deno run --reload -A https://raw.githubusercontent.com/j3lte/deno-mx-widget-tooling/main/cli.ts"
```

## Usage

<!-- START SNIPPET -->

```

Usage:   mx-widget-tooling                                                                                       
Version: 0.1.1  (New version available: 0.1.0. Run 'mx-widget-tooling upgrade' to upgrade to the latest version!)

Description:

  Some tools I use in widget building

Options:

  -h, --help     - Show this help.                            
  -V, --version  - Show the version number for this program.  

Commands:

  check                   - Check the current folder if it is a proper setup                             
  version  [version]      - Set the version of the widget                                                
  setup                   - Setup the current folder as a widget, include some goodies left behind by R&D
  sizes                   - Show the sizes of the widget mpks                                            
  icons    [file] [dark]  - Generate the icons for the widget                                            
  upgrade                 - Upgrade mx-widget-tooling executable to latest or given version.             
  help     [command]      - Show this help or the help of a sub-command.                                 

```
<!-- END SNIPPET -->

## License

MX Widget Tooling is licensed under the [MIT license](LICENSE).

<!-- START LICENSE -->

```
The MIT License (MIT)

Copyright © J.W. Lagendijk 2023-2023. All Rights Reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

```
<!-- END LICENSE -->
