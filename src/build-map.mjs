
function __set_one_edge_of_map(map, from, to, line) {
  map[ from ][ to ].value = 1
  map[ from ][ to ].line.push(line)
}

// Use this for give each site a number order
var all_site_list = [] // [{name:'车公庙', line: [1,7,9,11]}, {}]
var all_site_index = {} // ['车公庙': 0, '福田': 1]

/**
 * Get a matrix about each site‘s connection
 * @param {*} all_line [ {name:'', path: []}, {}]
 */
function build_map(all_line) {
  var all_site = {};// {'车公庙': [1,7,9,11]}
  all_line.forEach( (line) => {
    line.path.forEach( (site) => {
      if( all_site[site] ) {
        all_site[site].push( line.name )
      } else{
        all_site[site] = [ line.name ]

        all_site_index[site] = all_site_list.length
        // given the key(line) a array ref
        all_site_list.push( {name: site, line: all_site[site]} )
      }
    })
  })

  // Form a empty matrix
  var site_map = [];
  for (let i = 0; i < all_site_list.length; i++) {
    site_map[i] = [];
    for (let j = 0; j < all_site_list.length; j++) {
      let node = {value: Number.MAX_VALUE, line:[]};
      if (i === j) {  
        node.value = 0; // A -> A, no distance
      } 
      site_map[i].push(node);
    } 
  }

  // Use all line to set real value
  all_line.forEach( (line) => {
    // The first site only goto the self
    let idx = all_site_index[ line.path[0] ]; // like "机场东"
    site_map[ idx ][ idx ].line.push(line.name);// from A -> B, which line pass

    // Then from second site of the line
    for (let i = 1; i < line.path.length; i++){
      let from_idx = all_site_index[ line.path[i-1] ];
      let to_idx = all_site_index[ line.path[i] ];

      __set_one_edge_of_map(site_map, from_idx, to_idx, line.name)
      __set_one_edge_of_map(site_map, to_idx, from_idx, line.name)

      site_map[ to_idx ][ to_idx ].line.push(line.name)
    }
  })

  return site_map;
}

export {all_site_list, all_site_index, build_map};