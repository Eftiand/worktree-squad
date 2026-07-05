import { existsSync } from "node:fs";
import { loadConfig } from "../config.js";
import { ensureGitRepo, worktreePath, branchName } from "../paths.js";
import {
  worktreeRemove,
  worktreePrune,
  checkout,
  hasUncommittedChanges,
} from "../git.js";
import { killPaneFor } from "../state.js";

export function done(name) {
  const config = loadConfig();
  ensureGitRepo();

  const branch = branchName(config, name);
  const wtPath = worktreePath(config, name);

  // Abort if there are uncommitted changes
  if (existsSync(wtPath) && hasUncommittedChanges(wtPath)) {
    throw new Error(
      `worktree '${name}' has uncommitted changes — commit or stash first`,
    );
  }

  // Close the associated herdr pane
  killPaneFor(config, name);

  // Remove the worktree but keep the branch
  if (existsSync(wtPath)) {
    worktreeRemove(wtPath);
  }
  worktreePrune();

  // Switch to the branch in the main worktree
  checkout(branch);

  console.log(`✓ Removed worktree and switched to ${branch}`);
}
