var View = (function() {

  class Node {
    //position is a THREE.Vector3
    constructor(position, name, /*modelSource, */flippedText) {
      this.position = position
      this.name = name;
      //this.modelSource = modelSource;
      if(flippedText === undefined) {
        this.flippedtext = false;
      } else {
        this.flippedText = flippedText;
      }
    };
  }

  class Edge {
    constructor(input, output, src) {
      this.input = input;
      this.output = output;
      this.src = src;
    }
    
  }

  var nodes = {
    glucose: new Node(new THREE.Vector3(0, 8, 0), "glucose", ""),
    glucose_6_phosphate: new Node(new THREE.Vector3(0, 7, 0), "glucose 6-phosphate", ""),
    fructose_6_phosphate: new Node(new THREE.Vector3(0, 6, 0), "fructose 6-phosphate", ""),
    fructose_1_6_biphosphate: new Node(new THREE.Vector3(0, 5, 0), "fructose 1,6-biphosphate"),
    dihydroxyacetone_phosphate: new Node(new THREE.Vector3(-1, 4.5, 0), "dihydroxyacetone phosphate", true),
    glycerol_3_phosphate: new Node(new THREE.Vector3(-2, 4, 0), "glycerol 3-phosphate", true),
    glycerol: new Node(new THREE.Vector3(-2, 3, 0), "glycerol", true),
    glyceraldehyde_3_phosphate: new Node(new THREE.Vector3(0, 4, 0), "glyceraldehyde 3-phosphate"),
    _1_3_biphosphoglycerate: new Node(new THREE.Vector3(0, 3, 0), "1,3-biphosphoglycerate"),
    _3_phosphoglycerate: new Node(new THREE.Vector3(0, 2, 0), "3-phosphoglycerate"),
    _2_phosphoglycerate: new Node(new THREE.Vector3(0, 1, 0), "2-phosphoglycerate"),
    phosphoenolpyruvate_1: new Node(new THREE.Vector3(0, 0, 0), "phosphoenolpyruvate", true),
    pyruvate_1: new Node(new THREE.Vector3(0, -1, 0), "pyruvate"),
    lactate: new Node(new THREE.Vector3(2, -1, 0), "lactate"),
    oxaloacetate_1: new Node(new THREE.Vector3(-3, -1, 0), "oxaloacetate"),
    malate_1: new Node(new THREE.Vector3(-4, -1, 0), "malate", true),
    pyruvate_2: new Node(new THREE.Vector3(0, -3, 0), "pyruvate"),
    phosphoenolpyruvate_2: new Node(new THREE.Vector3(-1, -3, 0), "phosphoenolpyruvate", true),
    oxaloacetate_2: new Node(new THREE.Vector3(-1, -4, 0), "oxaloacetate", true),
    citrate: new Node(new THREE.Vector3(1, -4, 0), "citrate"),
    isocitrate: new Node(new THREE.Vector3(2, -5, 0), "isocitrate"),
    a_ketoglutarate: new Node(new THREE.Vector3(2, -6, 0), "a-ketoglutarate"),
    succinyl_coa: new Node(new THREE.Vector3(1, -7, 0), "succinyl-CoA"),
    succinate: new Node(new THREE.Vector3(-1, -7, 0), "succinate", true),
    fumarate: new Node(new THREE.Vector3(-2, -6, 0), "fumarate", true),
    malate_2: new Node(new THREE.Vector3(-2, -5, 0), "malate", true),
  };


  var edges = [
    new Edge("glucose", "glucose_6_phosphate", "/img/pyruvate_carboxylase.png"),
    new Edge("glucose_6_phosphate", "fructose_6_phosphate"),
    new Edge("fructose_6_phosphate", "fructose_1_6_biphosphate"),
    new Edge("fructose_1_6_biphosphate","dihydroxyacetone_phosphate"),
    new Edge("glycerol_3_phosphate","glycerol"),
    new Edge("dihydroxyacetone_phosphate","glyceraldehyde_3_phosphate"),
    new Edge("dihydroxyacetone_phosphate","glycerol_3_phosphate"),
    new Edge("fructose_1_6_biphosphate","glyceraldehyde_3_phosphate"),
    new Edge("glyceraldehyde_3_phosphate","_1_3_biphosphoglycerate"),
    new Edge("_1_3_biphosphoglycerate","_3_phosphoglycerate"),
    new Edge("_3_phosphoglycerate","_2_phosphoglycerate"),
    new Edge("_2_phosphoglycerate","phosphoenolpyruvate_1", "/img/pyruvate_carboxylase.png"),
    new Edge("phosphoenolpyruvate_1","oxaloacetate_1"),
    new Edge("oxaloacetate_1","malate_1"),
    new Edge("pyruvate_1","lactate"),
    new Edge("pyruvate_2","oxaloacetate_2"),
    new Edge("phosphoenolpyruvate_2","oxaloacetate_2"),
    new Edge("oxaloacetate_2","citrate"),
    new Edge("citrate","isocitrate"),
    new Edge("isocitrate","a_ketoglutarate"),
    new Edge("a_ketoglutarate","succinyl_coa"),
    new Edge("succinyl_coa","succinate"),
    new Edge("succinate","fumarate"),
    new Edge("fumarate","malate_2"),
    new Edge("malate_2","oxaloacetate_2"),
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
