import { ButteryLogger } from "./ButteryLogger";

export const LOG_CLI = new ButteryLogger({
  id: "buttery",
  prefix: "buttery",
  logLevel: "info",
  prefixBgColor: "#f6df81"
});
