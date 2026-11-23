import { spawnSync } from "node:child_process";
import { nextAction } from "./fake-agent.js";

function runTests() {
  const result = spawnSync("npm", ["test"], {
    encoding: "utf8",
  });

  return {
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? "",
    exitCode: result.status,
    error: result.error?.message,
  };
}

// This map is the harness's allowlist: only listed tools may run.
const allowedTools = new Map([["runTests", runTests]]);

const action = nextAction();

if (action.kind !== "tool") {
  console.error("Harness: expected a tool request.");
  process.exitCode = 1;
} else {
  const tool = allowedTools.get(action.name);

  if (!tool) {
    console.error(`Harness: tool not allowed: ${action.name}`);
    process.exitCode = 1;
  } else {
    const result = tool(action.input);

    process.stdout.write(result.stdout);
    process.stderr.write(result.stderr);

    if (result.error) {
      console.error(`Harness could not start tests: ${result.error}`);
      process.exitCode = 1;
    } else if (result.exitCode !== 0) {
      console.error(`Harness: tests failed (exit code ${result.exitCode}).`);
      process.exitCode = 1;
    } else {
      console.log("Harness: tests passed.");
    }
  }
}
