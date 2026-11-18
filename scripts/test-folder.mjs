import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

const TEST_FILE = /\.test\.(?:[cm]?[jt]s)$/;

function collectTests(dir) {
  const tests = [];

  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules") continue;

    const path = join(dir, entry.name);
    if (entry.isDirectory()) tests.push(...collectTests(path));
    else if (TEST_FILE.test(entry.name)) tests.push(path);
  }

  return tests.sort();
}

const name = process.argv[2];

if (!name) {
  console.error("Usage: npm run test:folder -- <problem-folder> [node flags]");
  console.error("Example: npm run test:folder -- 02-LRU");
  process.exit(1);
}

const asPath = resolve(name);
const folder =
  existsSync(asPath) && statSync(asPath).isDirectory() ? asPath : resolve("problems", name);

if (!existsSync(folder) || !statSync(folder).isDirectory()) {
  console.error(`No folder at ${folder}`);
  console.error("Pass a folder name under problems/ or a path to a folder.");
  process.exit(1);
}

const tests = collectTests(folder);

if (tests.length === 0) {
  console.error(`No *.test.* files under ${folder}`);
  process.exit(1);
}

const nodeFlags = process.argv.slice(3);
const result = spawnSync(process.execPath, ["--test", ...nodeFlags, ...tests], {
  stdio: "inherit",
});
process.exit(result.status ?? 1);
