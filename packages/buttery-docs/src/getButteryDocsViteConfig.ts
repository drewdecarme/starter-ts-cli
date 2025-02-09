import type { ResolvedButteryConfig } from "@buttery/core/config";
import mdx from "@mdx-js/rollup";
import rehypeShiki from "@shikijs/rehype";
import rehypeTOC from "@stefanprobst/rehype-extract-toc";
import rehypeTOCExport from "@stefanprobst/rehype-extract-toc/mdx";
import react from "@vitejs/plugin-react";
import wyw from "@wyw-in-js/vite";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import { type Plugin, defineConfig } from "vite";
import type { ButteryDocsDirectories } from "./getButteryDocsDirectories";
import { getButteryDocsRouteManifest } from "./getButteryDocsRouteManifest";
import {
  type ButteryDocsVirtualModules,
  getButteryDocsVirtualModules,
} from "./getButteryDocsVirtualModules";
import { LOG } from "./utils";

export function getButteryDocsViteConfig(
  config: ResolvedButteryConfig<"docs">,
  dirs: ButteryDocsDirectories
) {
  const viteConfig = defineConfig({
    root: dirs.app.root,
    cacheDir: dirs.app.viteCacheDir,
    publicDir: dirs.srcDocs.public,
    resolve: {
      preserveSymlinks: true,
      extensions: [".js", ".jsx", ".ts", ".tsx", ".mdx"],
      alias: {
        "@docs": dirs.srcDocs.root,
      },
    },
    optimizeDeps: {
      include: [
        "@buttery/logs",
        "@buttery/components",
        "@buttery/tokens/docs",
        "react",
        "react-dom",
        "react-dom/client",
        "react-router",
      ],
    },
    plugins: [
      mdx({
        remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter, remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          rehypeTOC,
          rehypeTOCExport,
          [
            rehypeAutolinkHeadings,
            {
              behavior: "wrap",
              headingProperties: {
                className: "heading",
              },
            },
          ],
          [
            rehypeShiki,
            {
              theme: "dark-plus",
            },
          ],
        ],
      }),

      react(),
      wyw({
        include: ["**/*.{ts,tsx}"],
        babelOptions: {
          presets: ["@babel/preset-typescript", "@babel/preset-react"],
        },
      }),
      vitePluginButteryDocsVirtual(config, dirs),
    ],
  });

  return viteConfig;
}

function vitePluginButteryDocsVirtual(
  config: ResolvedButteryConfig<"docs">,
  dirs: ButteryDocsDirectories
): Plugin {
  // Assemble the route manifest along with
  // the virtual modules that will tell vite exactly where
  // the dynamic imports are. This allows us to get around the issue
  // where you can't supply the async import a dynamic path
  let routeManifest = getButteryDocsRouteManifest(config, dirs);
  let vModules = getButteryDocsVirtualModules(config, routeManifest);
  const butteryVirtualModuleIds = Object.keys(vModules);
  const resolvedVModulePrefix = "\0";

  return {
    name: "vite-plugin-buttery-docs-virtual",
    configureServer(server) {
      server.watcher.add(dirs.srcDocs.root);
      server.watcher.on("all", (_event, path) => {
        console.log(_event, path, path.startsWith(dirs.srcDocs.root));
        // Only process things inside docs directory
        if (!path.startsWith(dirs.srcDocs.root)) return;
        LOG.info(
          "Detected changes in the .buttery/docs directory. Reloading..."
        );

        // Rebuild the static data
        LOG.debug("Rebuilding virtual modules");
        routeManifest = getButteryDocsRouteManifest(config, dirs);
        vModules = getButteryDocsVirtualModules(config, routeManifest);

        LOG.checkpointStart("Rebuild Virtual Modules");
        // Loop through the virtual modules and invalidate them
        const viteVirtualModuleEntries = [
          ...server.moduleGraph.idToModuleMap.entries(),
        ].filter(([virtualModuleId]) => virtualModuleId.includes("virtual"));

        LOG.debug(
          "Attempting to match buttery virtual module Ids with those in vite"
        );
        for (const butteryVirtualModuleId of butteryVirtualModuleIds) {
          // Go through the virtual module entries and find an an entry id that
          // matches the buttery virtual module id.
          LOG.debug(
            `Locating vite virtual module that includes: "${butteryVirtualModuleId}"`
          );
          const viteVirtualModuleEntry = viteVirtualModuleEntries.find(
            ([viteModId]) => viteModId.includes(butteryVirtualModuleId)
          );

          // wasn't able to match a buttery virtual module id with the ones that are in vite
          // so we just continue the loop. Theoretically, this should always return something
          if (!viteVirtualModuleEntry) {
            LOG.debug(
              `Unable to find vite virtual module match for the buttery virtual module id: ${butteryVirtualModuleId}`
            );
            continue;
          }

          // Grab the virtual module ID from the found entry
          // and then fetch the entire module class from the moduleGraph
          const [viteVirtualModuleId] = viteVirtualModuleEntry;
          LOG.debug(
            `Locating vite virtual module that includes: "buttery:${butteryVirtualModuleId} - vite:${viteVirtualModuleId}`
          );
          const viteVirtualModule =
            server.moduleGraph.getModuleById(viteVirtualModuleId);
          if (!viteVirtualModule) {
            continue;
          }

          // Invalidate the module so we can re-load it properly. This will allow us to make ANY changes to the
          // docs directory and have them update the UI. This includes adding, removing (unlinking), changing, etc...
          LOG.debug(`Invalidating vModule: ${viteVirtualModuleId}`);
          server.moduleGraph.invalidateModule(viteVirtualModule);
        }
        LOG.checkpointEnd("Rebuild Virtual Modules");

        // Force a full refresh
        server.ws.send({
          type: "full-reload",
        });
      });
    },
    resolveId(id) {
      const vModuleId = butteryVirtualModuleIds.find(
        (vModuleId) => vModuleId === id
      );
      if (vModuleId) return resolvedVModulePrefix.concat(vModuleId);
      return null;
    },
    load(id) {
      const vModuleId = butteryVirtualModuleIds.find(
        (vModuleId) => resolvedVModulePrefix.concat(vModuleId) === id
      );
      if (vModuleId) {
        const module = vModules[vModuleId as keyof ButteryDocsVirtualModules];
        return module;
      }
      return null;
    },
  };
}
