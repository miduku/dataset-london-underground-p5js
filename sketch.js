// for filling whole document
var w = window,
    wWidth = w.innerWidth,
    wHeight = w.innerHeight;

// colors
// light
var h = 360,
    s = 0,
    b = 90,
    a = 100;

// dark
var h2 = 360,
    s2 = 0,
    b2 = 70,
    a2 = 100;

var network;

var entryName = [],
    entryLines = [],
    entryZones = [];

// vertical starting position
var yNameMove = wHeight/28,
    yLinesMove = wHeight/28,
    yZonesMove = wHeight/28;

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

  // main key
  stations = network.stations;

  // create arrays from JSON entries
  for (var key in stations) {
    name.push(stations[key].name);
    lines.push(stations[key].lines);
    zones.push(stations[key].zones);
  }

  // create canvas
  var c = createCanvas(wWidth, wHeight/28*name.length);
      c.parent("container");

  // rectangle/background
  background(bgrColor);

  // sort, disect, trim, then put back together arrays
  var linesTrimmed = lines.sort().join(',').replace(/(^\s+|\s+$)/g, '').split(',');
  var zonesTrimmed = zones.sort().join(',').replace(/(^\s+|\s+$)/g, '').split(',');

  // remove duplicate entries in arrays
  linesUniq = uniq(linesTrimmed);
  zonesUniq = uniq(zonesTrimmed);


  // create column for "name"
  for (var i = 0; i < name.length; i++) {
    entryName[i] = new Entry(
      wWidth/7, 
      yNameMove, 
      c.height/(name.length + 4),
      name[i]
    );
    entryName[i].show();

    yNameMove += entryName[i].height;
  }


  // create column for "lines"
  for (var i = 0; i < linesUniq.length; i++) {
    entryLines[i] = new Entry(
      wWidth/7*3, 
      yLinesMove, 
      c.height/(name.length + 4)
    );
    entryLines[i].show();

    yLinesMove += entryLines[i].height;
  }


  // create column for "zones"
  for (var i = 0; i < zonesUniq.length; i++) {
    entryZones[i] = new Entry(
      wWidth/7*5, 
      yZonesMove, 
      c.height/(name.length + 4)
    );
    entryZones[i].show();

    yZonesMove += entryLines[i].height;
  }

  console.log(entryName[0]);
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


/*
* Entry constructor
*/
var Entry = function(xPos, yPos, height, txt) {
  this.xPos = xPos;
  this.yPos = yPos;
  this.width = wWidth/7;
  this.height = height;
  this.txt = txt;
  // this.height = (bodyHeight/14*12) / total;
  // this.total = total;
};

Entry.prototype.show = function() {
  // noStroke();
  stroke(h,s,b,a);
  fill(h2,s2,b2,a2);
  rect(
    this.xPos, this.yPos,
    this.width, this.height
  );
  // text(
  //   this.txt,
  //   this.xPos+2,
  //   this.height/4
  // );
};
