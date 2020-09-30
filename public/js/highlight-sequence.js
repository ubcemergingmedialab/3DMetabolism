AFRAME.registerComponent("highlight-sequence", {
  schema: {
    sequence: { type: 'string', default: "1" },
  },
  init: function () {
    console.log("HIGHLIGHT INIT");
    const colorEdge = (input, output) => {
      const curEdge = document.getElementById(input + "/" + output);
      if (curEdge == null) {
        console.log("could not find edge " + input + "/" + output);
      } else {
        curEdge.setAttribute("material", "color", "purple");
      }
    };
    const colorNode = (node) => {
      const curElement = document.getElementById(node);
      if (curElement === null) {
        console.log("could not find node " + node);
      } else {
        curElement.setAttribute("material", "color", "red");
      }
    };
    this.el.addEventListener('click', () => {
      const component = this.el.getAttribute("highlight-sequence");
      const sequenceName = component.sequence;
      const nodes = View.sequences.nodes[sequenceName];
      const edges = View.sequences.edges[sequenceName];
      for (let i = 0; i < nodes.length; i++) {
        const metabolite = nodes[i];
        console.log("HIGHLIGHT" + metabolite);
        colorNode(metabolite);
        const outputMetabolite = nodes[i + 1];
        if (outputMetabolite !== null) {
          colorEdge(metabolite, outputMetabolite);
        }
      }
      edges.forEach((edge) => {
        colorEdge(edge.input, edge.output);
        [edge.input, edge.output].forEach((metabolite) => {
          colorNode(metabolite);
        });
      });
    });
  }
})
