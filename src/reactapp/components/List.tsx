import { Icon, List, ListHeader, ListItem, Page } from "react-onsenui"
import React, { CSSProperties } from "react"
import { Container } from "../../utils/Container";
import { StateMapAction } from "../../utils/AppStatesHandler";

function Iconiser(props: {iconparser: (item: Labelled, i:number)=>string, item: Labelled, i:number}){
    let icon = props.iconparser?props.iconparser(props.item, props.i):undefined;
    if(icon)
        return <div className="left"><Icon icon={icon}/></div>
    else
        return <div className="left"><Icon icon="md-circle-o"/></div>
}

export class StringList extends Container<StringListState, any> {
    render(){
        let p = this.getProps();
        let data = p.processor(p.data);
        return             <List<string> 
        dataSource={Object.keys(data)}
        renderRow={
            (row: string, i: number) => { return <ListItem 
                tapBackgroundColor="#AAAAAA" 
                onClick = {()=>p.onClick(row, i)}
                tappable={true}>
                    <Iconiser iconparser = {p.iconParser} item={data[row]} i={i}></Iconiser>
                    <div className="center">{data[row].label}</div>
                </ListItem>}
        } />
    }
}

export interface Labelled {
    label: string
}

export type StringListOptions = {
    onClick?: (row: string, i: number)=>void
    iconParser?: (item: Labelled, i:number)=>string;
    processor?: (data: string[])=>{[key: string]: Labelled}
}

export class StringListState {
    constructor(data: string[], options?: StringListOptions){
        this.data = data;
        if(options && options.onClick)
            this.onClick = options.onClick;
        if(options && options.iconParser)
            this.iconParser = options.iconParser;
        if(options && options.processor)
            this.processor = options.processor;
    }
    data: string[];
    processor: (data: string[])=>{[key: string]: Labelled} = (data: string[]): {[key: string]: Labelled} => {
        let res:{[key: string]: Labelled} = {};
        for(let s of data) res[s] = {label:s};
        return res;
    }
    iconParser: (item: Labelled, i:number)=>string;
    onClick: (row: string, i: number)=>void = ()=>{};
}

export class StringListAction extends StateMapAction<StringListState> {
    setList(data: string[]){
        let sl = this.getState();
        sl.data = [];
        setTimeout(()=>sl.data=data,1);
    }
}