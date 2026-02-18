import { createInterface } from "node:readline";
import { existsSync, readdirSync, rmdirSync } from "node:fs";
import { join } from "node:path";
import { loadConfig } from "../config.js";
import { ensureGitRepo, repoRoot } from "../paths.js";
import { worktreeRemove, worktreePrune } from "../git.js";
import { nukeAllPanes } from "../state.js";

function confirm(question) {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(/^[yY]$/.test(answer));
    });
  });
}

export async function nuke() {
  const config = loadConfig();
  ensureGitRepo();

  console.log(`This will remove ALL worktrees in ${config.worktreeDir}/.`);
  const yes = await confirm("Continue? [y/N] ");
  if (!yes) process.exit(0);

  // Kill all tracked ws panes
  nukeAllPanes(config);

  const wtBase = join(repoRoot(), config.worktreeDir);
  if (existsSync(wtBase)) {
    let entries;
    try {
      entries = readdirSync(wtBase, { withFileTypes: true });
    } catch {
      entries = [];
    }
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const dir = join(wtBase, entry.name);
      try {
        worktreeRemove(dir);
      } catch {
        // continue with others
      }
    }
    try {
      if (readdirSync(wtBase).length === 0) {
        rmdirSync(wtBase);
      }
    } catch {
      // ignore
    }
  }

  worktreePrune();
  console.log("✓ Nuked all worktrees");
}
