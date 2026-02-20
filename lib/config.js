import { readFileSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import { repoRoot } from "./paths.js";

const DEFAULTS = {
  worktreeDir: "worktrees",
  branchPrefix: "kj",
  editor: "nvim .",
  stateDir: join(homedir(), ".local", "state", "worktree-squad"),
  copyDirs: [""],
  symlinkFiles: [""],
};

let cached;

export function loadConfig() {
  if (cached) return cached;

  let fileConfig = {};

  // 1. Repo-root config
  try {
    const root = repoRoot();
    const raw = readFileSync(join(root, ".worktree-squad.json"), "utf8");
    fileConfig = JSON.parse(raw);
  } catch {
    // 2. ~/.config fallback
    try {
      const raw = readFileSync(
        join(homedir(), ".config", "worktree-squad", "config.json"),
        "utf8",
      );
      fileConfig = JSON.parse(raw);
    } catch {
      // use defaults
    }
  }

  cached = { ...DEFAULTS, ...fileConfig };
  return cached;
}

export function resetConfigCache() {
  cached = undefined;
}
