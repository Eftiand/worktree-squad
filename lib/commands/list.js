import { ensureGitRepo } from "../paths.js";
import { worktreeList } from "../git.js";

export function list() {
  ensureGitRepo();
  console.log("── Worktrees ──");
  console.log(worktreeList());
}
