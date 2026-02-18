#!/usr/bin/env node

import { Command } from "commander";
import { list } from "../lib/commands/list.js";
import { cmdNew } from "../lib/commands/new.js";
import { attach } from "../lib/commands/attach.js";
import { kill } from "../lib/commands/kill.js";
import { done } from "../lib/commands/done.js";
import { nuke } from "../lib/commands/nuke.js";

const program = new Command();

program
  .name("worktree-squad")
  .description("worktree-squad — Parallel git worktrees with editor panes in tmux")
  .helpOption("--help", "display help")
  .version("1.0.0", "--version");

program
  .command("new")
  .description("Create worktree + editor pane")
  .argument("<name>", "worktree name")
  .argument("[base]", "base branch", "HEAD")
  .option("-v", "split below")
  .option("-h", "split right (default)")
  .action((name, base, opts) => {
    const splitDir = opts.v ? "-v" : "-h";
    cmdNew(name, base, splitDir);
  });

program
  .command("attach")
  .alias("a")
  .description("Open existing worktree in pane")
  .argument("<name>", "worktree name")
  .option("-v", "split below")
  .option("-h", "split right (default)")
  .action((name, opts) => {
    const splitDir = opts.v ? "-v" : "-h";
    attach(name, splitDir);
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
