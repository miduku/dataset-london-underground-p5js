// for filling whole document
var w = window,
    windowWidth = w.innerWidth,
    windowHeight = w.innerHeight;

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


var divisionColumn = windowWidth/7,
    divisionRow = windowHeight/28;

// vertical starting position
var yMoveName = divisionRow,
    yMoveLines = divisionRow,
    yMoveZones = divisionRow;

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
  var c = createCanvas(windowWidth, divisionRow*name.length);
      c.parent("container");

  // rectangle/background
  background(bgrColor);

  // sort, disect, trim, then put back together arrays
  var linesTrimmed = lines.sort().join(',').replace(/(^\s+|\s+$)/g, '').split(',');
  var zonesTrimmed = zones.sort().join(',').replace(/(^\s+|\s+$)/g, '').split(',');

  // remove duplicate entries in arrays
  linesUniq = uniq(linesTrimmed);
  zonesUniq = uniq(zonesTrimmed);

  // height for entries
  var entryHeight = c.height/(name.length + 4);


  // create column for "name"
  for (var i = 0; i < name.length; i++) {
    entryName[i] = new Entry(
      divisionColumn, 
      yMoveName, 
      entryHeight,
      name[i],
      lines[i]
    );
    entryName[i].show();

    yMoveName += entryName[i].height;
  }


  // create column for "lines"
  for (var i = 0; i < linesUniq.length; i++) {
    entryLines[i] = new Entry(
      divisionColumn*3, 
      yMoveLines, 
      entryHeight,
      linesUniq[i]
    );
    entryLines[i].show();

    yMoveLines += entryLines[i].height;
  }


  // create column for "zones"
  for (var i = 0; i < zonesUniq.length; i++) {
    entryZones[i] = new Entry(
      divisionColumn*5, 
      yMoveZones, 
      entryHeight,
      zonesUniq[i]
    );
    entryZones[i].show();

    yMoveZones += entryLines[i].height;
  }

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


/*
* Entry constructor
*/
var Entry = function(xPos, yPos, height, txt, connector) {
  this.xPos = xPos;
  this.yPos = yPos;
  this.width = wWidth/7;
  this.height = height;
  this.txt = txt;
  this.connector = connector;
  // this.height = (bodyHeight/14*12) / total;
  // this.total = total;
};

Entry.prototype.show = function() {
  this.createPrimitives();
  this.createConnections();
  // text(
  //   this.txt,
  //   this.xPos+2,
  //   this.height/4
  // );
};

Entry.prototype.createPrimitives = function() {
  // noStroke();
  stroke(h,s,b,a);
  fill(h2,s2,b2,a2);
  rect(
    this.xPos, this.yPos,
    this.width, this.height
  );
}

Entry.prototype.createConnections = function() {
  stroke(h2,s2,b2,a2);
  noFill();
  bezier(
    this.xPos + this.width, this.yPos + this.height/2,
    this.xPos + this.width + this.width/2, this.yPos + this.height/2,
    this.xPos + this.width*2, this.yPos*2 + this.height,
    this.xPos + this.width*2 + this.width/2, this.yPos*2 + this.height
  );
}