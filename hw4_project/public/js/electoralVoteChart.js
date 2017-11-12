class ElectoralVoteChart {
  /**
   * Constructor for the ElectoralVoteChart
   *
   * @param shiftChart an instance of the ShiftChart class
   */
  constructor(shiftChart) {
    this.shiftChart = shiftChart;

    this.margin = {
      top: 30,
      right: 20,
      bottom: 30,
      left: 50
    };
    let divelectoralVotes = d3.select("#electoral-vote").classed("content", true);

    //Gets access to the div element created for this chart from HTML
    this.svgBounds = divelectoralVotes.node().getBoundingClientRect();
    this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
    this.svgHeight = 150;

    //creates svg element within the div
    this.svg = divelectoralVotes.append("svg")
      .attr("width", this.svgWidth)
      .attr("height", this.svgHeight)

  };

  /**
   * Returns the class that needs to be assigned to an element.
   *
   * @param party an ID for the party that is being referred to.
   */
  chooseClass(party) {
    if (party == "R") {
      return "republican";
    } else if (party == "D") {
      return "democrat";
    } else if (party == "I") {
      return "independent";
    }
  }


  /**
   * Creates the stacked bar chart, text content and tool tips for electoral vote chart
   *
   * @param electionResult election data for the year selected
   * @param colorScale global quantile scale based on the winning margin between republicans and democrats
   */

  update(electionResult, colorScale) {

    d3.select("#barArea").remove();

    // ******* TODO: PART II *******

    //Group the states based on the winning party for the state;
    //then sort them based on the margin of victory
    var self = this;
    var stateGroups = {
      "democrat": [],
      "independent": [],
      "republican": []
    };


    var republicanVotes = 0;
    var democratVotes = 0;
    var independentVotes = 0;
    for (var i = 0; i < electionResult.length; i++) {
      if (electionResult[i]["RD_Difference"] > 0) {
        stateGroups["republican"].push(electionResult[i]);
        republicanVotes += parseInt(electionResult[i]["Total_EV"]);
      } else if (electionResult[i]["RD_Difference"] < 0) {
        stateGroups["democrat"].push(electionResult[i]);
        democratVotes += parseInt(electionResult[i]["Total_EV"]);
      } else {
        stateGroups["independent"].push(electionResult[i]);
        independentVotes += parseInt(electionResult[i]["Total_EV"]);
      }
    }

    var sumOfVOtes = republicanVotes + democratVotes + independentVotes;
    stateGroups["democrat"].sort(function(a, b) {
      return a.RD_Difference - b.RD_Difference;
    })
    stateGroups["republican"].sort(function(a, b) {
      return a.RD_Difference - b.RD_Difference;
    })
    var data = stateGroups["independent"].concat(stateGroups["democrat"].concat(stateGroups["republican"]));

    //Create the stacked bar chart.
    //Use the global color scale to color code the rectangles.
    //HINT: Use .electoralVotes class to style your bars.
    this.svg.append("g")
      .attr("id", "barArea")
      .append("text")
      .text("Electoral Vote (" + parseInt(sumOfVOtes / 2) + " needed to win)")
      .attr("transform", "translate(" + (self.svgWidth / 2) + "," + 30 + ")")
      .classed("yeartext", true);

    var bar = this.svg.select("#barArea").selectAll("g")
      .data(data)
      .enter().append("g").classed("bar", true);
    var perc_so_far = 0;

    bar.append("rect")
      .attr("width", function(d) {
        return ((d["Total_EV"] / sumOfVOtes) * 100) + "%";
      })
      .attr("x", function(d) {
        var prev_perc = perc_so_far;
        var this_perc = 100 * (d["Total_EV"] / sumOfVOtes);
        perc_so_far = perc_so_far + this_perc;
        return prev_perc + "%";
      })
      .attr("height", 40)
      .attr("transform", "translate(50,50)")
      .attr("fill", function(d) {
        if (d["RD_Difference"] == 0) {
          return "green";
        } else {
          return (colorScale(d["RD_Difference"]));
        }
      })
      .classed("electoralVotes", true);

    this.svg.select("#barArea").append("line")
      .style("stroke", "black")
      .attr("x1", "50%")
      .attr("y1", 48)
      .attr("x2", "50%")
      .attr("y2", 92)
      .attr("transform", "translate(25,0)");

    var votesLabels = this.svg.select("#barArea").append("g").attr("id", "votesLabels");
    votesLabels.append("text").text(independentVotes)
      .attr("transform", function(d) {
        return "translate(" + (stateGroups["independent"].length > 0 ? 65 : -100) + ", 48)";
      })
      .attr("style", "fill: green");
    votesLabels.append("text").text(democratVotes)
      .attr("x", function(d) {
        return (independentVotes / sumOfVOtes * 100) + "%";
      })
      .attr("style", "fill: #6baed6")
      .attr("transform", "translate(68,48)");
    votesLabels.append("text").text(republicanVotes)
      .attr("x", function(d) {
        return (97.5) + "%";
      })
      .attr("y", 48)
      .attr("style", "fill: #de2d26");

    votesLabels.selectAll("text").classed("yeartext", true);

    //Display total count of electoral votes won by the Democrat and Republican party
    //on top of the corresponding groups of bars.
    //HINT: Use the .electoralVoteText class to style your text elements;  Use this in combination with
    // chooseClass to get a color based on the party wherever necessary

    //Display a bar with minimal width in the center of the bar chart to indicate the 50% mark
    //HINT: Use .middlePoint class to style this bar.

    //Just above this, display the text mentioning the total number of electoral votes required
    // to win the elections throughout the country
    //HINT: Use .electoralVotesNote class to style this text element

    //HINT: Use the chooseClass method to style your elements based on party wherever necessary.

    //******* TODO: PART V *******
    //Implement brush on the bar chart created above.
    //Implement a call back method to handle the brush end event.
    //Call the update method of shiftChart and pass the data corresponding to brush selection.
    //HINT: Use the .brush class to style the brush.


  };


}
