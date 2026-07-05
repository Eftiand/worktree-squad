#!/usr/bin/env node

import { Command } from "commander";
import { createRequire } from "node:module";
import { list } from "../lib/commands/list.js";
import { cmdNew } from "../lib/commands/new.js";
import { attach } from "../lib/commands/attach.js";
import { kill } from "../lib/commands/kill.js";
import { done } from "../lib/commands/done.js";
import { nuke } from "../lib/commands/nuke.js";

const { version } = createRequire(import.meta.url)("../package.json");

const program = new Command();

program
  .name("worktree-squad")
  .description("worktree-squad — Parallel git worktrees with editor panes in herdr")
  .helpOption("--help", "display help")
  .version(version, "--version");

program
  .command("new")
  .description("Create worktree + editor pane")
  .argument("<name>", "worktree name")
  .argument("[base]", "base branch", "HEAD")
  .option("-v", "split below (default)")
  .option("-h", "split right")
  .action((name, base, opts) => {
    const direction = opts.h ? "right" : "down";
    cmdNew(name, base, direction);
  });

program
  .command("attach")
  .alias("a")
  .description("Open existing worktree in pane")
  .argument("<name>", "worktree name")
  .option("-v", "split below (default)")
  .option("-h", "split right")
  .action((name, opts) => {
    const direction = opts.h ? "right" : "down";
    attach(name, direction);
  });

program
  .command("list")
  .alias("ls")
  .description("Show active worktrees")
  .action(() => {
    list();
  });

program
  .command("done")
  .description("Remove worktree, switch to its branch")
  .argument("<name>", "worktree name")
  .action((name) => {
    done(name);
  });

program
  .command("kill")
  .description("Remove worktree + branch (no merge)")
  .argument("<name>", "worktree name")
  .action((name) => {
    kill(name);
  });

program
  .command("nuke")
  .description("Remove all worktrees")
  .action(async () => {
    await nuke();
  });

// Catch errors from sync commands
const origParse = program.parseAsync.bind(program);
try {
  await origParse(process.argv);
} catch (err) {
  console.error(`error: ${err.message}`);
  process.exit(1);
}
