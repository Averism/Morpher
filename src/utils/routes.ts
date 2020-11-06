import path from 'path'
import fs from 'fs'

const route: {[key: string]: string} = {
    '/': 'index.html'
}

function defRoute(req: string): string {
    let p = req.substr(1);
    if(route[req]) return route[req]; 
    if(fs.existsSync(path.join("static",p))) return p;
    return null;
}

export default defRoute