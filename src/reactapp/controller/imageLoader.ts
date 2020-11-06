import { WsappClient } from "../lib/wsapp-client";

import wsapp from "../lib/wsapp-client"

export async function imageLoader(filename: string): Promise<string>{
    return new Promise<string>((resolve,reject)=>{
        wsapp.getImage({filename});
        wsapp.trigger.ongetImage = function(x: {filename: string, value: string}){
            resolve(x.value);
        }
    })
}