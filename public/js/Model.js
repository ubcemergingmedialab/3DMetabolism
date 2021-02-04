var Model = (function () {

  class Node {
    //position is a THREE.Vector3
    constructor(position, name, /*modelSource, */flippedText, isPlaceholder) {
      this.position = position
      this.name = name;
      //this.modelSource = modelSource;
      if (flippedText === undefined) {
        this.flippedtext = false;
      } else {
        this.flippedText = flippedText;
      }
      this.isPlaceholder = !!isPlaceholder;
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
      let inputPosition = Model.nodes[this.input].position;
      let outputPosition = Model.nodes[this.output].position;
      let negInputPosition = (new THREE.Vector3()).copy(inputPosition).negate();

      let targetMag = (new THREE.Vector3()).add(outputPosition).add(negInputPosition);
      return (new THREE.Vector3()).copy(targetMag).multiplyScalar(0.5).add(inputPosition)
    }

    /**
     * returns Euler that represents the rotation of the edges to span cylinder between input and output nodes
     */
    GetRotation() {
      let inputPosition = Model.nodes[this.input].position;
      let outputPosition = Model.nodes[this.output].position;
      let negInputPosition = (new THREE.Vector3()).copy(inputPosition).negate();

      let targetVector = (new THREE.Vector3()).add(outputPosition).add(negInputPosition).normalize(); // AB = B - A
      let targetRotation = (new THREE.Quaternion()).setFromUnitVectors(new THREE.Vector3(0, 1, 0), targetVector) // rotation from up vector to AB
      return (new THREE.Euler()).setFromQuaternion(targetRotation); //turn to euler to apply to aframe entity
    }

    /**
     * returns height that is the distance between input and output nodes
     */
    GetHeight() {
      let inputPosition = Model.nodes[this.input].position;
      let outputPosition = Model.nodes[this.output].position;
      let negInputPosition = (new THREE.Vector3()).copy(inputPosition).negate();
      return (new THREE.Vector3()).add(outputPosition).add(negInputPosition).length();
    }
  }


  /**
   * nodes is an array of THREE.Vector3's.
   * Returns THREE.Vector3 with position at the midpoint of all nodes
   */
  const midPointVector = (nodes) => {
    const n = nodes.length;
    const { x, y, z } = nodes.reduce((acc, node) => {
      acc.x += node.position.x;
      acc.y += node.position.y;
      acc.z += node.position.z;

      return acc;
    }, {
      x: 0,
      y: 0,
      z: 0,
    });
    return new THREE.Vector3(x / n, y / n, z / n);
  }

  const fetchEdge = (input, output) => {
    return document.getElementById(input + "/" + output) || document.getElementById(output + "/" + input);
  }

  const fetchNode = (id) => {
    return document.getElementById(id);
  }

  var existingNodes = {
    glucose: new Node(new THREE.Vector3(0, 8, 0), "glucose", ""),
    glucose_6_phosphate: new Node(new THREE.Vector3(0, 7, 0), "glucose 6-phosphate", true),
    glucose_1_phosphate: new Node(new THREE.Vector3(2, 7, 0), "glucose 1-phosphate"),
    upd_glucose: new Node(new THREE.Vector3(4, 7, 0), "UPD-glucose", ""),
    glycogen: new Node(new THREE.Vector3(6, 7, 0), "glycogen", ""),
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
    glutamate: new Node(new THREE.Vector3(-1, -5, -4), "glutamate", true),
    aspartate:  new Node(new THREE.Vector3(-2, -7, -4), "aspartate", true),
    glutamate_2: new Node(new THREE.Vector3(-3, 1, 0), "glutamate", true),
    a_ketoglutarate_2: new Node(new THREE.Vector3(-3, 1, -4), "a-ketoglutarate", true),
    aspartate_2: new Node(new THREE.Vector3(-3, -1, -4), "aspartate", true),
  };

  var placeholderNodes = {
    dihydroxyacetone_phosphate_glyceraldehyde_3_phosphate_placeholder: new Node(midPointVector([
      existingNodes.dihydroxyacetone_phosphate,
      existingNodes.glyceraldehyde_3_phosphate,
    ]), "placeholder", false, true),
    oxaloacetate_2_citrate_placeholder: new Node(midPointVector([
      existingNodes.oxaloacetate_2,
      existingNodes.citrate,
    ]), "placeholder", false, true),
    glutamate_oxaloacetate_2_placeholder: new Node(midPointVector([
      existingNodes.glutamate,
      existingNodes.oxaloacetate_2,
    ]), "placeholder", false, true),
    aspartate_fumarate_placeholder: new Node(midPointVector([
      existingNodes.aspartate,
      existingNodes.fumarate,
    ]), "placeholder", false, true),
    glutamate_2_oxaloacetate_1_placeholder: new Node(midPointVector([
      existingNodes.glutamate_2,
      existingNodes.oxaloacetate_1,
    ]), "placeholder", false, true),
    a_ketoglutarate_2_aspartate_2_placeholder: new Node(midPointVector([
      existingNodes.a_ketoglutarate_2,
      existingNodes.aspartate_2,
    ]), "placeholder", false, true),
  };

  var nodes = {
    ...existingNodes,
    ...placeholderNodes,
  };

  var all_pathways = [
    new Edge("glucose_6_phosphate", "glucose", "/img/G6P-to-Glucose-v002.png", " /obj/alpha-d-glucose-6-phosphate_v002.glb", " /obj/alpha-d-glucose_v002.glb"),
    new Edge("fructose_6_phosphate", "glucose_6_phosphate"),
    new Edge("glucose_6_phosphate", "glucose_1_phosphate"),
    new Edge("glucose_1_phosphate", "upd_glucose"),
    new Edge("upd_glucose", "glycogen"),
    new Edge("glucose_1_phosphate", "glycogen"),
    new Edge("fructose_1_6_bisphosphate", "fructose_6_phosphate"),
    new Edge("glycerol_3_phosphate", "dihydroxyacetone_phosphate"),
    new Edge("glycerol", "glycerol_3_phosphate"),
    new Edge("dihydroxyacetone_phosphate", "glyceraldehyde_3_phosphate"),
    new Edge("glyceraldehyde_3_phosphate", "_1_3_bisphosphoglycerate"),
    new Edge("_1_3_bisphosphoglycerate", "_3_phosphoglycerate"),
    new Edge("_3_phosphoglycerate", "_2_phosphoglycerate"),
    new Edge("_2_phosphoglycerate", "phosphoenolpyruvate_1", "/img/pyruvate_carboxylase.png"),
    new Edge("phosphoenolpyruvate_1", "pyruvate_1"),
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
    new Edge("pyruvate_2", "acetyl_coA"),

    // PLACEHOLDERS
    new Edge("fructose_1_6_bisphosphate", "dihydroxyacetone_phosphate_glyceraldehyde_3_phosphate_placeholder"),
    new Edge("dihydroxyacetone_phosphate", "dihydroxyacetone_phosphate_glyceraldehyde_3_phosphate_placeholder"),
    new Edge("glyceraldehyde_3_phosphate", "dihydroxyacetone_phosphate_glyceraldehyde_3_phosphate_placeholder"),
    new Edge("acetyl_coA", "oxaloacetate_2_citrate_placeholder"),

    // pathways in z-plane
    new Edge("glutamate", "glutamate_oxaloacetate_2_placeholder"),
    new Edge("glutamate_oxaloacetate_2_placeholder", "oxaloacetate_2"),
    new Edge("aspartate", "aspartate_fumarate_placeholder"),
    new Edge("aspartate_fumarate_placeholder", "fumarate"),
    new Edge("glutamate_oxaloacetate_2_placeholder", "aspartate_fumarate_placeholder"),

    new Edge("glutamate_2", "glutamate_2_oxaloacetate_1_placeholder"),
    new Edge("glutamate_2_oxaloacetate_1_placeholder", "oxaloacetate_1"),
    new Edge("a_ketoglutarate_2", "a_ketoglutarate_2_aspartate_2_placeholder"),
    new Edge("a_ketoglutarate_2_aspartate_2_placeholder", "aspartate_2"),
    new Edge("glutamate_2_oxaloacetate_1_placeholder", "a_ketoglutarate_2_aspartate_2_placeholder"),
  ];
  var gluconeogenesis = [
    new Edge("glucose_6_phosphate", "glucose", "/img/pyruvate_carboxylase.png", "/obj/pyruvate.glb", "/obj/oxaloacetate.glb"),
    new Edge("fructose_6_phosphate", "glucose_6_phosphate"),
    new Edge("fructose_1_6_bisphosphate", "fructose_6_phosphate"),
    new Edge("dihydroxyacetone_phosphate", "glyceraldehyde_3_phosphate"),
    new Edge("glyceraldehyde_3_phosphate", "_1_3_bisphosphoglycerate"),
    new Edge("_1_3_bisphosphoglycerate", "_3_phosphoglycerate"),
    new Edge("_3_phosphoglycerate", "_2_phosphoglycerate"),
    new Edge("_2_phosphoglycerate", "phosphoenolpyruvate_1", "/img/pyruvate_carboxylase.png"),
    new Edge("phosphoenolpyruvate_1", "pyruvate_1"),
    new Edge("pyruvate_2", "oxaloacetate_2"),
    new Edge("phosphoenolpyruvate_2", "oxaloacetate_2"),
    // PLACEHOLDERS
    new Edge("fructose_1_6_bisphosphate", "dihydroxyacetone_phosphate_glyceraldehyde_3_phosphate_placeholder"),
  ];

  var glycolysis = [
    new Edge("glucose", "glucose_6_phosphate", "/img/pyruvate_carboxylase.png"),
    new Edge("fructose_6_phosphate", "glucose_6_phosphate"),
    new Edge("fructose_1_6_bisphosphate", "fructose_6_phosphate"),
    new Edge("dihydroxyacetone_phosphate", "glyceraldehyde_3_phosphate"),
    new Edge("glyceraldehyde_3_phosphate", "_1_3_bisphosphoglycerate"),
    new Edge("_1_3_bisphosphoglycerate", "_3_phosphoglycerate"),
    new Edge("_3_phosphoglycerate", "_2_phosphoglycerate"),
    new Edge("_2_phosphoglycerate", "phosphoenolpyruvate_1", "/img/pyruvate_carboxylase.png"),
    new Edge("phosphoenolpyruvate_1", "pyruvate_1"),
    // PLACEHOLDERS
    new Edge("fructose_1_6_bisphosphate", "dihydroxyacetone_phosphate_glyceraldehyde_3_phosphate_placeholder"),
  ];

  var pyruvate_dehydrogenase = [
    new Edge("pyruvate_2", "acetyl_coA")
  ];

  var citric_acid_cycle = [
    new Edge("oxaloacetate_2", "citrate"),
    new Edge("citrate", "isocitrate"),
    new Edge("isocitrate", "a_ketoglutarate"),
    new Edge("a_ketoglutarate", "succinyl_coa"),
    new Edge("succinyl_coa", "succinate"),
    new Edge("succinate", "fumarate"),
    new Edge("fumarate", "malate_2"),
    new Edge("malate_2", "oxaloacetate_2"),
    new Edge("acetyl_coA", "oxaloacetate_2_citrate_placeholder")
  ];

  var glycogenesis = [
    new Edge("glucose_6_phosphate", "glucose_1_phosphate"),
    new Edge("glucose_1_phosphate", "upd_glucose"),
    new Edge("upd_glucose", "glycogen")
  ];

  var glycogenolysis = [
    new Edge("glucose_6_phosphate", "glucose_1_phosphate"),
    new Edge("glucose_1_phosphate", "glycogen"),
  ];

  var oxidative_phosphorylation = [];

  var pathways = {
    "all_pathways": all_pathways,
    "glycolysis": glycolysis,
    "gluconeogenesis": gluconeogenesis,
    "pyruvate_dehydrogenase": pyruvate_dehydrogenase,
    "citric_acid_cycle": citric_acid_cycle,
    "glycogenesis": glycogenesis,
    "glycogenolysis": glycogenolysis,
    "oxidative_phosphorylation": oxidative_phosphorylation
  }

  var sequences = {
    nodes: {
      gluconeogenesis: {
        "glycerol_to_glucose": [[
          "glycerol",
          "glycerol_3_phosphate",
          "dihydroxyacetone_phosphate",
          "glyceraldehyde_3_phosphate-1",
          "none3",
          "none4",
          "glyceraldehyde_3_phosphate-2",
          "dihydroxyacetone_phosphate_glyceraldehyde_3_phosphate_placeholder"
        ], [
          "none2",
          "none3",
          "none4",
          "none5",
          "glycerol",
          "glycerol_3_phosphate",
          "dihydroxyacetone_phosphate",
          "dihydroxyacetone_phosphate_glyceraldehyde_3_phosphate_placeholder",
          "fructose_1_6_bisphosphate",
          "fructose_6_phosphate",
          "glucose_6_phosphate",
          "glucose"
        ]],
        "lactate_to_glucose": [[
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
          "dihydroxyacetone_phosphate_glyceraldehyde_3_phosphate_placeholder",
          "fructose_1_6_bisphosphate", // handle T-shaped reaction
          "fructose_6_phosphate",
          "glucose_6_phosphate",
          "glucose",
        ], [
          "none1",
          "none2",
          "none3",
        ]],
      }
    },
    edges: {
      "1": [
      ],
    },
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
    sequences,
    fetchEdge,
    fetchNode
  };
})();

document.addEventListener("DOMContentLoaded", () => {
  Model.init();
})
