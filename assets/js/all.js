// 抓取 value 的 function
function getUrlVal(val) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");

  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");

    if (pair[0] == val) {
      return pair[1];
    }
  }

  return false;
}