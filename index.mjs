import {all_lines, C_TRANSFER_COST} from './src/sz-line';
import {dijkstra} from './src/dijkstra';
import {all_site_list, all_site_index, build_map} from './src/build-map';

// example

let start = '下沙' //宝华
let end = '太安'

/*
let start = '翠竹';
let end = '下沙';
*/

let site_map = build_map(all_lines)
let ret = dijkstra(start, end, all_site_index, site_map)

let paths = ret.path.map( (st) => { return {name: all_site_list[ st.idx ].name, on: st.on, transfer: !!st.transfer} })

let count = 0
paths.forEach( (pt, idx) => {
  console.log(`${idx+1}, ${pt.name}, on ${pt.on}${pt.transfer? ',  transfer':''}`)
  if (pt.transfer) {
    count++
  }
});
console.log(`Have ${ret.value - count * C_TRANSFER_COST} sites, and transfer ${count} times`)

console.log('----------------------')
// 
ret.distance.forEach( (dis, idx) => {
  if (all_lines[5].path.includes( all_site_list[ idx ].name ) || all_lines[6].path.includes(all_site_list[ idx ].name)){
    console.log(`${dis.on}, ${all_site_list[ idx ].name}, value(${dis.value}), prev(${all_site_list[dis.from].name})`)
  }
})