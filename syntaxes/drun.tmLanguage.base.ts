import type { TextMateRule } from "./textmate-types";

export const baseRepository: Record<string, TextMateRule> = {
  meta: {
    patterns: [
      { include: "#version" },
      { include: "#task-template" },
      { include: "#task-definition" },
      { include: "#snippet-definition" },
      { include: "#parameter-definition" },
      { include: "#dependency-declaration" },
      { include: "#variable-declaration" },
      { include: "#control-flow" },
      { include: "#detection-conditions" },
      { include: "#include-statement" },
      { include: "#call-task" },
      { include: "#lifecycle-hooks" },
      { include: "#shell-config" },
      { include: "#capture-shell" },
      { include: "#env-conditions" },
      { include: "#http-actions" },
      { include: "#download-actions" },
      { include: "#network-actions" },
      { include: "#orchestration" }
    ]
  },
  comments: {
    patterns: [
      {
        name: "comment.line.number-sign.drun",
        match: "#.*$"
      },
      {
        name: "comment.block.drun",
        begin: "/\\*",
        end: "\\*/"
      }
    ]
  },
  version: {
    patterns: [
      {
        name: "meta.version.drun",
        match: "^(\\s*)(version)(\\s*:\\s*)(\\d+(?:\\.\\d+)*)\\s*$",
        captures: {
          "2": { name: "keyword.declaration.version.drun" },
          "4": { name: "constant.numeric.version.drun" }
        }
      }
    ]
  },
  "task-template": {
    patterns: [
      {
        name: "meta.definition.template-task.drun",
        match: "^(\\s*)(template)(\\s+)(task)(\\s+)(\"(?:[^\"\\\\]|\\\\.)*\"|[A-Za-z_][A-Za-z0-9_]*)",
        captures: {
          "2": { name: "keyword.declaration.template.drun" },
          "4": { name: "keyword.declaration.task.drun" },
          "6": { name: "entity.name.function.task.drun" }
        }
      }
    ]
  },
  "task-definition": {
    patterns: [
      {
        name: "meta.definition.task.drun",
        match: "^(\\s*)(task)(\\s+)(\"(?:[^\"\\\\]|\\\\.)*\"|[A-Za-z_][A-Za-z0-9_]*)",
        captures: {
          "2": { name: "keyword.declaration.task.drun" },
          "4": { name: "entity.name.function.task.drun" }
        }
      },
      {
        name: "meta.definition.project.drun",
        match: "^(\\s*)(project)(\\s+)(\"(?:[^\"\\\\]|\\\\.)*\")(?:(\\s+)(version)(\\s+)(\"(?:[^\"\\\\]|\\\\.)*\"))?",
        captures: {
          "2": { name: "keyword.declaration.project.drun" },
          "4": { name: "entity.name.type.project.drun" },
          "6": { name: "keyword.declaration.version.drun" },
          "8": { name: "string.quoted.double.version.drun" }
        }
      },
      {
        name: "keyword.declaration.description.drun",
        match: "\\bmeans\\b"
      }
    ]
  },
  "snippet-definition": {
    patterns: [
      {
        name: "meta.definition.snippet.drun",
        match: "^(\\s*)(snippet)(\\s+)(\"(?:[^\"\\\\]|\\\\.)*\")",
        captures: {
          "2": { name: "keyword.declaration.snippet.drun" },
          "4": { name: "entity.name.constant.snippet.drun" }
        }
      }
    ]
  },
  "parameter-definition": {
    patterns: [
      {
        name: "meta.definition.parameter.drun",
        match: "^(\\s*)(parameter|requires|given|accepts)(?=\\b)",
        captures: {
          "2": { name: "keyword.declaration.parameter.drun" }
        }
      },
      {
        name: "keyword.operator.word.drun",
        match: "\\b(?:defaults\\s+to|as\\s+list\\s+to|as|from|matching|between|of|to)\\b"
      }
    ]
  },
  "dependency-declaration": {
    patterns: [
      {
        name: "meta.dependency.declaration.drun",
        match: "^(\\s*)(depends)(\\s+)(on)\\b",
        captures: {
          "2": { name: "keyword.declaration.drun" },
          "4": { name: "keyword.operator.word.drun" }
        }
      },
      {
        name: "keyword.operator.word.drun",
        match: "\\b(?:then|and|in\\s+parallel)\\b"
      }
    ]
  },
  "variable-declaration": {
    patterns: [
      {
        name: "meta.variable.declaration.drun",
        match: "^(\\s*)(let|set|define)(\\s+)(\\$?[A-Za-z_][A-Za-z0-9_\\-]*)",
        captures: {
          "2": { name: "keyword.declaration.drun" },
          "4": { name: "variable.other.drun" }
        }
      },
      {
        name: "meta.capture.expression.drun",
        match: "^(\\s*)(capture)(\\s+)(?!from\\s+shell)([A-Za-z_][A-Za-z0-9_\\-]*)(\\s+)(from)\\b",
        captures: {
          "2": { name: "keyword.declaration.drun" },
          "4": { name: "variable.other.drun" },
          "6": { name: "keyword.operator.word.drun" }
        }
      }
    ]
  },
  "include-statement": {
    patterns: [
      {
        name: "meta.include.drun",
        match: "^(\\s*)(include)(\\s+)(?=\")",
        captures: {
          "2": { name: "keyword.control.import.drun" }
        }
      },
      {
        name: "meta.include.drun",
        match: "^(\\s*)(include)(\\s+)(from)(\\s+)(drunhub)\\b",
        captures: {
          "2": { name: "keyword.control.import.drun" },
          "4": { name: "keyword.control.import.drun" },
          "6": { name: "support.constant.domain.drun" }
        }
      },
      {
        name: "meta.include.drun",
        match: "^(\\s*)(include)(\\s+)(snippets|templates|tasks)?(?:(\\s*)(,)(\\s*)(snippets|templates|tasks))?(\\s+)(from)?(?:(\\s+)(drunhub))?",
        captures: {
          "2": { name: "keyword.control.import.drun" },
          "4": { name: "entity.name.type.import-selector.drun" },
          "6": { name: "punctuation.separator.sequence.drun" },
          "8": { name: "entity.name.type.import-selector.drun" },
          "10": { name: "keyword.control.import.drun" },
          "12": { name: "support.constant.domain.drun" }
        }
      },
      {
        name: "meta.include.alias.drun",
        match: "(?:^|\\s)(as)(\\s+)([A-Za-z_][A-Za-z0-9_-]*)$",
        captures: {
          "1": { name: "keyword.operator.word.drun" },
          "3": { name: "entity.name.namespace.drun" }
        }
      },
      {
        name: "meta.use-snippet.drun",
        match: "^(\\s*)(use)(\\s+)(snippet)(\\s+)(\"(?:[^\"\\\\]|\\\\.)*\"|[A-Za-z_][A-Za-z0-9_.-]*)",
        captures: {
          "2": { name: "keyword.control.import.drun" },
          "4": { name: "keyword.declaration.snippet.drun" },
          "6": { name: "entity.name.constant.snippet.drun" }
        }
      }
    ]
  },
  "capture-shell": {
    patterns: [
      {
        name: "meta.shell.inline.drun",
        match: "^(\\s*)(run|exec|shell)(\\s+)(\"(?:[^\"\\\\]|\\\\.)*\")(?:\\s+(attached))?",
        captures: {
          "2": { name: "support.type.action.drun" },
          "4": { name: "string.quoted.double.drun" },
          "5": { name: "keyword.operator.word.drun" }
        }
      },
      {
        name: "meta.capture.shell.inline.drun",
        match: "^(\\s*)(capture)(\\s+)(from)(\\s+)(shell)(\\s+)(as)(\\s+)(\\$[A-Za-z_][A-Za-z0-9_\\-]*)(?=\\s*:)",
        captures: {
          "2": { name: "keyword.declaration.drun" },
          "4": { name: "keyword.operator.word.drun" },
          "6": { name: "support.type.action.drun" },
          "8": { name: "keyword.operator.word.drun" },
          "10": { name: "variable.other.drun" }
        }
      },
      {
        name: "meta.capture.shell.inline.drun",
        match: "^(\\s*)(capture)(\\s+)(from)(\\s+)(shell)(\\s+)(\"(?:[^\"\\\\]|\\\\.)*\")(\\s+)(as)(\\s+)(\\$[A-Za-z_][A-Za-z0-9_\\-]*)",
        captures: {
          "2": { name: "keyword.declaration.drun" },
          "4": { name: "keyword.operator.word.drun" },
          "6": { name: "support.type.action.drun" },
          "8": { name: "string.quoted.double.drun" },
          "10": { name: "keyword.operator.word.drun" },
          "12": { name: "variable.other.drun" }
        }
      },
      {
        name: "meta.shell.block.drun",
        match: "^(\\s*)(run|exec|shell)(?=\\s*:)",
        captures: {
          "2": { name: "support.type.action.drun" }
        }
      },
      {
        name: "meta.workdir.drun",
        match: "^(\\s*)(use)(\\s+)(workdir)\\b",
        captures: {
          "2": { name: "keyword.control.import.drun" },
          "4": { name: "support.constant.domain.drun" }
        }
      },
      {
        name: "meta.service-scoped-shell.drun",
        match: "^(\\s*)(run|exec|shell)(\\s+)(in)(\\s+)(service)(\\s+)(\\$[A-Za-z_][A-Za-z0-9_\\-]*|\"(?:[^\"\\\\]|\\\\.)*\"|[A-Za-z_][A-Za-z0-9_\\-]*)(?=\\s+\"|\\s*:)",
        captures: {
          "2": { name: "support.type.action.drun" },
          "4": { name: "keyword.operator.word.drun" },
          "6": { name: "support.constant.domain.drun" },
          "8": { name: "entity.name.namespace.drun" }
        }
      },
      {
        name: "meta.service-scoped-shell.modifier.drun",
        match: "\\b(attached)\\b",
        captures: {
          "1": { name: "keyword.operator.word.drun" }
        }
      }
    ]
  },
  "env-conditions": {
    patterns: [
      {
        name: "meta.condition.environment.drun",
        match: "\\b(if|when)(\\s+)(env)(\\s+)([A-Z_][A-Z0-9_]*)(\\s+)(exists|is)(?:(\\s+)(not)(\\s+)(empty|\"(?:[^\"\\\\]|\\\\.)*\"))?(?:(\\s+)(and)(\\s+)(is)(\\s+)(not)?(\\s+)(empty|\"(?:[^\"\\\\]|\\\\.)*\"))?",
        captures: {
          "1": { name: "keyword.control.drun" },
          "3": { name: "support.function.builtin.drun" },
          "5": { name: "support.variable.environment.name.drun" },
          "7": { name: "keyword.control.drun" },
          "10": { name: "keyword.control.drun" },
          "12": { name: "constant.language.boolean.drun" },
          "15": { name: "keyword.control.drun" },
          "17": { name: "keyword.control.drun" },
          "19": { name: "keyword.control.drun" },
          "21": { name: "constant.language.boolean.drun" }
        }
      },
      {
        name: "meta.condition.runtime-environment.drun",
        match: "\\b(when)(\\s+)(running)(\\s+)(in|on)(\\s+)(CI|locally|macOS|Linux)\\b",
        captures: {
          "1": { name: "keyword.control.drun" },
          "3": { name: "support.constant.domain.drun" },
          "5": { name: "keyword.operator.word.drun" },
          "7": { name: "support.constant.domain.drun" }
        }
      }
    ]
  },
  "control-flow": {
    patterns: [
      {
        name: "meta.control.else-if.drun",
        match: "^(\\s*)(else)(\\s+)(if)\\b",
        captures: {
          "2": { name: "keyword.control.drun" },
          "4": { name: "keyword.control.drun" }
        }
      },
      {
        name: "meta.control.statement.drun",
        match: "^(\\s*)(if|when|otherwise|else|try|catch|finally)(?=\\b)",
        captures: {
          "2": { name: "keyword.control.drun" }
        }
      },
      {
        name: "meta.control.match-arm.drun",
        match: "^(\\s*)(is)(\\s+)(\"(?:[^\"\\\\]|\\\\.)*\"|\\$[A-Za-z_][A-Za-z0-9_\\-]*|\\{[^}]+\\}|[A-Za-z_][A-Za-z0-9_\\-]*)(?=\\s*:)",
        captures: {
          "2": { name: "keyword.control.drun" },
          "4": { name: "string.quoted.double.drun" }
        }
      }
    ]
  },
  "detection-conditions": {
    patterns: [
      {
        name: "meta.condition.tool-availability.drun",
        match: "^(\\s*)(if)(\\s+)(.+?)(\\s+)(is|are)(\\s+)(not\\s+available|available)\\b",
        captures: {
          "2": { name: "keyword.control.drun" },
          "6": { name: "keyword.control.drun" },
          "8": { name: "keyword.control.drun" }
        }
      },
      {
        name: "meta.condition.version-check.drun",
        match: "\\b(and\\s+version|version)(\\s+)(==|!=|<=|>=|<|>)\\b",
        captures: {
          "1": { name: "keyword.control.drun" },
          "3": { name: "keyword.operator.comparison.drun" }
        }
      },
      {
        name: "meta.condition.filesystem.drun",
        match: "\\b(file|folder|directory|dir)(\\s+)(\"(?:[^\"\\\\]|\\\\.)*\"|\\{[^}]+\\}|\\$[A-Za-z_][A-Za-z0-9_\\-]*)",
        captures: {
          "1": { name: "support.constant.domain.drun" },
          "3": { name: "string.quoted.double.path.drun" }
        }
      },
      {
        name: "meta.condition.detected.drun",
        match: "\\b([A-Za-z_][A-Za-z0-9_\\-]*)(\\s+)(is\\s+detected|detected)\\b",
        captures: {
          "1": { name: "support.constant.domain.drun" },
          "3": { name: "keyword.control.drun" }
        }
      }
    ]
  },
  "http-actions": {
    patterns: [
      {
        name: "meta.http.action.drun",
        match: "^(\\s*)(get|post|put|delete|patch|head|options)(\\s+)(\"(?:[^\"\\\\]|\\\\.)*\")",
        captures: {
          "2": { name: "support.type.action.drun" },
          "4": { name: "string.quoted.double.url.drun" }
        }
      },
      {
        name: "meta.http.option.drun",
        match: "\\b(content\\s+type|with\\s+body|with\\s+header|with\\s+auth|auth\\s+bearer|auth\\s+basic|timeout|retry|download|upload)\\b",
        captures: {
          "0": { name: "keyword.operator.word.drun" }
        }
      }
    ]
  },
  "download-actions": {
    patterns: [
      {
        name: "meta.download.action.drun",
        match: "^(\\s*)(download)(\\s+)(\"(?:[^\"\\\\]|\\\\.)*\")(\\s+)(to)(\\s+)(\"(?:[^\"\\\\]|\\\\.)*\")",
        captures: {
          "2": { name: "support.type.action.drun" },
          "4": { name: "string.quoted.double.url.drun" },
          "6": { name: "keyword.operator.word.drun" },
          "8": { name: "string.quoted.double.path.drun" }
        }
      },
      {
        name: "meta.download.option.drun",
        match: "\\b(allow\\s+overwrite|allow\\s+permissions|extract\\s+to|remove\\s+archive|with\\s+auth|with\\s+header|timeout|retry)\\b",
        captures: {
          "0": { name: "keyword.operator.word.drun" }
        }
      }
    ]
  },
  "network-actions": {
    patterns: [
      {
        name: "meta.network.wait.drun",
        match: "^(\\s*)(wait)(\\s+)(for)(\\s+)(service)(\\s+)(at)(\\s+)(\"(?:[^\"\\\\]|\\\\.)*\")(\\s+)(to)(\\s+)(be)(\\s+)(ready)",
        captures: {
          "2": { name: "support.type.action.drun" },
          "4": { name: "keyword.operator.word.drun" },
          "6": { name: "support.constant.domain.drun" },
          "8": { name: "keyword.operator.word.drun" },
          "10": { name: "string.quoted.double.url.drun" },
          "12": { name: "keyword.operator.word.drun" },
          "14": { name: "keyword.operator.word.drun" },
          "16": { name: "support.constant.domain.drun" }
        }
      },
      {
        name: "meta.network.test.drun",
        match: "^(\\s*)(test)(\\s+)(connection)(\\s+)(to)(\\s+)(\"(?:[^\"\\\\]|\\\\.)*\")(\\s+)(on)(\\s+)(port)(\\s+)(\\d+)",
        captures: {
          "2": { name: "support.type.action.drun" },
          "4": { name: "support.constant.domain.drun" },
          "6": { name: "keyword.operator.word.drun" },
          "8": { name: "string.quoted.double.drun" },
          "10": { name: "keyword.operator.word.drun" },
          "12": { name: "support.constant.domain.drun" },
          "14": { name: "constant.numeric.drun" }
        }
      },
      {
        name: "meta.network.ping.drun",
        match: "^(\\s*)(ping)(\\s+)(host)(\\s+)(\"(?:[^\"\\\\]|\\\\.)*\")",
        captures: {
          "2": { name: "support.type.action.drun" },
          "4": { name: "support.constant.domain.drun" },
          "6": { name: "string.quoted.double.drun" }
        }
      }
    ]
  },
  orchestration: {
    patterns: [
      {
        name: "meta.service.definition.drun",
        match: "^(\\s*)(service)(\\s+)(\"(?:[^\"\\\\]|\\\\.)*\")(\\s+)(in)(\\s+)(\"(?:[^\"\\\\]|\\\\.)*\")",
        captures: {
          "2": { name: "keyword.declaration.drun" },
          "4": { name: "entity.name.type.service.drun" },
          "6": { name: "keyword.operator.word.drun" },
          "8": { name: "string.quoted.double.path.drun" }
        }
      },
      {
        name: "meta.orchestration.definition.drun",
        match: "^(\\s*)(orchestrate)(\\s+)(\"(?:[^\"\\\\]|\\\\.)*\")(?=\\s*:)",
        captures: {
          "2": { name: "support.type.action.drun" },
          "4": { name: "entity.name.type.orchestration.drun" }
        }
      },
      {
        name: "meta.orchestration.action.drun",
        match: "^(\\s*)(orchestrate)(\\s+)(\"(?:[^\"\\\\]|\\\\.)*\")(\\s+)(show\\s+endpoints|clone\\s+repositories|update\\s+repositories|list\\s+branches|switch\\s+branch\\s+to\\s+default|set\\s+all\\s+branches\\s+to\\s+default|health_check|restart|recreate|status|health|build|pull|down|logs|start|stop|scale|endpoints|up)(?:(\\s+)(starting\\s+from)(\\s+)(\\$[A-Za-z_][A-Za-z0-9_\\-]*|\"(?:[^\"\\\\]|\\\\.)*\"|\\{[^}]+\\}))?",
        captures: {
          "2": { name: "support.type.action.drun" },
          "4": { name: "entity.name.type.orchestration.drun" },
          "6": { name: "support.type.action.drun" },
          "8": { name: "keyword.operator.word.drun" },
          "10": { name: "entity.name.type.service.drun" }
        }
      },
      {
        name: "meta.orchestration.modifier.drun",
        match: "\\b(services|service|starting\\s+from|with\\s+cache|with\\s+branch|with\\s+timeout)\\b",
        captures: {
          "1": { name: "keyword.operator.word.drun" }
        }
      },
      {
        name: "entity.name.type.service.drun",
        match: "(?<=\\bservice\\s)(\"(?:[^\"\\\\]|\\\\.)*\"|\\$[A-Za-z_][A-Za-z0-9_\\-]*|\\{[^}]+\\})"
      },
      {
        name: "entity.other.attribute-name.orchestration.drun",
        match: "^(\\s*)(repository|build|health\\s+check|services|strategy|circuit_breaker|stop_on_failure|health_check_interval|startup_timeout|shutdown_timeout|makefile_order|makefile_timeout|clone_order|clone_timeout|pre_task|post_task|git_ssh_key|dns_checks|url|branch|tag|ssh_key|clone|update_on_start|required|command|allocate_tty|makefile|make_target|make_args|retry_on_failure|max_retries|retry_delay|fallback_command|type|endpoint|timeout|interval|retries|condition|container)(?=\\s*:|\\s+\\[|\\s+\"|\\s+true\\b|\\s+false\\b|\\s+\\d)"
      }
    ]
  },
  "call-task": {
    patterns: [
      {
        name: "meta.call.task.drun",
        match: "^(\\s*)(call)(\\s+)(task)(\\s+)(\"(?:[^\"\\\\]|\\\\.)*\"|[A-Za-z_][A-Za-z0-9_:.\\-]*)(?:(\\s+)(with))?",
        captures: {
          "2": { name: "keyword.control.call.drun" },
          "4": { name: "keyword.declaration.task.drun" },
          "6": { name: "entity.name.function.task.drun" },
          "8": { name: "keyword.operator.word.drun" }
        }
      },
      {
        name: "meta.call.task.argument.drun",
        match: "(?:\\s|^)([A-Za-z_][A-Za-z0-9_\\-]*)(=)",
        captures: {
          "1": { name: "variable.parameter.drun" },
          "2": { name: "keyword.operator.assignment.drun" }
        }
      }
    ]
  },
  "lifecycle-hooks": {
    patterns: [
      {
        name: "meta.lifecycle.hook.drun",
        match: "^(\\s*)(before|after)(\\s+)(any)(\\s+)(task)(?=\\s*:)",
        captures: {
          "2": { name: "keyword.control.lifecycle.drun" },
          "4": { name: "keyword.control.lifecycle.drun" },
          "6": { name: "keyword.declaration.task.drun" }
        }
      },
      {
        name: "meta.lifecycle.hook.drun",
        match: "^(\\s*)(on)(\\s+)(drun)(\\s+)(setup|teardown)(?=\\s*:)",
        captures: {
          "2": { name: "keyword.control.lifecycle.drun" },
          "4": { name: "support.constant.domain.drun" },
          "6": { name: "keyword.control.lifecycle.drun" }
        }
      }
    ]
  },
  "shell-config": {
    patterns: [
      {
        name: "meta.shell-config.drun",
        match: "^(\\s*)(shell)(\\s+)(config)(?=\\s*:)",
        captures: {
          "2": { name: "support.type.action.drun" },
          "4": { name: "keyword.declaration.config.drun" }
        }
      },
      {
        name: "entity.name.label.platform.drun",
        match: "^(\\s*)(darwin|linux|windows)(?=\\s*:)"
      },
      {
        name: "entity.other.attribute-name.drun",
        match: "^(\\s*)(executable|args|environment)(?=\\s*:)"
      },
      {
        name: "punctuation.definition.list-item.drun",
        match: "^\\s*(-)(?=\\s+\")"
      }
    ]
  },
  "single-quoted": {
    patterns: [
      {
        name: "string.quoted.single.drun",
        begin: "'",
        beginCaptures: {
          "0": { name: "punctuation.definition.string.begin.drun" }
        },
        end: "'",
        endCaptures: {
          "0": { name: "punctuation.definition.string.end.drun" }
        },
        patterns: [
          {
            name: "constant.character.escape.drun",
            match: "\\\\."
          }
        ]
      }
    ]
  },
  strings: {
    patterns: [
      {
        name: "string.quoted.double.drun",
        begin: "\"",
        beginCaptures: {
          "0": { name: "punctuation.definition.string.begin.drun" }
        },
        end: "\"",
        endCaptures: {
          "0": { name: "punctuation.definition.string.end.drun" }
        },
        patterns: [
          {
            name: "constant.character.escape.line-continuation.drun",
            match: "\\\\\\n"
          },
          {
            name: "constant.character.escape.drun",
            match: "\\\\."
          },
          { include: "#interpolation" }
        ]
      }
    ]
  },
  interpolation: {
    patterns: [
      {
        name: "meta.interpolation.drun",
        begin: "\\{",
        beginCaptures: {
          "0": { name: "punctuation.section.interpolation.begin.drun" }
        },
        end: "\\}",
        endCaptures: {
          "0": { name: "punctuation.section.interpolation.end.drun" }
        },
        patterns: [
          { include: "#single-quoted" },
          { include: "#variables" },
          { include: "#builtins" },
          { include: "#functions" },
          { include: "#constants" },
          { include: "#types" },
          { include: "#keywords" },
          { include: "#operators" },
          { include: "#object-keys" }
        ]
      }
    ]
  },
  "object-keys": {
    patterns: [
      {
        name: "support.type.property-name.drun",
        match: "\\b[A-Za-z_][A-Za-z0-9_]*\\b(?=\\s*:)"
      }
    ]
  },
  variables: {
    patterns: [
      {
        name: "variable.language.globals.drun",
        match: "\\$globals\\.[A-Za-z_][A-Za-z0-9_]*"
      },
      {
        name: "variable.other.drun",
        match: "\\$[A-Za-z_][A-Za-z0-9_\\-]*"
      }
    ]
  }
};
