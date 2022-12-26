
<template>
    <div class="ScatterPlot">
        
        <div id="myScatterPlot">
            <svg></svg>
        </div>

  </div>
</template>

<script>

/*
 * @author Jakob Andersen
 */

export default {
  props: ['data'],
  name: "Streudiagramm",
  data: function() {
    return {
      selection : [],
      chart : {
          // chart props
      }
    };
  },
  watch : {
      data (newValue) {
          if(newValue[1]) {
              this.initChart(newValue[0]);
          } else {
              this.updateData(newValue[0]);
          }
      },
       selection : function(newValue) {
           this.$emit('selectedPoints', this.selection);
       }
  },
  methods: {
      brushEvent : function(d) {
        var minext = this.chart.brush.extent()[0];
        var maxext = this.chart.brush.extent()[1];
        var isBrushed = this.isBrushed; 

        var circleGroup = this.chart.svg.select('.circleGroup')

        if(this.chart.brush.empty()) {
            this.chart.svg.select('.circleGroup').selectAll("circle")
                .attr('class', 'brushed')    
        } else {
            circleGroup.selectAll("circle")
                .attr('class', 'non_brushed')
                .filter(function () {
                    var cx = d3.select(this).attr("cx"),
                        cy = d3.select(this).attr("cy");
                    return isBrushed(minext, maxext , cx, cy);
                })
                .attr('class', 'brushed');  
        }
          this.selection = circleGroup.selectAll(".brushed").data();
      },
      isBrushed(minext, maxext, cx, cy) {
        var x0 = this.chart.x(minext[0]),
            x1 = this.chart.x(maxext[0]),
            y0 = this.chart.y(maxext[1]),
            y1 = this.chart.y(minext[1]);
        return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;
      },
      updateData (data) {
          console.log('-  - update scatterplot')

          var svg = d3.select("#myScatterPlot svg")
          svg.select(".circleGroup").selectAll("*").remove();  

          svg.select(".circleGroup")
            .selectAll("circle")
            .data(data)
            .enter().append("circle")
            .attr("r", 3.5)
            .attr("cx", d => this.chart.x(d.sentiment) )
            .attr("cy", d => this.chart.y(d.votes) )
            .attr("class", "brushed");

         this.brushEvent();
      },
      initChart (data) {
        console.log('-  - redraw scatterplot')

        var margin = this.chart.margin = {top: 40, right: 30, bottom: 40, left: 30},
            width = this.chart.width = 330 - margin.left - margin.right,
            height = this.chart.width = 350 - margin.top - margin.bottom;

        var x = this.chart.x = d3.scale.linear().range([0, width]);
        var y = this.chart.y = d3.scale.linear().range([height, 0]);

        var xAxis = this.chart.xAxis = d3.svg.axis().scale(x).orient("bottom");
        var yAxis = this.chart.yAxis = d3.svg.axis().scale(y).orient("left");

        var svg = this.chart.svg = d3.select("#myScatterPlot svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        x.domain([-1,1]);
        y.domain([-25, 25]);
        //x.domain(d3.extent(data, function(d) { return d.sentiment; })).nice();
        //y.domain(d3.extent(data, function(d) { return d.votes; })).nice();

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("class", "label")
            .attr("x", width)
            .attr("y", -6)
            .style("text-anchor", "end")
            .text("Meinung");

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Empfehlung")
            
        svg.append("g")
            .attr("class", "circleGroup")
        .selectAll("circle")
            .data(data)
            .enter().append("circle")
            .attr("r", 3.5)
            .attr("cx", function(d) { return x(d.sentiment); })
            .attr("cy", function(d) { return y(d.votes); })
            .attr("class", "brushed");

        svg.append('line')
            .attr('class', 'sLine')
            .attr('x1', x(0))
            .attr('x2', x(0))
            .attr('y1', 0)
            .attr('y2', height)
            .attr('stroke', 'gray')
            .attr('stroke-width', 1)
            .attr('fill-opacity', .125)
            .attr('shape-rendering', "crispEdges")

        svg.append('line')
            .attr('class', 'sLine')
            .attr('x1', width)
            .attr('x2', 0)
            .attr('y1', y(0))
            .attr('y2', y(0))
            .attr('stroke', 'gray')
            .attr('stroke-width', 1)
            .attr('fill-opacity', .125)
            .attr('shape-rendering', "crispEdges")



            var leged = svg.append('g')
 
            leged.append('circle')
            .attr("class", "non_brushed")
            .attr("r", 3.5)
            .attr("cx",10)
            .attr("cy", -20)
            .style("fill", 'blue')
            .style("stroke", "none")

            leged.append('text')
                .attr("dx", 6 + 15)
                .attr("dy", -15)
                .style("text-anchor", "left")
                .attr("font-size", "12px")
                .attr("font-weight", "bold")
                .text('Kommentar')

            

        var instance = this;
        var brush = this.chart.brush = d3.svg
            .brush()
            .x(x)
            .y(y)
            .on("brushend", this.brushEvent);

        this.$emit('brush', this.chart.brush);

        var brushArea = this.chart.brushArea =  svg.append("g").attr("class", "brush").call(brush);
    }

  }
};
</script>

<style>

body {
  font: 10px sans-serif;
}

.axis path,
.axis line {
  fill: none;
  stroke: #000;
  shape-rendering: crispEdges;
}

.circle {
  stroke: #000;
}

.non_brushed {
   fill: #404040;
   opacity: 0.5;
}

.brushed {
    fill: blue;
    opacity: 0.5;
}

.extent {
  stroke: #fff;
  fill-opacity: .125;
  shape-rendering: crispEdges;
}

</style>

