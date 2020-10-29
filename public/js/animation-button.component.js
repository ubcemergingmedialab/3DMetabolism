AFRAME.registerComponent("animation-button-behavior", {
    schema: {
        sequence: { type: 'string', default: '1' },
    },

    init: function () {
        this.states = { ACTIVE: 1, DEFAULT: 0 };
        this.state = 0;
        this.clickListener = this.clickListener.bind(this);
        document.addEventListener('click', this.clickListener);
    },

    /**
     * swap states and use View.sequences.nodes[this.data.sequence] and View.fetchEdge to call animation-behavior animate or stopAnimation depending on state
     */
    clickListener: function () {
      const component = this.el.getAttribute("animation-button-behavior");
      const sequenceNum = component.sequence;
      const nodes = View.sequences.nodes[sequenceNum];

      for (let idx = 1; idx < nodes.length; idx++) {
        const edge = View.fetchEdge(nodes[idx - 1], nodes[idx]);
        if (edge) {
          const animationBehaviorComponent = edge.components["animation-behavior"];
          if (animationBehaviorComponent) {
            this.state === this.states.ACTIVE ? animationBehaviorComponent.callAnimate() : animationBehaviorComponent.callStopAnimation();
          } else {
            edge.setAttribute('animation-behavior', '');
          }
        }
      }
      this.state = this.state ? this.states.DEFAULT : this.states.ACTIVE;
    }
})