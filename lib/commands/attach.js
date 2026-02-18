import { existsSync } from "node:fs";
import { loadConfig } from "../config.js";
import { ensureGitRepo, worktreePath } from "../paths.js";
import { ensureTmux, splitWindow } from "../tmux.js";
import { initGroup, trackPane, equalize } from "./helpers.js";

export function attach(name, splitDir) {
  const config = loadConfig();
  ensureGitRepo();
  ensureTmux();

  const wtPath = worktreePath(config, name);
  if (!existsSync(wtPath)) {
    throw new Error(`worktree '${name}' not found at ${wtPath}`);
  }

  initGroup(config, splitDir);
  const newPane = splitWindow(splitDir, wtPath, config.editor);
  trackPane(config, newPane, name);
  equalize();
}
