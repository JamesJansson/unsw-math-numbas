// Unit circle

var spacing = 1; // space between the circle and the graph

// Ratio calc
// y = 1.4 + 1.4 = 2.8
// x = 1.4 + (1+spacing+2*Math.PI+0.4) = 10.083185307179587

var div = Numbas.extensions.jsxgraph.makeBoard('900px','223px', 
  {
    boundingBox: [-1.4, 1.4, 1+spacing+2*Math.PI+0.4, -1.4], // xmin, ymax, xmax, ymin
    axis: false,
    showNavigation: false,
    grid: false
  });


var board = div.board;


var p1 = board.create('point', [0, 0], {name: ''});
p1.setProperty({fixed:true});
var circle = board.create('circle', [p1, 1]); // [0,0]
var g1 = board.create('glider', [0.5, Math.sqrt(1 - Math.pow(0.5, 2)),  circle]);

var l1 = board.create('line', [p1, g1], {straightFirst:false, straightLast:false});



// var thetaDisplay = Math.round(theta/Math.PI * 100) / 100 + ' PI';
var p2 = board.create('point', [0, 0], {name: 'theta'});
p2.setProperty({fixed:true});



var func = function(t){ return Math.sin(t);}

var thetaFunc = function () {
  var theta = Math.acos(g1.X());
  // If it is on the opposite side of the circle
  if (g1.Y() < 0) {
    theta = 2 * Math.PI - theta;
  }
  return theta;
};

function thetaOffSet(input) {
  return 1 + spacing + input;
}

var graph = board.create('curve',
    [function(t){ return 1 + spacing + t},
    func,
    0, 2*Math.PI]
);

var p3 = board.create('point', [function(){return thetaOffSet(thetaFunc())}, function(){return func(thetaFunc())}], {name: ''});
// p3.setProperty({fixed:true});
var p4 = board.create('point', [function(){return thetaOffSet(thetaFunc())}, 0], {name: ''});
// p4.setProperty({fixed:true});

var l2 = board.create('line', [p3, p4], {straightFirst:false, straightLast:false});


// draw cross-graph dotted lines (only for sine)
var l3 = board.create('line', [g1, p3], {straightFirst:false, straightLast:false, dash:2});

// draw axes
var lcirclexaxis = board.create('line', [[-1.2, 0], [1.2, 0]], {straightFirst:false, straightLast:false, fixed:true});
var lcircleyaxis = board.create('line', [[0, -1.2], [0, 1.2]], {straightFirst:false, straightLast:false, fixed:true});

var pcirclexaxis1n = board.create('point', [0, -1], {name: '-1'});
var pcirclexaxis1p = board.create('point', [0, 1], {name: '1'});
var pcircleyaxis1n = board.create('point', [-1, 0], {name: '-1'});
var pcircleyaxis1p = board.create('point', [1, 0], {name: '1'});

var lcurvexaxis = board.create('line', [[thetaOffSet(-0.2), 0], [thetaOffSet(2*Math.PI +1.2), 0]], {straightFirst:false, straightLast:false, fixed:true});
var lcurveyaxis = board.create('line', [[thetaOffSet(0), -1.2], [thetaOffSet(0), 1.2]], {straightFirst:false, straightLast:false, fixed:true});

var pcurvexaxis1n = board.create('point', [thetaOffSet(0), -1], {name: '-1'});
var pcurvexaxis1p = board.create('point', [thetaOffSet(0), 1], {name: '1'});
var pcurveyaxis1n = board.create('point', [thetaOffSet(Math.PI), 0], {name: 'PI'});
var pcurveyaxis1n = board.create('point', [thetaOffSet(2*Math.PI), 0], {name: '2PI'});



return div;

