MX Widget Tooling
====

Some tools I use for Mendix widget building. Conveniently wrapped in a Deno script that can be directly run from Github.

>
> *This is intended for power-users and should be used with caution. I do not take any responsibility for damaging you widget, computer or causing a global meltdown.*
>

## Installation

### Using Deno

If you have [Deno](https://deno.land/) installed, you can run the following command:
<!-- START INSTALL -->

```bash
deno install -A -n mx-widget-tooling https://raw.githubusercontent.com/j3lte/deno-mx-widget-tooling/0.5.1/cli.ts
```

<!-- END INSTALL -->
### Executable

> Note: This is not recommended, as updating does not work automatically.

You can download the latest executable from the [releases page](https://github.com/j3lte/deno-mx-widget-tooling/releases). Download the binary for your platform and place it somewhere in your path. Make sure it is executable (`chmod +x mx-widget-tooling`). You can now run `mx-widget-tooling` from anywhere.


## Usage

<!-- START SNIPPET -->

```

Usage:   mx-widget-tooling                                                                                       
Version: 0.5.1  

Description:

  Some tools I use in widget building

Options:

  -h, --help     - Show this help.                            
  -V, --version  - Show the version number for this program.  

Commands:

  check                                  - Check the current folder if it is a proper setup                             
  copy-release       [target] [version]  - Copy the latest release to a target folder                                   
  help               [command]           - Show this help or the help of a sub-command.                                 
  icons              [file] [dark]       - Generate the icons for the widget                                            
  install-workflows                      - Install Github workflows                                                     
  rename-package     [newName]           - Rename the package name of the widget                                        
  setup                                  - Setup the current folder as a widget, include some goodies left behind by R&D
  sizes                                  - Show the sizes of the widget mpks                                            
  upgrade                                - Upgrade mx-widget-tooling executable to latest or given version.             
  version            [version]           - Set the version of the widget                                                

```
<!-- END SNIPPET -->

### Upgrade

If you install using Deno (see above), you can upgrade using `mx-widget-tooling upgrade`. This will download the latest version from Github and replace the current version.
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
