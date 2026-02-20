import {
  mkdirSync,
  readFileSync,
  appendFileSync,
  existsSync,
  cpSync,
  symlinkSync,
} from "node:fs";
import { join } from "node:path";
import { loadConfig } from "../config.js";
import { ensureGitRepo, repoRoot, worktreePath, branchName } from "../paths.js";
import { worktreeAdd } from "../git.js";
import { ensureTmux, splitWindow } from "../tmux.js";
import { initGroup, trackPane, equalize } from "./helpers.js";

export function cmdNew(name, base, splitDir) {
  const config = loadConfig();
  ensureGitRepo();
  ensureTmux();

  const root = repoRoot();
  const branch = branchName(config, name);
  const wtPath = worktreePath(config, name);

  // Create worktree dir if needed
  mkdirSync(join(root, config.worktreeDir), { recursive: true });

  // Add worktree dir to .gitignore if the file exists and lacks the entry
  const gitignore = join(root, ".gitignore");
  if (existsSync(gitignore)) {
    const content = readFileSync(gitignore, "utf8");
    const entry = `${config.worktreeDir}/`;
    if (!content.split("\n").includes(entry)) {
      appendFileSync(gitignore, `${content.endsWith("\n") ? "" : "\n"}${entry}\n`);
      console.log(`Added ${entry} to .gitignore`);
    }
  }

  // Create worktree
  worktreeAdd(wtPath, branch, base);

  // Copy configured directories
  for (const dir of config.copyDirs) {
    if (!dir) continue;
    const src = join(root, dir);
    if (existsSync(src)) {
      cpSync(src, join(wtPath, dir), { recursive: true });
    }
  }

  for (const target of config.symlinkFiles) {
    if (!target) continue;
    const src = join(root, target);
    if (existsSync(src)) {
      symlinkSync(src, join(wtPath, target));
    }
  }

  // Open pane
  initGroup(config, splitDir);
  const newPane = splitWindow(splitDir, wtPath, config.editor);
  trackPane(config, newPane, name);
  equalize();

  console.log(`✓ Created worktree: ${wtPath}`);
  console.log(`  Branch: ${branch} (based on ${base})`);
}
