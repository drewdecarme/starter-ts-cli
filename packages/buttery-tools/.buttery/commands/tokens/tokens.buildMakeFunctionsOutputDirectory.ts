import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { LOG } from "../_logger/util.ts.logger";
import type { ButteryTokensDirectories } from "./tokens.getButteryTokensDirectories";

export async function buildMakeFunctionsOutputDirectory(
  dirs: ButteryTokensDirectories,
  options: { isLocal: boolean }
) {
  // create a unique directory in the working directory
  // make a working dir we can always expect in any resolved tokens
  // directory. This working dir will enable us to build some files to
  // make imports work the way we want to.
  await mkdir(dirs.output.path, { recursive: true });

  if (options.isLocal) {
    LOG.info("Build is being run locally. Skipping import directory creation.");
    return;
  }

  // write the files needed to import from another library
  const importFileContent = `export * from "../${path.relative(dirs.root.path, dirs.output.path)}/index.js";\n`;
  const tsConfigFileContent = JSON.stringify(
    { extends: path.resolve("../../../tsconfig.build-lib.json") },
    null,
    2
  );
  await mkdir(dirs.output.path, { recursive: true }); // since it's a dir we need to make sure it's there.
  await Promise.all([
    writeFile(dirs.root.tsConfigPath, tsConfigFileContent),
    ...[".js", ".d.ts"].map((extension) =>
      writeFile(
        path.resolve(dirs.output.path, "index".concat(extension)),
        importFileContent
      )
    )
  ]);
}
