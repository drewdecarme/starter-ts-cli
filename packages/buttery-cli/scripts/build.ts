import { build } from "../src/script.build.js";

export type BuildArgs = {
  watch: boolean;
  local: boolean;
};

const defaultBuildArgs: BuildArgs = {
  watch: false,
  local: false,
};

/**
 * A simple function that parses the `process.argv` to find
 * some default values that were expecting in order to develop
 * the cli builder properly. We don't really need anything too
 * complex here... all we're looking to do is allow some args
 * to be supplied to the build script internally to this package.
 */
export const parseBuildArgs = (args: typeof process.argv): BuildArgs => {
  return args.reduce<BuildArgs>((accum, arg) => {
    if (arg === "--watch" || arg === "-w") {
      return { ...accum, watch: true };
    }
    if (arg === "--local" || arg === "-l") {
      return { ...accum, local: true };
    }
    return accum;
  }, defaultBuildArgs);
};

try {
  const args = process.argv.slice(2);
  const parsedArgs = parseBuildArgs(args);
  await build(parsedArgs);
} catch (error) {
  console.error(error);
}
