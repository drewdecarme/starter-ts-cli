import { css } from "@linaria/core";
import { makeRem, makeReset } from "@buttery/tokens/playground";
import { useCallback, useEffect } from "react";
import { exhaustiveMatchGuard, generateGUID } from "@buttery/utils/isomorphic";
import { match } from "ts-pattern";

import { Button } from "~/components/Button";
import { VariantEmpty } from "~/components/VariantEmpty";
import { VariantAdd } from "~/components/VariantAdd";
import { IconPlusSign } from "~/icons/IconPlusSign";

import { useConfigurationContext } from "./Config.context";
import { FontFamilyConfigManual } from "./FontFamilyConfigManual";
import type { OnFontVariantAction } from "./config.utils.font";
import { FontFamilyConfigRegistry } from "./FontFamilyConfigRegistry";

const styles = css`
  ${makeReset("ul")};
  display: flex;
  flex-direction: column;
  gap: ${makeRem(8)};
`;

export function FontFamilyConfig() {
  const { font, setFont } = useConfigurationContext();

  const handleAction = useCallback<OnFontVariantAction>(
    (args) => {
      switch (args.action) {
        case "addFontFamily":
          setFont((draft) => {
            draft.source = "manual";
            draft.families[generateGUID()] = {
              name: "Arial",
              fallback: undefined,
              styles: {},
              meta: {
                isOpen: true,
              },
            };
          });
          break;

        case "toggle": {
          setFont((draft) => {
            draft.families[args.id].meta.isOpen =
              !draft.families[args.id].meta.isOpen;
          });
          break;
        }

        case "changeSource":
          setFont((draft) => {
            draft.source = args.source;
          });
          break;

        case "changeFontFamily":
          setFont((draft) => {
            draft.families[args.id].name = args.fontFamily;
          });
          break;

        case "changeFallback":
          setFont((draft) => {
            draft.families[args.id].fallback = args.fallback;
          });
          break;

        default:
          exhaustiveMatchGuard(args);
      }
    },
    [setFont]
  );

  useEffect(() => {
    console.log(font);
  }, [font]);

  const handleAddFontFamily = useCallback(
    () => handleAction({ action: "addFontFamily" }),
    [handleAction]
  );

  // Show an empty state if there are no families added
  if (Object.entries(font.families).length === 0) {
    return (
      <VariantEmpty dxMessage="No font families have been added yet">
        <Button
          dxVariant="outlined"
          dxColor="secondary"
          DXIconStart={IconPlusSign}
          onClick={handleAddFontFamily}
        >
          Click to add a font family
        </Button>
      </VariantEmpty>
    );
  }

  return (
    <ul className={styles}>
      {match(font)
        .with({ source: "manual" }, (state) =>
          Object.entries(state.families).map(([familyId, family]) => (
            <li key={familyId}>
              <FontFamilyConfigManual
                {...family}
                id={familyId}
                source={state.source}
                onAction={handleAction}
              />
            </li>
          ))
        )
        .otherwise((state) =>
          Object.entries(state.families).map(([familyId, family]) => (
            <li key={familyId}>
              <FontFamilyConfigRegistry
                {...family}
                id={familyId}
                source={state.source}
                onAction={handleAction}
              />
            </li>
          ))
        )}
      <VariantAdd onAdd={handleAddFontFamily}>Add a font family</VariantAdd>
    </ul>
  );
}
