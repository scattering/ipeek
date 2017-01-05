import loadNCNRData from './loadNCNRData';
import './embed.css';
import $ from 'jquery';

var target = document.currentScript.getAttribute("target");
var instrument = document.currentScript.getAttribute("instrument");
var title = document.currentScript.getAttribute("title");
var width = document.currentScript.getAttribute("width");
var height = document.currentScript.getAttribute("height");

if (target != null && instrument != null) {
  var refresh = document.currentScript.getAttribute("refresh") || 60;
  $().ready(function() {
    var plot = new loadNCNRData(instrument, target, refresh, title, height, width);
  });
}

export {loadNCNRData as load};
