import { C_TRANSFER_SITE_COST, C_THROUGH_SITE_COST } from './sz-line.mjs'

// Use this for give each site a number order
var all_site_list = [] // ['7-车公庙','1-车公庙']
var all_site_index = {} // ['7-车公庙': 0, '1-车公庙': 1]

/**
 * Get a matrix about each site‘s connection
 * 这个过程建立好边的链接关系
 * @param {*} all_line [ {no:'', path: []}, {}]
 */
function build_map(all_line) {
  // 用来找到换乘站点：有多条路线经过
  var all_site = {}; // {'车公庙': [1,7,9,11]}
  // 存储可以直接连通的站点
  let site_edges = []; // [ {s: '下沙', e: '车公庙', value: C_THROUGH_SITE_COST}, {}]

  all_line.forEach( (line) => { // line = {path:[], no:''}
    let prev = null;
    line.path.forEach( (site) => {
      if( all_site[site] ) {
        all_site[site].push( line.no )
      } else {
        all_site[site] = [ line.no ]
      }

      // 从第二个站点开始建立边
      let e = `${line.no}-${site}`
      if (prev) {
        let s = `${line.no}-${prev}`
        site_edges.push({s, e, value: C_THROUGH_SITE_COST})
      } 

      all_site_list.push(e) // 站点因为加了路线前缀，所以不会重复，也不会漏
      prev = site;
    })
  })

  // 换乘站点生成虚拟边
  Object.keys(all_site).forEach( (key) => {
    // 有多条线路经过
    if( all_site[key].length > 1) { 
      for (let i = 0; i < all_site[key].length; i++) {
        for (let j = i + 1; j < all_site[key].length; j++) {
          let s = `${all_site[key][i]}-${key}`
          let e = `${all_site[key][j]}-${key}`
          site_edges.push({s, e, value: C_TRANSFER_SITE_COST})
        }
      }
    }
  })

  // 名称到下标的映射
  all_site_list.forEach( (site, idx) => {
    all_site_index[ site ] = idx
  })

  // Form a empty matrix
  var site_map = [];
  for (let i = 0; i < all_site_list.length; i++) {
    site_map[i] = [];
    for (let j = 0; j < all_site_list.length; j++) {
      let value = (i === j) ? 0 : Number.MAX_VALUE
      site_map[i].push(value);
    } 
  }

  // 用边的信息建设地图
  site_edges.forEach( (edge) => {
    let s_idx = all_site_index[ edge.s ]
    let e_idx = all_site_index[ edge.e ]

    // console.log(`${edge.s} - ${edge.e} = ${edge.value}`)

    site_map[ s_idx ][ e_idx ] = edge.value
    site_map[ e_idx ][ s_idx ] = edge.value
  })

  return site_map
}

export {all_site_list, all_site_index, build_map}