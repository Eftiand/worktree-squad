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
import * as herdr from "./herdr.js";

// Herdr pane ids contain ":" (e.g. "w1:p3"), so state lines are
// tab-separated: "<paneId>\t<name>".
const SEP = "\t";

function groupFile(config) {
  const tab = herdr.tabId().replaceAll(":", "-");
  return join(config.stateDir, tab);
}

export function initGroup(config, direction) {
  mkdirSync(config.stateDir, { recursive: true });
  const gf = groupFile(config);

  // Reset stale group: if file exists but source pane is dead, start fresh
  if (existsSync(gf)) {
    const lines = readFileSync(gf, "utf8").split("\n").filter(Boolean);
    if (lines.length >= 2) {
      const srcPane = lines[1].split(SEP)[0];
      if (!herdr.paneAlive(srcPane)) {
        unlinkSync(gf);
      }
    }
  }

  if (!existsSync(gf)) {
    const src = herdr.currentPaneId();
    writeFileSync(gf, `${direction}\n${src}${SEP}_\n`);
  }
}

export function trackPane(config, paneId, name) {
  appendFileSync(groupFile(config), `${paneId}${SEP}${name}\n`);
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
    const pattern = `${SEP}${name}`;
    const match = lines.find((l) => l.endsWith(pattern) && l !== pattern);
    if (!match) continue;

    const paneId = match.split(SEP)[0];
    herdr.closePane(paneId);

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
    // Skip line 0 (split direction), line 1 (source pane)
    for (let i = 1; i < lines.length; i++) {
      const [pid, wname] = lines[i].split(SEP);
      if (wname === "_") continue;
      herdr.closePane(pid);
    }

    unlinkSync(gf);
  }
}
