import React, { ReactNode } from "react"
import { List, ListItem, Page, Splitter, SplitterContent, SplitterSide } from "react-onsenui";
import { BaseAppState, StateMapAction, StateMapping } from "../../utils/AppStatesHandler";
import { SmartContainer, WithState } from "../../utils/Container";

function pct(x: number):string{ return (Math.round(x * 10000) / 100).toFixed(2)+"%"}
function dist(x1: number,y1: number,x2: number,y2: number){return Math.sqrt(Math.pow(x1-x2,2)+Math.pow(y1-y2,2))}

export default class ImageCanvas extends SmartContainer<ImageCanvasState>{
    divref: React.MutableRefObject<any> = React.createRef();
    divtxtref: React.MutableRefObject<any> = React.createRef();
    imgref: React.MutableRefObject<any> = React.createRef();
    cnvref: React.MutableRefObject<any> = React.createRef();
    listref: React.MutableRefObject<any> = React.createRef();
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
                t.panning = false;
                t.zooming = false;
            }
        }
    }
    doLayout(){
        let p = this.getProps();
        let div: HTMLDivElement = this.divref.current;
        let canvas: HTMLCanvasElement = this.cnvref.current;;
        let txt: HTMLDivElement = this.divtxtref.current;
        let h = div.parentElement.clientHeight;
        let t = document.body.clientHeight - h;
        let l = this.listref.current;
        let ratio = div.clientWidth / h;
        let ratio2 = ratio*2/3;
        if(p.layout == 3){
            if(ratio>=1.5){
                let a = h*ratio2;
                let b = h / 2;
                if(p.layoutPosition == 0){
                    canvas.width = a*0.7;
                    canvas.height = h;
                    canvas.style.left = a*0.3+"px";
                    canvas.style.top = t+"px";
                    l.style.left = "0px";
                    l.style.top = t+"px";
                    l.style.width = canvas.style.left;
                } else {
                    canvas.width = (div.clientWidth - a)*0.7;
                    canvas.height = b;
                    canvas.style.left = (a+(div.clientWidth - a)*0.3)+"px";
                    canvas.style.top = p.layoutPosition == 1? t+"px" : (t+b)+"px";
                    l.style.left = a+"px";
                    l.style.top = p.layoutPosition == 1? t+"px" : (t+b)+"px";
                    l.style.width = (div.clientWidth - a)*0.3+"px";
                }
            } else {
                ratio2 = 2/(3*ratio);
                let a = div.clientWidth*ratio2;
                let b = div.clientWidth / 2;
                if(p.layoutPosition == 0){
                    canvas.width = div.clientWidth*0.7;
                    canvas.height = a;
                    canvas.style.left = div.clientWidth*0.3+"px";
                    canvas.style.top = t+"px";
                    l.style.left = "0px";
                    l.style.top = t+"px";
                    l.style.width = canvas.style.left;
                } else {
                    canvas.width = b*0.7;
                    canvas.height = h - a;
                    canvas.style.left = p.layoutPosition == 1? b*0.3+"px" : b*1.3+"px";
                    canvas.style.top = (t+a)+"px";
                    l.style.left = p.layoutPosition == 1?"0px":b;
                    l.style.top = (t+a)+"px";
                    l.style.width = b-canvas.width;
                }
            }
        }
        txt.style.top = canvas.style.top;
        txt.style.left = canvas.style.left;
        txt.style.width = canvas.width+"px";
        l.style.height = canvas.height+"px";
    }
    drawCanvas(){
        if(this.imgref.current == null || this.cnvref.current == null) return;
        let p = this.getProps();
        let canvas: HTMLCanvasElement = this.cnvref.current;
        let txt: HTMLDivElement = this.divtxtref.current;
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
        this.doLayout();
        this.drawCanvas();
    }
    render():ReactNode{
        let p = this.getProps();
        return <div ref={this.divref}>
            <div ref={this.listref} style={{position: "fixed", backgroundColor: "black"}}>
                <Page>
                    <List>
                        <ListItem expandable={true} expanded={false} > Test
                            <div className="expandable-content">
                                <ListItem>testing child</ListItem>
                                <ListItem>testing child</ListItem>
                                <ListItem>testing child</ListItem>
                            </div>
                        </ListItem>
                        <ListItem expandable={true} expanded={false} > Test
                            <div className="expandable-content">
                                <ListItem>testing child</ListItem>
                                <ListItem>testing child</ListItem>
                                <ListItem>testing child</ListItem>
                            </div>
                        </ListItem>
                    </List>
                </Page>
            </div>
            <div ref={this.divtxtref} style={{position: "fixed", textAlign: "center", fontSize: "8pt"}}>Test Text</div>
            <img ref={this.imgref} src={p.imageB64} style={{display: "none"}}>
            </img>
            <canvas ref={this.cnvref}
            style={{borderWidth: "2px", borderStyle: "solid", position: "fixed"}}
            onWheel={(evt)=>p.actions.zoom(evt.deltaY/125)} 
            onMouseDown={((evt: React.MouseEvent)=>this.panStart(evt.clientX,evt.clientY)).bind(this)}
            onMouseMove={((evt: React.MouseEvent)=>this.panMove(evt.clientX,evt.clientY)).bind(this)}
            onMouseUp={(()=>this.panStop()).bind(this)}
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
    imageWidth: number;
    imageHeight: number;
    pan: {x: number, y: number} = {x:0 , y:0}
    layout: number = 3;
    layoutPosition: number = 0;
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
}