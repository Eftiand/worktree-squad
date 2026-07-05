# worktree-squad

Work on multiple things at once without stashing, switching branches, or losing context. Each `ws new` creates a git worktree on its own branch and opens your editor in a new [herdr](https://herdr.dev) pane — ready to code in seconds.

## Requirements

- Node.js >= 18
- git
- herdr

## Install

```bash
npm install -g worktree-squad
```

## Get started

```bash
ws new auth-flow    # new branch + worktree + editor pane, all at once
ws ls               # see what's running
ws done auth-flow   # finished — remove worktree, keep the branch
ws kill auth-flow   # scrap it — remove worktree and branch
```

## All commands

```bash
ws new <name> [base]   # create worktree from base branch (default: HEAD)
ws attach <name>       # reopen an existing worktree in a pane
ws ls                  # list active worktrees
ws done <name>         # remove worktree, switch main to its branch
ws kill <name>         # remove worktree + delete branch
ws nuke                # remove all worktrees (asks first)
```

## Configuration

Place `.worktree-squad.json` at your repo root, or `~/.config/worktree-squad/config.json` for a global default:

```json
{
  "branchPrefix": "kj",
  "editor": "nvim .",
  "copyDirs": ["config-overrides"],
  "symlinkFiles": [".env", ".nvmrc"]
}
```

| Key | Default | Description |
|-----|---------|-------------|
| `worktreeDir` | `worktrees` | Where worktrees are created (auto-added to `.gitignore`) |
| `branchPrefix` | `kj` | Branch naming: `<prefix>/<name>` |
| `editor` | `nvim .` | Command to open in each pane |
| `copyDirs` | `[]` | Dirs to copy from repo root into each new worktree |
| `symlinkFiles` | `[]` | Files or dirs to symlink from repo root into each new worktree |

## License

MIT
