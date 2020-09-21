AFRAME.registerComponent("highlight-sequence", {
  schema: {
    sequence: { type: 'string', default: "1" },
  },
  init: function () {
    console.log("HIGHLIGHT INIT");
    this.el.addEventListener('click', () => {
      let component = this.el.getAttribute("highlight-sequence");
      let sequenceName = component.sequence;
      for (let i = 0; i < View.sequences[sequenceName].length; i++) {
        curSequence = View.sequences[sequenceName];
        let metabolite = curSequence[i]
        console.log("HIGHLIGHT" + metabolite);
        let curElement = document.getElementById(metabolite);
        if (curElement === null) {
          console.log("could not find node " + metabolite);
          continue;
        }
        curElement.setAttribute("material", "color", "red");
        if (curSequence[i + 1] != null) {
          let input = curSequence[i];
          let output = curSequence[i + 1];
          console.log("looking for " + input + "/" + output);
          let curEdge = document.getElementById(input + "/" + output);
          if (curEdge === null) {
            console.log("could not find edge " + input + "/" + output);
            continue;
          }
          curEdge.setAttribute("material", "color", "purple");
        }
      }
    });
  }
})
