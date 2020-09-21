var View = (function () {

  class Node {
    //position is a THREE.Vector3
    constructor(position, name, /*modelSource, */flippedText) {
      this.position = position
      this.name = name;
      //this.modelSource = modelSource;
      if (flippedText === undefined) {
        this.flippedtext = false;
      } else {
        this.flippedText = flippedText;
      }
    };
  }

  class Edge {
    constructor(input, output, imgSrc, inputElSrc, outputElSrc) {
      this.input = input;
      this.output = output;
      this.imgSrc = imgSrc;
      this.leftElSrc = inputElSrc;
      this.rightElSrc = outputElSrc;
    }

    GetObject3D() {
      return this.object3D;
    }

    /**
     * returns a THREE.Vector3 for edge's position, which should be midpoint between input and output
     */
    GetPosition() {
      let inputPosition = View.nodes[this.input].position;
      let outputPosition = View.nodes[this.output].position;
      let negInputPosition = (new THREE.Vector3()).copy(inputPosition).negate();

      let targetMag = (new THREE.Vector3()).add(outputPosition).add(negInputPosition);
      return (new THREE.Vector3()).copy(targetMag).multiplyScalar(0.5).add(inputPosition)
    }

    /**
     * returns Euler that represents the rotation of the edges to span cylinder between input and output nodes
     */
    GetRotation() {
      let inputPosition = View.nodes[this.input].position;
      let outputPosition = View.nodes[this.output].position;
      let negInputPosition = (new THREE.Vector3()).copy(inputPosition).negate();

      let targetVector = (new THREE.Vector3()).add(outputPosition).add(negInputPosition).normalize(); // AB = B - A
      let targetRotation = (new THREE.Quaternion()).setFromUnitVectors(new THREE.Vector3(0, 1, 0), targetVector) // rotation from up vector to AB
      return (new THREE.Euler()).setFromQuaternion(targetRotation); //turn to euler to apply to aframe entity
    }

    /**
     * returns height that is the distance between input and output nodes
     */
    GetHeight() {
      let inputPosition = View.nodes[this.input].position;
      let outputPosition = View.nodes[this.output].position;
      let negInputPosition = (new THREE.Vector3()).copy(inputPosition).negate();
      return (new THREE.Vector3()).add(outputPosition).add(negInputPosition).length();
    }
  }

  var nodes = {
    glucose: new Node(new THREE.Vector3(0, 8, 0), "glucose", ""),
    glucose_6_phosphate: new Node(new THREE.Vector3(0, 7, 0), "glucose 6-phosphate", ""),
    fructose_6_phosphate: new Node(new THREE.Vector3(0, 6, 0), "fructose 6-phosphate", ""),
    fructose_1_6_bisphosphate: new Node(new THREE.Vector3(0, 5, 0), "fructose 1,6-bisphosphate"),
    dihydroxyacetone_phosphate: new Node(new THREE.Vector3(-1, 4.5, 0), "dihydroxyacetone phosphate", true),
    glycerol_3_phosphate: new Node(new THREE.Vector3(-2, 4, 0), "glycerol 3-phosphate", true),
    glycerol: new Node(new THREE.Vector3(-2, 3, 0), "glycerol", true),
    glyceraldehyde_3_phosphate: new Node(new THREE.Vector3(0, 4, 0), "glyceraldehyde 3-phosphate"),
    _1_3_bisphosphoglycerate: new Node(new THREE.Vector3(0, 3, 0), "1,3-bisphosphoglycerate"),
    _3_phosphoglycerate: new Node(new THREE.Vector3(0, 2, 0), "3-phosphoglycerate"),
    _2_phosphoglycerate: new Node(new THREE.Vector3(0, 1, 0), "2-phosphoglycerate"),
    phosphoenolpyruvate_1: new Node(new THREE.Vector3(0, 0, 0), "phosphoenolpyruvate", true),
    pyruvate_1: new Node(new THREE.Vector3(0, -1, 0), "pyruvate"),
    lactate: new Node(new THREE.Vector3(2, -1, 0), "lactate"),
    oxaloacetate_1: new Node(new THREE.Vector3(-3, -1, 0), "oxaloacetate"),
    malate_1: new Node(new THREE.Vector3(-4, -1, 0), "malate", true),
    pyruvate_2: new Node(new THREE.Vector3(0, -3, 0), "pyruvate"),
    acetyl_coA: new Node(new THREE.Vector3(0, -4, 0), "acetyl-coA"),
    phosphoenolpyruvate_2: new Node(new THREE.Vector3(-1, -3, 0), "phosphoenolpyruvate", true),
    oxaloacetate_2: new Node(new THREE.Vector3(-1, -5, 0), "oxaloacetate", true),
    citrate: new Node(new THREE.Vector3(1, -5, 0), "citrate"),
    isocitrate: new Node(new THREE.Vector3(2, -6, 0), "isocitrate"),
    a_ketoglutarate: new Node(new THREE.Vector3(2, -7, 0), "a-ketoglutarate"),
    succinyl_coa: new Node(new THREE.Vector3(1, -8, 0), "succinyl-CoA"),
    succinate: new Node(new THREE.Vector3(-1, -8, 0), "succinate", true),
    fumarate: new Node(new THREE.Vector3(-2, -7, 0), "fumarate", true),
    malate_2: new Node(new THREE.Vector3(-2, -6, 0), "malate", true),
  };



  var gluco = [
    new Edge("glucose", "glucose_6_phosphate", "/img/pyruvate_carboxylase.png", "/obj/pyruvate.glb", "/obj/oxaloacetate.glb"),
    new Edge("glucose_6_phosphate", "fructose_6_phosphate"),
    new Edge("fructose_6_phosphate", "fructose_1_6_bisphosphate"),
    new Edge("fructose_1_6_bisphosphate", "dihydroxyacetone_phosphate"),
    new Edge("dihydroxyacetone_phosphate", "glycerol_3_phosphate"),
    new Edge("glycerol_3_phosphate", "glycerol"),
    new Edge("dihydroxyacetone_phosphate", "glyceraldehyde_3_phosphate"),
    new Edge("fructose_1_6_bisphosphate", "glyceraldehyde_3_phosphate"),
    new Edge("glyceraldehyde_3_phosphate", "_1_3_bisphosphoglycerate"),
    new Edge("_1_3_bisphosphoglycerate", "_3_phosphoglycerate"),
    new Edge("_3_phosphoglycerate", "_2_phosphoglycerate"),
    new Edge("_2_phosphoglycerate", "phosphoenolpyruvate_1", "/img/pyruvate_carboxylase.png"),
    new Edge("oxaloacetate_1", "phosphoenolpyruvate_1"),
    new Edge("oxaloacetate_1", "malate_1"),
    new Edge("pyruvate_1", "lactate"),
    new Edge("pyruvate_2", "oxaloacetate_2"),
    new Edge("phosphoenolpyruvate_2", "oxaloacetate_2"),
    new Edge("oxaloacetate_2", "citrate"),
    new Edge("citrate", "isocitrate"),
    new Edge("isocitrate", "a_ketoglutarate"),
    new Edge("a_ketoglutarate", "succinyl_coa"),
    new Edge("succinyl_coa", "succinate"),
    new Edge("succinate", "fumarate"),
    new Edge("fumarate", "malate_2"),
    new Edge("malate_2", "oxaloacetate_2"),
  ];

  var glycolysis = [
    new Edge("glucose", "glucose_6_phosphate", "/img/pyruvate_carboxylase.png"),
    new Edge("glucose_6_phosphate", "fructose_6_phosphate"),
    new Edge("fructose_6_phosphate", "fructose_1_6_bisphosphate"),
    new Edge("fructose_1_6_bisphosphate", "dihydroxyacetone_phosphate"),
    new Edge("dihydroxyacetone_phosphate", "glyceraldehyde_3_phosphate"),
    new Edge("fructose_1_6_bisphosphate", "glyceraldehyde_3_phosphate"),
    new Edge("glyceraldehyde_3_phosphate", "_1_3_bisphosphoglycerate"),
    new Edge("_1_3_bisphosphoglycerate", "_3_phosphoglycerate"),
    new Edge("_3_phosphoglycerate", "_2_phosphoglycerate"),
    new Edge("_2_phosphoglycerate", "phosphoenolpyruvate_1", "/img/pyruvate_carboxylase.png"),
    new Edge("phosphoenolpyruvate_1", "pyruvate_1"),
    new Edge("pyruvate_2", "acetyl_coA"),
    new Edge("oxaloacetate_2", "acetyl_coA"),
    new Edge("acetyl_coA", "citrate"),
    new Edge("oxaloacetate_2", "citrate"),
    new Edge("citrate", "isocitrate"),
    new Edge("isocitrate", "a_ketoglutarate"),
    new Edge("a_ketoglutarate", "succinyl_coa"),
    new Edge("succinyl_coa", "succinate"),
    new Edge("succinate", "fumarate"),
    new Edge("fumarate", "malate_2"),
    new Edge("malate_2", "oxaloacetate_2"),
  ];

  var sequences = {
    "gluconeogenesis": [
      "1", "2",
    ],
    "glycolysis": [
      "3"
    ]
  }

  var pathways = {
    "gluconeogenesis": gluco,
    "glycolysis": glycolysis,
  }

  var sequences = {
    "1": [
      "glycerol",
      "glycerol_3_phosphate",
      "dihydroxyacetone_phosphate",
      "glyceraldehyde_3_phosphate",
      "fructose_1_6_bisphosphate", //misspelled?
      "fructose_6_phosphate",
      "glucose_6_phosphate",
      "glucose"
    ],
    "2": [
      "lactate",
      "pyruvate_1",
      "pyruvate_2",
      "oxaloacetate_2",
      "phosphoenolpyruvate_2",
      "phosphoenolpyruvate_1",
      "_2_phosphoglycerate",
      "_3_phosphoglycerate",
      "_1_3_bisphosphoglycerate",
      "glyceraldehyde_3_phosphate",
      "dihydroxyacetone_phosphate",
      "fructose_1_6_bisphosphate",
      "fructose_6_phosphate",
      "glucose_6_phosphate",
      "glucose"
    ]
  }

  var all_edges = {}

  var init = function () {
    //console.log(JSON.stringify(nodes));
    for (let listName in pathways) {
      for (let edge of pathways[listName]) {
        all_edges[edge.input + "/" + edge.output] = edge;
      }
    }
  }

  return {
    init,
    nodes,
    pathways,
    all_edges,
    sequences
  };
})();

document.addEventListener("DOMContentLoaded", () => {
  View.init();
})
