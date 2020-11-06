AFRAME.registerComponent("animation-button-behavior", {
  schema: {
    sequence: { type: 'string', default: '1' },
  },

  init: function () {
    this.states = { ACTIVE: 1, DEFAULT: 0 };
    this.state = 0;
    this.clickListener = this.clickListener.bind(this);
    this.changeColorMaterial = this.changeColorMaterial.bind(this);
    this.el.addEventListener('click', this.clickListener);
  },

  /**
   * swap states and use Model.sequences.nodes[this.data.sequence] and Model.fetchEdge to call animation-behavior animate or stopAnimation depending on state
   */
  clickListener: function () {
    const component = this.el.getAttribute("animation-button-behavior");
    const sequenceNum = component.sequence;
    const nodes = Model.sequences.nodes[sequenceNum];
    this.state = this.state === this.states.DEFAULT ? this.states.ACTIVE : this.states.DEFAULT;
    for (let idx = 1; idx < nodes.length; idx++) {
      const edge = Model.fetchEdge(nodes[idx - 1], nodes[idx]);
      if (edge) {
        if (!edge.components["animation-behavior"]) {
          edge.setAttribute("animation-behavior", "");
        }
        const animationBehaviorComponent = edge.components["animation-behavior"];
        if (this.state === this.states.ACTIVE) {
          animationBehaviorComponent.callAnimate();
          this.changeColorMaterial("orange")
        } else {
          animationBehaviorComponent.callStopAnimation();
          this.changeColorMaterial("#22252a");
        }
      }
    }
  },

  changeColorMaterial: function (color) {
    this.el.setAttribute("material", { color: color });
    let elements = this.el.querySelectorAll(".gui-button");
    for (elem of elements) {
      elem.setAttribute("material", { color: color });
    }
    let text = this.el.querySelector(".gui-text");
    switch (this.state) {
      case this.states["DEFAULT"]:
        text.setAttribute("material", { color: "#ffffff", emissive: "#000" });
        break;
      case this.states["ACTIVE"]:
        console.log('highlight button');
        text.setAttribute("material", { color: "#000000", emissive: "#fff" });
        break;
    }
  }
})