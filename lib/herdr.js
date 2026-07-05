import { execFileSync } from "node:child_process";

function herdr(args) {
  const out = execFileSync("herdr", args, {
    encoding: "utf8",
    stdio: "pipe",
  }).trim();
  if (!out) return null;
  const parsed = JSON.parse(out);
  if (parsed.error) {
    throw new Error(parsed.error.message);
  }
  return parsed.result;
}

export function ensureHerdr() {
  if (!process.env.HERDR_PANE_ID) {
    throw new Error("not inside a herdr session");
  }
}

export function tabId() {
  return process.env.HERDR_TAB_ID || "tab";
}

export function currentPaneId() {
  return process.env.HERDR_PANE_ID;
}

export function paneAlive(paneId) {
  try {
    herdr(["pane", "get", paneId]);
    return true;
  } catch {
    return false;
  }
}

export function splitPane(direction, cwd, shellCmd) {
  const result = herdr([
    "pane",
    "split",
    "--pane",
    currentPaneId(),
    "--direction",
    direction,
    "--cwd",
    cwd,
    "--focus",
  ]);
  const paneId = result.pane.pane_id;
  herdr(["pane", "run", paneId, shellCmd]);
  return paneId;
}

export function closePane(paneId) {
  try {
    herdr(["pane", "close", paneId]);
  } catch {
    // pane may already be gone
  }
}
