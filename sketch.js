// for filling whole document
var w = window,
    wX = w.innerWidth,
    wY = w.innerHeight;

// colors
var h = 360,
    s = 0,
    b = 90,
    a = 100;

var network;

/*
* preload
*/
function preload() {
  network = loadJSON('assets/json/london-underground.json');
}

/*
* only executed once
*/
function setup(){
  var stations, 
        name = [],    // station names
        lines = [],   // lines names
        linesUniq = [],   // unique lines names
        zones = [],   // zones names
        zonesUniq = [];   // unique zones names
  // change color mode to hsl
  colorMode(HSB, 360, 100, 100, 100);
  var bgrColor = color(h, s, b, a);

  var c = createCanvas(wX, wY);
      c.parent("container");

  // rectangle/background
  background(bgrColor);

  // main key
  stations = network.stations;

  for (var key in stations) {
    name.push(stations[key].name);
    lines.push(stations[key].lines);
    zones.push(stations[key].zones);
  }

  // remove duplicate entriey in arrays
  linesUniq = uniq(lines);
  zonesUniq = uniq(zones);

  console.log(linesUniq);
}


/*
* this will be executed all the time
*/
function draw(){
}


/*
* remove duplicates in arrays
* http://stackoverflow.com/a/9229821
*/
function uniq(a) {
    var seen = {};
    return a.filter(function(item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
}