import Marker from "./Marker";

export type PathParameter = {start: Marker, end: Marker} | Marker[]

export default class Path {
    constructor(input: PathParameter, name: string) {
        this.name = name;
        if (Array.isArray(input)) {
            this.markers = input;
        } else {
            this.markers = [input.start, input.end];
        }
        this.markers.forEach((v, i, arr) => {
            if (i > 0)
                v.prev = arr[i - 1];
            if (i < arr.length - 1)
                v.next = arr[i + 1];
        });
    }
    visible: boolean;
    name: string;
    markers: Marker[];
    toString():string {
        let res: any = {};
        res.markers = this.markers.map(x=>x.toString());
        res.name = this.name;
        return JSON.stringify(res);
    }
    static create(input: any): Path {       
        if (typeof input == "string"){
            input = JSON.parse(input);
        }
        let markers = input.markers.map((x: any) => Marker.create(x));
        let res = new Path(markers, input.name);
        return res;
    }
    insert(marker: Marker, i: number) {
        if (i < 0)
            i = 0;
        if (i >= this.markers.length)
            i = this.markers.length - 1;
        let tail = this.markers.splice(i);
        this.markers = [...this.markers, marker, ...tail];
        if (i > 0) {
            this.markers[i - 1].next = marker;
            marker.prev = this.markers[i - 1];
        }
        if (i < this.markers.length - 1) {
            this.markers[i + 1].prev = marker;
            marker.next = this.markers[i + 1];
        }
    }
}
