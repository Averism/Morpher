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
            <ImageCanvas statePath={p.secondaryImagesMap} />
            <ImageCanvas statePath={p.otherImagesMap} />
        </Page>
    }
}

export class MainPageState implements WithState{
    constructor(stateMap: StateMapping<MainPageState>){
        this.state = stateMap.state;
        this.actions = new MainPageAction(stateMap);
        this.primaryImagesMap = stateMap.appendPath<ImageCanvasState>("primaryImages");
        this.primaryImages = new ImageCanvasState(this.primaryImagesMap);
        this.secondaryImagesMap = stateMap.appendPath<ImageCanvasState>("secondaryImages");
        this.secondaryImages = new ImageCanvasState(this.secondaryImagesMap);
        this.secondaryImages.layoutPosition = 1;
        this.otherImagesMap = stateMap.appendPath<ImageCanvasState>("otherImages");
        this.otherImages = new ImageCanvasState(this.otherImagesMap);
        this.otherImages.layoutPosition = 2;
    }
    actions: MainPageAction;
    state: BaseAppState
    primaryImagesMap: StateMapping<ImageCanvasState>;
    primaryImages: ImageCanvasState;
    secondaryImagesMap: StateMapping<ImageCanvasState>;
    secondaryImages: ImageCanvasState;
    otherImagesMap: StateMapping<ImageCanvasState>;
    otherImages: ImageCanvasState;
}

export class MainPageAction extends StateMapAction<MainPageState>{
    async loadImage(filename: string, target: number){
        let mp = this;
        if(target == 0)
            imageLoader(filename).then(img=>mp.getState().primaryImages.imageB64=img);
        else
            imageLoader(filename).then(img=>mp.getState().secondaryImages.imageB64=img);
    }
}