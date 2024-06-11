import type { Preview } from "@storybook/react";
import "@buttery/tokens/_docs/index.css";
import React from "react";
import { bodyCSS } from "../targets/components/Layout";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <div className={bodyCSS}>
        <Story />
      </div>
    ),
  ],
};

export default preview;
