import {WsappHandler, WsappParam} from '../utils/wsapp';
import path from "path"
import imgLoader from "image-to-base64"

class GetImage extends WsappHandler {
    getSignature(): { [name: string]: { required: boolean; type: string; b64: boolean; default: any; }; } {
        return {
            filename: {
                required: true,
                type: "string",
                b64: false,
                default: undefined
            }
        }
    }
    getResultType(): string {
        return "{filename: string, value: string}"
    }
    handle(param: WsappParam, ws: import("ws")): boolean {
        let fn: string = param.filename;
        let ext: string = fn.split(".").pop();
        let promisedString = imgLoader(path.join("workspace",fn));
        const x = this;
        promisedString.then(b64=>x.wsreturn({filename: fn, value:"data:image/"+ext+";base64, "+b64},ws));
        return true;
    }
    getName(): string {
        return "getImage";
    }
    
}

export let getImage = new GetImage();