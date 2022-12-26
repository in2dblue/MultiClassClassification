<template>
    <div class="ParallelCoordinates">
        <div id="myParallelCoordinates">
            <svg></svg>
        </div>
        {{ infoText }}
        
  </div>
</template>

<script>
/*
 * @author Jakob Andersen
 */

export default {
  props : ['event', 'mode', 'data'],
  name: "D3ParallelCoordinates",
  data: function() {
    return {
      selection : '',
      text: "Parallel Coordinates",
      lastBrushed : '',
      lastBrushedExtent: '',
      lastBrushedExtentIsEmpty: '',
      chart : {
        oldBrush : null,
      },
      checkSum : '',
      blueLineSum : ''
    };
  },
 
  computed : {
    infoText() {
      return "Ausgewählt: " + this.blueLineSum + ' / ' + this.lineSum
    }
  },
  watch : {
    data (newValue) {
      d3.select("#myParallelCoordinates svg").selectAll("*").remove();
      this.refresh(newValue[0], newValue[1]);
    },
    lastBrushedExtent : function() {
      this.$emit('lastBrush', [this.lastBrushed, this.lastBrushedExtent, this.lastBrushedExtentIsEmpty]);
    }
  },

  methods: {
/*
      update () {
        var scales0to1 = { scale : [0, 1], names : [ 'Lesbarkeit', 'Informationsdichte', 'Unterhaltungswert' ] };

      var m = [30, 40, 10, 10],
          w = 1200 - m[1] - m[3],
          h = 380 - m[0] - m[2];

      var x = d3.scale.ordinal().rangePoints([0, w], 1),
          y  = {},
          dragging = {};

      var line = d3.svg.line(),
          axis = d3.svg.axis().orient("left"),
          background,
          foreground;

      var svg = d3.select("#myParallelCoordinates svg")
          .attr("width", w + m[1] + m[3])
          .attr("height", h + m[0] + m[2])
        .append("g")
          .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

        // Extract the list of dimensions and create a scale for each.
          var dimensions = '';

        x.domain(dimensions = d3.keys(data[0]).filter(function(d) {
          var dim;
          if(scales0to1.names.indexOf(d) > -1) {
            dim = scales0to1.scale;
          } else {
            dim = d3.extent(data, function(p) { return +p[d]; });
          }

          return d != "name" && d != "text" && (y[d] = d3.scale.linear()
              .domain(dim)
              .range([h, 0]));
        }));

        svg.selectAll('.background')

        // Add grey background lines for context.
        background = svg.append("g")
            .attr("class", "background")
          .selectAll("path")
            .data(data)
          .enter().append("path")
            .attr("d", path);

        // Add blue foreground lines for focus.
        foreground = svg.append("g")
            .attr("class", "foreground")
          .selectAll("path")
            .data(data)
          .enter().append("path")
            .attr("d", path);
      },
      */
      refresh : function (data, firstLoad) { 
      console.log('-  - redraw p.coordinates')    
      
      this.lineSum = data.length;

      var instance = this;

      var scales0to1 = { scale : [0, 1], names : [ 'Lesbarkeit', 'Informationsdichte', 'Unterhaltungswert' ] };

      var m = [30, 40, 10, 10],
          w = 1200 - m[1] - m[3],
          h = 380 - m[0] - m[2];

      var x = d3.scale.ordinal().rangePoints([0, w], 1),
          y = this.chart.y = {},
          dragging = {};

      var line = d3.svg.line(),
          axis = d3.svg.axis().orient("left"),
          background,
          foreground;

      var svg = d3.select("#myParallelCoordinates svg")
          .attr("width", w + m[1] + m[3])
          .attr("height", h + m[0] + m[2])
        .append("g")
          .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

        // Extract the list of dimensions and create a scale for each.
          var dimensions = '';

        x.domain(dimensions = d3.keys(data[0]).filter(function(d) {
          var dim;
          if(scales0to1.names.indexOf(d) > -1) {
            dim = scales0to1.scale;
          } else {
            dim = d3.extent(data, function(p) { return +p[d]; });
          }

          return d != "name" && d != "text" && (y[d] = d3.scale.linear()
              .domain(dim)
              .range([h, 0]));
        }));

        // Add grey background lines for context.
        background = svg.append("g")
            .attr("class", "background")
          .selectAll("path")
            .data(data)
          .enter().append("path")
            .attr("d", path);

        // Add blue foreground lines for focus.
        foreground = svg.append("g")
            .attr("class", "foreground")
          .selectAll("path")
            .data(data)
          .enter().append("path")
            .attr("d", path);

        // Add a group element for each dimension.
        var g = svg.selectAll(".dimension")
            .data(dimensions)
          .enter().append("g")
            .attr("class", "dimension")
            .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
            .call(d3.behavior.drag()
              .on("dragstart", function(d) {
                dragging[d] = this.__origin__ = x(d);
                background.attr("visibility", "hidden");
              })
              .on("drag", function(d) {
                dragging[d] = Math.min(w, Math.max(0, this.__origin__ += d3.event.dx));
                foreground.attr("d", path);
                dimensions.sort(function(a, b) { return position(a) - position(b); });
                x.domain(dimensions);
                g.attr("transform", function(d) { return "translate(" + position(d) + ")"; })
              })
              .on("dragend", function(d) {
                delete this.__origin__;
                delete dragging[d];
                transition(d3.select(this)).attr("transform", "translate(" + x(d) + ")");
                transition(foreground)
                    .attr("d", path);
                background
                    .attr("d", path)
                    .transition()
                    .delay(500)
                    .duration(0)
                    .attr("visibility", null);
              }));

        // Add an axis and title.
        g.append("g")
            .attr("class", "axis")
            .each(function(d) { d3.select(this).call(axis.scale(y[d])); })
          .append("text")
            .attr("text-anchor", "middle")
            .attr("y", -9)
            .text(String);

        // Add and store a brush for each axis.
        
        var brushes = [];
          
          g.append("g")
            .attr("class", "brush")
            .attr("data-dim", d => d)
            .each(function(d) {
              d3.select(this).call(y[d].brush = d3.svg.brush().y(y[d]).on("brushstart", brushstart).on("brushend", brush));
              })
          .selectAll("rect")
            .attr("x", -8)
            .attr("width", 16);

      
      // keep old brush
      if (this.chart.oldBrush != null && !firstLoad) {
        var old = this.chart.oldBrush;
          g.selectAll(".brush").each(function(d) { 
            if(old[d]) {
              d3.select(this).transition().call(y[d].brush.extent(old[d].brush.extent()))
            } else {
              // console.log('warning: [D3ParallelCoodinated] old brush is empty')
            }
          })
      } else {
        /*
       var old = this.chart.oldBrush;
          g.selectAll(".brush").each(function(d) { 
            if(scales0to1.names.indexOf(d) > -1 )
            d3.select(this).transition().call(y[d].brush.extent([0.5, 1]))
          })
          */
      }



      // this.chart.y

      

      brush();


      // filter setzen 

      var brushObject = {};
      for(var i = 0; i < dimensions.length; i++) {
        var dim = dimensions[i];
        var brushExtent = y[dim].brush.extent();
        var isEmpty = y[dim].brush.empty();
        brushObject[dim] = isEmpty ? [] : brushExtent;
        // DataStore.methods.filterClound(dim, brushExtent, isEmpty);
      }
      this.$emit('brush', brushObject);


      this.chart.oldBrush = y;

      function position(d) {
        var v = dragging[d];
        return v == null ? x(d) : v;
      }

      function transition(g) {
        return g.transition().duration(500);
      }

      // Returns the path for a given data point.
      function path(d) {
        return line(dimensions.map(function(p) { return [position(p), y[p](d[p])]; }));
      }

      // When brushing, don’t trigger axis dragging.
      function brushstart() {
        if(d3.event.sourceEvent != null)
          d3.event.sourceEvent.stopPropagation();


       
        instance.lastBrushed = d3.select(this).attr('data-dim');

      }

  
      // Handles a brush event, toggling the display of foreground lines.
      function brush() {
        
        console.log('brush')

        var actives = dimensions.filter(function(p) { return !y[p].brush.empty(); }),
            extents = actives.map(function(p) { return y[p].brush.extent(); });
        foreground.style("display", function(d) {
          return actives.every(function(p, i) {
            return extents[i][0] <= d[p] && d[p] <= extents[i][1];
          }) ? null : "none";
        });
        

        // get all in forground
        //var select 
        instance.blueLineSum = svg.select(".foreground").selectAll('path').filter(function (d) {
          var style = d3.select(this).attr('style')
          return style != 'display: none;'
        }).size();

        
         if(instance.lastBrushed && y[instance.lastBrushed]) { // ?
          instance.lastBrushedExtent = y[instance.lastBrushed].brush.extent();
          instance.lastBrushedExtentIsEmpty = y[instance.lastBrushed].brush.empty();
         }

         
         instance.$emit('activeBrushes', [actives, extents] )
      }
    }
  }
};
</script>

<style>

.background path {
  fill: none;
  stroke: #ccc;
  stroke-opacity: .4;
  shape-rendering: crispEdges;
}

.foreground path {
  fill: none;
  stroke: steelblue;
  stroke-opacity: .7;
}

.axis line,
.axis path {
  fill: none;
  stroke: #000;
  shape-rendering: crispEdges;
}

.axis text {
  text-shadow: 0 1px 0 #fff;
  cursor: move;
}

</style>