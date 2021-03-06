// Need condition: turning point < x_0 to ensure not ridiculous flicking around


var compiledExpression = Numbas.jme.compile(equation_string, scope);
if(compiledExpression === null) {
  throw(new Error('No equation'));
}
function equation(x) {
  // Create a JME scope with the variable x set to the given value.
  var nscope = new Numbas.jme.Scope([
      Numbas.jme.builtinScope,
      {
        variables: {
          x: new Numbas.jme.types.TNum(x),
          // c_4: new Numbas.jme.types.TNum(c_4),
          // c_3: new Numbas.jme.types.TNum(c_3),
          // c_2: new Numbas.jme.types.TNum(c_2),
          // c_1: new Numbas.jme.types.TNum(c_1),
          // c_0: new Numbas.jme.types.TNum(c_0)
        }
      }
  ]);
  return Numbas.jme.evaluate(compiledExpression, nscope).value;
}

y_1 = equation(x_1);
y_0 = equation(x_0);

// x_chart_min and x_chart_max are the min and max positions of the interesting elements of the chart. 
// We will make the chart bounds slightly larger, such that the interesting chart elements take up roughly 70% of the screen
var bufferProp = 0.4;
var xDisplayRange = Math.max(x_1, 0) - Math.min(0, x_0);
xBoundMin = Math.min(-xDisplayRange*bufferProp, x_0 - xDisplayRange*bufferProp);
xBoundMax = Math.max(xDisplayRange*bufferProp, x_1 + xDisplayRange*bufferProp);

// This needs a max for the _1 AND _2 points
var yDisplayRange = Math.max(y_1, 0) - Math.min(0, y_0);
yBoundMin = Math.min(-yDisplayRange*bufferProp, y_0 - yDisplayRange*bufferProp);
yBoundMax = Math.max(yDisplayRange*bufferProp, y_1 + yDisplayRange*bufferProp);

var div = Numbas.extensions.jsxgraph.makeBoard('600px','600px', 
  {
    boundingBox: [xBoundMin, yBoundMax, xBoundMax, yBoundMin], // xmin, ymax, xmax, ymin
    axis: true,
    showNavigation: true,
    grid: true
  });

var board = div.board;


var graph = board.create('curve',
    [function(x){ return x},
    equation,
    xBoundMin, xBoundMax]
);


var p0 = board.create('point', [x_0, y_0], {fixed:true});
var p1 = board.create('point', [x_1, y_1], {fixed:true});

var lineVertical = board.create('line', [p1, [function(){return p1.X()}, function(){return p0.Y()}]], {strokeWidth: 4, straightFirst:false, straightLast:false});
var lineHorizontal = board.create('line', [p0, [function(){return p1.X()}, function(){return p0.Y()}]], {strokeWidth: 4, straightFirst:false, straightLast:false});
var lineDiagonal = board.create('line', [p0, p1], {strokeWidth: 4, straightFirst:false, straightLast:false});
var lineTangent = board.create('line', [p0, p1], {strokeWidth: 1});

return div;

