<template>
    <div class="StreamGraphD32">
        <svg id="myChart"></svg>    
  </div>
</template>

<script>
/*
 * @author Jakob Andersen
 */

import DataStore from './../../data/DataStore'; 

export default {
  props: ['msg', 'data'],
  name: "StreamGraphD32",
  data: function() {
    return {
      color : d3.scale.category20c(),
      colorb : d3.scale.category10(),
      colorc : d3.scale.category20b(),
      // brush: {min : '', max : ''},
      brushExtend : '',
      chart: {
          // chart props
      }
    };
  },
  mounted: function() {
    this.initColors();
  },
  computed : {
      trigger : function () {
          return this.$store.state.keyDimSwitch;
          }
  },
  watch : {
      msg : function(newValue) {
         // this.redraw();
      },
      trigger : function() {
          // this.redraw();
      },
      data (newData) {
          d3.select("#myChart").selectAll("*").remove();  
          this.refresh(newData);
      }
  },
  methods: {
      brushed : function (extend, isEmpty) {
          this.$emit('streamGraphBrushExtend', extend);
          this.brushExtend = isEmpty ? [] : extend;
          this.$emit('streamBrush', this.brushExtend); 
      },
      initColors : function(d, i) { 
        DataStore.state.colorTopic['Politik'] = this.color(1);  // set colors
        DataStore.state.colorTopic['Wirtschaft'] = this.color(0)  // set colors
        DataStore.state.colorTopic['Kultur'] = this.color(3)  // set colors
        DataStore.state.colorTopic['Sport'] = this.color(2); 
        
        DataStore.state.colorTopic['Deutschland'] = this.colorb(5);  // set colors
        DataStore.state.colorTopic['Fußball'] = this.colorb(6)  // set colors
        DataStore.state.colorTopic['Literatur'] = this.colorb(9)  // set colors
        DataStore.state.colorTopic['Mittelstand'] = this.colorb(7); 
        DataStore.state.colorTopic['Märkte'] = this.colorb(4)  // set colors
        DataStore.state.colorTopic['Wintersport'] = this.colorb(12)  // set colors

        DataStore.state.colorTopic["Frida Müller"] = this.colorc(0);  // set colors
        DataStore.state.colorTopic['August Schröder'] = this.colorc(1)  // set colors
        DataStore.state.colorTopic['Karl Becker'] = this.colorc(2)  // set colors
        DataStore.state.colorTopic['Albert Seibert'] = this.colorc(3); 
      },
      getColors : function(d, i) {
          return DataStore.state.colorTopic[d.key];
      },
      onMouseOver : function(d) {
          d3.select(".tooltip").style("display", null);
      },
      onMouseOut : function(d) {
          d3.select(".tooltip").style("display", "none");
      }, 
      onMouseMove : function(d) {
          var xPos = d3.mouse(d3.select(".tooltip"))
      },
      refresh : function (data) {
          console.log('-  - init streamgraph')

            var margin = {top: 20, right: 20, bottom: 110, left: 40},
                width = 850 - margin.left - margin.right,
                height = 400 - margin.top - margin.bottom,
                marginMini = { top: 310, right: 20, bottom: 50, left: 40 },
                heightMini = 400 - marginMini.top - marginMini.bottom;

            var x = d3.time.scale().range([0, width]),
                xMin = d3.time.scale().range([0, width]);

            var y = d3.scale.linear().range([height, 0]),
                yMin = d3.scale.linear().range([heightMini, 0]);

            
            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");

            var xAxisMini = d3.svg.axis()
                .scale(xMin)
                .orient("bottom");

            var yAxis = d3.svg.axis()
                .scale(y)
                .tickFormat(d3.format("d"))
                .orient("left");

            var yAxisMini = d3.svg.axis()
                .scale(yMin)
                .orient("left");

            var brush = d3.svg.brush().x(xMin).on("brushend", brushed); // brushend brush

            this.$emit('brush', brush);

            var stack = d3.layout.stack()
                .values(function(d) { return d.values; })
                .x(function(d) { return d.date; })
                .y(function(d) { return d.value; })
                .offset("silhouette");

            var nest = d3.nest()
                .key(function(d) { return d.key; });

            var area = d3.svg.area()
                .interpolate("basis") 
                .x(function(d) { return x(d.date); })
                .y0(function(d) { return y(d.y0); })
                .y1(function(d) { return y(d.y0 + d.y); });

            var areaMini = d3.svg.area()
                .interpolate("basis")
                .x(function(d) { return xMin(d.date); })
                .y0(function(d) { return yMin(d.y0); })
                .y1(function(d) { return yMin(d.y0 + d.y); });

            var svg = d3.select("#myChart")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom);

            svg.append("defs").append("clipPath")
                .attr("id", "clip")
                .append("rect")
                .attr("width", width)
                .attr("height", height);

            var main = svg.append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            var mini = svg.append("g")
                .attr("transform", "translate(" + marginMini.left + "," + marginMini.top + ")");


            data.forEach(function(d) {
                d.date = new Date(d.date);
                d.value = +d.value;
            });

            var layers = stack(nest.entries(data));


            if(this.brushExtend.length > 0) {
                x.domain(this.brushExtend);
            } else {
                x.domain(d3.extent(data, function(d) { return d.date; }));
            }
            y.domain([0, d3.max(data, function(d) { return d.y0 + d.y; })]);

            xMin.domain(d3.extent(data, function(d) { return d.date; }));
            yMin.domain([0, d3.max(data, function(d) { return d.y0 + d.y; })]);

      
            main.selectAll(".layer")
                .data(layers)
                .enter().append("path")
                .attr("class", "layer")
                .style("fill", this.getColors)
                
                .attr("d", function(d) { return area(d.values); })



                .attr("clip-path", "url(#clip)")
                .on("mouseover", function() { tooltip.style("display", null); })
                .on("mouseout", function() { 
                    line.attr('stroke-width', 0);
                    tooltip.style("display", "none"); 
                    })
                .on("mousemove", function(d) {
                    var xPosition = d3.mouse(this)[0];
                    var yPosition = d3.mouse(this)[1] - 10;
                    tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
                    var i = x.invert(d3.mouse(this)[0]);
                    var t = new Date(i.getFullYear(), i.getMonth(), i.getDate()+1);
                    
                    var start = d.values[0].date;
                    var diff = diffDays(start, t);

                    var key = d.values[0].key;
                    var value = d.values[diff -1].value;

                    line.attr('x1', xPosition-1)
                        .attr('x2', xPosition-1)
                        .attr('stroke-width', 1);

                    //alert(x.range()[1]);

                    tooltip.select("text").text(key + ':' + value);

                    
                }) 

            // line
            var line = main.append('line')
                .attr('class', 'vertline')
                .attr('x1', 0) // TODO 
                .attr('x2', 0)
                .attr('y1', 0)
                .attr('y2', height)
                .attr('fill', false)
                .attr('stroke', 'rgba(100,150,200,0.8)')
                .attr('stroke-width', 0);

            mini.selectAll(".layerMini")
                .data(layers)
                .enter().append("path")
                .attr("class", "layerMini")
                .attr("d", function(d) { return areaMini(d.values); })
                .style("fill", this.getColors)

                //////

    	        var timeToopltip = mini.append("text")
                    .attr("x", 0)
                    .attr("y", -8)
                    .style("display", "none")
                    .attr("dy", "1.2em")
                    .style("text-anchor", "middle")
                    .attr("font-size", "12px")
                    .attr("font-weight", null)
                mini.on("mouseover", function() {  timeToopltip.style("display", null) })
                mini.on("mouseout", function() { timeToopltip.style("display", "none") })
                mini.on("mousemove", function(d) {
                    var i = xMin.invert(d3.mouse(this)[0]);
                    timeToopltip
                        .attr("x", d3.mouse(this)[0])
                        .text( i.getDate() + '.' + (i.getMonth()+1) + '.' + i.getFullYear())
                });

                //////////


            main.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

            mini.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + heightMini + ")")
                .call(xAxisMini);

            main.append("g")
                .attr("class", "y axis")
                .call(yAxis)

            // LAbel
             .append("text")
                .attr("class", "label")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Anzahl")

            mini.append("g")
                .attr("class", "x brush")
                .call(brush)
                .selectAll("rect")
                .attr("y", 0)
                .attr("height", heightMini - 1)
                

            // tooltip
            var tooltip = svg.append("g")
                .attr("class", "tooltip")
                
            var tooltip2 = svg.append("g")
                .attr("class", "tooltip2")

            tooltip.append("text")
                .attr("x", 15)
                .attr("dy", "1.2em")
                .style("text-anchor", "middle")
                .attr("font-size", "12px")
                .attr("font-weight", "bold");

            tooltip2.append("text")
                .attr("x", 15)
                .attr("dy", "1.2em")
                .style("text-anchor", "middle")
                .attr("font-size", "12px")
                .attr("font-weight", "bold");

            // tooltip end

            var  firstTime = false;
            if(this.brushExtend.length > 0) {
                firstTime = true;
                brush.extent(this.brushExtend);
                brush.event(d3.select(".brush").transition(0))
            } 

            var i = this;
            // END 

            function brushed () {
                var brushExtend = brush.extent();
                var isBrushEmpty = brush.empty();

                // Tage Runden
                var d1 = d3.time.day.floor(brushExtend[0]);
                var d2 = d3.time.day.floor(brushExtend[1]);
                if(d1.getTime() === d2.getTime()) {
                    d2 = d3.time.day.ceil(brushExtend[1]);
                }
                brushExtend = [d1, d2];

                i.brushed(brush.empty() ? [] : brushExtend);

                x.domain(isBrushEmpty ? xMin.domain() : brushExtend);
                //if(firstTime) {
                //    main.selectAll(".layer").attr("d", function(d) { return area(d.values); })
                //    main.select(".x.axis").call(xAxis);
                //} else {
                    main.selectAll(".layer").transition().duration(1000).attr("d", function(d) { return area(d.values); })
                    main.select(".x.axis").transition().duration(1000).call(xAxis);
                //}

                firstTime = false;

                // brush snap
                if(!isBrushEmpty) {
                    d3.select(this).transition().call(brush.extent(brushExtend));
                }

            }
            function diffDays(d1, d2) {
                var tv1 = d1.getTime();
                var tv2 = d2.getTime();
                return Math.round(((tv2 - tv1) / 1000 / 86400) -0.5);
            }

      }
  }
};
</script>

<style>


.nest {
    clip-path: url(#clip);
}

.brush .extent {
    stroke: #fff;
    fill-opacity: .125;
    shape-rendering: crispEdges;
}

.axis path,
.axis line {
  fill: none;
  stroke: #000;
  shape-rendering: crispEdges;
}

</style>