declare global {
    interface Window { wsapp: WsappClient; }
}

class WsappClientTriggers {
        ongetImage: (x: {filename: string, value: string})=>any = function(x: {filename: string, value: string}):any{console.log("getImage",x)};
        onlistfile: (x: {path: string[], items: string[]})=>any = function(x: {path: string[], items: string[]}):any{console.log("listfile",x)};

}

export class WsappClient {

    constructor(){
        const theclient = this;
        this.__initws();
        this.__ws.onmessage = function(event: any) {
            const data = JSON.parse(event.data);
            switch(data.name){
                case "getImage": typeof theclient.trigger.ongetImage(data.value); break;
                case "listfile": typeof theclient.trigger.onlistfile(data.value); break;

            }
        }
        this.__ws.onclose = function(event: any) {
            console.log("connection closed");
            // this.__initws();
        }
    }

    private __initws() {
        this.__ws = new WebSocket("ws://"+"192.168.100.9:3000"+"/wsrpc");
    }

    private __ws: WebSocket;

    private async __call(name: string, parameters: any){
        const ws = this.__ws;
        await new Promise((v,j)=>{
            function waitReady(){
                if(ws.readyState == ws.CONNECTING){
                    setTimeout(waitReady,100);
                }else{
                    v();
                }
            }
            waitReady();
        })
        this.__ws.send(JSON.stringify({name, parameters}))
    }

    trigger: WsappClientTriggers = new WsappClientTriggers();

    defaultHandler: (data: any)=>any = function(data: any){
        console.log(data);
    }

    getImage(parameter: {filename:string;}){
        this.__call("getImage", parameter);
    }


    listfile(parameter: {path:string[];}){
        this.__call("listfile", parameter);
    }



    
}

let sdk = new WsappClient();
export default sdk;

const w: Window = (window as Window);
if(w) {
    w.wsapp = sdk;
}
