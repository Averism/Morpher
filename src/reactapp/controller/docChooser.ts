import { map, StateMapping } from "../../utils/AppStatesHandler";
import wsapp from "../lib/wsapp-client";
import { ChooserActionSheetState } from "../components/ChooserActionSheet";
import appStates, { AppStates } from "../lib/appstates";
import { MainPageState } from "../components/AM-MainPage";
import { Labelled } from "../components/List";

async function getFileList(): Promise<string[]>{
    return new Promise((resolve,reject)=>{
        wsapp.trigger.onlistfile = function(x: {path: string[], items: string[]}){
            resolve(x.items);
        };
        wsapp.listfile({path: ['workspace']});
    })
}

export interface DocType extends Labelled {
    type: string;
    checklist: {[key: string]:boolean}
}

export function docChooser(state: AppStates): ChooserActionSheetState {
    let dataSource = getFileList;
    let onOk = () => {
        let selected = state.docChooser.selected.row;
        let data: {[key: string]: DocType} = state.docChooser.list.processor(state.docChooser.list.data) as {[key: string]: DocType};
        let selectedData: DocType = data[selected];
        if(selectedData.type == "image") {
            state.mainBody.actions._getFunc("loadImage")(selectedData.label+".png")
        }
        setTimeout(()=>state.mainPage.action.toggleMainMenu(),100);
    };
    return new ChooserActionSheetState(dataSource, {
        onOk,
        listOptions: {
            iconParser: (item: DocType, i: number):string => {
                let selected:{row: string, i: number} = map<{row: string, i: number}>
                    ("docChooser.selected", state).getProperty()
                if(i == selected.i) return "md-check";
                if((item as any).type == "image") return "md-image"
                return "circle-o";
            },

            processor: (data: string[]):{[key: string]:DocType} => {
                let res: {[key: string]:DocType} = {};
                for(let s of data){
                    if(s.endsWith(".png")){
                        let key = s.substr(0,s.length-4);
                        if(res[key]) {

                        } else {
                            res[key] = {label: key, type: "image", checklist: {"image": true}}
                        }
                    }
                }
                return res;
            }
        }
    }, map("docChooser", state));
}
