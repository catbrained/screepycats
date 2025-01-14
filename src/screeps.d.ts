declare global {
  interface CreepMemory {
    role: "harvester" | "builder" | "upgrader";
    activity: "harvest" | "upgrade" | "store";
    [name: string]: any;
  }

  interface Memory {
    creeps: { [name: string]: CreepMemory };
  }
}

export {};
