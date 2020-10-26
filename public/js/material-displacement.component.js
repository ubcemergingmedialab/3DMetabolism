AFRAME.registerComponent('material-displacement', {
    tick: function (t) {
        this.el.setAttribute("material", "time:" + t);
    }
})

