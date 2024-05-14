import path from "node:path";
import * as esbuild from "esbuild";
import { BuildScriptArgs } from "./script.build";
import { ESBuildPluginEntryTemplateTransformer } from "./util.esbuild-plugin-entry-template-transformer";
import { createEsbuildOptions } from "./config.esbuild";
import { glob } from "glob";

// TODO: Fix description
/**
 * Process
 * 1 - Build the /src
 * 1.0 - Delete the src/index.ts file
 * 1.1 - Process the template with the config
 * 1.2 - Build the src into the bin folder
 * 2 - Build the /commands
 */

// force remove the index.ts file

// -- SRC --
// delete the existing index.ts file, compile the index template and write it
// to the src directory so it can be transpiled and built again.
export async function buildEntry({ config, argv }: BuildScriptArgs) {
  try {
    const entryFileTemplate = path.resolve(
      import.meta.dirname,
      "../templates/template.index.hbs"
    );
    const commandFilesDir = path.resolve(config.root, "./commands");
    const commandFilesGlob = path.resolve(commandFilesDir, "./*.ts");
    const commandFiles = glob.sync(commandFilesGlob, {
      follow: false,
    });
    const outFile = path.join(config.root, "./bin/index.js");

    // Create a .hbs plugin transformer
    const ESBuildEntryTemplateTransformer =
      new ESBuildPluginEntryTemplateTransformer(config);

    const plugins = [ESBuildEntryTemplateTransformer.getPlugin()];

    // Create the build options
    const esbuildOptions = createEsbuildOptions({
      entryPoints: [entryFileTemplate, ...commandFiles],
      plugins,
      outdir: outFile,
    });

    // Build when not in watch
    if (!argv.watch) {
      return await esbuild.build(esbuildOptions);
    }

    // Create a watcher plugin
    // const ESBuildWatchLogger = new EsbuildPluginWatchLogger({
    //   cliName: config.name,
    //   dirname: "entry",
    // });

    // Build the esbuild context and watch it to re-build
    // files on change
    const context = await esbuild.context({
      ...esbuildOptions,
      minify: false,
      plugins,
    });
    return await context.watch();
  } catch (error) {
    throw new Error("Error when building 'entry': ".concat(error as string));
  }
}
