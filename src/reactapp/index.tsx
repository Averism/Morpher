import ReactDOM from 'react-dom'
import React from "react"
import 'onsenui/css/onsenui.css'
import 'onsenui/css/onsen-css-components.css'
import { Body, LeftMenu, MainPage } from "./components/MainPage"
import Left from './components/AM-MainMenu'
import {default as appState, AppStates} from './lib/appstates'
import AM_MainPage from "./components/AM-MainPage"
import main from "./controller"
import { StateMapping } from '../utils/AppStatesHandler'

let appInstance: App;

class App extends React.Component<AppStates, AppStates> {
    constructor(props: AppStates) {
        super(props);
        this.state = appState;
        appState.__setInstance(this);
        appInstance = this;
    }

    componentDidMount(){
        onAppMount();
    }

    render(): React.ReactNode {
        let r = <MainPage statePath={new StateMapping("mainPage", appState)}>
            <LeftMenu>
                <Left actSheetOpen={this.state.asopen}></Left>
            </LeftMenu>
            <Body>
                <AM_MainPage statePath={new StateMapping("mainBody", appState)}/>
            </Body>
        </MainPage>
        // r = toolbar(r);
        return r;
    }
}

Error.stackTraceLimit = undefined;
const app = React.createElement(App,appState);
ReactDOM.render(app, document.getElementById('root'));

function onAppMount() {
    (window as any).appstate = appState;
    main();
}

window.onresize = function(){appState.__update()}
window.ondeviceorientation = function(){appState.__update()}