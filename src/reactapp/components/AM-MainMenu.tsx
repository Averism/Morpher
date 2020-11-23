import React from "react"
import appstate from "../lib/appstates"
import { Button, Page } from "react-onsenui"
import { ChooserActionSheet, ChooserActionSheetAction, ChooserActionSheetState } from "./ChooserActionSheet";
import { StateMapping } from "../../utils/AppStatesHandler";

export default class MainMenu extends React.Component<any, any> {
    render() {
        let docChooser = new StateMapping<ChooserActionSheetState>('docChooser', appstate);
        let docChooserAction: ChooserActionSheetAction = appstate.docChooser.actions;
        return <Page contentStyle={{ padding: "5px", "text-align": "center" }}>
            <Button modifier="large--cta" style={{ marginBottom: "5px" }}
                onClick={() => { docChooser.getProperty().target = 0; docChooserAction.open();}}>
                Load Primary Image
            </Button>
            <Button modifier="large--cta" style={{ marginBottom: "5px" }}
                onClick={() => { docChooser.getProperty().target = 1; docChooserAction.open();}}>
                Load Secondary Image
            </Button>
            <ChooserActionSheet statePath={docChooser}>

            </ChooserActionSheet>
        </Page>
    }
}



