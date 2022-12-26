<template>
    <div class="WordCloud">
        
        <div id="mywordcloud" class="deselect">
            <svg></svg>
        </div>
        
  </div>
</template>

<script>
/*
 * @author Jakob Andersen
 */
import wordData from './../../assets/worddata.json'
import './../../js/d3.layout.cloud';

import DataStore from './../../data/DataStore'; 

export default {
    props: ['data'],
  name: "D3WordCloud",
  data: function() {
    return {
      selection : '',
    };
  },
  computed : {

  },
  watch : {
    data : function(newValue) {
      this.refresh(wordData);
    }
  },
  methods: {

      refresh : function (data) {
      console.log('-  - redraw wordcloud')      
      
        var width = 1135
        var height = 250;

        var fill = d3.scale.category20();
        
        d3.layout.cloud().size([width, height])
            .words(data.map(d => ({ text: d.text, size: d.frequency })))
            .rotate(function() { return ~~(Math.random() * 2) * 1; })
            .font("Impact")
            .fontSize(function(d) { return d.size; })
            .on("end", draw)
            .start();

        function draw(words) {
            var svg = d3.select("#mywordcloud svg")
                
            var background = svg
                .append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", width)
                .attr("height", height)
                .style("fill", "white")
                .on("click", function() {
                    svg.selectAll('text').attr('fill-opacity', 1);
                })

            svg .attr("width", width)
                .attr("height", height)
            .append("g")
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
            .selectAll("text")
                .data(words)
            .enter().append("text")
                .style("font-size", function(d) { return d.size + "px"; })
                .style("font-family", "Impact")
                .style("cursor", "pointer")
                .style("fill", function(d, i) { return fill(i); })
                .attr("text-anchor", "middle")
                .attr("transform", function(d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                })
                .text(function(d) { return d.text; })
                .on("click", function(d) {
                    svg.selectAll('text').attr('fill-opacity', .19);
                    d3.select(this).attr('fill-opacity', 1);
                })
        }
    }
  }
};
</script>

<style>


.deselect ::selection {
    background: transparent;
    color: inherit;
}
.deselect ::-moz-selection {
    background: transparent;
    color: inherit;
}
.deselect {
    -ms-user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
}
</style>

</style>