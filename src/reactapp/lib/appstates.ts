import { AppStatesHandler, BaseAppState, map, StateMapping } from "../../utils/AppStatesHandler";
import { ChooserActionSheetState } from "../components/ChooserActionSheet";
import { MainPageState } from "../components/MainPage";
import { MainPageState as MainBodyState } from "../components/AM-MainPage"
import { docChooser } from "../controller/docChooser";

export class AppStates extends BaseAppState {
    docChooser: ChooserActionSheetState = docChooser(this);
    mainPage: MainPageState = new MainPageState("AverMorph",map('mainPage',this));
    mainBody: MainBodyState = new MainBodyState(map("mainBody",this));
    asopen: boolean = false;
}

let realAppStates: AppStates = new AppStates();
export let appStates: AppStates = new Proxy(realAppStates,new AppStatesHandler<AppStates>());

export default appStates;




