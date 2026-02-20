# worktree-squad

CLI for managing parallel git worktrees as tmux panes. Create a worktree, get an editor in a split — one command.

## Requirements

- Node.js >= 18
- git
- tmux

## Install

```bash
npm install -g worktree-squad
```

## Usage

```bash
worktree-squad new auth-flow          # create worktree + open editor in new pane
worktree-squad new auth-flow main -v  # based on main, split vertically
worktree-squad attach auth-flow       # reopen existing worktree in a pane
worktree-squad ls                     # list worktrees
worktree-squad done auth-flow         # remove worktree, checkout its branch
worktree-squad kill auth-flow         # remove worktree + delete branch
worktree-squad nuke                   # remove all worktrees (confirms first)
```

Each `ws new` creates a branch (`<prefix>/<name>`), a worktree directory, and splits your current tmux window with your editor pointed at it. Panes auto-equalize after every operation.

`done` preserves the branch (switches your main worktree to it). `kill` deletes both worktree and branch.

## Configuration

Place `.worktree-squad.json` at your repo root, or `~/.config/worktree-squad/config.json` globally:

```json
{
  "worktreeDir": "worktrees",
  "branchPrefix": "kj",
  "editor": "nvim .",
  "copyDirs": ["config-overrides"],
  "symlinkFiles": [".env", ".nvmrc"]
}
```

| Key | Default | Description |
|-----|---------|-------------|
| `worktreeDir` | `worktrees` | Directory for worktrees (auto-added to `.gitignore`) |
| `branchPrefix` | `kj` | Branch naming: `<prefix>/<name>` |
| `editor` | `nvim .` | Shell command run in each pane |
| `copyDirs` | `["config-overrides"]` | Dirs copied from repo root into new worktrees |
| `symlinkFiles` | `[]` | Files or dirs symlinked from repo root into new worktrees |

## License

MIT
