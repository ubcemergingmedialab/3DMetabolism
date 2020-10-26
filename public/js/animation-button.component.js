AFRAME.registerComponent("animation-button-behaviour", {
    schema: {
        sequence: { type: 'string', default: '1' }
    },

    init: function () {
        this.states = { ACTIVE: 1, DEFAULT: 0 }
        this.state = 0;
        this.clickListener = this.clickListener.bind(this);
        document.addEventListener('click', clickListener)
    },

    clickListener: function () {
        //swap states and
        //use View.sequences.nodes[this.data.sequence]
        //and View.fetchEdge to call animation-behavior animate or stopAnimation depending on state
    }
})