// Unit circle

var spacing = 1; // space between the circle and the graph

var div1 = Numbas.extensions.jsxgraph.makeBoard('900px','223px', 
  {
    boundingBox: [-1.2, 1.2, 1+spacing+2*Math.PI+0.2, -1.2], // xmin, ymax, xmax, ymin
    axis: true,
    showNavigation: true,
    grid: true
  });

var board1 = div1.board;


var p1 = board1.create('point', [0, 0], {name: ''});
p1.setProperty({fixed:true});
var circle = board1.create('circle', [p1, 1]); // [0,0]
var g1 = board1.create('glider', [0.5, Math.sqrt(1 - Math.pow(0.5, 2)),  circle]);

var l1 = board1.create('line', [p1, g1]);



// var thetaDisplay = Math.round(theta/Math.PI * 100) / 100 + ' PI';
var p2 = board1.create('point', [0, 0], {name: 'theta'});
p2.setProperty({fixed:true});


// 



var div2 = Numbas.extensions.jsxgraph.makeBoard('900px','223px', 
  {
    boundingBox: [-1.2, 1.2, 1+spacing+2*Math.PI+0.2, -1.2], // xmin, ymax, xmax, ymin
    axis: true,
    showNavigation: true,
    grid: true
  });
  var board2 = div2.board;

var func = function(t){ return Math.sin(t);}

var thetaFunc = function () {
  updateSecondGraph();

  var theta = Math.acos(g1.X());
  // If it is on the opposite side of the circle
  if (g1.Y() < 0) {
    theta = 2 * Math.PI - theta;
  }
  return theta;
};

function updateSecondGraph() {
  var j = document.getElementById('jsxgraph1');
  if (j) {
    if (j.childNodes[0]){
      if (typeof j.childNodes[0].click === 'function') {
        console.log('Update occurring: ' + Date.now())
        j.childNodes[0].click();
      }
    }
  }
}

var graph = board1.create('curve',
    [function(t){ return 1 + spacing + t},
    func,
    0, 2*Math.PI]
);

var p3 = board1.create('point', [function(){return 1 + spacing + thetaFunc()}, function(){return func(thetaFunc())}], {name: ''});
// p3.setProperty({fixed:true});
var p4 = board1.create('point', [function(){return 1 + spacing + thetaFunc()}, 0], {name: ''});
// p4.setProperty({fixed:true});

var l2 = board1.create('line', [p3, p4]);


var graph = board2.create('curve',
    [function(t){ return 1 + spacing + t},
    func,
    0, 2*Math.PI]
);

var p3 = board2.create('point', [function(){return 1 + spacing + thetaFunc()}, function(){return func(thetaFunc())}], {name: ''});
// p3.setProperty({fixed:true});
var p4 = board2.create('point', [function(){return 1 + spacing + thetaFunc()}, 0], {name: ''});
// p4.setProperty({fixed:true});

var l2 = board2.create('line', [p3, p4]);


var joinedDiv = document.createElement("div"); 
joinedDiv.appendChild(div1);
joinedDiv.appendChild(div2);
return joinedDiv;

