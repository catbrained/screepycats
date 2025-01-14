import roleHarvester from "./role.harvester";
import roleUpgrader from "./role.upgrader";

export function loop() {
  // Clear memory used by dead creeps
  for (const name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
      console.log("Clearing non-existent creep's memory:", name);
    }
  }

  let numHarvesters = 0;
  let numUpgraders = 0;

  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    if (creep.memory.role === "harvester") {
      numHarvesters++;
      if (!creep.spawning) {
        roleHarvester.run(creep);
      }
    }
    if (creep.memory.role === "upgrader") {
      numUpgraders++;
      if (!creep.spawning) {
        roleUpgrader.run(creep);
      }
    }
  }

  // Spawn new creeps, if necessary
  const spawn = Game.spawns["Spawn1"];
  if (!spawn.spawning) {
    if (numHarvesters < 2) {
      const body: BodyPartConstant[] = ["work", "carry", "move"];
      const name = `harvester_${numHarvesters}_${Game.time}`;
      const canSpawn = spawn.spawnCreep(body, name, { dryRun: true });
      if (canSpawn === OK) {
        spawn.spawnCreep(body, name, {
          memory: { role: "harvester", activity: "harvest" },
        });
      }
    } else if (numUpgraders < 5) {
      const body: BodyPartConstant[] = ["work", "carry", "move"];
      const name = `upgrader_${numUpgraders}_${Game.time}`;
      const canSpawn = spawn.spawnCreep(body, name, { dryRun: true });
      if (canSpawn === OK) {
        spawn.spawnCreep(body, name, {
          memory: { role: "upgrader", activity: "harvest" },
        });
      }
    }
  }
}

function filterObject(
  obj: Object,
  callback: (val: any, key: string) => boolean,
) {
  return Object.fromEntries(
    Object.entries(obj).filter(([key, val]) => callback(val, key)),
  );
}
