import { useModal } from "@buttery/components";
import { css } from "@linaria/core";
import { makeColor, makeRem } from "@buttery/tokens/playground";

import { Button } from "~/components/Button";
import { ModalHeader } from "~/components/ModalHeader";
import { Modal } from "~/components/Modal";
import { IconPaintBoard } from "~/icons/IconPaintBoard";
import { ModalBody } from "~/components/ModalBody";
import { InputSection } from "~/components/InputSection";
import { InputLabel } from "~/components/InputLabel";
import { IconLayout01 } from "~/icons/IconLayout01";
import { InputRadio } from "~/components/InputRadio";
import { IconLayout2Column } from "~/icons/IconLayout2Column";
import { IconWebDesign01 } from "~/icons/IconWebDesign01";

import { StyleGuideBasic } from "./styleguide/StyleguideBasic";

const styles = css`
  height: 100%;
  display: grid;
  grid-template-rows: auto 1fr;
  overflow: hidden;
`;

const bodyStyles = css`
  display: grid;
  grid-template-columns: ${makeRem(300)} 1fr;
  height: 100%;
  overflow: hidden;

  .sidebar {
    padding-right: ${makeRem(32)};
  }

  .guide {
    padding: ${makeRem(32)};
    background: ${makeColor("neutral-light", { opacity: 0.1 })};
    height: 100%;
    overflow: auto;
    & > div {
      padding: ${makeRem(32)};
      background: white;
      border-radius: ${makeRem(8)};
      max-width: ${makeRem(1024)};
      margin: 0 auto;
    }
  }
`;

const layoutStyles = css`
  display: flex;
  flex-direction: column;
  gap: ${makeRem(8)};
`;

export function ConfigStyleGuide() {
  const { openModal, modalRef } = useModal();

  return (
    <>
      <Button
        dxVariant="outlined"
        DXIconStart={IconPaintBoard}
        onClick={openModal}
      >
        Style Guide
      </Button>
      <Modal
        ref={modalRef}
        dxVariant="contain"
        dxSize="full"
        className={styles}
      >
        <ModalHeader dxSubtitle="TokensStudio has a few preset auto generated style guide styles that can be applied and exported. Select a layout from one of the buttons below to view it. You'll also have the ability to configure different sections to contextualize the guide.">
          Style Guide
        </ModalHeader>
        <ModalBody className={bodyStyles}>
          <div className="sidebar">
            <InputSection>
              <InputLabel
                dxLabel="Choose template"
                dxHelp="Select a layout template to view the guide in different layouts"
              />
              <div className={layoutStyles}>
                <InputRadio
                  dxVariant="block"
                  DXIcon={IconLayout01}
                  defaultChecked
                  name="layout"
                  value="basic"
                  dxTextPrimary="Basic"
                  dxTextSecondary="A basic layout that displays some sections headers along with it's content"
                />
                <InputRadio
                  dxVariant="block"
                  DXIcon={IconLayout2Column}
                  value="stylized"
                  name="layout"
                  dxTextPrimary="Stylized"
                  dxTextSecondary="A bit more stylized than basic, this layout separates out each section with a large stylistic placed number"
                />
                <InputRadio
                  dxVariant="block"
                  DXIcon={IconWebDesign01}
                  value="web-app"
                  name="layout"
                  dxTextPrimary="Web App"
                  dxTextSecondary="A layout that closely models a web app that can be exported as a web app"
                />
              </div>
            </InputSection>
          </div>
          <div className="guide">
            <StyleGuideBasic />
          </div>
        </ModalBody>
      </Modal>
    </>
  );
}
