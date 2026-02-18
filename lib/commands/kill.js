import { existsSync } from "node:fs";
import { loadConfig } from "../config.js";
import { ensureGitRepo, worktreePath, branchName } from "../paths.js";
import { worktreeRemove, worktreePrune, deleteBranch } from "../git.js";
import { killPaneFor } from "../state.js";
import * as tmux from "../tmux.js";

export function kill(name) {
  const config = loadConfig();
  ensureGitRepo();

  const branch = branchName(config, name);
  const wtPath = worktreePath(config, name);

  // Kill the associated tmux pane (safe even outside tmux)
  killPaneFor(config, name);

  if (existsSync(wtPath)) {
    worktreeRemove(wtPath);
  }

  deleteBranch(branch);
  worktreePrune();

  // Re-equalize if in tmux
  if (process.env.TMUX) {
    tmux.equalize();
  }

  console.log(`✓ Removed worktree for '${name}'`);
}
