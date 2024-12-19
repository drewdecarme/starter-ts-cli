import type { Meta } from "@storybook/react";

import UseDropdownMenuExample from "./UseDropdownMenu.example.js";
import UseDropdownMenuWithFormsExample from "./UseDropdownMenuWithForms.example.js";

const meta: Meta = {
  title: "Hooks / useDropdownMenu",
} satisfies Meta<typeof meta>;

export default meta;

export const Base = UseDropdownMenuExample;
export const WithForms = UseDropdownMenuWithFormsExample;
