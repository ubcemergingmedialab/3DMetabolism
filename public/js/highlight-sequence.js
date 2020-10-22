const HIGHLIGHT_EDGE_COLOR = 'purple';
const HIGHLIGHT_NODE_COLOR = 'red';
const INITIAL_EDGE_COLOR = 'green';
const INITIAL_NODE_COLOR = 'blue';
AFRAME.registerComponent("highlight-sequence", {
  schema: {
    sequence: { type: 'string', default: "1" },
    clickState: { type: 'number', default: 0 }, // 0 for unclicked, 1 for clicked, 2 for outline
  },
  init: function () {
    const colorEdge = (input, output, color = HIGHLIGHT_EDGE_COLOR) => {
      const curEdge = document.getElementById(input + "/" + output);
      if (curEdge == null) {
        console.log("could not find edge " + input + "/" + output);
      } else {
        curEdge.setAttribute("material", "color", color);
      }
    };
    const colorNode = (node, color = HIGHLIGHT_NODE_COLOR) => {
      const curElement = document.getElementById(node);
      if (curElement === null) {
        console.log("could not find node " + node);
      } else {
        curElement.setAttribute("material", "color", color);
      }
    };
    const outlineElem = (id, type = 'node') => {
      const curElement = document.getElementById(id);
      if (curElement == null) {
        console.log("could not find " + type +  " "+ id);
      } else {
        const outlineElement = document.createElement('a-entity');
        const { x: posX, y: posY, z: posZ } = curElement.getAttribute('position');
        if (type === 'edge') {
          const height = curElement.getAttribute('geometry')?.height || 0;
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
    const cleanupHighlights = (sequenceName = 'all_pathways') => {
      const nodes = View.sequences.nodes[sequenceName];
      const edges = View.pathways[sequenceName];
      if (nodes != undefined) {
        for (let i = 0; i < nodes.length; i++) {
          const metabolite = nodes[i];
          console.log("HIGHLIGHT" + metabolite);
          colorNode(metabolite, INITIAL_NODE_COLOR);
          const outputMetabolite = nodes[i + 1];
          if (outputMetabolite !== null) {
            colorEdge(metabolite, outputMetabolite, INITIAL_EDGE_COLOR);
          }
        }
      }
      if (edges != undefined) {
        edges.forEach((edge) => {
          colorEdge(edge.input, edge.output, INITIAL_EDGE_COLOR);
          [edge.input, edge.output].forEach((node) => colorNode(node, INITIAL_NODE_COLOR));
        });
      }
    }
    const updateButtonColor = (clickState, sequenceName) => {
      const button = document.getElementById(sequenceName + '_button');
      // button attibutes seem to only take hex codes. 'red', 'purple', etc don't work.
      switch (clickState) {
        case 0: {
          // default colors: https://github.com/rdub80/aframe-gui#a-gui-button-component
          button.setAttribute("background-color", '#22252a');
          // TODO - these don't work..
          // button.setAttribute("border-color", '#d3d3d4');
          // button.setAttribute("font-color", '#d3d3d4');

          return;
        }
        case 1: {
          button.setAttribute("background-color", '#FF0000');
          // TODO - these don't work..
          // button.setAttribute("font-color", '#ffffff');
          // button.setAttribute("border-color", '#d3d3d4');

          return;
        }
        case 2: {
          button.setAttribute("background-color", '#00FFFF');

          return;
        }
        default: {
          return;
        }
      }
    }
    this.el.addEventListener('click', () => {
      const component = this.el.getAttribute("highlight-sequence");
      const sequenceName = component.sequence;
      if (component.clickState === 2) {
        cleanupOutlines();
      }
      const clickState = (component.clickState + 1) % 3;
      updateButtonColor(clickState, sequenceName);
      // increment clickState attribute
      this.el.setAttribute('highlight-sequence', 'clickState', clickState);
      switch (clickState) {
        case 0:
          cleanupHighlights(sequenceName);
          break;
        // highlight
        case 1: {
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
          break;
        };
        // outline
        // needs coloring redundancy to re-color overwritten highlighting
        // from other instances of this component
        case 2: {
          cleanupOutlines();
          const nodes = View.sequences.nodes[sequenceName];
          const edges = View.pathways[sequenceName];
          if (nodes != undefined) {
            for (let i = 0; i < nodes.length; i++) {
              const metabolite = nodes[i];
              console.log("HIGHLIGHT" + metabolite);
              colorNode(metabolite);
              outlineElem(metabolite);
              const outputMetabolite = nodes[i + 1];
              if (outputMetabolite !== null) {
                colorEdge(metabolite, outputMetabolite);
                outlineElem(metabolite + "/" + outputMetabolite, 'edge');
              }
            }
          }
          if (edges != undefined) {
            edges.forEach((edge) => {
              colorEdge(edge.input, edge.output);
              outlineElem(edge.input + "/" + edge.output, 'edge');
              [edge.input, edge.output].forEach((node) => {
                colorNode(node);
                outlineElem(node);
              });
            });
          }
          break;
        }
        default:
          break;
      };
    });
  },
});
