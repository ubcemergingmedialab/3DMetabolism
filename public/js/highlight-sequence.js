AFRAME.registerComponent("highlight-sequence", {
  schema: {
    sequence: { type: 'string', default: "1" },
  },
  init: function () {
    const EDGE_COLOR_HIGHLIGHT = "purple";
    const NODE_COLOR_HIGHLIGHT = "red";
    const EDGE_COLOR = "green";
    const NODE_COLOR = "blue";
    console.log("HIGHLIGHT INIT");
    const colorEdge = (input, output, color = EDGE_COLOR_HIGHLIGHT) => {
      const curEdge = document.getElementById(input + "/" + output);
      if (curEdge == null) {
        console.log("could not find edge " + input + "/" + output);
      } else {
        curEdge.setAttribute("material", "color", color);
      }
      outlineElem(input + "/" + output, 'edge');
    };
    const colorNode = (node, color = NODE_COLOR_HIGHLIGHT) => {
      const curElement = document.getElementById(node);
      if (curElement === null) {
        console.log("could not find node " + node);
      } else {
        curElement.setAttribute("material", "color", color);
      }
      outlineElem(node);
    };
    const outlineElem = (id, type = 'node') => {
      const curElement = document.getElementById(id);
      if (curElement == null) {
        console.log("could not find " + type +  " "+ id);
      } else {
        const outlineElement = document.createElement('a-entity');
        const { x: posX, y: posY, z: posZ } = curElement.getAttribute('position');
        if (type === 'edge') {
          const { height } = curElement.getAttribute('geometry');
          const { x: rotX, y: rotY, z: rotZ } = curElement.getAttribute('rotation');
          outlineElement.setAttribute('geometry','height:' + height);
          outlineElement.setAttribute('rotation', rotX + ' ' + rotY + ' ' + rotZ);
        }
        outlineElement.setAttribute('geometry','primitive:' + (type == 'edge' ? 'cylinder' : 'sphere'));
        outlineElement.setAttribute('material', 'color', 'cyan');
        outlineElement.setAttribute('material', 'side', 'back');
        outlineElement.setAttribute('scale', '0.28 ' + (type === 'edge' ? '1.0' : '0.28') + ' 0.28');
        outlineElement.setAttribute('position', posX + ' ' + posY + ' ' + posZ);
        outlineElement.setAttribute('isoutline', 'true');
        curElement.parentElement.appendChild(outlineElement);
      }
    };
    const cleanupOutlines = () => {
      const outlineElems = document.querySelectorAll("[isoutline='true']");
      outlineElems.forEach((elem) => {
        elem.parentElement.removeChild(elem);
      });
    };
    const cleanupHighlights = () => {
      const sequenceName = 'all_pathways'; // index into all pathways
      const nodes = View.sequences.nodes[sequenceName];
      const edges = View.pathways[sequenceName];
      if (nodes != undefined) {
        for (let i = 0; i < nodes.length; i++) {
          const metabolite = nodes[i];
          console.log("HIGHLIGHT" + metabolite);
          colorNode(metabolite, NODE_COLOR);
          const outputMetabolite = nodes[i + 1];
          if (outputMetabolite !== null) {
            colorEdge(metabolite, outputMetabolite, EDGE_COLOR);
          }
        }
      }
      if (edges != undefined) {
        edges.forEach((edge) => {
          colorEdge(edge.input, edge.output, EDGE_COLOR);
          [edge.input, edge.output].forEach((node) => colorNode(node, NODE_COLOR));
        });
      }
    }
    const cleanup = () => {
      cleanupOutlines();
      cleanupHighlights();
    }
    this.el.addEventListener('click', () => {
      cleanup();
      const component = this.el.getAttribute("highlight-sequence");
      const sequenceName = component.sequence;
      console.log("highlighting " + sequenceName);
      const nodes = View.sequences.nodes[sequenceName];
      const edges = View.pathways[sequenceName];
      if (nodes != undefined) {
        for (let i = 0; i < nodes.length; i++) {
          const metabolite = nodes[i];
          console.log("HIGHLIGHT" + metabolite);
          colorNode(metabolite);
          const outputMetabolite = nodes[i + 1];
          if (outputMetabolite !== null) {
            colorEdge(metabolite, outputMetabolite);
          }
        }
      }
      if (edges != undefined) {
        edges.forEach((edge) => {
          colorEdge(edge.input, edge.output);
          [edge.input, edge.output].forEach((node) => colorNode(node));
        });
      }
    });
  }
})
