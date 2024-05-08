import { CommandAction, CommandMeta } from "../lib/types";

export const meta: CommandMeta = {
  name: "build",
  description: "Build your file-based CLI",
};

export const action: CommandAction = async (args) => {
  // This is where you make the index.js file where the commands
  // will have an entry point...

  console.log("Hello from the 'cli.build' command.", args);
};
