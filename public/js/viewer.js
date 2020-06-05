var View = (function() {

  class Node {
    //position is a THREE.Vector3
    constructor(position, name, modelSource) {
      this.position = position
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
    glucose: new Node(new THREE.Vector3(0, 3, 0), "glucose", ""),
    glucose_6_phosphate: new Node(new THREE.Vector3(0, -1, 0), "glucose 6-phosphate", ""),
    fructose_6_phosphate: new Node(new THREE.Vector3(2, -4, 0), "fructose 6-phosphate", "")
  };


  var edges = [
    new Edge("glucose", "glucose_6_phosphate"),
    new Edge("glucose_6_phosphate", "fructose_6_phosphate")
  ];

  var init = function() {
    //console.log(JSON.stringify(nodes));
  }

  return {
    init,
    nodes,
    edges
  };
})();

document.addEventListener("DOMContentLoaded", () => {
  View.init();
})
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
