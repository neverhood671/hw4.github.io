var data;
var selectedYear = 2012;

d3.json("data/countries_1995_2012.json", function(allData) {
  data = allData;
  sortData(data, "population", 1);
  let nodes = initNodes(data);
  let links = initLinks(nodes);

  // Define this as a global variable
  window.graph = new Graph(nodes, links, data);

  // Draw the Bar chart for the first time
  graph.updateGraph();
});

function updateGraph() {
  graph.applyLayaut();
}

function initNodes(actualData) {
  let nb_nodes = actualData.length;
  let k = -1;
  let nodes = d3.range(nb_nodes).map(function() {

    k++;

    var currentYears = actualData[k].years;
    var j = 0;
    while (currentYears[j].year != selectedYear) {
      j++;
    }

    return {
      id: actualData[k].country_id,
      country: actualData[k].name,
      latitude: actualData[k].latitude,
      longitude: actualData[k].longitude,
      population: currentYears[j].population,
      gdp: currentYears[j].gdp,
      life_expectancy: currentYears[j].life_expectancy,
      top_partners: currentYears[j].top_partners,
    };
  });
  return nodes;
}

function initLinks(nodes) {
  let links = [];

  for (var i = 0; i < nodes.length; i++) {
    var partners = nodes[i].top_partners;
    for (var n = 0; n < nodes.length; n++) {
      for (var m = 0; m < partners.length; m++) {
        if (partners[m].country_id == nodes[n].id) {
          links.push({
            "source": i,
            "target": n
          });
        }
      }
    }
  }
  return links;
}

function lineLayout() {
  var scale = d3.select('input[name="scaleRadio"]:checked').property("value");
  var sortBy = d3.select("select").property('value');

  if (scale == "default") {
    defaultScale();
  } else {
    byValueScale();
  }
}

function defaultScale() {
  var selectedOption = d3.select("select").property('value');
  var maxVal = (getMaxAndMinValue(data, selectedOption))[1];
  var step = (height - 50) / data.length;
  graph.nodes.forEach(function(d, i) {
    d.x = width / 2;
    d.y = 50 + step * i;
  });
  graph_update(2000);
}

function byValueScale() {
  var selectedOption = d3.select("select").property('value');
  var minAndMaxVal = getMaxAndMinValue(graph.nodes, selectedOption);
  var maxVal = minAndMaxVal[1];
  graph.nodes.forEach(function(d, i) {
    d.x = width / 2;
    d.y = 50 + (1 - d[selectedOption] / maxVal) * (height - 50);
  });
  graph_update(2000);
}

function twoDemisionLayout() {
  var axis = d3.select('input[name="axisRadio"]:checked').property("value");
  if (axis == "gdp_population") {
    populationGDPAxis();
  } else {
    longitudeLatitudeAxis();
  }
}

function populationGDPAxis() {
  var maxGDP = (getMaxAndMinValue(graph.nodes, "gdp"))[1];
  var maxPopulation = (getMaxAndMinValue(graph.nodes, "population"))[1];
  graph.nodes.forEach(function(d, i) {
    d.x = 50 + (d["gdp"] / maxGDP) * (width - 50);
    d.y = 50 + (1 - d["population"] / maxPopulation) * (height - 50);
  });
  graph_update(2000);
}

function longitudeLatitudeAxis() {
  var minAndMaxLong = getMaxAndMinValue(graph.nodes, "longitude");
  var minAndMaxLat = getMaxAndMinValue(graph.nodes, "latitude");
  graph.nodes.forEach(function(d, i) {
    d.x = 50 + ((-minAndMaxLong[0] + d["longitude"]) / (minAndMaxLong[1] - minAndMaxLong[0])) * (width - 200);
    d.y = 50 + ((-minAndMaxLong[0] + d["latitude"]) / (minAndMaxLong[1] - minAndMaxLong[0])) * (height - 50);
  });
  graph_update(2000);
}

function circleLayout() {

}


function ringeLayout() {

}

function graph_update(duration) {
  d3.selectAll(".node").transition().duration(duration)
    .attr("transform", function(d) {
      return "translate(" + d.x + "," + d.y + ")";
    });
}

function chooseData() {
  selectedOption = d3.select("select").property('value');
  sortData(graph.nodes, selectedOption, 1);
  graph.applyLayaut();
}

function getMaxAndMinValue(data, key) {
  var max = 0,
    min = 0;
  for (var i = 0; i < data.length; i++) {
    var curretVal = !!data[i][key] ? data[i][key] : 0;
    if (curretVal > max) {
      max = curretVal;
    }
    if (curretVal < min) {
      min = curretVal;
    }
  }
  return [min, max];
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
    case "longitude":
      data.sort(sortByKey("longitude", reverse));
      break;
    case "latitude":
      data.sort(sortByKey("latitude", reverse));
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
