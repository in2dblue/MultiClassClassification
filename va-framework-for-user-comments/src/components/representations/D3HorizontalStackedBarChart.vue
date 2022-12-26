<template>
    <div class="Donut">

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
  props: ['msg', 'data', 'color'],
  name: "Donut",
  mode : false,
  data: function() {
    return {
      selection : [],
      chart : {
          // chart props
      }
    };
  },
  mounted: function() {
    this.refresh(this.data.slice(0));
  },
  watch : {
       data (newValue) {
           
           this.mode = newValue[1];
           if(this.mode) {                
                this.selection = [];
                this.update(newValue[0].slice(0));
           } else {
               this.update(newValue[0].slice(0));
           }  
       },
       selection (newValue) {
           if(!this.mode) {
            this.$emit('selection', newValue);
           }
       }
  },
  methods: {
      clickEvent (d) {
        this.mode = false;
        this.$emit('click');

        var el = d;
    
        var i = this.selection.indexOf(el);
           if(i == -1) {
               if(this.chart.countRect == this.selection.length + 1) {
                   this.selection = [];
               } else
                    this.selection.push(el);
            } else {
               this.selection.splice(i, 1);
            }

            var allRect = this.chart.state.selectAll("rect")
            var allText = this.chart.legend.selectAll("text")

            if(this.selection.length == 0) {
                allRect.attr('fill-opacity', 1)
                allText.attr("class", "sel")
            } else {
                allRect
                    .attr('fill-opacity', 1)
                    .filter(d => this.selection.indexOf(d.name) == -1 )
                    .attr('fill-opacity', 0.1)
                allText
                    .attr("class", "sel")
                    .filter(d => this.selection.indexOf(d) == -1 )
                    .attr("class", "notsel")
            }

       },
      update (d) {
        
        console.log('-  - update stacked barchart')

        var color = this.chart.color;
        var x = this.chart.x;
        var y = this.chart.y;
        var svg = this.chart.svg;

        d.forEach(function(d) {
            var y0 = 0;
            d.value = color.domain().map(function(name) { return {
                name: name, 
                y0: y0, 
                y1: y0 += +d[name]}; });
            d.total = d.value[d.value.length - 1].y1;
        });

        x.domain([0, d3.max(d, function(d) { return d.total; })]);


        svg.selectAll('.g').remove();

        var state = this.chart.state = svg.selectAll(".state")
            .data(d)
            .enter().append("g")
            .attr("class", "g")
            .attr("transform", function(d) { return "translate(0," + y(d.type) + ")"; });

        state.selectAll("rect")
            .data(function(d) { return d.value; })
            .enter().append("rect")
            .attr("height", y.rangeBand())
            .attr("x", function(d) { return x(d.y0); })
            .attr("width", function(d) { return x(d.y1) - x(d.y0); })
            .style("cursor", "pointer")
            .style("fill", function(d) { return color(d.name); })
           // .on('dblclick', d => dblClickEvent(d.name))
            .on('click', d => this.clickEvent(d.name))
            .attr('fill-opacity', d => {
                if(this.selection.length == 0) {
                    return 1
                } else {
                    return this.selection.indexOf(d.name) == -1 ? 0.2 : 1;
                }
            })

            if(this.selection == 0) {
                this.chart.legend.selectAll("text").attr('class', 'sel')
            }
            

            state.selectAll("text")
            .data(function(d) { return d.value; })
            .enter()
            .append("text")
                    .style("cursor", "pointer")
                    .attr("x", 10)
                    .attr("y", 23)
                    .attr("dx",function(d) { return x(d.y0); })
                    .attr("dy", ".35em")
                    .attr("text-anchor", "left")
                    .text(d => { var x = d.y1 - d.y0; return x > 0 ? x : ''; } )
      
      },
      refresh (data) {
          console.log('draw horizonatlbarchart') 
          
        var margin = {top: 30, right: 70, bottom: 0, left: 100},
            width = 1100 - margin.left - margin.right,
            height = 90 - margin.top - margin.bottom;

        var y = this.chart.y = d3.scale.ordinal()
            .rangeRoundBands([height, 0], .1);

        var x = this.chart.x = d3.scale.linear()
            .rangeRound([0, width]);

        var color = this.chart.color = d3.scale.ordinal()
            .range(this.color);

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

        var svg = this.chart.svg = d3.select("#" + this.msg + " svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        color.domain(d3.keys(data[0]).filter(function(key) { return key !== "type"; }));

        data.forEach(function(d) {
            var y0 = 0;
            d.value = color.domain().map(function(name) { return {
                name: name, 
                y0: y0, 
                y1: y0 += +d[name]}; });
            d.total = d.value[d.value.length - 1].y1;
        });

        y.domain(data.map(function(d) { return d.type; }));
        x.domain([0, d3.max(data, function(d) { return d.total; })]);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)

        var state = this.chart.state = svg.selectAll(".state")
            .data(data)
            .enter().append("g")
            .attr("class", "g")
            .attr("transform", function(d) { return "translate(0," + y(d.type) + ")"; });

        this.chart.countRect = 0;
        var selection = this.selection;

        state.selectAll("rect")
            .data(function(d) { return d.value; })
            .enter().append("rect")
            .attr("height", y.rangeBand())
            .attr("x", d => { this.chart.countRect ++; return x(d.y0); })
            .attr("width", function(d) { return x(d.y1) - x(d.y0); })
            .style("cursor", "pointer")
            .style("fill", function(d) { return color(d.name); })
           // .on('dblclick', d => dblClickEvent(d.name))
            .on('click', d => this.clickEvent(d.name))


        var legend = this.chart.legend = svg.selectAll(".legend")
            .data(color.domain().slice().reverse())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", (d, i) => "translate(" + (  (this.chart.countRect  - 1 - i) * 140) + ",-20)")
            .style("cursor", "pointer")
           //.on('dblclick', this.dblClickEvent)
            .on('click', this.clickEvent)
            
        legend.append("rect")
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color);

        legend.append("text")
            .attr("x", 20)
            .attr("y", 8)
            .attr("dy", ".35em")
            .text(function(d) { return d; });

        function dblClickEvent (d) {
                var el = d;
                var newSelection = [el]
                if(selection == newSelection) return;

                selection.length = 0;
                selection.push(el);

                var allRect = state.selectAll("rect")
                var allText = legend.selectAll("text")
                allRect
                    .attr('fill-opacity', 0.2)
                    .filter(d => el == d.name)
                    .attr('fill-opacity', 1)
                allText
                    .attr("class", "notsel")
                    .filter(d => el == d )
                    .attr("class", "sel")
        }

            }
        }
    };
</script>

<style>

.notsel {
    text-decoration: line-through;
}



</style>

