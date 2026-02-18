import {
  readFileSync,
  writeFileSync,
  appendFileSync,
  readdirSync,
  unlinkSync,
  mkdirSync,
  existsSync,
} from "node:fs";
import { join } from "node:path";
import * as tmux from "./tmux.js";

function groupFile(config) {
  const session = tmux.sessionName();
  const window = tmux.windowId();
  return join(config.stateDir, `${session}_${window}`);
}

export function initGroup(config, splitDir) {
  mkdirSync(config.stateDir, { recursive: true });
  const gf = groupFile(config);

  // Reset stale group: if file exists but source pane is dead, start fresh
  if (existsSync(gf)) {
    const lines = readFileSync(gf, "utf8").split("\n").filter(Boolean);
    if (lines.length >= 2) {
      const srcPane = lines[1].split(":")[0];
      if (!tmux.paneAlive(srcPane)) {
        unlinkSync(gf);
      }
    }
  }

  if (!existsSync(gf)) {
    const src = tmux.currentPaneId();
    writeFileSync(gf, `${splitDir}\n${src}:_\n`);
  }
}

export function trackPane(config, paneId, name) {
  appendFileSync(groupFile(config), `${paneId}:${name}\n`);
}

export function killPaneFor(config, name) {
  if (!existsSync(config.stateDir)) return;

  let files;
  try {
    files = readdirSync(config.stateDir);
  } catch {
    return;
  }

  for (const file of files) {
    const gf = join(config.stateDir, file);
    let content;
    try {
      content = readFileSync(gf, "utf8");
    } catch {
      continue;
    }

    const lines = content.split("\n");
    const pattern = `:${name}`;
    const match = lines.find((l) => l.endsWith(pattern) && l !== pattern);
    if (!match) continue;

    const paneId = match.split(":")[0];
    tmux.killPane(paneId);

    // Remove the line from state file
    const filtered = lines.filter(
      (l) => !(l.endsWith(pattern) && l !== pattern),
    );
    writeFileSync(gf, filtered.join("\n"));
    return;
  }
}

export function nukeAllPanes(config) {
  if (!existsSync(config.stateDir)) return;

  let files;
  try {
    files = readdirSync(config.stateDir);
  } catch {
    return;
  }

  for (const file of files) {
    const gf = join(config.stateDir, file);
    let content;
    try {
      content = readFileSync(gf, "utf8");
    } catch {
      continue;
    }

    const lines = content.split("\n").filter(Boolean);
    // Skip line 0 (split dir), line 1 (source pane)
    for (let i = 1; i < lines.length; i++) {
      const [pid, wname] = lines[i].split(":");
      if (wname === "_") continue;
      tmux.killPane(pid);
    }

    unlinkSync(gf);
  }
}
