var View = (function() {

  class Node {
    //position is a THREE.Vector3
    constructor(position, name, modelSource, flippedText = false) {
      this.position = position
      this.name = name;
      this.modelSource = modelSource;
      this.flippedText = flippedText;
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
    glucose: new Node(new THREE.Vector3(0, 8, -1), "glucose", ""),
    glucose_6_phosphate: new Node(new THREE.Vector3(0, 7, -1), "glucose 6-phosphate", ""),
    fructose_6_phosphate: new Node(new THREE.Vector3(0, 6, -1), "fructose 6-phosphate", ""),
    fructose_1_6_biphosphate: new Node(new THREE.Vector3(0, 5, -1), "fructose 1,6-biphosphate"),
    dihydroxyacetone_phosphate: new Node(new THREE.Vector3(-1, 4.5, -1), "dihydroxiacetone phosphate", true),
    glycerol_3_phosphate: new Node(new THREE.Vector3(-2, 4, -1), "glycerol 3-phosphate", true),
    glycerol: new Node(new THREE.Vector3(-2, 3, -1), "glycerol", true),
    glyceraldehyde_3_phosphate: new Node(new THREE.Vector3(0, 4, -1), "glyceraldehyde 3-phosphate"),
    _1_3_biphosphoglycerate: new Node(new THREE.Vector3(0, 3, -1), "1,3-biphosphoglycerate"),
    _3_phosphoglycerate: new Node(new THREE.Vector3(0, 2, -1), "3-phosphoglycerate"),
    _2_phosphoglycerate: new Node(new THREE.Vector3(0, 1, -1), "2-phosphoglycerate"),
    phosphoenolpyruvate: new Node(new THREE.Vector3(0, 0, -1), "phosphoenolpyruvate", true),
    pyruvate_1: new Node(new THREE.Vector3(0, -1, -1), "pyruvate"),
    lactate: new Node(new THREE.Vector3(2, -1, -1), "lactate"),
    oxaloacetate_1: new Node(new THREE.Vector3(-3, -1, -1), "oxaloacetate", true),
    malate_1: new Node(new THREE.Vector3(-4, -1, -1), "malate", true),
    pyruvate_2: new Node(new THREE.Vector3(0, -3, -1), "pyruvate"),
    phosphoenolpyruvate: new Node(new THREE.Vector3(-1, -3, -1), "phosphoenolpyruvate"),
    oxaloacetate_2: new Node(new THREE.Vector3(-1, -4, -1), "oxaloacetate", true),
    citrate: new Node(new THREE.Vector3(1, -4, -1), "citrate"),
    isocitrate: new Node(new THREE.Vector3(2, -5, -1), "isocitrate"),
    a_ketoglutarate: new Node(new THREE.Vector3(2, -6, -1), "a-ketoglutarate"),
    succinyl_coa: new Node(new THREE.Vector3(1, -7, -1), "succinyl-CoA"),
    succinate: new Node(new THREE.Vector3(-1, -7, -1), "succinate"),
    fumarate: new Node(new THREE.Vector3(-1, -6, -1), "succinate", true),
    malate_2: new Node(new THREE.Vector3(-1, -5, -1), "succinate", true),
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
