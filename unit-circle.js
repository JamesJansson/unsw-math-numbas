// Unit circle

var spacing = 1; // space between the circle and the graph

var axisStyle = {strokeColor: '#b2b2b2', straightFirst:false, straightLast:false, fixed:true};
var axisPointStyle = {size:0, strokeWidth:3, strokeColor: '#b2b2b2', fillColor: '#b2b2b2', fixed:true};
var axisPointStyleXLabel = {size:0, strokeWidth:0, strokeColor: '#b2b2b2', fillColor: '#b2b2b2', fixed:true};
var axisPointStyleYLabel = {size:0, strokeWidth:0, strokeColor: '#b2b2b2', fillColor: '#b2b2b2', fixed:true, label:{offset: [-20, 0]}};
var axisPointStyleBelow = {size:0, strokeWidth:3, strokeColor: '#b2b2b2', fillColor: '#b2b2b2', fixed:true, label:{offset: [-5, -13]}};
var axisPointStyleLeft = {size:0, strokeWidth:3, strokeColor: '#b2b2b2', fillColor: '#b2b2b2', fixed:true, label:{offset: [-20, 0]}};
var arcPointStyle = {name: '', size:0, strokeWidth:3, strokeColor: '#b2b2b2', fillColor: '#b2b2b2', fixed:true};

// Ratio calc
// y = 1.8 + 1.8 = 3.6
// x = 1.4 + (1+spacing+2*Math.PI+0.4) = 10.083185307179587
// 1080 * 3.6 / 10.083185307179587 = 386

var div = Numbas.extensions.jsxgraph.makeBoard('1080px','386px', 
  {
    boundingBox: [-1.4, 1.8, 1+spacing+2*Math.PI+0.4, -1.8], // xmin, ymax, xmax, ymin
    axis: false,
    showNavigation: false,
    grid: false
  });


var board = div.board;


// DRAW AXES
var lCircleXAxis = board.create('line', [[-1.2, 0], [1.2, 0]], axisStyle);
var lCircleYAxis = board.create('line', [[0, -1.2], [0, 1.2]], axisStyle);

var pCircleXAxisNeg = board.create('point', [0, -1], axisPointStyle);
pCircleXAxisNeg.setProperty({name:'-1'});
var pCircleXAxisPos = board.create('point', [0, 1], axisPointStyle);
pCircleXAxisPos.setProperty({name:'1'});
var pCircleYAxisNeg = board.create('point', [-1, 0], axisPointStyle);
pCircleYAxisNeg.setProperty({name:'-1'});
var pCircleYAxisPos = board.create('point', [1, 0], axisPointStyle);
pCircleYAxisPos.setProperty({name:'1'});
var pCurveYAxis1n = board.create('point', [1.2, 0], axisPointStyleXLabel);
pCurveYAxis1n.setProperty({name:'x'});
var pCurveYAxis1n = board.create('point', [0, 1.2], axisPointStyleYLabel);
pCurveYAxis1n.setProperty({name:'y'});

var lCurveXAxis = board.create('line', [[thetaOffSet(-0.2), 0], [thetaOffSet(2*Math.PI +1.2), 0]], axisStyle);
var lCurveYAxis = board.create('line', [[thetaOffSet(0), -1.2], [thetaOffSet(0), 1.2]], axisStyle);



var pCurveYAxisNeg = board.create('point', [thetaOffSet(0), -1], axisPointStyleLeft);
pCurveYAxisNeg.setProperty({name:'-1'});
var pCurveYAxisPos = board.create('point', [thetaOffSet(0), 1], axisPointStyleLeft);
pCurveYAxisPos.setProperty({name:'1'});
var pCurveXAxis1Pi = board.create('point', [thetaOffSet(Math.PI/2), 0], axisPointStyleBelow);
pCurveXAxis1Pi.setProperty({name:'π/2'});
var pCurveXAxis1Pi = board.create('point', [thetaOffSet(Math.PI), 0], axisPointStyleBelow);
pCurveXAxis1Pi.setProperty({name:'π'});
var pCurveXAxis2Pi = board.create('point', [thetaOffSet(3*Math.PI/2), 0], axisPointStyleBelow);
pCurveXAxis2Pi.setProperty({name:'3π/2'});
var pCurveXAxis2Pi = board.create('point', [thetaOffSet(2*Math.PI), 0], axisPointStyleBelow);
pCurveXAxis2Pi.setProperty({name:'2π'});


var pCurveYAxis1n = board.create('point', [thetaOffSet(2*Math.PI + 0.2), 0], axisPointStyleXLabel);
pCurveYAxis1n.setProperty({name:'θ'});
var pCurveYAxis1n = board.create('point', [thetaOffSet(0), 1.2], axisPointStyleYLabel);
pCurveYAxis1n.setProperty({name:'y'});




// LEFT CHART
var pointCircleCentre = board.create('point', [0, 0], {name: ''});
pointCircleCentre.setProperty({fixed:true});
var circle = board.create('circle', [pointCircleCentre, 1]); // [0,0]
var g1 = board.create('glider', [0.5, Math.sqrt(1 - Math.pow(0.5, 2)),  circle], {name: 'Drag this point'});

var lineRadius = board.create('line', [pointCircleCentre, g1], {straightFirst:false, straightLast:false});



var arcPoint1 = board.create('point', [0.75, 0], arcPointStyle);
var arcPoint2 = board.create('point', [function () {return 0.75*g1.X()}, function () {return 0.75*g1.Y()}], arcPointStyle);
board.create('arc', [pointCircleCentre, arcPoint1, arcPoint2], {strokeColor: '#b2b2b2'});


var thetaDisplay = function () { return 'θ=' + Math.round(thetaFunc()/Math.PI * 100) / 100 + 'π'};
var p3 = board.create('point', [0, 0], {name: thetaDisplay, fixed:true, label:{offset: [20, 10]}});

var lineVerticalCircle = board.create('line', [g1, [function(){return g1.X()}, 0]], {straightFirst:false, straightLast:false});
var lineHorizontalCircle = board.create('line', [[0,0], [function(){return g1.X()}, 0]], {straightFirst:false, straightLast:false});

if (functionType === 'sin' || functionType === 'tan') {
  var yDisplay = function () { return 'y=' + Math.round(g1.Y()* 100) / 100};
  var pYLabel = board.create('point', [function(){return g1.X()}, function(){return g1.Y()/2}], 
      {name: yDisplay, fixed:true, size:0, strokeWidth:0, strokeColor: '#0000FF', fillColor: '#0000FF', label:{offset: [5, -10]}});
}
if (functionType === 'cos' || functionType === 'tan') {
  var xDisplay = function () { return 'x=' + Math.round(g1.X()* 100) / 100};
  var pXLabel = board.create('point', [function(){return g1.X()/2}, 0], 
      {name: xDisplay, fixed:true, size:0, strokeWidth:0, strokeColor: '#0000FF', fillColor: '#0000FF', label:{offset: [-10, -15]}});
}

// RIGHT CHART
var func;
if (functionType === 'sin') {
  func = function(t){ return Math.sin(t);};
  lineVerticalCircle.setProperty({strokeColor: '#BB0000'});
}
if (functionType === 'cos') {
  func = function(t){ return Math.cos(t);};
  lineHorizontalCircle.setProperty({strokeColor: '#BB0000'});
}
if (functionType === 'tan') {
  func = function(t){ return Math.tan(t);};
  lineVerticalCircle.setProperty({strokeColor: '#BB0000'});
  lineHorizontalCircle.setProperty({strokeColor: '#BB0000'});
}


function thetaFunc () {
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

var curvePoint = board.create('point', [function(){return thetaOffSet(thetaFunc())}, function(){return func(thetaFunc())}], {name: ''});
var p4 = board.create('point', [function(){return thetaOffSet(thetaFunc())}, 0], {name: ''});

var lineVerticalCurve = board.create('line', [curvePoint, p4], {straightFirst:false, straightLast:false, strokeColor: '#BB0000'});


// draw cross-graph dotted lines (only for sine)
if (functionType === 'sin') {
  var crossGraphLine = board.create('line', [g1, curvePoint], {straightFirst:false, straightLast:false, dash:2});
}

return div;
