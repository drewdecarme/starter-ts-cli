import path from "node:path";
import { glob } from "glob";
import * as esbuild from "esbuild";

import type { BuildScriptArgs } from "./script.build";
import { EsbuildPluginWatchLogger } from "./util.esbuild-plugin-watch-logger";
import { createEsbuildOptions } from "./config.esbuild";

// TODO: Fix jsdoc description
/**
 * Builds the commands in the commands directory defined in
 * the buttery.config cosmic config file.
 *
 * Process:
 * 1. Gather the commands via glob defined in the commands directory
 * relative to the provided root.
 * 2. Build the new files defined via glob into the bin/commands directory
 *
 * Ensures that any commands from a previous development instance
 * are cleared out so the new ones can be replaced and updated dynamically
 * via the esbuild watch context (if necessary).
 */
export async function buildLib({ config, argv }: BuildScriptArgs) {
  try {
    const libFilesDir = path.resolve(import.meta.dirname, "../lib");
    const libFilesGlob = path.resolve(libFilesDir, "./*.ts");
    const libFiles = glob.sync(libFilesGlob, {
      follow: false,
    });
    const libFilesOutDir = path.join(config.root, "./dist");

    // Create the build options
    const esbuildOptions = createEsbuildOptions({
      entryPoints: libFiles,
      outdir: libFilesOutDir,
    });

    // Just build when dev isn't present
    if (!argv.watch) {
      return await esbuild.build(esbuildOptions);
    }

    console.log(`Watching '${libFilesDir}' for changes...`);

    // Create a watcher plugin
    const ESBuildWatchLogger = new EsbuildPluginWatchLogger({
      cliName: config.name,
      dirname: "lib",
    });

    // Build the esbuild context and watch it to re-build
    // files on change
    const context = await esbuild.context({
      ...esbuildOptions,
      entryPoints: libFiles,
      minify: false,
      plugins: [ESBuildWatchLogger.getPlugin()],
    });

    return await context.watch();
  } catch (error) {
    throw new Error("Error when building 'lib': ".concat(error as string));
  }
}
