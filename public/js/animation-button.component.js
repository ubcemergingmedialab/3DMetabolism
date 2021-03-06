AFRAME.registerComponent("animation-button-behavior", {
  schema: {
    sequence: { type: 'string', default: '1' },
    pathway: {type: 'string', default: 'gluconeogenesis'}
  },

  init: function () {
    this.states = { ACTIVE: 1, DEFAULT: 0 };
    this.state = 0;
    this.clickListener = this.clickListener.bind(this);
    this.changeColorMaterial = this.changeColorMaterial.bind(this);
    this.el.addEventListener('click', this.clickListener);
  },

  clickListener: function () {
    const component = this.el.getAttribute("animation-button-behavior");
    const sequenceNum = component.sequence;
    const pathway = component.pathway;
    this.state = this.state === this.states.DEFAULT ? this.states.ACTIVE : this.states.DEFAULT;
    const isActive = this.state === this.states.ACTIVE;
    document.querySelector("[sequence-animation]").components["sequence-animation"].triggerAnimation(sequenceNum, pathway);
    //EdgePresenter.setEdgeAnimation(sequenceNum, isActive, this.changeColorMaterial);
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
        text.setAttribute("material", { color: "#000000", emissive: "#fff" });
        break;
    }
  }
})