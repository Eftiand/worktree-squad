import { execFileSync } from "node:child_process";

function tmux(args) {
  return execFileSync("tmux", args, {
    encoding: "utf8",
    stdio: "pipe",
  }).trim();
}

export function ensureTmux() {
  if (!process.env.TMUX) {
    throw new Error("not inside a tmux session");
  }
}

export function sessionName() {
  return tmux(["display-message", "-p", "#{session_name}"]);
}

export function windowId() {
  return tmux(["display-message", "-p", "#{window_id}"]);
}

export function currentPaneId() {
  return tmux(["display-message", "-p", "#{pane_id}"]);
}

export function paneAlive(paneId) {
  try {
    tmux(["display-message", "-t", paneId, "-p", "#{pane_id}"]);
    return true;
  } catch {
    return false;
  }
}

export function splitWindow(splitDir, cwd, shellCmd) {
  return tmux([
    "split-window",
    splitDir,
    "-c",
    cwd,
    "-P",
    "-F",
    "#{pane_id}",
    "--",
    process.env.SHELL || "/bin/zsh",
    "-lic",
    shellCmd,
  ]);
}

export function killPane(paneId) {
  try {
    tmux(["kill-pane", "-t", paneId]);
  } catch {
    // pane may already be gone
  }
}

export function equalize() {
  try {
    tmux(["select-layout", "-E"]);
  } catch {
    // ignore
  }
}
