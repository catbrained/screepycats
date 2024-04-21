import { roleHarvester } from "./role.harvester";

export const loop = function () {
  // Clear memory used by dead creeps
  for(const i in Memory.creeps) {
    if(!Game.creeps[i]) {
      delete Memory.creeps[i];
    }
  }

  let numHarvesters = 0;
  for(const name in Game.creeps) {
    const creep = Game.creeps[name];
    if(creep.memory.role == "harvester") {
      numHarvesters++;
      roleHarvester.run(creep);
    }
  }

  // Spawn new creeps, if necessary
  if(numHarvesters < 2) {
    const spawn = Game.spawns["Spawn1"];
    const body: BodyPartConstant[] = [ "work", "carry", "move" ];
    const name = `harvester_${numHarvesters}_${Game.time}`;
    const canSpawn = spawn.spawnCreep(body, name, { dryRun: true });
    if(canSpawn === OK) {
      spawn.spawnCreep(body, name, { memory: { role: "harvester" } });
    }
  }
}

function filterObject(obj: Object, callback: (val: any, key: string) => boolean) {
  return Object.fromEntries(Object.entries(obj).filter(([key, val]) => callback(val, key)));
}
