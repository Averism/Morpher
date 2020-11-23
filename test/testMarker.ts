import * as Assert from 'assert';
import Marker from '../src/morpher/Marker';
import Path from '../src/morpher/Path';


function createMarker(name: string, x:number, y:number){
    let m: Marker = new Marker(name);
    m.position = {x,y};
    return m;
}

describe("Marker",()=>{
    it("should serialize and deserialize correctly",()=>{
        let marker = new Marker("test");
        let s1 = marker.toString();
        Assert.strictEqual(s1, '{"name":"test","position":{}}');
        let marker2 = Marker.create(s1);
        marker.position = {x: 1, y: 2};
        let s2 = marker.toString();
        Assert.strictEqual(s2, '{"name":"test","position":{"x":1,"y":2}}')
        let marker3 = Marker.create(s2);
        Assert.deepStrictEqual(marker,marker3);
        Assert.notDeepStrictEqual(marker2,marker3);
    });
});

describe("Path",()=>{
    it("should serialize and deserialize correctly",()=>{
        let m1 = createMarker("m1",0,1);
        let m2 = createMarker("m2",1,2);
        let m3 = createMarker("m2",2,2);
        let path = new Path({start: m1, end: m3},"path");
        let spath = path.toString();
        Assert.strictEqual(spath, `{"markers":${
            JSON.stringify([m1.toString(),m3.toString()])
        },"name":"path"}`);
        let path1 = Path.create(spath);
        Assert.deepStrictEqual(path1,path);
        Assert.deepStrictEqual(path1.markers[0].next,path.markers[1]);
        path.insert(m2,1);
        Assert.deepStrictEqual(m1.next, m2);  
        Assert.deepStrictEqual(m2.prev, m1);       
    });
});