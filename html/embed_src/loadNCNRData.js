import $ from 'jquery';
import d3 from 'd3';
import xyChart from './xy-chart';
import heatChart from './heat-chart';
import * as cm from './colormap';
 
var chart;
var loadNCNRData = function(instrument, target, refresh_time, title, height, width) {
  // refresh_time in seconds
  this.chart = null;
  this.instrument = instrument;
  this.target = target;
  var target_el = $("#" + target);
  if (height != null) target_el.height(height);
  if (width != null) target_el.width(width);
  var target_height = target_el.height();
  
  if (title != null) { 
    var title_el = $("<h2 />", {"text": title, "class": "plot-title"});
    target_el.append(title_el);
    target_height -= title_el.height()
  }
  
  var plotdiv = $("<div />", {"class": "plotdiv"});
  target_el.append(plotdiv);
  plotdiv.height(target_height);
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
        plotdiv.empty();
        chart = new xyChart();
        chart
          .options(options)
          .zoomRect(true);
        d3.select(plotdiv[0])
          .data([data.data])
          .call(chart);
        that.chart = chart;
      }
    } else if (data.type == '2d') {
      if (chart && chart.type && chart.type == 'heatmap_2d') {
        chart.source_data(data.z[0]);
      }
      else {
        plotdiv.empty();
        var aspect_ratio = null;
        if ((((data.options || {}).fixedAspect || {}).fixAspect || null) == true) {
          aspect_ratio = ((data.options || {}).fixedAspect || {}).aspectRatio || null;
        }
        chart = new heatChart();
        chart
          .colormap(cm.get_colormap(instrument == "NGBSANS" ? "spectral" : "jet"))
          .dims(data.dims)
          .xlabel(data.xlabel)
          .ylabel(data.ylabel);
        d3.select(plotdiv[0])
          .data(data.z)
          .call(chart);
        chart.zoomScroll(true)
          .ztransform((logselected)? "log" : "linear")
          .aspect_ratio(aspect_ratio)
        
        that.chart = chart;
      }
    } else {
        // this will get triggered if data is missing or has a type other than 1d or 2d
        plotdiv.empty().append('<div class="no-data">Ceci n\'est pas data</div>');
    }

    return chart;
  }
  
  this.update = update;
}


export default loadNCNRData;
