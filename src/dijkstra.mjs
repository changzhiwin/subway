export function dijkstra(from, to, name_2_index, map) {
  let from_idx = name_2_index[from];
  let to_idx = name_2_index[to];

  let arr_of_start = map[from_idx];
  let distance = [];
  let mark_used = [];
  let prev_site_idx = from_idx;

  // first start point, init distance array and mark_used array
  for(let i = 0; i < arr_of_start.length; i++) {
    distance.push({value: arr_of_start[ i ], from: from_idx})
    mark_used.push(i === from_idx)
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
        /**
         * 这种算法有bug，case如下：
         * 9, 红岭北, value(11), prev(泥岗)
         * 7, 笋岗, value(14), prev(红岭北)
         * 这种情况，换乘的成本放到了换乘站的下一站；导致计算错误
         * 想了想，只能切换为换乘虚拟站点方案（2019-11-05 22:05:14）
         */
        if (distance[i].value > (min_idx.value + temp_arr[i]) ) {
          distance[i].value = min_idx.value + temp_arr[i];
          distance[i].from = prev_site_idx; // find a shortest path, update prev_node
        }
      }
    }
  }

  let mid_node = to_idx;
  let solve_path = [];
  while(mid_node !== distance[mid_node].from) {
    solve_path.unshift(mid_node);
    mid_node = distance[mid_node].from
  }
  solve_path.unshift(mid_node)

  return {value: distance[to_idx].value, path: solve_path, distance: distance};
}