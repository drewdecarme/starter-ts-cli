import { classes } from "@buttery/components";
import { makeCustom, makeRem } from "@buttery/tokens/playground";
import { css } from "@linaria/core";
import type { JSX } from "react";
import { forwardRef } from "react";

export type LayoutConfigSectionPropsNative = JSX.IntrinsicElements["section"];
export type LayoutConfigSectionProps = LayoutConfigSectionPropsNative;

const styles = css`
  display: grid;
  grid-template-columns: ${makeRem(520)} 1fr;
  padding: 0 ${makeCustom("layout-gutters")};
  padding-bottom: ${makeCustom("layout-gutters")};
`;

export const LayoutConfigSection = forwardRef<
  HTMLElement,
  LayoutConfigSectionProps
>(function LayoutConfigSection({ children, className, ...restProps }, ref) {
  return (
    <section {...restProps} className={classes(styles, className)} ref={ref}>
      {children}
    </section>
  );
});
