import { existsSync } from "node:fs";
import { loadConfig } from "../config.js";
import { ensureGitRepo, worktreePath, branchName } from "../paths.js";
import { worktreeRemove, worktreePrune, deleteBranch } from "../git.js";
import { killPaneFor } from "../state.js";

export function kill(name) {
  const config = loadConfig();
  ensureGitRepo();

  const branch = branchName(config, name);
  const wtPath = worktreePath(config, name);

  // Close the associated herdr pane (safe even outside herdr)
  killPaneFor(config, name);

  if (existsSync(wtPath)) {
    worktreeRemove(wtPath);
  }

  deleteBranch(branch);
  worktreePrune();

  console.log(`✓ Removed worktree for '${name}'`);
}
