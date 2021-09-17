const {distance} = require('@turf/distance');
var from = {
  "type": "Feature",
  "properties": {},
  "geometry": {
    "type": "Point",
    "coordinates": [-75.343, 39.984]
  }
};
var to = {
  "type": "Feature",
  "properties": {},
  "geometry": {
    "type": "Point",
    "coordinates": [-75.534, 39.123]
  }
};
var units = "miles";
var distances = distance(from, to, units);

console.log(distances)


/* const geolib = require('geolib');

const distance0= geolib.getPreciseDistance(
    { latitude: 48.87778, longitude: 2.1802832 },
    { latitude: 43.2961743, longitude: 5.3699525 }
);
const distance1= geolib.convertDistance(distance0, 'km', 1);
console.log(distance1)


var distance = require('@turf/distance');
const point = require("@turf/helpers")
//var turf = require('@turf/turf');


var from = turf.point([48.87778, 2.1802832]);
var to = turf.point([43.2961743, 5.3699525]);
//var options = {units: 'miles'}; 
var options = {units:"kilometers"}

var distance2 = distance(from, to, options)

console.log(distance2)

 */