var data;
var selectedOption;
var graph = {
  nodes: [],
  links: []
};
var margin = {
  top: 50,
  bottom: 10,
  left: 300,
  right: 40
};
var width = 1000 - margin.left - margin.right;
var height = 1900 - margin.top - margin.bottom;

function initPage(data) {
  selectedOption = d3.select("select").property('value');
  data = sortData(data, selectedOption, 1);
  var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

  var fill = d3.scale.category10();

  initGraph(data);

  d3.select("input[value=\"default\"]").on("click", verticalDefaultLayout);
  d3.select("input[value=\"byValue\"]").on("click", verticalByValueLayout);
  d3.select("select").on("change", changeOption);

}

function initGraph(data) {
  var svg = d3.select("svg");
  svg.selectAll(".node").remove();
  var nb_nodes = data.length,
    nb_cat = 10;
  var node_scale = d3.scale.linear().domain([0, nb_cat]).range([5, 50]);
  var k = -1;
  graph.nodes = d3.range(nb_nodes).map(function() {
    k++;
    return {
      country: data[k].name,
      population: data[k].population,
      gdp: data[k].gdp,
      life_expectancy: data[k].life_expectancy
    };
  });

  var node = svg.selectAll(".node")
    .data(graph.nodes)
    .enter()
    .append("g").attr("class", "node");

  svg.selectAll(".node")
    .append("text")
    .text(function(d) {
      return d.country;
    })
    .attr("class", "country_label");

  svg.selectAll(".country_label")
    .attr("dy", "5")
    .attr("dx", "10");

  node.append("circle")
    .attr("r", 5);

    var scaleVal = d3.select('input[name="scaleRadio"]:checked').property("value");
    if (scaleVal == "default") {
      verticalDefaultLayout();
    } else {
      verticalByValueLayout();
    }
    graph_update(2000);
}

function verticalDefaultLayout() {
  var maxVal = getMaxValue(data, selectedOption);
  var step = (height - 50) / data.length;
  graph.nodes.forEach(function(d, i) {
    d.x = width / 2;
    d.y = 50 + step * i;
  });
  graph_update(2000);
}

function verticalByValueLayout() {
  var maxVal = getMaxValue(data, selectedOption);
  graph.nodes.forEach(function(d, i) {
    d.x = width / 2;
    d.y = 50 + (1 - d[selectedOption] / maxVal) * (height - 50);
  });
  graph_update(2000);
}

function graph_update(duration) {
  d3.selectAll(".node").transition().duration(duration)
    .attr("transform", function(d) {
      return "translate(" + d.x + "," + d.y + ")";
    });
}

function changeOption() {
  selectedOption = d3.select("select").property('value');
  data = sortData(data, selectedOption, 1);
  initGraph(data);
}

function getMaxValue(data, key) {
  var max = 0;
  for (var i = 0; i < data.length; i++) {
    if (data[i][key] > max) {
      max = data[i][key];
    }
  }
  return max;
}

function sortData(data, sortByParam, reverse) {
  switch (sortByParam) {
    case "name":
      data.sort(sortByKey("name", reverse));
      break;
    case "population":
      data.sort(sortByKey("population", reverse));
      break;
    case "gdp":
      data.sort(sortByKey("gdp", reverse));
      break;
    case "life_expectancy":
      data.sort(sortByKey("life_expectancy", reverse));
      break;
  }
  return data;
}

function sortByKey(key, reverse) {
  var moveSmaller = reverse ? 1 : -1;
  var moveLarger = reverse ? -1 : 1;
  return function(a, b) {
    if (a[key] < b[key]) {
      return moveSmaller;
    }
    if (a[key] > b[key]) {
      return moveLarger;
    }
    return 0;
  };
}
