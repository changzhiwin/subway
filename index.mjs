import {all_lines} from './src/sz-line';
import {dijkstra} from './src/dijkstra';
import {all_site_list, all_site_index, build_map} from './src/build-map';

// example

let start = '车公庙';//宝华
let end = '太安';

/*
let start = '翠竹';
let end = '下沙';
*/

let site_map = build_map(all_lines);
let ret = dijkstra(start, end, all_site_index, site_map);
//{idx: mid_node, on: distance[mid_node].on, transfer: distance[mid_node].transfer}
let paths = ret.path.map( (st) => { return {name: all_site_list[ st.idx ].name, on: st.on, transfer: !!st.transfer} });

//console.log(`${start} -> ${end} have ${ret.value} sites, [${paths.join(', ')}]`);

let count = 0;
paths.forEach( (pt, idx) => {
  console.log(`${idx+1}, ${pt.name}, on ${pt.on}${pt.transfer? ',  transfer':''}`)
  if (pt.transfer) {
    count++
  }
});
console.log(`Have ${ret.value - count}, and transfer ${count}`)