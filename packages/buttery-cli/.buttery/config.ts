import type { ButteryConfig } from "@buttery/core";

const config: ButteryConfig = {
  commands: {
    name: "buttery",
    description:
      "The buttery ecosystem CLI. Bootstrapped and dog-fooded using buttery itself. Let's spread it on!",
    version: "0.0.1",
    commandsDir: "cmds",
  },
  docs: {
    build: {
      target: "cloudflare-pages",
    },
    header: {
      title: "Buttery CLI",
    },
  },
  tokens: {
    importName: "_tokens",
    gridSystem: 4,
    prefix: "buttery-tokens",
    strict: true,
    suppressStrictWarnings: false,
    font: {
      size: 16,
      family: {
        heading:
          'Poppins, system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
        body: 'Poppins, system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
      },
      weight: {
        bold: 700,
        "semi-bold": 600,
        medium: 500,
        regular: 400,
        light: 300,
      },
      typography: {},
    },
    breakpoints: {
      "phone-small": 320,
      phone: 375,
      "phone-large": 414,
      "tablet-small": 480,
      tablet: 768,
      "tablet-large": 1024,
      "desktop-small": 1200,
      desktop: 1280,
      "desktop-large": 1400,
    },
    color: {
      mode: "presets",
      tone: "jewel",
      saturation: 83,
      brightness: 76,
      application: {
        hues: {
          primary: 42,
          secondary: 170,
          warning: 60,
          danger: 359,
        },
        variants: {
          mode: "auto",
          total: 10,
          scaleMin: 2,
          scaleMax: 2,
        },
      },
      neutral: {
        base: "#030305",
        variants: {
          mode: "auto",
          total: 10,
          scaleMin: 5,
        },
      },
      static: {
        background: "#fff",
        surface: "#fff",
      },
    },
    custom: {
      "layout-header": 48,
    },
  },
};
export default config;
