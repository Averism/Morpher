import React from "react"
import { ActionSheet, ActionSheetButton, Row } from "react-onsenui";
import { BaseAppState, StateMapAction, StateMapping } from "../../utils/AppStatesHandler";
import { SmartContainer, WithState } from "../../utils/Container";
import { StringList, StringListAction, StringListOptions, StringListState } from "./List";

export class ChooserActionSheet extends SmartContainer<ChooserActionSheetState> {
    render() {
        let p = this.getProps();
        let curPath = this.stateMap.stateMap.join(".");
        let ls = new StateMapping<StringListState>(curPath + ".list", p.state)
        return (
            <ActionSheet isOpen={p.isOpen}
                animation="none"
                onPreShow={async () => {
                    p.list.data = await p.dataSource(p.parameters)
                }}
                onPreHide={() => p.actions.close()}>
                    <div style={{overflowY: "scroll", 
                    height: Math.min((window.innerHeight*0.9 - 36), p.list.data.length*36+36)+"px", 
                    }}>
                        <StringList statePath={ls} />
                    </div>
                    <div>
                        <ActionSheetButton onClick={() => {
                            if(p.onCancel) p.onCancel();
                            p.actions.close()}}
                            style={{ width: "48%", display: "inline-block", margin: "1%" }}>
                            Cancel
                        </ActionSheetButton>
                        <ActionSheetButton style={{ width: "48%", display: "inline-block", margin: "1%" }}
                        onClick={() => {
                            if(p.onOk) p.onOk();
                            p.actions.close()}
                        }>
                            OK
                        </ActionSheetButton>
                    </div>
            </ActionSheet>
        )
    }
}

export type ChooserActionSheetOptions = {
    onOk?: Function;
    onCancel?: Function;
    listOptions?: StringListOptions;
}

export class ChooserActionSheetState implements WithState {
    constructor(dataSource: (input: any)=> Promise<string[]>, options?: ChooserActionSheetOptions, stateMap?: StateMapping<ChooserActionSheetState>) {
        this.dataSource = dataSource;
        let listOptions: StringListOptions = {};
        if(options){
            if(options.onOk) this.onOk = options.onOk;
            if(options.onCancel) this.onCancel = options.onCancel;
            if(options.listOptions) listOptions = options.listOptions;
        }
        if (stateMap) {
            this.actions = new ChooserActionSheetAction(stateMap);
            listOptions.onClick = this.actions._getFunc("select");
            this.list = new StringListState([], listOptions);
            this.state = stateMap.state;
            this.lsActions = new StringListAction(
                new StateMapping(stateMap.stateMap.join(".") + ".list"),
                stateMap.state)
        }
    }
    target: any;
    state: BaseAppState;
    parameters: any;
    actions: ChooserActionSheetAction;
    lsActions: StringListAction;
    selected: {row: string, i: number} = {row: undefined, i:undefined};
    dataSource: (input: any)=> Promise<string[]> = ()=>Promise.resolve([]);
    list: StringListState;
    isOpen: boolean = false;
    onOk: Function;
    onCancel: Function;
}

export class ChooserActionSheetAction extends StateMapAction<ChooserActionSheetState> {
    select(r: string, i: number){
        let selected = this.getState().selected;
        if(selected.i == i) {
            this.unselect();
        }else {
            selected.row=r; 
            selected.i=i;
        }
    } 
    unselect(){
        let selected = this.getState().selected;
        selected.row=undefined; 
        selected.i=undefined;
    }
    open() {
        this.unselect();
        this.getState().isOpen = true;
    }
    close() {
        if (this.getState().isOpen) this.getState().isOpen = false;
    }
}

