import { existsSync } from "node:fs";
import { loadConfig } from "../config.js";
import { ensureGitRepo, worktreePath } from "../paths.js";
import { ensureHerdr, splitPane } from "../herdr.js";
import { initGroup, trackPane } from "./helpers.js";

export function attach(name, direction) {
  const config = loadConfig();
  ensureGitRepo();
  ensureHerdr();

  const wtPath = worktreePath(config, name);
  if (!existsSync(wtPath)) {
    throw new Error(`worktree '${name}' not found at ${wtPath}`);
  }

  initGroup(config, direction);
  const newPane = splitPane(direction, wtPath, config.editor);
  trackPane(config, newPane, name);
}
