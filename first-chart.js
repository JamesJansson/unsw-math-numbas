// Code partially inspired by 
// Use student input in a JSXGraph diagram by Christian Lawson-Perfect
// https://numbas.mathcentre.ac.uk/question/2223/use-student-input-in-a-jsxgraph-diagram/

var div = Numbas.extensions.jsxgraph.makeBoard('400px','400px',
  {
    boundingBox: [-13,16,13,-16], // xmin, ymax, xmax, ymin
    axis: false,
    showNavigation: false,
    grid: true
  });

// board.suspendUpdate(); 


var board = div.board;

var xaxis = board.create('line', [[0,0],[1,0]],
    {
      strokeColor: 'black',
      fixed: true
    });
var xticks = board.create('ticks', [xaxis, 2],
    {
      drawLabels: true,
      label: {offset: [-4, -15]},
      minorTicks: 0
    });

var yaxis = board.create('line', [[0,0],[0,1]], 
    {
      strokeColor: 'black',
      fixed: true
    });
var yticks = board.create('ticks', [yaxis,2],
    {
      drawLabels: true,
      label: {offset: [-20, 0]},
      minorTicks: 0
    });

// Create bar chart from here
// http://jsxgraph.uni-bayreuth.de/wiki/index.php/Dynamic_bar_chart
// http://jsxgraph.uni-bayreuth.de/wiki/index.php/Different_chart_styles

function equation(x) {
  return a*x*x + b*x + c;
}

// function makecurve(x) {
//   // Create a JME scope with the variable x set to the given value.
//   var nscope = new Numbas.jme.Scope([
//       Numbas.jme.builtinScope,
//       {variables: {x: new Numbas.jme.types.TNum(x)}}
//   ]);
//   return Numbas.jme.evaluate(equation, nscope).value;
// }

var curveline = board.create('functiongraph',
                [equation, -2, 4]);

// var curveline = board.create('functiongraph', 
//    [makecurve,-13,13],
//    {strokeColor:'black', strokeWidth: 3, visible: false}
//   );

var barWidth = 0.5;

var length = 10;

var x = [];
for (var i=0; i<length/barWidth; i++) {
  
  x.push(i*barWidth);
  
  
  
}

//var fbar = [5, 6, 7, 8];

var fbar = [];
x.forEach(function(xval){
  // if left
  fbar.push(equation(xval));
  // if mid, + 0.5 * barWidth
  // fbar.push(equation(xval + 0.5 * barWidth));
  // if mid, + barWidth
  // fbar.push(equation(xval + barWidth));
});

labels = fbar * barWidth;

var chart = board.createElement('chart', [fbar], 
    {chartStyle:'bar', width: barWidth, labels:labels, strokeColor: '#0000FF', strokeWidth:'3px'});


// for polygons
i=0;
var p1 = board.create('point', [x[i], fbar[i]], {size:0, strokeColor:'blue'});
var p2 = board.create('point', [x[i], 0], {size:0, strokeColor:'blue'});
var p3 = board.create('point', [x[i] + barWidth, 0], {size:0, strokeColor:'blue'});
var p4 = board.create('point', [x[i] + barWidth, fbar[i]], {size:0, strokeColor:'blue'});

var poly = board.createElement('polygon',[p1, p2, p3, p4]);

// http://jsxgraph.uni-bayreuth.de/wiki/index.php/Polygon


    //, colorArray:['#B02B2C','#3F4C6B','#C79810','#D15600']}); // try color, or maybe repeat colour

// Perform a definite integral on the function

// board.unsuspendUpdate();

// board.update();

return div;