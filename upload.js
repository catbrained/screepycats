const https = require("node:https");
const config = require("./screeps.json");
const fs = require("node:fs");
const path = require("node:path");

try {
  const token = process.env.SCREEPS_TOKEN;
  if(token === "" || token === undefined) {
    throw new Error("Screeps login info is missing!");
  }
  let dest = config.sim;
  if(process.argv[2]) {
    dest = config[process.argv[2]];
    if(!dest) {
      throw new Error(`destination '${process.argv[2]}' not found in screeps.json!`)
    }
  }
  const modules = {};
  const entries = fs.readdirSync("./dist", { encoding: "utf8", withFileTypes: true, recursive: true });
  for(const entry of entries) {
    if(entry.isFile()) {
      // Strip file extension (i.e., `.js`)
      const name = path.parse(entry.name).name;
      modules[name] = fs.readFileSync(path.join(entry.path, entry.name), { encoding: "utf8" });
    }
  }
  const data = {
    branch: dest.branch,
    modules: modules
  };

  const options = {
    hostname: dest.hostname,
    port: dest.port,
    path: "/api/user/code",
    method: "POST",
    headers: {
      "X-Token": token,
      "Content-Type": "application/json; charset=utf-8"
    }
  };

  const req = https.request(options, (res) => {
    console.log("status code:", res.statusCode);

    res.on("data", (d) => {
      const answer = JSON.parse(d);
      if(answer.ok === 1) {
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
