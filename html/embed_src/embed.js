import loadNCNRData from './loadNCNRData';
import './embed.css';

var target = document.currentScript.getAttribute("target");
var instrument = document.currentScript.getAttribute("instrument");

if (target != null && instrument != null) {
  var refresh = document.currentScript.getAttribute("refresh") || 60;
  var plot = new loadNCNRData(instrument, target, refresh);
}

export {loadNCNRData as load};
