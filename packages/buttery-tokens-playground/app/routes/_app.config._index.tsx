import { ColorPreviewBrand } from "~/features/ColorPreviewBrand";
import { ColorBrandMode } from "~/features/ColorBrandMode";
import { LayoutConfigSection } from "~/components/LayoutConfigSection";
import { LayoutConfigSectionControls } from "~/components/LayoutConfigSectionControls";
import { ColorPreviewNeutral } from "~/features/ColorPreviewNeutral";
import { ColorNeutral } from "~/features/ColorNeutral";
import { ColorPreview } from "~/features/ColorPreview";

export default function ColorsRoute() {
  return (
    <>
      <LayoutConfigSection>
        <LayoutConfigSectionControls
          dxTitle="Brand Colors"
          dxDescription={
            <>
              Brand colors are an essential part of your application&apos;s
              design system, providing consistency and harmony across all visual
              assets.
            </>
          }
        >
          <ColorBrandMode />
        </LayoutConfigSectionControls>
        <ColorPreview>
          <ColorPreviewBrand />
        </ColorPreview>
      </LayoutConfigSection>
      <LayoutConfigSection>
        <LayoutConfigSectionControls
          dxTitle="Neutral Colors"
          dxDescription={
            <>
              Brand colors are an essential part of your application&apos;s
              design system, providing consistency and harmony across all visual
              elements. This configuration allows you to generate a cohesive
              color palette using harmonious fluorescent tones by defining
              parameters for saturation, brightness, and hue variations.
            </>
          }
        >
          <ColorNeutral />
        </LayoutConfigSectionControls>
        <ColorPreview>
          <ColorPreviewNeutral />
        </ColorPreview>
      </LayoutConfigSection>
    </>
  );
}
