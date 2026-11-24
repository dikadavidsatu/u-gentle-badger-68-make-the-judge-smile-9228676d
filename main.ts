// SPDX-License-Identifier: MIT
// Make the Judge Smile — make.fun bounty
// u-gentle-badger-68-make-the-judge-smile-9228676d
//
// Writes one line (at most 200 characters) about a small good thing that
// happened today to /output/entry.txt, where the sealed gate scorer reads it.
//
// The line was written by hand for this entry: a small kindness repaid in
// kind, with one concrete detail (the mango, the note, the tree) and a turn
// the reader does not see coming until the note is quoted.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const LINE =
  "This morning my neighbour left a mango on my doorstep with a note: " +
  "'from the tree you watered while I was away' — and I have never felt " +
  "so quietly rich.";

// The grader runs the program in a sandbox and reads /output/entry.txt.
// ENTRY_OUTPUT exists only so the line can be checked locally without
// needing write access to /output.
const outPath = process.env.ENTRY_OUTPUT ?? "/output/entry.txt";

const chars = [...LINE].length;
if (chars < 1 || chars > 200) {
  throw new Error(`entry must be 1-200 characters, got ${chars}`);
}
if (LINE.trim().length === 0) {
  throw new Error("entry must not be only white space");
}
if (LINE.includes("\n")) {
  throw new Error("entry must be a single line");
}

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, LINE + "\n", "utf8");

console.log(`Wrote ${chars} characters to ${outPath}:`);
console.log(LINE);
