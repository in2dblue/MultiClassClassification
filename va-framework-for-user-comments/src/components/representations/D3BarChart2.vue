<template>
    <div class="barChart2">

        <div v-bind:id="msg">
            <svg></svg >
        </div>

  </div>
</template>

<script>

/*
 * @author Jakob Andersen
 */

export default {
  props: ['msg', 'data', 'close'], 
  name: "barChart2",
  data: function() {
    return {
      selection : [],
      brushSelection : [],
      oldBrush: null,
    };
  },
  watch : {
       close (newValue) {
            var svg = d3.select("#" + this.msg + " svg");
            svg
            .select(".barMiniContainer")
            .selectAll("rect")
            .filter(d => d.key == newValue)
            .attr("class", d => this.brushSelection.indexOf(newValue) > -1 == "barMiniBrushed" ? "barMini" : "");   
       },
       selection (newValue) {
           this.$emit('barSelection', newValue);
           this.$emit('clickEvent')

            // entferne Farbe
            var svg = d3.select("#" + this.msg + " svg");
            svg
            .select(".barContainer")
            .selectAll("rect")
            .filter(d => newValue.indexOf(d.key) == -1)
            .attr("class", "bar");    

            if(newValue.length == 0) {
                var svg = d3.select("#" + this.msg + " svg");
            svg
            .select(".barMiniContainer")
            .selectAll("rect")
            .attr("class", d => d == "barMiniBrushed" ? "barMini" : "");   
            }
       },
       data (newValue) {
           this.refresh(newValue);
       }
  },
  methods: {
      refresh (data) {
           console.log('-  - redraw barchart')

            d3.select("#" + this.msg + " svg").selectAll("*").remove();

            var clicked = this.selection;

            var margin = {top: 10, right: 120, bottom: 30, left: 100},
                width = 600 - margin.left - margin.right,
                height = 300 - margin.top - margin.bottom;

            var marginMini = {top: 0, right: 0, bottom: 0, left: 90},
                widthMini = 50;

            var xMax = d3.max(data, function(d) { return d.value; });
            var xSum= d3.sum(data, function(d) { return d.value; });

            var x = d3.scale.linear().range([0, width]);
            var y = d3.scale.ordinal().rangeRoundBands([0, height], .1);
            var yAll = d3.scale.ordinal().rangeRoundBands([0, height], .1);

            var xMini = d3.scale.linear().range([0, widthMini]);
            var yMini = d3.scale.ordinal().rangeRoundBands([0, height], .1);

            var xAxis = d3.svg.axis().scale(x).orient("bottom").tickFormat(d => Math.round(d*100/xSum) + "%" ); //.tickFormat(d3.format(".0%")); // d3.format(".0%")
            var yAxis = d3.svg.axis().scale(y).orient("left");

            var brush = d3.svg.brush().y(yMini).on("brush", brushed); // brushend brush

            var svg = d3.select("#" + this.msg + " svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)

            var main = svg.append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            var mini = svg.append("g")
                .attr("transform", "translate(" + marginMini.left + "," + margin.top + ")");

            
            x.domain([0, xMax]);
            y.domain(data.map(function(d) { return d.key; }));
            yAll.domain(data.map(function(d) { return d.key; }));

            xMini.domain([0, xMax]);
            yMini.domain(data.map(function(d) { return d.key; }));

            main.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

            main.append("g")
                .attr("class", "y axis")
                .call(yAxis);

            var barContainer = main.append("g")
                .attr("class", "barContainer");

            if(this.oldBrush != null) {
                
                var initBrush = data.slice(0, 5).map(d => d.key);
                brush.extent([this.oldBrush[0], this.oldBrush[0] + yMini(initBrush.pop())]);
            } else {
                var initBrush = data.slice(0, 5).map(d => d.key);
                brush.extent([0, yMini(initBrush.pop())]);
            }

            drawMainChart(data);   

            var miniBarContainer = mini.append("g")
                .attr("class", "barMiniContainer");
        
            var barMini = miniBarContainer.selectAll("bar")
                .data(data)
                .enter().append("g")
                .attr("class", "barMiniBrushed")
                .attr("data-key", function(d) { return d.key } )
                .attr("transform", function(d) { return "translate(400," + yMini(d.key) + ")"; });
                
                barMini.append("rect")
                .attr("width", function(d) { return xMini(d.value); })
                .attr("height", yMini.rangeBand())
                .filter(function(d) {
                    return clicked.indexOf(d.key) > -1
                })
                .attr("class", "barSelected");

                mini.append("g")
                .attr("class", "y brush")
                .call(brush)
                .selectAll("rect")
                .attr("x", 400 - 1)
                .attr("width", widthMini + 2);
                        
                brush.event(mini.select(".brush").transition(0))

            function drawMainChart(data) {
                var bar = barContainer.selectAll("bar")
                    .data(data)
                    .enter().append("g")
                    .attr("transform", function(d) { return "translate(0," + y(d.key) + ")"; })
                    .attr("data-key", function(d) { return d.key } )
                    .on("click", click)

                bar.append("rect")
                    .attr("class", "bar")
                    .style("cursor", "pointer")
                    .attr("width", function(d) { return x(d.value); })
                    .attr("height", y.rangeBand())
                    .filter(function(d) { return clicked.indexOf(d.key) > -1; })
                    .attr("class", "barSelected");
                
                bar.append("text")
                    .attr("class", "value")
                    .style("cursor", "pointer")
                    .attr("x", 5)
                    .attr("y", y.rangeBand() / 2)
                    .attr("dx", -3)
                    .attr("dy", ".35em")
                    .attr("text-anchor", "left")
                    .text(function(d) { return d.value; }) 
            }
            
            function click() {
                var el = d3.select(this).attr("data-key");
                var i = clicked.indexOf(el); 
                if(i > -1) {
                    d3.select(this).select('rect').attr("class", "bar");
                    clicked.splice(i, 1);
                } else {
                    d3.select(this).select('rect').attr("class", "barSelected");
                    clicked.push(el);
                }

                miniBarContainer.selectAll("rect")
                    .attr("class", "b")
                    .filter(function(d) {
                        return clicked.indexOf(d.key) > -1
                    })
                    .attr("class", "barSelected");
            }

            var instance = this;
            function brushed() {

                var brushExtend;

                if(brush.empty()) {
                    var size = instance.oldBrush[1] - instance.oldBrush[0],
                        range = yMini.range(),
                        y0 = d3.min(range) + size / 2,
                        y1 = d3.max(range) + yMini.rangeBand() - size / 2,
                        center = Math.max( y0, Math.min( y1, d3.mouse(this)[1]))                 

                         brushExtend = instance.oldBrush =  [center - size / 2, center + size / 2];
                         brush.extent([center - size / 2, center + size / 2]);
                         brush(d3.select("#" + instance.msg + " svg").select(".brush").transition());

                         console.log(brushExtend)
                } else {    
                    brushExtend = instance.oldBrush =  brush.extent();
                }


                var selected  = yMini.domain().filter(function(d) {
                    return (brushExtend[0] <= yMini(d)) && (yMini(d) <= brushExtend[1]);
                });

                instance.brushSelection = selected;

                var currentDomain = '';
                var currentData = '';
                
                if(selected.length == 0) {
                   // currentDomain = yAll.domain();
                   // currentData = data;
                } else {
                    currentDomain = selected;
                    currentData = data.filter(d => selected.indexOf(d.key) > -1);
                

                // Update achse
                y.domain(currentDomain);
                main.select(".y.axis").call(yAxis); 

                // Update dom
                main.select(".barContainer").selectAll("*").remove();

                drawMainChart(currentData);
        
                // einfärben
                miniBarContainer.selectAll("g")
                    .attr("class", "barMini")
                    .filter(function() {
                        if(selected.length == 0) return true;
                        var key = d3.select(this).attr("data-key");
                        return selected.indexOf(key) > -1
                    })
                    .attr("class", "barMiniBrushed")

                }
                   
            }
      }
  }
};
</script>

<style>
.bar {
  fill: steelblue;
}

.barSelected {
    fill: darkgreen;
}

.barMini {
  fill: #dfdede;
}

.barMiniBrushed {
  fill: steelblue;
}

.axis text {
  font: 10px sans-serif;
}

.axis path,
.axis line {
  fill: none;
  stroke: #000;
  shape-rendering: crispEdges;
}

.y.axis path {
  display: none;
}

.bar text.value {
  fill: white;
}
</style>