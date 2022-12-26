<template>
    <div class="Donut">

        <div id="myDonutChart">
            <svg></svg >        
        </div>
        
  </div>
</template>

<script>
/*
 * @author Jakob Andersen
 */

import DataStore from './../../data/DataStore'; 

export default {
  props: ['msg', 'data'],
  name: "Donut",
  data: function() {
    return {
      selection : '',
      clicked: false,
      streamdata : '',
      brush: {min : '', max : ''},
      text: "Abb2: Aggregation von Abb. 1"
    };
  },
  watch : {
      data (newValue) {
          if(newValue[1]) {
            d3.select("#myDonutChart svg").selectAll("*").remove();   
            this.refresh(newValue[0]);
          }
          else {
            this.update(newValue[0])
          }
      }
  },
  methods: {
      onMouseOver : function (d) {
        if(this.clicked) return;

        this.selection = d.data.key;

        d3.selectAll('.layer').filter(function(dd) {
             return dd.key != d.data.key;
        }).attr('class', 'layer non_brushed_g');
        d3.selectAll('.layerMini').filter(function(dd) {
             return dd.key != d.data.key;
        }).attr('class', 'layerMini non_brushed_g');

        d3.select(".tooltipPie")
        .style("display", null)
        .select("text").text(d.data.key);

      },
      onMouseOut : function (d) {

         if(this.clicked) return;
         this.selection = '';

         d3.selectAll('.layer').attr('class', 'layer');
         d3.selectAll('.layerMini').attr('class', 'layerMini');


         d3.select(".tooltipPie").style("display", "none");
      },
      onClick : function(d) {

      },
      reset : function() {
          this.clicked = false;
          this.onMouseOut();
      },
      getColor : function (d) {
        return DataStore.state.colorTopic[d.data.key];
      },
      update (data) {
        console.log('-  - update dounut')
            
            var width = 200,
                height = 200,
                radius = Math.min(width, height) / 2;

            var svg = d3.select("#myDonutChart svg");

            var pie = d3.layout.pie()
                .sort(null)
                .value(function(d) { return d.value; });

            var arc = d3.svg.arc()
                .outerRadius(radius - 10)
                .innerRadius(radius - 50);
            

            function arcTween(a) {
                var i = d3.interpolate(this._current, a);
                this._current = i(0);
                return function(t) {
                    return arc(i(t));
                };
            }

            function labelarcTween(a) {
                var i = d3.interpolate(this._current, a);
                this._current = i(0);
                return function(t) {
                    return "translate(" + arc.centroid(i(t)) + ")";
                };
            }

            var path = svg.selectAll("path")
                .data(pie(data));
                
                path.transition().duration(1000).attrTween("d", arcTween);

            var text = svg.selectAll(".arc text")
                .data(pie(data))
                .text(function(d) { return d.data.value == 0 ? ' ' : d.data.value ; })       
                .transition().duration(1000).attrTween("transform", labelarcTween);
                  

      },
      refresh : function (data) {
            console.log('-  - init dounut')
            var width = 200,
                height = 200,
                radius = Math.min(width, height) / 2;

            var pie = d3.layout.pie()
                .sort(null)
                .value(function(d) { return d.value; });

            var arc = d3.svg.arc()
                .outerRadius(radius - 10)
                .innerRadius(radius - 50);

            var svg = d3.select("#myDonutChart svg")
                .attr("width", width + 40)
                .attr("height", 350) 
                .append("g")
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

            data.forEach(function(d) {
                d.value = +d.value;
                return d;
            });

            var g = svg.selectAll(".arc")
                .data(pie(data))
                .enter().append("g")
                .attr("class", "arc");

            g.append("path")
                .style("fill", this.getColor)
                .each(function(d) { this._current = d})
                .transition()
                .delay(function(d, i) { return i * 150; })
                .attrTween('d', function(d) {
                    if(d.value == 0) return 0;
                    var i = d3.interpolate(d.startAngle+0.1, d.endAngle);
                    return function(t) {
                        d.endAngle = i(t);
                        return arc(d);
                    }
                });

            var tooltip = svg.append("g")
                .attr("class", "tooltipPie")
                .style("display", "none")
                .attr("x", width / 2)
                .attr("y", height / 2)

            tooltip.append("text")
                .attr("dy", "5")
                 .attr("dx", "0")
                .style("text-anchor", "middle")
                .attr("font-size", "12px")
                .attr("font-weight", "bold");

            g.append("text")
                .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
                .attr("dy", ".35em")
                .transition()
                .delay(function(d, i) { return i * 200; })
                .text(function(d) { return d.value == 0 ? ' ' : d.data.value ; })
                .each(function(d) { this._current = d }); // init
            
            g.on('mouseover', this.onMouseOver);
            g.on('mouseout', this.onMouseOut);
            g.on('click', this.onClick);



            var legendG = svg.selectAll(".legend") 
                .data(pie(data))
                .enter().append("g")
                .filter(d => d.value > 0)
                .attr("transform", function(d,i){
                    return "translate(" + -90 + "," + (i * 20 + height - 110) + ")";
                })
                .attr("class", "legend");   

                legendG.append("rect") 
                .attr("width", 15)
                .attr("height", 15)
                .attr("fill", this.getColor);

                legendG.append("text") 
                .text(function(d){
                    return d.data.key;
                })
                .style("font-size", 13)
                .attr("y", 10)
                .attr("x", 20);
      }, 
  }
};
</script>

<style>

.arc text {
  font: 10px sans-serif;
  text-anchor: middle;
}

.arc path {
  stroke: #fff;
}

#myDonutChart {
    margin-top: -20px;
    margin-left: 30px;
}

.non_brushed_g {
            opacity: 0.1;
        }

</style>