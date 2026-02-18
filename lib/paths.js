import { execFileSync } from "node:child_process";
import { join } from "node:path";

export function ensureGitRepo() {
  try {
    execFileSync("git", ["rev-parse", "--git-dir"], { stdio: "pipe" });
  } catch {
    throw new Error("not a git repository");
  }
}

export function repoRoot() {
  return execFileSync("git", ["rev-parse", "--show-toplevel"], {
    encoding: "utf8",
    stdio: "pipe",
  }).trim();
}

export function worktreePath(config, name) {
  return join(repoRoot(), config.worktreeDir, name);
}

export function branchName(config, name) {
  return `${config.branchPrefix}/${name}`;
}
