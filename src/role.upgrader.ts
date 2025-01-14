let roleUpgrader: {
  /**
   * @param {Creep} creep
   */
  run(creep: Creep): void;
};

export default roleUpgrader = {
  run(creep) {
    if (
      creep.memory.activity === "upgrade" &&
      creep.store.getUsedCapacity() === 0
    ) {
      creep.memory.activity = "harvest";
      creep.say("Harvesting");
    } else if (
      creep.memory.activity === "harvest" &&
      creep.store.getFreeCapacity() === 0
    ) {
      creep.memory.activity = "upgrade";
      creep.say("Upgrading");
    }

    if (creep.memory.activity === "upgrade") {
      const targets: StructureController[] = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
          return structure.structureType === STRUCTURE_CONTROLLER;
        },
      });
      if (creep.upgradeController(targets[0]) === ERR_NOT_IN_RANGE) {
        creep.moveTo(targets[0], { visualizePathStyle: { stroke: "#ffffff" } });
      }
    } else if (creep.memory.activity === "harvest") {
      const sources = creep.room.find(FIND_SOURCES);
      if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0], { visualizePathStyle: { stroke: "#ffaa00" } });
      }
    }
  },
};
