import React, { ReactNode } from "react"
import { BaseAppState, StateMapAction, StateMapping } from "../../utils/AppStatesHandler";
import { SmartContainer, WithState } from "../../utils/Container";

function pct(x: number):string{ return (Math.round(x * 10000) / 100).toFixed(2)+"%"}
function dist(x1: number,y1: number,x2: number,y2: number){return Math.sqrt(Math.pow(x1-x2,2)+Math.pow(y1-y2,2))}

export default class ImageCanvas extends SmartContainer<ImageCanvasState>{
    divref: React.MutableRefObject<any> = React.createRef();
    divtxtref: React.MutableRefObject<any> = React.createRef();
    imgref: React.MutableRefObject<any> = React.createRef();
    cnvref: React.MutableRefObject<any> = React.createRef();
    width: number; 
    height: number;
    panning: boolean = false;
    zooming: boolean = false;
    sx: number;
    sy: number;
    sd: number;
    panStart(x: number, y: number){
        this.panning = true;
        this.sx = x;
        this.sy = y;
    }
    panMove(x: number, y: number){
        if(this.panning){
            let dx = x - this.sx;
            let dy = y - this.sy;
            let p = this.getProps();
            let zoom = Math.pow(2,p.zoom/10);
            p.actions.pan(-dx/zoom,-dy/zoom);
            this.sx += dx;
            this.sy += dy;
        }
    }
    panStop(){
        this.panning = false;
    }
    touchHandler(mode: string){
        const t = this;
        switch(mode){
            case "start": return (evt: React.TouchEvent) => {
                evt.preventDefault();
                if(evt.touches.length==1){
                    t.panning = true;
                    t.sx = evt.touches.item(0).clientX;
                    t.sy = evt.touches.item(0).clientY;
                } else {
                    t.zooming = true;
                    let t1 = evt.touches.item(0);
                    let t2 = evt.touches.item(1);
                    t.sd = dist(t1.clientX,t1.clientY,t2.clientX,t2.clientY);
                }
            }
            case "move": return (evt: React.TouchEvent) => {
                evt.preventDefault();
                if(evt.touches.length==1){
                    if(t.panning){
                        let dx = evt.touches.item(0).clientX - this.sx;
                        let dy = evt.touches.item(0).clientY - this.sy;
                        let p = this.getProps();
                        let zoom = Math.pow(2,p.zoom/10);
                        p.actions.pan(-dx/zoom,-dy/zoom);
                        this.sx += dx;
                        this.sy += dy;
                    }
                } else {
                    let t1 = evt.touches.item(0);
                    let t2 = evt.touches.item(1);
                    let d = dist(t1.clientX,t1.clientY,t2.clientX,t2.clientY);
                    let distRatio = d/this.sd;
                    this.getProps().actions.zoom(10*Math.log2(distRatio));
                    this.sd = d;
                }
            }
            case "end": return (evt: React.TouchEvent) => {
                evt.preventDefault();
                t.panning = false;
                t.zooming = false;
            }
        }
    }
    drawCanvas(){
        if(this.imgref.current == null || this.cnvref.current == null) return;
        let p = this.getProps();
        let div: HTMLDivElement = this.divref.current;
        let canvas: HTMLCanvasElement = this.cnvref.current;
        canvas.width = div.clientWidth*p.canvasWidth;
        canvas.height = div.clientHeight*p.canvasHeight;
        let txt: HTMLDivElement = this.divtxtref.current;
        txt.style.width = canvas.width+"px";
        let zoom = Math.pow(2,p.zoom/10);
        let ctx = canvas.getContext("2d");
        let sw = canvas.width * (1/zoom);
        let sh = canvas.height * (1/zoom);
        let zpx = (canvas.width - sw)/2;
        let zpy = (canvas.height - sh)/2;
        let px = Math.min(sw/this.imgref.current.width,1);
        let py = Math.min(sh/this.imgref.current.height,1);
        txt.innerText = "zoom "+pct(zoom)+" - showing "+pct(px)+" w  -  "+pct(py)+" h "+p.log;
        ctx.drawImage(this.imgref.current,p.pan.x + zpx,p.pan.y + zpy,sw,sh,0,0,canvas.width,canvas.height);
    }
    componentDidUpdate = function(){
        this.drawCanvas();
    }
    render():ReactNode{
        let p = this.getProps();
        return <div ref={this.divref} style={{position: "fixed", width: "100%", height: "100%"}}>
            <div ref={this.divtxtref} style={{position: "fixed", textAlign: "center", fontSize: "8pt"}}>Test Text</div>
            <img ref={this.imgref} src={p.imageB64} style={{display: "none"}}>
            </img>
            <canvas ref={this.cnvref}
            onWheel={(evt)=>p.actions.zoom(evt.deltaY/125)} 
            onMouseDown={((evt: React.MouseEvent)=>this.panStart(evt.clientX,evt.clientY)).bind(this)}
            onMouseMove={((evt: React.MouseEvent)=>this.panMove(evt.clientX,evt.clientY)).bind(this)}
            onMouseUp={((evt: React.MouseEvent)=>this.panStop()).bind(this)}
            onTouchStart={this.touchHandler("start")}
            onTouchMove={this.touchHandler("move")}
            onTouchEnd={this.touchHandler("end")}
            />
        </div>
    }
}


export class ImageCanvasState implements WithState{
    constructor(stateMap: StateMapping<ImageCanvasState>){
        if(stateMap){
            this.state = stateMap.state;
            this.actions = new ImageCanvasAction(stateMap)
        }
    }
    actions: ImageCanvasAction;
    state: BaseAppState;
    imageB64: string;
    log: string = "";
    canvasWidth: number = 0.5;
    canvasHeight: number = 1;
    imageWidth: number;
    imageHeight: number;
    pan: {x: number, y: number} = {x:0 , y:0}
    zoom: number = 0;
}

export class ImageCanvasAction extends StateMapAction<ImageCanvasState> {
    log(s: string){this.getState().log = s}

    pan(x: number, y: number){
        let cpan = this.getState().pan;
        this.getState().pan = {x: cpan.x+x, y:cpan.y+y};
    }

    zoom(zoom: number){
        this.getState().zoom = this.getState().zoom + zoom;
    }

    setSize(w: number, h: number){
        this.getState().canvasWidth = w;
        this.getState().canvasHeight = h;
    }
}