import Marker from "./Marker";
import Path from "./Path";

function isPathArray(array: any[]): array is Path[] {
    if(array.length == 0) return true;
    if( array[0] instanceof Path) return true;
    return false;
}

function getLastOf<T>(array: T[]):T { return array[array.length-1] }

export default class Shape {
    constructor(input: string[]|Path[], name: string, scheme: string) {
        this.name = name;
        this.scheme = scheme
        this.markers = [];
        this.paths = [];
        for(let i: number=0; i<input.length; i++){
            if(isPathArray(input)){
                this.paths = input;
                this.name = name;
                this.scheme = scheme;
                for(let i=0; i<this.paths.length; i++){
                    this.paths[i].markers.pop();
                    if(i+1<this.paths.length)
                        this.paths[i].markers.push(this.paths[i+1].markers[0]);
                    else
                        this.paths[i].markers.push(this.paths[0].markers[0]);
                    this.markers.push(this.paths[i].markers[0]);
                }
            }else{
                let m = new Marker(input[i]);
                this.markers.push(m);
                if(i > 0 ){
                    let l = this.markers[this.markers.length-2];
                    let p = new Path({start: l, end: m}, l.name+"-"+m.name);
                    this.paths.push(p);
                    if(i == input.length-1){
                        let o = this.markers[0];
                        let q = new Path({start: m, end: o}, m.name+"-"+o.name);
                        this.paths.push(q);
                    }
                }
            }
        }
        this.vocal = new Marker("vocal-"+this.name);
    }
    name: string;
    scheme: string;
    visible: boolean;
    markers: Marker[];
    vocal: Marker
    paths: Path[];

    toString(): string {
        let so: any = {};
        so.paths = this.markers.map(x=>x.toString());
        so.name = this.name;
        so.vocal = this.vocal.toString();
        so.scheme = this.scheme;
        return JSON.stringify(so);
    }

    static create(input: any): Shape {
        if (typeof input == "string"){
            input = JSON.parse(input);
        }
        if(!input.markers) throw "shape constructor input must have markers property"
        if(!input.name) throw "shape constructor input must have name property"
        if(!input.scheme) throw "shape constructor input must have scheme property"
        if(!input.paths) throw "shape constructor input must have paths property"
        let res = new Shape( input.paths.map((x: any)=> Path.create(x)) , input.name, input.scheme );
        res.vocal = Marker.create(input.vocal);
        return res;
    }
}
