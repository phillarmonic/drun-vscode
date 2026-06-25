# Drun Language Support

VS Code language support for the [Drun](https://github.com/phillarmonic/drun) automation language.

### Included

- TextMate syntax highlighting for `.drun` files
- Automatic `xdrun cmd:lsp` language-server startup when `xdrun` is available
- Language registration for the `drun` language id
- Comment, bracket, auto-close, and basic indentation-aware folding configuration

### Highlighted syntax

- `task`, `project`, `version`, `requires`, `given`, `accepts`, `depends`, `call`, `include`
- Control flow such as `if` / `else`, `when` / `otherwise`, `for each`, `try`, `catch`, `finally`
- Detection and constraint forms such as `is/are available`, version checks, file existence checks, and parameter validation operators
- Built-in actions and domain keywords for Docker, Git, HTTP, orchestration, secrets, capture, dependencies, and detection modifiers
- Double-quoted strings with escapes
- String interpolation like `{name}` and `{$name}`
- `$variables`, booleans, numbers, arrays, operators, and comments

### Language Server

When `xdrun cmd:lsp` is available, the extension starts it automatically over stdio for `.drun` files. The current integration adds:

- Parser-backed diagnostics
- Simple keyword and task-name completions
- Decorator highlighting for annotations like `@platform("linux", "mac")`

If `xdrun` is missing from `PATH`, or the installed binary does not support `cmd:lsp`, the extension falls back to grammar-only behavior.

Settings:

- `drun.enableLanguageServer`: enable or disable LSP startup
- `drun.xdrunPath`: override the executable path or command name used to launch `xdrun`

### Install locally

1. Open this folder in VS Code.
2. Run `Developer: Install Extension from Location...`.
3. Choose `/Users/andy/repos/phillarmonic/drun-vscode`.

### Debug locally

Open this repo in VS Code and run the `Run Drun Extension` launch configuration. It starts an Extension Development Host and opens [samples/spec-coverage.drun](/Users/andy/repos/phillarmonic/drun-vscode/samples/spec-coverage.drun) for a quick highlighting check.

### Test locally

Install dev dependencies with `pnpm install`, then run:

```bash
pnpm test
```

That runs:

- TypeScript compilation for the VS Code extension entrypoint
- TypeScript compilation for grammar tooling
- Grammar generation from [syntaxes/drun.tmLanguage.source.ts](/Users/andy/repos/phillarmonic/drun-vscode/syntaxes/drun.tmLanguage.source.ts) into [syntaxes/drun.tmLanguage.json](/Users/andy/repos/phillarmonic/drun-vscode/syntaxes/drun.tmLanguage.json)
- JSON validation for extension metadata and grammar files
- TextMate grammar assertions from [tests/grammar/spec-coverage.test.json](/Users/andy/repos/phillarmonic/drun-vscode/tests/grammar/spec-coverage.test.json) against [samples/spec-coverage.drun](/Users/andy/repos/phillarmonic/drun-vscode/samples/spec-coverage.drun)

The TextMate grammar source now lives in [syntaxes/drun.tmLanguage.source.ts](/Users/andy/repos/phillarmonic/drun-vscode/syntaxes/drun.tmLanguage.source.ts). Regenerate the JSON artifact with:

```bash
pnpm run build:grammar
```

### Sample

```drun
version: 2.0

task "deploy":
  given $environment defaults to "staging" from ["dev", "staging", "production"]

  step "Deploying to {$environment}"
  if docker is available:
    build docker image "myapp:{environment}"
    success "Build complete"
```

For the canonical highlighting coverage fixture, open [samples/spec-coverage.drun](/Users/andy/repos/phillarmonic/drun-vscode/samples/spec-coverage.drun). It is the sample that the grammar assertions track and should be kept aligned with newly supported syntax families.
