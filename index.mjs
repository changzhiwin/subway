import {all_lines} from './src/sz-line';
import {dijkstra} from './src/dijkstra';
import {all_site_list, all_site_index, build_map} from './src/build-map';

// example


let start = '2-蛇口港' //宝华
let end = '3-木棉湾'


/*
let start = '3-翠竹';
let end = '9-下沙';
*/


let site_map = build_map(all_lines)
let ret = dijkstra(start, end, all_site_index, site_map)

let paths = ret.path.map( (st) => { return all_site_list[ st ] })

console.log(`Have ${ret.value} sites, path ${paths}`)

