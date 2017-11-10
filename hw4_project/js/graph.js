

class Graph {


  constructor(nodes, links, allData) {
    this.nodes = nodes;
    this.links = links;
    this.actialData = allData;
  }

  /**
   * Render and update the graph based on the selection of the data type in the drop-down box
   */
  updateGraph() {
    d3.selectAll("input[type = 'radio']").on("change", updateGraph);
    d3.select("select").on("change", chooseData);

    var self = this;
    d3.selectAll(".node").remove();

    var svg = d3.select("#graph")
      .attr("width", width)
      .attr("height", height)
      .attr("transform", "translate(0,70)");

    var node = svg.selectAll(".node")
      .data(self.nodes)
      .enter()
      .append("g")
      .attr("class", "node")

    svg.selectAll(".node")
      .append("text")
      .text(function(d){
        return d.country;
      })
      .attr("class", "country_label")
      .attr("dx", 12)
      .attr("dy", 5);

    node.append("circle")
      .attr("r", 8)
      .attr("class", "node_circle")
      .attr("style", function(d){
        return "fill: " + foci[d.continent].color;
      });


    this.applyLayaut();
  }

  applyLayaut() {
    var layaut = d3.select('input[name="layautRadio"]:checked').property("value");
    d3.selectAll(".optionBlock").attr("style", "display: none");
    switch (layaut) {
      case "line":
        d3.select("#lineBlock").attr("style", "display: block");
        lineLayout();
        break;
      case "2D":
        d3.select("#twoDBlock").attr("style", "display: block");
        twoDemisionLayout();
        break;
      case "circle":
        d3.select("#circleBlock").attr("style", "display: block");
        circleLayout();
        break;
      case "ring":
        d3.select("#ringBlock").attr("style", "display: block");
        ringLayout();
        break;
    }
  }
}
