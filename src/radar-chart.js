var RadarChart = {
  defaultConfig: {
    containerClass: 'radar-chart',
    w: 650,
    h: 660,
    factor: 0.95,
    factorLegend: 1,
    levels: 4,
    levelTick: false,
    TickLength: 10,
    maxValue: 100,
    minValue: 0,
    radians: 2 * Math.PI,
    //color: d3.scale.category10(),
    axisLine: true,
    axisText: true,
    circles: false,
    radius: 5,
    open: false,
    backgroundTooltipColor: "#555",
    backgroundTooltipOpacity: "0.9",
    tooltipColor: "white",
    showLevelsLabels:true,
    labelScale: 0.9,
    animateDelay:100,
    animateDuration:500,
    axisJoin: function(d, i) {
      return d.className || i;
    },
    tooltipFormatValue: function(d) {
      return d;
    },
    tooltipFormatClass: function(d) {
      return d;
    },
    transitionDuration: 300
  },
  chart: function() {

  //colors of the chart lines by region
  var color = { "Europe":"#54AF52",  "North America": "#DD6CA7", "Oceania": "#ff9f2f", "Africa": "#9D5130", 
                "Middle East":"#AB9C27", "South America": "#D58323", "Asia": "#5DA5B3"};
  //defining which country belongs to which region (could be done better using a data file)
  var group = { "Australia": "Oceania",
                "Austria": "Europe",
                "Belgium": "Europe",
                "Brazil": "South America",
                "Canada": "North America",
                "China": "Asia",
                "Denmark": "Europe",
                "Egypt": "Middle East",
                "Finland": "Europe",
                "France": "Europe",
                "Germany": "Europe",
                "Hong Kong": "Asia",
                "Israel": "Middle East",
                "Italy": "Europe",
                "Japan": "Asia",
                "Luxembourg": "Europe",
                "Netherlands": "Europe",
                "New Zealand": "Oceania",
                "Norway": "Europe",
                "Republic of Ireland": "Europe",
                "Russian Federation": "Europe",
                "Singapore": "Asia",
                "South Africa": "Africa",
                "South Korea": "Asia",
                "Spain": "Europe",
                "Sweden": "Europe",
                "Switzerland": "Europe",
                "Taiwan": "Asia",
                "Turkey": "Middle East",
                "United Kingdom": "Europe",
                "United States of America": "North America"
              };

    // default config
    var cfg = Object.create(RadarChart.defaultConfig);
    cfg.color = color;

    function setTooltip(tooltip, msg){
      if(msg === false || msg == undefined){
        tooltip.classed("visible", 0);
        tooltip.select("rect").classed("visible", 0);
      }else{
        tooltip.classed("visible", 1);

        var container = tooltip.node().parentNode;
        var coords = d3.mouse(container);

        tooltip.select("text").classed('visible', 1).style("fill", cfg.tooltipColor);
        var padding=5;
        var bbox = tooltip.select("text").text(msg).node().getBBox();
        tooltip.node().parentNode.appendChild(tooltip.node());

        tooltip.select("rect")
        .classed('visible', 1).attr("x", 0)
        .attr("x", bbox.x - padding)
        .attr("y", bbox.y - padding)
        .attr("width", bbox.width + (padding*2))
        .attr("height", bbox.height + (padding*2))
        .attr("rx","5").attr("ry","5")
        .style("position","relative")
        .style("z-index",-1)

        .style("fill", cfg.backgroundTooltipColor).style("opacity", cfg.backgroundTooltipOpacity);
        tooltip.attr("transform", "translate(" + (coords[0]+10) + "," + (coords[1]-10) + ")")
      }
    }
    function radar(selection) {
      selection.each(function(data) {
        var container = d3.select(this);
        var tooltip = container.selectAll('g.tooltip').data([data[0]]);

        var tt = tooltip.enter()
        .append('g')
        .classed('tooltip', true)

        tt.append('rect').classed("tooltip", true);
        tt.append('text').classed("tooltip", true);

        // allow simple notation
        data = data.map(function(datum) {
          if(datum instanceof Array) {
            datum = {axes: datum};
          }
          return datum;
        });

        var maxValue = Math.max(cfg.maxValue, d3.max(data, function(d) {
          return d3.max(d.axes, function(o){ return o.value; });
        }));
        maxValue -= cfg.minValue;

        var allAxis = data[0].axes.map(function(i, j){ return {name: i.axis, xOffset: (i.xOffset)?i.xOffset:0, yOffset: (i.yOffset)?i.yOffset:0}; });
        var total = allAxis.length;
        var radius = cfg.factor * Math.min(cfg.w / 2, cfg.h / 2);
        var radius2 = Math.min(cfg.w / 2, cfg.h / 2);


        container.classed(cfg.containerClass, 1);

        function getPosition(i, range, factor, func){
          factor = typeof factor !== 'undefined' ? factor : 1;
          return range * (1 - factor * func(i * cfg.radians / total));
        }
        function getHorizontalPosition(i, range, factor){
          return getPosition(i, range, factor, Math.sin);
        }
        function getVerticalPosition(i, range, factor){
          return getPosition(i, range, factor, Math.cos);
        }

        // levels && axises
        var levelFactors = d3.range(0, cfg.levels).map(function(level) {
          return radius * ((level + 1) / cfg.levels);
        });

        var levelGroups = container.selectAll('g.level-group').data(levelFactors);

        levelGroups.enter().append('g');
        levelGroups.exit().remove();

        levelGroups.attr('class', function(d, i) {
          return 'level-group level-group-' + i;
        });

        var levelLine = levelGroups.selectAll('.level').data(function(levelFactor) {
          return d3.range(0, total).map(function() { return levelFactor; });
        });

        levelLine.enter().append('line');
        levelLine.exit().remove();

        //Build the level labels/axis labels
        //Code excerpts : http://bl.ocks.org/chrisrzhou/2421ac6541b68c1680f8
         function buildLevelsLabels() {
            for (var level = 0; level < cfg.levels; level++) {
              var levelFactor = radius * ((level + 1) / cfg.levels);
             

              // build level-labels
              levelGroups
                .append('svg:text').classed("level-labels", true)
                .text((cfg.maxValue * (level + 1) / cfg.levels).toFixed())
                .attr("x", function(d) {
                  return levelFactor * (1 - Math.sin(0)); })
                .attr("y", function(d) { return levelFactor * (1 - Math.cos(0)); })
                .attr("transform", "translate(" + (cfg.w / 2 - levelFactor + 5) + ", " + (cfg.h / 2 - levelFactor) + ")")
                .attr("fill", "black")
                .attr("text-outline", "2px 2px #ff0000")
                .attr("font-family", "sans-serif")
                .attr("font-size", 15 * cfg.labelScale + "px")
                .on('mouseout', function(b){

                //d3.select(this).parentNode.appendChild(d3.select(this));

                });

            }
            
          }
        //Show level labels is variable showLevelsLabels is set as true
        if (cfg.showLevelsLabels) {buildLevelsLabels();}

        //If variable levelTick is set as true, show only the ticks (no lines) for each level
        if (cfg.levelTick){
          levelLine
          .attr('class', 'level')
          .attr('x1', function(levelFactor, i){
            if (radius == levelFactor) {
              return getHorizontalPosition(i, levelFactor);
            } else {
              return getHorizontalPosition(i, levelFactor) + (cfg.TickLength / 2) * Math.cos(i * cfg.radians / total);
            }
          })
          .attr('y1', function(levelFactor, i){
            if (radius == levelFactor) {
              return getVerticalPosition(i, levelFactor);
            } else {
              return getVerticalPosition(i, levelFactor) - (cfg.TickLength / 2) * Math.sin(i * cfg.radians / total);
            }
          })
          .attr('x2', function(levelFactor, i){
            if (radius == levelFactor) {
              return getHorizontalPosition(i+1, levelFactor);
            } else {
              return getHorizontalPosition(i, levelFactor) - (cfg.TickLength / 2) * Math.cos(i * cfg.radians / total);
            }
          })
          .attr('y2', function(levelFactor, i){
            if (radius == levelFactor) {
              return getVerticalPosition(i+1, levelFactor);
            } else {
              return getVerticalPosition(i, levelFactor) + (cfg.TickLength / 2) * Math.sin(i * cfg.radians / total);
            }
          })
          .attr('transform', function(levelFactor) {
            return 'translate(' + (cfg.w/2-levelFactor) + ', ' + (cfg.h/2-levelFactor) + ')';
          });
        }
        else{
          levelLine
          .attr('class', 'level')
          .attr('x1', function(levelFactor, i){ return getHorizontalPosition(i, levelFactor); })
          .attr('y1', function(levelFactor, i){ return getVerticalPosition(i, levelFactor); })
          .attr('x2', function(levelFactor, i){ return getHorizontalPosition(i+1, levelFactor); })
          .attr('y2', function(levelFactor, i){ return getVerticalPosition(i+1, levelFactor); })
          .attr('transform', function(levelFactor) {
            return 'translate(' + (cfg.w/2-levelFactor) + ', ' + (cfg.h/2-levelFactor) + ')';
          });
        }
          
        //Show axis lines and labels if variables axisLine or axisText are set as true
        if(cfg.axisLine || cfg.axisText) {
          var axis = container.selectAll('.axis').data(allAxis);
          var newAxis = axis.enter().append('g');
          if(cfg.axisLine) {
            newAxis.append('line');
                     }
          if(cfg.axisText) {
            newAxis.append('text');
          }
          axis.exit().remove();
          axis.attr('class', 'axis');
          if(cfg.axisLine) {
            axis.select('line')
            .attr('x1', cfg.w/2)
            .attr('y1', cfg.h/2)
            .attr('x2', function(d, i) { return (cfg.w/2-radius2)+getHorizontalPosition(i, radius2, cfg.factor); })
            .attr('y2', function(d, i) { return (cfg.h/2-radius2)+getVerticalPosition(i, radius2, cfg.factor); })
          }

          if(cfg.axisText) {
            axis.select('text')
            .attr('class', function(d, i){
              var p = getHorizontalPosition(i, 0.5);

              return 'legend ' +
              ((p < 0.4) ? 'left' : ((p > 0.6) ? 'right' : 'middle'));
            })
            .attr('dy', function(d, i) {
              var p = getVerticalPosition(i, 0.5);
              return ((p < 0.1) ? '1em' : ((p > 0.9) ? '0' : '0.5em'));
            })
            .text(function(d) { return d.name; })
            .attr('x', function(d, i){ return d.xOffset+ (cfg.w/2-radius2)+getHorizontalPosition(i, radius2, cfg.factorLegend); })
            .attr('y', function(d, i){ return d.yOffset+-7+ (cfg.h/2-radius2)+getVerticalPosition(i, radius2, cfg.factorLegend); })
            .style({'font-weight': 'bold', 'stroke': color, 'fill': color});

          }
        }

        // content
        data.forEach(function(d){
          d.axes.forEach(function(axis, i) {
            axis.x = (cfg.w/2-radius2)+getHorizontalPosition(i, radius2, (parseFloat(Math.max(axis.value - cfg.minValue, 0))/maxValue)*cfg.factor);
            axis.y = (cfg.h/2-radius2)+getVerticalPosition(i, radius2, (parseFloat(Math.max(axis.value - cfg.minValue, 0))/maxValue)*cfg.factor);
          });
        });
        var polygon = container.selectAll(".area").data(data, cfg.axisJoin);
        var polygonType = 'polygon';
        if (cfg.open) {
          polygonType = 'polyline';
        }
        var t = d3.transition()
          .duration(750)
          .ease('linear');

        polygon.enter()
        .append(polygonType)
        .classed({area: 1, 'd3-enter': 1})
        .on('mouseover', function (dd){
          d3.event.stopPropagation();
          container.classed('focus', 1);
          d3.select(this).classed('focused', 1);
          setTooltip(tooltip, cfg.tooltipFormatClass(dd.className));

        })
        .on('mouseout', function(){
          d3.event.stopPropagation();
          container.classed('focus', 0);
          d3.select(this).classed('focused', 0);
          setTooltip(tooltip, false);
        });

        polygon.exit()
        .classed('d3-exit', 1) // trigger css transition
        .transition().duration(cfg.animateDuration)
        .remove();

        polygon
        .each(function(d, i) {
          var classed = {'d3-exit': 0}; // if exiting element is being reused
          classed['radar-chart-serie' + i] = 1;
          if(d.className) {
            classed[d.className] = 1;
          }
          d3.select(this).classed(classed);
        })
        .transition().duration(cfg.animateDuration)
        //color code using continent
        .style('stroke', function(d,i) { return color[group[d.country]];}) 
        .style('fill', function(d,i) { return  color[group[d.country]];})
        //.transition().duration(cfg.transitionDuration)
        // svg attrs with js
        .attr('points',function(d) {
          return d.axes.map(function(p) {
            return [p.x, p.y].join(',');
          }).join(' ');
        })
        .each('start', function() {
          d3.select(this).classed('d3-enter', 0); // trigger css transition
        });

        if(cfg.circles && cfg.radius) {

          var circleGroups = container.selectAll('g.circle-group').data(data, cfg.axisJoin);

          circleGroups.enter().append('g').classed({'circle-group': 1, 'd3-enter': 1});
          circleGroups.exit()
          .classed('d3-exit', 1) // trigger css transition
          .transition().duration(cfg.transitionDuration).remove();

          circleGroups
          .each(function(d) {
            var classed = {'d3-exit': 0}; // if exiting element is being reused
            if(d.className) {
              classed[d.className] = 1;
            }
            d3.select(this).classed(classed);
          })
          .transition().duration(cfg.transitionDuration)
          .each('start', function() {
            d3.select(this).classed('d3-enter', 0); // trigger css transition
          });

          var circle = circleGroups.selectAll('.circle').data(function(datum, i) {
            return datum.axes.map(function(d) { return [d, i]; });
          });


          circle.enter().append('circle')
          .classed({circle: 1, 'd3-enter': 1})
          .on('mouseover', function(dd){
            d3.event.stopPropagation();
            setTooltip(tooltip, cfg.tooltipFormatValue(dd[0].value));
            //container.classed('focus', 1);
            //container.select('.area.radar-chart-serie'+dd[1]).classed('focused', 1);
          })
          .on('mouseout', function(dd){
            d3.event.stopPropagation();
            setTooltip(tooltip, false);
            container.classed('focus', 0);
            //container.select('.area.radar-chart-serie'+dd[1]).classed('focused', 0);
            //No idea why previous line breaks tooltip hovering area after hoverin point.
          });

          circle.exit()
          .classed('d3-exit', 1) // trigger css transition
          .transition().duration(cfg.transitionDuration).remove();

          circle
          .each(function(d) {
            var classed = {'d3-exit': 0}; // if exit element reused
            classed['radar-chart-serie'+d[1]] = 1;
            d3.select(this).classed(classed);
          })
          // styles should only be transitioned with css
          //.style('fill', function(d) { return cfg.color(d[1]); })
          //.style('fill', function(ddd,i) { console.log(ddd);return color[group[ddd.country]];})
          //.style('fill',  function(d,i) { return  color[group[d.country]];})

          .transition().duration(cfg.transitionDuration)
          // svg attrs with js
          .attr('r', cfg.radius)
          .attr('cx', function(d) {
            return d[0].x;
          })
          .attr('cy', function(d) {
            return d[0].y;
          })
          .each('start', function() {
            d3.select(this).classed('d3-enter', 0); // trigger css transition
          });

          //Make sure layer order is correct
          var poly_node = polygon.node();
          poly_node.parentNode.appendChild(poly_node);

          var cg_node = circleGroups.node();
          cg_node.parentNode.appendChild(cg_node);

          // ensure tooltip is upmost layer
          var tooltipEl = tooltip.node();
          tooltipEl.parentNode.appendChild(tooltipEl);
          tooltipEl.style("position","relative").style("z-index",-1);

        }
      });
    }

    radar.config = function(value) {
      if(!arguments.length) {
        return cfg;
      }
      if(arguments.length > 1) {
        cfg[arguments[0]] = arguments[1];
      }
      else {
        d3.entries(value || {}).forEach(function(option) {
          cfg[option.key] = option.value;
        });
      }
      return radar;
    };

    return radar;
  },
  draw: function(id, d, options) {
    var chart = RadarChart.chart().config(options);
    var cfg = chart.config();
    var yScale = d3.scale.linear()
        .domain([0,d3.max(d)])
        .range(0,cfg.h);
      //console.log(d3.max(d));

    d3.select(id).select('svg').remove();
    d3.select(id)
    .append("svg")
    .attr("width", cfg.w)
    .attr("height", cfg.h)
    .datum(d)
    .call(chart);


    //create the legend
  var legend = d3.select('svg').append('g')
      .attr("width", 60)
      .attr("height", 10)
      .attr('stroke', '#555')
      .attr("transform", "translate("+(cfg.w+20)+", "+ (cfg.h-150) + ")");
  //function to draw the legend elements
  var newLegend = function(legendContainer, color, text, offsetX) {
    var g = legendContainer.append('g');
    g.attr("transform", "translate(" + 0 + ", "+(-offsetX-20)+")");
    g.append('text')
      .style({'font-size': '8px', 'stroke': color, 'fill': color})
      .text('██');
    g.append('text')
      .attr("transform", "translate(20, 0)")
      .attr('fill', color)
      .text(text);
  };
  //loops through each color group and calls a legend element to be drawn
  var value;
  var i = 0;
 //http://stackoverflow.com/questions/33946567/javascript-iterate-over-values-of-map
  Object.keys(cfg.color).forEach(function(key) {
      value = cfg.color[key];
      newLegend(legend, value, key, i*50);
      i++;
  });
  }
};
