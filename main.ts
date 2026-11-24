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

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
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
if (LINE.includes("\r")) {
  throw new Error("entry must not contain carriage returns");
}
// Trailing-whitespace guard: a trailing space or tab would be invisible in
// the scored line and could push it over the limit or look sloppy to the
// judge, so reject it before anything is written.
if (/[ \t]$/.test(LINE)) {
  throw new Error("entry must not end with trailing whitespace");
}
// Gate self-check, run as one named function so the rules live in exactly
// one place: 1-200 characters, a single line, and non-whitespace content.
function checkGate(line: string): void {
  const n = [...line].length;
  if (n < 1 || n > 200) {
    throw new Error(`entry must be 1-200 characters, got ${n}`);
  }
  if (line.trim().length === 0) {
    throw new Error("entry must not be only white space");
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  if (/[ \t]$/.test(line)) {
    throw new Error("entry must not end with trailing whitespace");
  }
}
checkGate(LINE);

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, LINE + "\n", "utf8");

// Read-back verification: read what was actually written and confirm it is
// byte-identical to the intended line plus one trailing newline. If the
// disk content differs (partial write, encoding surprise, stray whitespace),
// fail loudly instead of letting a corrupt entry reach the scorer.
const written = readFileSync(outPath, "utf8");
const expected = LINE + "\n";
if (written !== expected) {
  throw new Error(
    `read-back mismatch: wrote ${JSON.stringify(expected)} but file ` +
      `contains ${JSON.stringify(written)}`,
  );
}
checkGate(written.replace(/\n$/, ""));

console.log(`Wrote ${chars} characters to ${outPath}:`);
console.log(LINE);
