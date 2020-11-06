import { Icon, List, ListItem, Page, Popover, 
    Splitter, SplitterContent, SplitterSide,
    Toolbar, ToolbarButton } from "react-onsenui"
import React from "react"
import { SmartContainer, WithState } from "../../utils/Container";
import { BaseAppState, StateMapAction, StateMapping } from "../../utils/AppStatesHandler";

function isRE(x: any): x is React.ReactElement{
    return typeof x.type != "undefined" && typeof x.props != "undefined";
}

export class LeftMenu extends React.Component {
    render(){
        return this.props.children;
    }
}

export class Body extends React.Component {
    render(){
        return this.props.children;
    }
}

export class MainPageState implements WithState {
    constructor(title: string, stateMap: StateMapping<MainPageState>){
        this.title = title;
        this.state = stateMap.state;
        this.action = new MainPageAction(stateMap);
    }
    state: BaseAppState;
    title: string;
    action:MainPageAction;
    mainMenuOpen: boolean = false;
}

export class MainPageAction extends StateMapAction<MainPageState>{
    toggleMainMenu(){
        this.getState().mainMenuOpen = !this.getState().mainMenuOpen;
    }
    closeMainMenu(){
        this.getState().mainMenuOpen = false;
    }
}

export class MainPage extends SmartContainer<MainPageState> {
    constructor(props: any){
        super(props)
        this.state = {isOpen: false};
    }

    render(){
        let menuButton: ToolbarButton;
        let left: {}[] = [];
        let body: {}[] = [];
        let p = this.getProps();
        if(Array.isArray(this.props.children))
            this.props.children.forEach(x=>{
                if(!isRE(x)) return;
                if(x.type == LeftMenu)left.push(x) 
                if(x.type == Body)body.push(x)})
        return <Page renderToolbar = { ()=>
            <Toolbar>
                <div className="left">
                    <ToolbarButton 
                    ref={(btn)=>{menuButton = btn}}
                    onClick = {p.action.toggleMainMenu} >
                        <Icon icon="md-menu" />
                    </ToolbarButton>
                </div>
        <div className="center">{p.title}</div>
            </Toolbar>
        }>
            <Splitter>
                <SplitterSide
                side="left"
                width={180}
                isOpen={p.mainMenuOpen}
                onClose={p.action.closeMainMenu}
                collapse={true}
                >
                    <Page>{left}</Page>
                </SplitterSide>
                <SplitterContent>
                    {body}
                </SplitterContent>
            </Splitter>
        </Page>
    }
}
