import React, { ReactNode} from "react"
import { Page } from "react-onsenui"
import { BaseAppState, map, StateMapAction, StateMapping } from "../../utils/AppStatesHandler"
import { SmartContainer, StateMapped, WithState } from "../../utils/Container"
import { imageLoader } from "../controller/imageLoader"
import appstate from "../lib/appstates"
import ImageCanvas, { ImageCanvasState } from "./ImageCanvas"

export default class MainPage extends SmartContainer<MainPageState> {
    render(): ReactNode {
        let p = this.getProps(); 
        return <Page>
            <ImageCanvas statePath={p.primaryImagesMap} />
        </Page>
    }
}

export class MainPageState implements WithState{
    constructor(stateMap: StateMapping<MainPageState>){
        this.state = stateMap.state;
        this.actions = new MainPageAction(stateMap);
        this.primaryImagesMap = stateMap.appendPath<ImageCanvasState>("primaryImages");
        this.primaryImages = new ImageCanvasState(this.primaryImagesMap);
    }
    actions: MainPageAction;
    state: BaseAppState
    primaryImagesMap: StateMapping<ImageCanvasState>;
    primaryImages: ImageCanvasState;
}

export class MainPageAction extends StateMapAction<MainPageState>{
    async loadImage(filename: string){
        let mp = this;
        imageLoader(filename).then(img=>mp.getState().primaryImages.imageB64=img);
    }
}