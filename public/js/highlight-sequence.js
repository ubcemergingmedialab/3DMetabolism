AFRAME.registerComponent("highlight-sequence", {
    schema: {
        sequence: {type: 'string', default: "1"},
    },
    init: function() {
        this.el.addEventListener('click', () => {
          let component = this.el.getAttribute("highlight-sequence");
          let sequenceName = component.sequence;
          for(let i = 0; i < View.sequences[sequenceName].length; i++) {
            curSequence = View.sequences[sequenceName];
            let metabolite = curSequence[i]
            let curElement = document.getElementById(metabolite);
            curElement.setAttribute("material", "color", "red");
            if(curSequence[i+1] != null) {
              let input = curSequence[i];
              let output = curSequences[i+1];
              let curEdge = document.getElementById(input + "/" + output);
              curEdge.setAttribute("material", "color", "purple");
            }
        });
    }
})
