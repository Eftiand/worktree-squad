import { execFileSync } from "node:child_process";

function git(args, opts = {}) {
  return execFileSync("git", args, {
    encoding: "utf8",
    stdio: "pipe",
    ...opts,
  }).trim();
}

export function branchExists(branch) {
  try {
    git(["show-ref", "--verify", "--quiet", `refs/heads/${branch}`]);
    return true;
  } catch {
    return false;
  }
}

export function worktreeAdd(path, branch, base) {
  if (branchExists(branch)) {
    git(["worktree", "add", path, branch]);
  } else {
    git(["worktree", "add", "-b", branch, path, base]);
  }
}

export function worktreeRemove(path) {
  git(["worktree", "remove", "--force", path]);
}

export function worktreeList() {
  return git(["worktree", "list"]);
}

export function worktreePrune() {
  git(["worktree", "prune"]);
}

export function deleteBranch(branch) {
  try {
    git(["branch", "-D", branch]);
  } catch {
    // branch may already be gone
  }
}

export function checkout(branch) {
  git(["checkout", branch]);
}

export function hasUncommittedChanges(wtPath) {
  try {
    git(["diff", "--quiet", "HEAD"], { cwd: wtPath });
    return false;
  } catch {
    return true;
  }
}
