<template>
    <div class="LineChart">
        
        <h1>{{ text }}</h1>
        <div id="myLineChart">
            <svg></svg>
        </div>


  </div>
</template>

<script>
/*
 * @author Jakob Andersen
 */

import DataStore from './../store/DataStore'; 

export default {
  name: "LineChart",
  data: function() {
    return {
      streamdata: "",
      brush: { min: "", max: "" },
      text: "LineChart"
    };
  },
  mounted: function() {
    this.refresh(this.computeData());
  },
  computed: {
    changTrigger : function() {
        return this.$store.state.timeDimSwitch;
    },
    changTrigger2 : function() {
        return this.$store.state.keyDimSwitch;
    }
  },
  watch: {
    changTrigger () {
        d3.select("#myLineChart svg").selectAll("*").remove();
        this.refresh(this.computeData());
     },
     changTrigger2 () {
        d3.select("#myLineChart svg").selectAll("*").remove();
        this.refresh(this.computeData());
     }
  },
  methods: {
    brushed(extend, isEmpty) {
      if(isEmpty) {
        this.brush = null;
        DataStore.state.lineChartBruch = null;
      } else {
        this.brush = extend;
        DataStore.state.lineChartBruch = extend;
      }
      this.$store.state.timeDimSwitchLineChart = !this.$store.state.timeDimSwitchLineChart;
    },
    computeData() {
      var times = ['01/01/18', '01/02/18', '01/03/18', '01/04/18', '01/05/18', '01/06/18', '01/07/18', '01/08/18', '01/09/18', '01/10/18', '01/11/18', '01/12/18', '01/13/18', '01/14/18', '01/15/18', '01/16/18', '01/17/18', '01/18/18', '01/19/18', '01/20/18', '01/21/18', '01/22/18', '01/23/18', '01/24/18', '01/25/18', '01/26/18', '01/27/18', '01/28/18'];

      for(var i = 0; i < times.length; i++) {
          var date = times[i].split('/'); 
          times[i] = new Date('20' + date[2], date[0], date[1]).toISOString();
      }
      
      var brushExtend = DataStore.state.streamBrush;

      if(brushExtend != null) {
        times = times.filter(e => e >= brushExtend[0].toISOString() && e <= brushExtend[1].toISOString())
      }
      
      var objectComments = DataStore.state.cfComments.all.allFiltered()

      var objectSentiment = [];
      for (var d = 0; d < times.length; d++) {
          var obj = {};
          obj.date = times[d];
          obj.pos = 0;
          obj.neg = 0;
          obj.neu = 0;
          objectComments
          .filter(e => e.timeStamp == times[d])
          .forEach(e => {
              if(e.sentiment > 0) {
                  obj.pos++;
              } else if (e.sentiment < 0) {
                  obj.neg++
              } else {
                  obj.neu++;
              }
            } 
          );
          objectSentiment.push(obj)
      }

      return objectSentiment;
    },
    refresh: function(data) {
      console.log(data);

      var margin = { top: 10, right: 10, bottom: 40, left: 40 },
        width = 650 - margin.left - margin.right,
        height = 350 - margin.top - margin.bottom;

      var color = d3.scale.category10();

      var parseDate = d3.time.format("%Y%m").parse;

      var x = d3.time.scale().range([0, width]),
          y = d3.scale.linear().range([height, 0]);

      var xAxis = d3.svg
          .axis()
          .scale(x)
          .orient("bottom"),
        yAxis = d3.svg
          .axis()
          .scale(y)
          .orient("left");

      var brush = d3.svg
        .brush()
        .x(x) // x2
        .on("brush", brush);

      var line = d3.svg
        .line()
        .defined(function(d) { return !isNaN(d.yValue); })
        .interpolate("monotone") // cubic
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.yValue); });

      var svg = d3
        .select("#myLineChart svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

      svg
        .append("defs")
        .append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height);

      var context = svg
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      //var data = myData;

      color.domain(
        d3.keys(data[0]).filter(function(key) {
          return key !== "date";
        })
      );

      data.forEach(function(d) {
        d.date = new Date(d.date);
      });


      var sources = color.domain().map(function(name) {
        return {
          name: name,
          values: data.map(function(d) {
            return { date: d.date, yValue: +d[name], name: name };
          })
        };
      });

      x.domain( d3.extent(data, function(d) { return d.date; }));
      y.domain([ d3.min(sources, function(c) {
          return d3.min(c.values, function(v) {
            return v.yValue;
          });
        }),
        d3.max(sources, function(c) {
          return d3.max(c.values, function(v) {
            return v.yValue;
          });
        })
      ]);

      var contextlineGroups = context
        .selectAll("g")
        .data(sources)
        .enter()
        .append("g");

      var contextLines = contextlineGroups
        .append("path")
        .attr("class", "line")
        .attr("stroke-width", "1.5")
        .attr("d", function(d) { return line(d.values); })
        .style("stroke", function(d) {
           if(d.name == "pos") return 'green';
           if(d.name == "neg") return 'red';
           return 'black';
           })
        .append("circle")
          .attr("r", 5)
          .attr("fill-opacity", .50)
          .attr("cx", function(d) { console.log(d); return x(d.date); } )
          .attr("cy", function(d) { return y(d.yValue); })
          .style("fill", function(d) {
           if(d.name == "pos") return 'green';
           if(d.name == "neg") return 'red';
           return 'white';
           });


      context
        .append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    context
        .append("g")
        .attr("class", "y axis")
        .call(yAxis);

      context
        .append("g")
        .attr("class", "x brush")
        .call(brush)
        .selectAll("rect")
        .attr("y", -1)
        .attr("height", height);



      
      var i = this;
      function brush() {
        i.brushed(brush.extent(), brush.empty());
      }
    }
  }
};
</script>

<style>


svg {
  font: 10px sans-serif;
}
 
 
.axis path,
.axis line {
  fill: none;
  stroke: #000;
  shape-rendering: crispEdges;
}

.y.axis path {
  fill: none;
  stroke: #000;
  shape-rendering: crispEdges;
}


.line {
  fill: none;
}

</style>