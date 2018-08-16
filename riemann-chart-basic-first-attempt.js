var div = Numbas.extensions.jsxgraph.makeBoard('400px','400px',
  {
    boundingBox: [-13,16,13,-16], // xmin, ymax, xmax, ymin
    axis: false,
    showNavigation: false,
    grid: true
  });

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

var barWidth = 0.5;

var fbar = [5, 6, 7, 8];

labels = fbar * barWidth;

var chart = board.createElement('chart', [fbar], 
    {chartStyle:'bar', width: barWidth, labels:labels, colorArray:['#B02B2C','#3F4C6B','#C79810','#D15600']}); // try color, or maybe repeat colour


return div;