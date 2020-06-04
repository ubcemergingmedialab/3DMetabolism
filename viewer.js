var View = (function() {

  class Node {
    constructor(xPos, yPos, zPos, name, modelSource) {
      this.xPosition = xPos;
      this.yPosition = yPos;
      this.zPosition = zPos;
      this.name = name;
      this.modelSource = modelSource;
    };
    // get name() {
    //   return this.name;
    // }
    // get pos() {
    //   return '${this.xPosition} ${this.yPosition} ${this.zPostition}';
    //
    // }
  }

  class Edge {
    constructor(input, output) {
      this.input = input;
      this.output = output;
    }
  }

  var nodes = {
    glucose: new Node(0, 0, 0, "glucose", ""),
    glucose_6_phosphate: new Node(0, -1, 0, "glucose 6-phosphate", ""),
    fructose_6_phosphate: new Node(0, -2, 0, "fructose 6-phosphate", "")
  };


  var edges = [
    new Edge("glucose", "glucose_6_phosphate"),
    new Edge("glucose_6_phosphate", "fructose_6_phosphate")
  ];

  var init = function() {
    console.log(JSON.stringify(nodes));
  }

  return {
    init,
    nodes,
    edges
  };
})();

View.init();
// ----------------------------------


// var Present = (function() {
//   var views = Object.keys(View.nodes)
//
//   var init = function() {
//     console.log(JSON.stringify(views));
//   }
//
//   return {
//     init
//   };
// })();
//
// Present.init();
