// Unit circle

var spacing = 1; // space between the circle and the graph

var div = Numbas.extensions.jsxgraph.makeBoard('800px','400px', 
  {
    boundingBox: [-1.2, 1.2, 1+spacing+2*Math.PI+0.2, -1.2], // xmin, ymax, xmax, ymin
    axis: false,
    showNavigation: false,
    grid: false
  });

var board = div.board;


var p1 = board.create('point', [0, 0], {name: ''});
p1.setProperty({fixed:true});
var circle = board.create('circle', [p1, 1]); // [0,0]
var g1 = board.create('glider', [circle]);

var l1 = board.create('line', [p1, g1]);

var theta = Math.acos(g1.X());
// If it is on the opposite side of the circle
if (g1.Y() > 0) {
  theta = 2 * Math.PI - theta;
}

var thetaDisplay = Math.round(theta/Math.PI * 100) / 100 + ' PI';
var p2 = board.create('point', [0, 0], {name: thetaDisplay});
p2.setProperty({fixed:true});



var func = function(t){ return Math.sin(t);}

var graph = board.create('curve',
    [function(t){ return 1 + spacing + t},
    func,
    0, 2*Math.PI]
);

var p3 = board.create('point', [theta, func(theta)], {name: ''});
p3.setProperty({fixed:true});
var p4 = board.create('point', [theta, 0], {name: ''});
p4.setProperty({fixed:true});

var l2 = board.create('line', [p3, p4]);


return div;

