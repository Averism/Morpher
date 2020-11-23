export default class Marker {
    constructor(name?:string){
        this.name = name;
    }
    name: string;
    position: {x: number, y: number} = {x: undefined, y: undefined};
    prev: Marker;
    next: Marker;
    visible: boolean;

    toString(): string{
        let res: any = {};
        res.name = this.name;
        res.position = this.position;
        return JSON.stringify(res);
    }

    static create(input: any):Marker {
        /* istanbul ignore else */
        if (typeof input == "string"){
            input = JSON.parse(input);
        }
        let res = new Marker(input.name);
        res.position = input.position;
        return res;
    }
}

