import $ from 'jquery';
import d3 from 'd3';
import xyChart from './xy-chart';
import heatChart from './heat-chart-colorbar-typed-options';
import * as cm from './colormap';
 
var chart;
var loadNCNRData = function(instrument, target, refresh_time) {
  // refresh_time in seconds
  this.chart = null;
  this.instrument = instrument;
  this.target = target;
  $("#" + target).addClass("plotdiv");
  this.refresh_time = refresh_time; // set to zero or null to disable refresh;
  
  var that = this;
  
  update();
  
  function update() {
    var noCache = Date.now();
    return new Promise(function(resolve, reject) {
      $.ajax({
          dataType: "json",
          url: "https://www.ncnr.nist.gov/ipeek/data/" + instrument + "/live_data.json",
          data: { "noCache": noCache },
          success: function(data) { resolve(showData(data)); },
          error: function(e) { resolve(showData([{}])); },
          complete: function() { 
            if (refresh_time) { setTimeout(update, refresh_time * (0.95 + Math.random()/10) * 1000) }
          }
      });
    });
  }
  var logselected = true;
  function showData(datalist) {
    var data = datalist[0];
    var chart = that.chart;
    var options_1d = {show_errorbars: true, series: []},
        options_2d = {};
    if (data.type == '1d') {
      var options = $.extend(true, {}, options_1d, data.options);
      if (chart && chart.type && chart.type == 'xy') {
        chart.options(options, true).source_data(data.data).update();
      }
      else {
        $('#' + target).empty();
        chart = new xyChart();
        chart
          .options(options)
          //.options(data.options)
          //.ytransform(options.ytransform)
          .zoomRect(true);
        d3.select("#" + target)
          .data([data.data])
          .call(chart);
        //chart.ytransform(options.ytransform);
        that.chart = chart;
      }
    } else if (data.type == '2d') {
      if (chart && chart.type && chart.type == 'heatmap_2d') {
        chart.source_data(data.z[0]);
      }
      else {
        $('#' + target).empty();
        var aspect_ratio = null;
        if ((((data.options || {}).fixedAspect || {}).fixAspect || null) == true) {
          aspect_ratio = ((data.options || {}).fixedAspect || {}).aspectRatio || null;
        }
        chart = new heatChart();
        chart
          .colormap(cm.get_colormap(instrument == "NGBSANS" ? "spectral" : "jet"))
          .aspect_ratio(aspect_ratio)
          .dims(data.dims)
          .xlabel(data.xlabel)
          .ylabel(data.ylabel);
        d3.select("#"+ target)
          .data(data.z)
          .call(chart);
        chart.zoomScroll(true)
          .ztransform((logselected)? "log" : "linear")
        
        that.chart = chart;
      }
    } else {
        // this will get triggered if data is missing or has a type other than 1d or 2d
        $('#' + target).empty().append('<div class="no-data">Ceci n\'est pas data</div>');
    }

    return chart;
  }
  
  this.update = update;
}


export default loadNCNRData;
