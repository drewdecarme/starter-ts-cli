import {
  type GetButteryConfigOptions,
  getButteryConfig,
} from "@buttery/core/config";

export type ButteryDocsConfig = Awaited<
  ReturnType<typeof getButteryDocsConfig>
>;

/**
 * Fetches the buttery.docs config from the
 * `buttery.config.ts` file
 */
export async function getButteryDocsConfig(options?: GetButteryConfigOptions) {
  const config = await getButteryConfig("docs", {
    ...options,
    defaultConfig: "docs",
  });
  return config;
}
