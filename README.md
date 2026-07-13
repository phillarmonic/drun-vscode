# Drun Automation Language Support (With AI features)

<p align="center">
  <img src="images/drun_500_transp.png" width="500" alt="Drun" />
</p>

Write and run readable project automation in VS Code. This extension adds syntax highlighting and editor support for [Drun](https://phillarmonic.github.io/drun/), the automation language executed by the [`xdrun` CLI](https://github.com/phillarmonic/drun).

## What you get

- Syntax highlighting for `.drun` files
- Comments, bracket matching, auto-closing pairs, and code folding
- Diagnostics and completions when `xdrun` is installed
- Support for tasks, conditions, loops, Docker, Git, HTTP, secrets, orchestration, and more

## Get started

1. Install this extension.
2. Install [`xdrun`](https://phillarmonic.github.io/drun/getting-started/install/) to run Drunfiles and enable language-server features.
3. Open or create a file ending in `.drun`.

Try a small task:

```drun
version: 2.0

task "hello":
  step "Hello from Drun"
  run "echo Hello from the shell"
```

Run it from your project directory with `xdrun`.

## Teach your AI agents how to use drun

In a hurry? Let your agents work for you. Install the basics skill in your current project with:

```bash
xdrun cmd:skill install drun-basics
```

## Language-server support

When `xdrun` is available on your `PATH`, the extension starts `xdrun cmd:lsp` automatically for `.drun` files. This provides parser-backed diagnostics, keyword completions, and annotation highlighting.

The extension still provides syntax highlighting when `xdrun` is not installed.

## Settings

| Setting                     | Default | Description                                           |
| --------------------------- | ------- | ----------------------------------------------------- |
| `drun.enableLanguageServer` | `true`  | Enable or disable automatic language-server startup.  |
| `drun.xdrunPath`            | `xdrun` | Path to, or command name for, the `xdrun` executable. |

## Learn Drun

- [Getting started](https://phillarmonic.github.io/drun/getting-started/)
- [Language reference](https://phillarmonic.github.io/drun/reference/language/)
- [Built-in actions](https://phillarmonic.github.io/drun/reference/language/built-in-actions/)
- [Examples](https://phillarmonic.github.io/drun/examples/)

Found a problem with the extension? [Open an issue](https://github.com/phillarmonic/drun-vscode/issues).
