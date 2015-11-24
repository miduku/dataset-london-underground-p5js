// for filling whole document
var w = window,
    windowWidth = w.innerWidth,
    windowHeight = w.innerHeight;

// colors
// light
var h = 200,
    s = 5,
    b = 100,
    a = 100;

// dark
var h2 = 199,
    s2 = 31,
    b2 = 21,
    a2 = 100;

var network;

var entryName = [],
    entryLines = [],
    entryZones = [];

// height for entries
var entryHeight = 20;

var divisionColumn = windowWidth/7,
    marginTop = 50;

// vertical starting position
var yMoveName = marginTop,
    yMoveLines = marginTop,
    yMoveZones = marginTop;

/*
* preload
*/
function preload() {
  // network = loadJSON('assets/json/london-underground-short.json');
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

  if (marginTop+(entryHeight*name.length) <= windowHeight) {
    var canvasHeight = windowHeight;
  } 
  else {
    var canvasHeight = marginTop*2+(entryHeight*name.length);
  }

  // create canvas
  var c = createCanvas(windowWidth, canvasHeight);
      c.parent("container");

  // rectangle/background
  background(bgrColor);

  // disect, trim, then put back together arrays
  var linesTrimmed = lines.join(',').replace(/(^\s+|\s+$)/g, '').split(',');
  var zonesTrimmed = zones.join(',').replace(/(^\s+|\s+$)/g, '').split(',');

  // remove duplicate entries in arrays
  linesUniq = uniq(linesTrimmed);
  zonesUniq = uniq(zonesTrimmed);

  // var entryHeight = c.height/(name.length + 4);


  // create column for "name"
  // function(xPos, yPos, parent, parentUnique, children, childrenUnique) {}
  for (var i = 0; i < name.length; i++) {
    entryName[i] = new Entry(
      divisionColumn, 
      yMoveName, 
      name[i],
      name[i],
      lines[i],
      linesUniq
    );
    entryName[i].show();

    yMoveName += entryName[i].height;
  }


  // create column for "lines"
  // function(xPos, yPos, parent, parentUnique, children, childrenUnique) {}
  for (var i = 0; i < linesUniq.length; i++) {
    entryLines[i] = new Entry(
      divisionColumn*3, 
      yMoveLines, 
      lines[i],     // parent       ["District", "Piccadilly"]
      linesUniq[i], // parentUnique ["Bakerloo", "..."]
      zones[i],     // child        ["3"]
      zonesUniq     // chjldUnique  ["1", "2", "3", "4", "9"]
    );
    entryLines[i].show();

    yMoveLines += entryLines[i].height;
  }


  // create column for "zones"
  // function(xPos, yPos, parent, parentUnique, children, childrenUnique) {}
  for (var i = 0; i < zonesUniq.length; i++) {
    entryZones[i] = new Entry(
      divisionColumn*5, 
      yMoveZones, 
      zones[i],
      zonesUniq[i]
    );
    entryZones[i].show();

    yMoveZones += entryLines[i].height;
  }


  console.log(zonesUniq);
  // console.log(Array.isArray(lines[0][0]));
  // console.log(entryName[0].children);
}


/*
* this will be executed all the time
*/
function draw(){

}


/*
* sort, then remove duplicates in arrays
* http://stackoverflow.com/a/9229821
*/
function uniq(array) {
    var seen = {};
    return array.sort().filter(function(item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
}


/*
* Entry constructor
*/
var Entry = function(xPos, yPos, parent, parentUnique, children, childrenUnique) {
  this.xPos = xPos;
  this.yPos = yPos;
  this.width = divisionColumn;
  this.height = entryHeight;
  this.parent = parent;
  this.parentUnique = parentUnique;
  this.children = children;
  this.childrenUnique = childrenUnique;
};

Entry.prototype.show = function() {
  this.addPrimitives();
  this.addConnections();
  this.addText();
};

Entry.prototype.addPrimitives = function() {
  // noStroke();
  stroke(h,s,b,a);
  fill(h2,s2,b2,a2);
  rect(
    this.xPos, this.yPos,
    this.width, this.height
  );
};

Entry.prototype.addConnections = function() {
  var parent = this.parent,
      parentUnique = this.parentUnique,
      child = this.children,
      childUnique = this.childrenUnique,
      parentIdx = [],
      childIdx = [];

  if (child) {
    stroke(h2,s2,b2,a2/4);
    noFill();

    // for (var p = 0; p < parent.length; p++) {
    // }
    if (!Array.isArray(parent)) {
      for (var i = 0; i < child.length; i++) {
        childIdx.push(childUnique.indexOf(child[i]));
        bezier(
          this.xPos+this.width, this.yPos+this.height/2,
          this.xPos+this.width+this.width/2, this.yPos+this.height/2,
          this.xPos+this.width+this.width/2, marginTop+this.height/2+(this.height * (childIdx[i])),
          this.xPos+this.width*2, marginTop+this.height/2+(this.height * (childIdx[i]))
        );
      }
    }
    // else {
    //   for (var i = 0; i < parent.length; i++) {
    //     parent.push(child);
    //     bezier(
    //       this.xPos+this.width, this.yPos+this.height/2,
    //       this.xPos+this.width+this.width/2, this.yPos+this.height/2,
    //       this.xPos+this.width+this.width/2, marginTop+this.height/2+(this.height * (childIdx[i])),
    //       this.xPos+this.width*2, marginTop+this.height/2+(this.height * (childIdx[i]))
    //     );
    //   console.log(parent);
    //   }
    // }

  }
};

Entry.prototype.addText = function() {
  noStroke();
  fill(h,s,b,a);
  textSize(this.height/2);

  var txt = String(this.parentUnique);
  text(txt, this.xPos+this.width/24, this.yPos+this.height-this.height/4);
};

Entry.prototype.compareEntries = function() {

};