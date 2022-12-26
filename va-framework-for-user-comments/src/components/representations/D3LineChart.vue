<template>
    <div class="LineChart">
        <input type="checkbox"  checked="checked" id="myCheckbox" style="display:inline; position:absolute; top:15px; right: 15%;cursor:pointer;">     
        <label style="display:inline; position:absolute; top:15px; right: 5%;font-size:12px;font-weight:bold;">Kumuliert</label>

        <div id="myLineChart">
            <svg></svg>
        </div>
              
  </div>
</template>

<script>
export default {
  props: ['data'],
  name: "LineChart",
  data: function() {
    return {
      selection: [],
      brush: [],
      checkbox : true,
      chart: {
        // chart props
      }
    };
  },
  mounted: function() {
    d3.select("#myCheckbox").on("change", this.onCheckBox);

  },
  computed: {
    getBrushIntervall() {
      var b = this.brush;
      if(b.length != 0) {
      return this.format(b[0]) + " - " + this.format(b[1]);
      }
    }
  },
  watch: {
    data(newValue) {
      d3.select("#myLineChart svg").selectAll("*").remove();
      if(newValue[1]) {
        this.refresh(newValue[0], this.brush);
      } else {
        this.refresh(newValue[0], []);
      }
      
    }
  },
  methods: {
    onCheckBox() {
      d3.select("#myLineChart svg").selectAll("*").remove();
      this.checkbox = d3.select("#myCheckbox").property("checked");
      this.refresh(this.data[0], this.brush);
    },
    format (time) {
              return time.getDate() + '.' + (time.getMonth() + 1) + "." + time.getFullYear();
    },
    brushEvent() {
      var extend = this.chart.brush.extent();
      var isEmpty = this.chart.brush.empty();

      if(isEmpty) {
        this.$emit('lineChartBrush', []);
        this.brush = [];
        d3.select('.brushField')
                .text("")
      } else {
        this.$emit('lineChartBrush', extend);

        this.brush = extend;
        d3.select('.brushField')
                .text(this.getBrushIntervall)
      }
    },
    refresh: function(data, brush) {

      console.log('-  - redraw linechart')
      var margin = this.chart.margin = { top: 40, right: 25, bottom: 40, left: 25 },
          width = this.chart.width = 720 - margin.left - margin.right,
          height = this.chart.height = 350 - margin.top - margin.bottom;

      var color = d3.scale.category10();

      var x = this.chart.x = d3.time.scale().range([0, width]),
          y = this.chart.y = d3.scale.linear().range([height, 0]),
          y2 = this.chart.y2 = d3.scale.linear().range([height, 0]);

      var xAxis = d3.svg.axis().scale(x).orient("bottom"),
          yAxis = d3.svg.axis().scale(y).orient("left").tickFormat(d3.format("d")),
          yAxis2 = d3.svg.axis().scale(y2).orient("right").ticks(3).tickFormat(d3.format(".1f"))
         // .innerTickSize(-width)


      if(brush.length > 0) {
        
      } else { 
        this.chart.brush = d3.svg.brush().x(x).on("brushend", this.brushEvent);
        this.$emit('brush', this.chart.brush);
      }

      var line = d3.svg.line().defined(d => !isNaN(d.yValue)).interpolate("monotone")
        .x(d => x(d.date) )
        .y(d => y(d.yValue));

      var line2 = d3.svg.line().defined(d => !isNaN(d.yValue)).interpolate("monotone")
        .x(d => x(d.date) )
        .y(d => y2(d.yValue));

      var svg = this.chart.svg = d3
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
        .attr('class', 'contextGroup')
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



      color.domain(
        d3.keys(data[0]).filter(key => key !== "date")
      );

      var sources = this.chart.sources = color.domain().map(function(name) {
        return {
          name: name,
          values: data.map((d, i) => {
           return ({ 'date': d.date, 'yValue': d[name] , 'name': name }) 
          })
        
        }
      });
      
      // Kummulieren
      if(this.checkbox) {
      for(var i = 0; i < sources.length; i++) {
          sources[i].values.forEach((d, j) => {
            d.yValue = j > 0 ? sources[i].values[j - 1].yValue + d.yValue : d.yValue;
          })

        }
      }

 
      var sourcesDiff = [{
        name: 'dif',
        values: []
      }];
    
      sources[0].values.forEach((e, i) => {
        sourcesDiff[0].values[i] = ({ 'date': e.date, 'yValue' : e.yValue / ( e.yValue + sources[1].values[i].yValue), 'name':'diff'}) 
      });

      x.domain(d3.extent(data, d => d.date));
      y.domain([
        d3.min(sources, c => d3.min(c.values, v => v.yValue )),
        d3.max(sources, c => d3.max(c.values, v => v.yValue ))
      ]);

      y2.domain([
        0, 1
      ]);

      var contextlineGroups = context
        .selectAll("g")
        .data(sources)
        .enter()
        .append("g")
        .attr("class", "contentGroup");

    var contextlineDif = context
        .selectAll("gg")
        .data(sourcesDiff)
        .enter()
        .append("g")
        .attr("class", "contentDiff");

      var contextLines = contextlineGroups
        .append("path")
        .attr("class", "line")
        .attr("stroke-width", "1.5")
        .style("stroke", function(d) {
           if(d.name == "pos") return 'green';
           if(d.name == "neg") return 'red';
           return 'black';
        })
        .attr("d", function(d) { return line(d.values); })
        
      var contextLinesDif = contextlineDif
        .append("path")
        .attr("class", "line")
        .attr("stroke-width", "2")
        .style("stroke", function(d) {
           if(d.name == "pos") return 'green';
           if(d.name == "neg") return 'red';
           return 'orange';
        })
        .attr("d", function(d) { return line2(d.values); })


      contextlineGroups.selectAll("circle")
          .data(function(d) { return d.values; })
        .enter().append("circle")
        .filter(function(d) {return d.yValue > 0 })
          .attr("r", 5)
          .attr("fill-opacity", .5)
          .attr("cx", function(d) { return x(d.date); } )
          .attr("cy", function(d) { return y(d.yValue); })
          .style("fill", function(d) {
            if(d.name == "pos") return 'green';
            if(d.name == "neg") return 'red';
          // andere nicht
          });


      context
        .append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("Zeit");

    context
        .append("g")
        .attr("class", "y axis")
      .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")

        .text("Anzahl")

      context
        .append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + width + " ,0)")
      .call(yAxis2)
        .append("text")
        .attr("class", "label2")
        .attr("transform", "rotate(-90)")
        .attr("y", -12)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .style("stroke", "orange")
        .text("Anteil")
 
      var bbb = context
        .append("g")
        .attr("class", "x brush")
      .call(this.chart.brush)
        .selectAll("rect")
        .attr("y", -1)
        .attr("height", height);

        svg.append('line')
            .attr('class', 'sLine')
            .attr('x1', width+ margin.right)
            .attr('x2', margin.right)
            .attr('y1', y2(0) / 2 + margin.top)
            .attr('y2', y2(0) / 2 + margin.top)
            .attr('stroke', 'gray')
            .attr('stroke-width', 1)
            .attr('fill-opacity', .125)
            .attr('shape-rendering', "crispEdges")

        svg.append('line')
            .attr('class', 'sLine')
            .attr('x1', width+ margin.right)
            .attr('x2', margin.right)
            .attr('y1', (y2(0) / 2 ) * 1.5 + margin.top)
            .attr('y2', (y2(0) / 2 ) * 1.5 + margin.top)
            .attr('stroke', 'gray')
            .attr('stroke-width', 1)
            .attr('fill-opacity', .125)
            .attr('shape-rendering', "crispEdges")
        
        svg.append('line')
            .attr('class', 'sLine')
            .attr('x1', width+ margin.right)
            .attr('x2', margin.right)
            .attr('y1', (y2(0) / 2) * 0.5 + margin.top) 
            .attr('y2', (y2(0) / 2) * 0.5 + margin.top) 
            .attr('stroke', 'gray')
            .attr('stroke-width', 1)
            .attr('fill-opacity', .125)
            .attr('shape-rendering', "crispEdges")

            svg.append('line')
            .attr('class', 'sLine')
            .attr('x1', width+ margin.right)
            .attr('x2', margin.right)
            .attr('y1', margin.top) 
            .attr('y2', margin.top) 
            .attr('stroke', 'gray')
            .attr('stroke-width', 1)
            .attr('fill-opacity', .125)
            .attr('shape-rendering', "crispEdges")


           var legendData = [
             {
             name: 'Pro',
             color: 'green',
             circle: true,
           },
           {
             name: 'Kontra',
             color: 'red',
             circle: true,
           },
           {
             name: 'Pro Anteil',
             color: 'orange',
             circle: false,
           },
           ]

            var leged = svg.append('g')
            .selectAll('circle')
            .data(legendData)

            leged.enter().append('circle')
            .attr("r", 5)
            .attr("fill-opacity", .5)
            .attr("cx",(d,i) => margin.right + 15 * i * 10 + 15)
            .attr("cy", margin.right - 5)
            .style("fill", d => d.circle ? d.color : 'none')
            .style("stroke", "none")

            leged.enter().append('line')
            .attr('x1',(d, i) =>  margin.right + 15 * i * 10)
            .attr('x2', (d,i) => margin.right + 30 + 15 * i * 10)
            .attr('y1', margin.top -20) 
            .attr('y2', margin.top - 20) 
            .style('stroke', d => d.color)
            .style("stroke-width", "2")
            .style('shape-rendering', "crispEdges")

            leged.enter().append('text')
                .attr("dx",(d, i) =>  margin.right + 15 * i * 10 + 40)
                .attr("dy", margin.right)
                .style("text-anchor", "left")
                .attr("font-size", "12px")
                .attr("font-weight", "bold")
                .text(d => d.name)


            leged.enter().append('text')
                .attr('class', 'brushField')
                .attr("dx",margin.right + 15 * 3 * 10 + 35)
                .attr("dy", margin.right)
                .style("text-anchor", "middle")
                .attr("font-size", "12px")
                .attr("font-weight", "bold")
                 

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


.y.axis2 path {
  fill: none;
  stroke: none;
  shape-rendering: crispEdges;
}


.axis2 line {
  stroke: black;
  shape-rendering: crispEdges;
}


.line {
  fill: none;
}


</style>