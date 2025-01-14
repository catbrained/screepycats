import { request } from "node:https";
import config from "./screeps.json" with { type: "json" };
import { readdirSync, readFileSync } from "node:fs";
import { parse, join } from "node:path";

try {
  const token = process.env.SCREEPS_TOKEN;
  if (token === "" || token === undefined) {
    throw new Error("Screeps login info is missing!");
  }
  let dest = config.sim;
  if (process.argv[2]) {
    dest = config[process.argv[2]];
    if (!dest) {
      throw new Error(
        `destination '${process.argv[2]}' not found in screeps.json!`,
      );
    }
  }
  const modules = {};
  const entries = readdirSync("./dist", {
    encoding: "utf8",
    withFileTypes: true,
    recursive: true,
  });
  for (const entry of entries) {
    if (entry.isFile()) {
      const path = parse(entry.name);
      if (path.ext == ".map") {
        continue;
      }
      // Strip file extension (i.e., `.js`)
      const name = path.name;
      modules[name] = readFileSync(join(entry.parentPath, entry.name), {
        encoding: "utf8",
      });
    }
  }
  const data = {
    branch: dest.branch,
    modules: modules,
  };

  const options = {
    hostname: dest.hostname,
    port: dest.port,
    path: "/api/user/code",
    method: "POST",
    headers: {
      "X-Token": token,
      "Content-Type": "application/json; charset=utf-8",
    },
  };

  const req = request(options, (res) => {
    console.log("status code:", res.statusCode);

    res.on("data", (d) => {
      const answer = JSON.parse(d);
      if (answer.ok === 1) {
        console.log("Upload OK!");
      } else {
        console.error("Upload FAILED!");
      }
    });
  });

  req.on("error", (e) => {
    console.error(e);
  });

  req.write(JSON.stringify(data));
  req.end();
} catch (e) {
  console.error(e);
}
