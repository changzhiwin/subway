/**
 * 从下面页面扣出地铁线路信息，在console里面执行
 * [地铁站数据](https://dt.8684.cn/sz_x_2e25af6a)
 */
var trs = document.getElementsByTagName('tbody')[0].childNodes;
var points = [];
trs.forEach((tr, idx) => {  if ( idx % 2) { points.push( tr.childNodes[1].firstChild.firstChild); } });
var textName = points.map( (p) => {return p.textContent});
textName;