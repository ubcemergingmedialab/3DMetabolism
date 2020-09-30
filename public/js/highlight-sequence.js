AFRAME.registerComponent("highlight-sequence", {
  schema: {
    sequence: { type: 'string', default: "1" },
  },
  init: function () {
    console.log("HIGHLIGHT INIT");
    this.el.addEventListener('click', () => {
      const component = this.el.getAttribute("highlight-sequence");
      const sequenceName = component.sequence;
      const nodes = View.sequences.nodes[sequenceName];
      const edges = View.sequences.edges[sequenceName];
      for (let i = 0; i < nodes.length; i++) {
        const metabolite = nodes[i];
        console.log("HIGHLIGHT" + metabolite);
        const curElement = document.getElementById(metabolite);
        if (curElement === null) {
          console.log("could not find node " + metabolite);
          continue;
        }
        curElement.setAttribute("material", "color", "red");
        if (nodes[i + 1] !== null) {
          const outputMetabolite = nodes[i + 1];
          console.log("looking for " + metabolite + "/" + outputMetabolite);
          const curEdge = document.getElementById(metabolite + "/" + outputMetabolite);
          if (curEdge === null) {
            console.log("could not find edge " + metabolite + "/" + outputMetabolite);
            continue;
          }
          curEdge.setAttribute("material", "color", "purple");
        }
      }
      for (let i = 0; i < edges.length; i++) {
        const edge = edges[i];
        const edgeName = edge.input + '/' + edge.output;
        console.log("HIGHLIGHT" + edgeName);
        const curEdge = document.getElementById(edgeName);
        if (curEdge === null) {
          console.log("could not find node " + edgeName);
          continue;
        }
        curEdge.setAttribute("material", "color", "purple");
        [edge.input, edge.output].forEach((metabolite) => {
          const curElement = document.getElementById(metabolite);
          if (curElement === null) {
            console.log("could not find node " + metabolite);
          } else {
            curElement.setAttribute("material", "color", "red");
          }
        });
      }
    });
  }
})
