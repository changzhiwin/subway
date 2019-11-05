import {C_TRANSFER_COST} from './sz-line'

export function dijkstra(from, to, name_2_index, map) {
  let from_idx = name_2_index[from];
  let to_idx = name_2_index[to];

  let arr_of_start = map[from_idx];
  let distance = [];
  let mark_used = [];
  let prev_site_idx = from_idx;

  // first start point, init distance array and mark_used array
  for(let i = 0; i < arr_of_start.length; i++) {
    let cost = {value: Number.MAX_VALUE, from: prev_site_idx, line: [], on: [], transfer: 0}
    let used = (i === from_idx)

    cost.value = arr_of_start[ i ].value
    cost.line = arr_of_start[ i ].line // need record which line have

    // 运行在那条地铁线上，可以到达i
    arr_of_start[ i ].line.forEach( (l) => { // 我有哪些线路
      if (arr_of_start[ from_idx ].line.includes(l)) { // 起点有哪些线路
        cost.on.push(l) // 如果有同一条线路，说明这条线路可以到达i
      }
    })

    distance.push(cost)
    mark_used.push(used)
  }

  while (1) {
    // Find the min value
    let min_idx = {idx: -1, value: Number.MAX_VALUE};
    distance.forEach( (dis, i) => {
      if ( !mark_used[i] && ( dis.value < min_idx.value) ) {
        min_idx.idx = i
        min_idx.value = dis.value
      }
    })

    if (min_idx.idx === -1) break;

    // use it, and reset prev node
    mark_used[ min_idx.idx ] = true
    prev_site_idx = min_idx.idx // 从这个站点，重新计算一遍最短距离
    let temp_arr = map[ min_idx.idx ]
    for (let i = 0; i < temp_arr.length; i++) {
      if (!mark_used[i]) {
        // 需要处理换乘情况：到这个站之前运行到的站点是 distance[ prev_site_idx ]，当前的站点是 distance[ i ]
        let can_on = []
        let need_transfer = true;
        distance[ prev_site_idx ].on.forEach( (l) => {
          if (temp_arr[i].line.includes(l)){
            can_on.push(l)
            need_transfer = false;
          }
        })
        
        let adder = 0;
        if (need_transfer) {
          can_on = temp_arr[i].line.slice()
          adder = C_TRANSFER_COST // 增加换乘消耗
        }

        /**
         * 这种算法有bug，case如下：
         * 9, 红岭北, value(11), prev(泥岗)
         * 7, 笋岗, value(14), prev(红岭北)
         * 这种情况，换乘的成本放到了换乘站的下一站；导致计算错误
         * 想了想，只能切换为换乘虚拟站点方案（2019-11-05 22:05:14）
         */
        if (distance[i].value > (adder + min_idx.value + temp_arr[i].value) ) {
          distance[i].value = adder + min_idx.value + temp_arr[i].value;
          distance[i].from = prev_site_idx; // find a shortest path, update prev_node
          distance[i].on = can_on;

          distance[i].transfer = need_transfer ? 1:0 
        }
      }
    }
  }

  let mid_node = to_idx;
  let solve_path = [];
  while(mid_node !== distance[mid_node].from) {
    let site = {idx: mid_node, on: distance[mid_node].on, transfer: distance[mid_node].transfer}

    solve_path.unshift(site);
    mid_node = distance[mid_node].from
  }
  solve_path.unshift(
    {idx: mid_node, on: distance[mid_node].on, transfer: distance[mid_node].transfer}
  );

  return {value: distance[to_idx].value, path: solve_path, distance: distance};
}