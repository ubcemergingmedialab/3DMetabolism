AFRAME.registerComponent("highlight-button-behavior", {
  schema: {
    sequence: { type: 'string', default: "" }
  },

  init: function () {
    this.states = { DEFAULT: 1, HIGHLIGHTED: 2, OUTLINED: 0 };
    this.state = this.states.DEFAULT;
    this.num_states = Object.keys(this.states).length;
    this.clickListener = this.clickListener.bind(this);
    this.changeMaterialColor = this.changeMaterialColor.bind(this);
    this.downgrade = this.downgrade.bind(this);
    this.el.addEventListener("click", this.clickListener);
    this.highlightColor = "#182BEF";
    this.defaultColor = "#B1B1B1";
    this.outlineColor = "#F2994A";
  },

  clickListener: function (e) {
    this.state = (this.state + 1) % this.num_states;

    try {
      //may be able to cache elements on init instead of finding them on click every time
      switch (this.state) {
        case this.states.DEFAULT:
          EdgePresenter.removeOutline(this.data.sequence);
          NodePresenter.removeOutline(this.data.sequence);
          this.changeMaterialColor(this.defaultColor);
          break;
        case this.states.HIGHLIGHTED:
          EdgePresenter.highlight(this.data.sequence);
          NodePresenter.highlight(this.data.sequence);
          this.changeMaterialColor(this.highlightColor)
          break;
        case this.states.OUTLINED:
          for (button of document.querySelectorAll("[highlight-button-behavior]")) {
            if (button.getAttribute("highlight-button-behavior").sequence !== this.data.sequence) {
              button.components["highlight-button-behavior"].downgrade();
            }
          }
          EdgePresenter.outline(this.data.sequence);
          NodePresenter.outline(this.data.sequence);
          this.changeMaterialColor(this.outlineColor);
          break;
      }
    } catch (e) {
      console.log(e);
    }
  },

  downgrade: function () {
    if (this.state === this.states["OUTLINED"]) {
      NodePresenter.removeOutline(this.data.sequence);
      EdgePresenter.removeOutline(this.data.sequence);
      this.changeMaterialColor(this.highlightColor);
    }
  },

  changeMaterialColor: function (color) {
    this.el.setAttribute("material", { color: color });
    let elements = this.el.querySelectorAll(".gui-button");
    for (elem of elements) {
      elem.setAttribute("material", { color: color });
    }
    let text = this.el.querySelector(".gui-text");
    switch (this.state) {
      case this.states["DEFAULT"]:
        text.setAttribute("material", { color: "black", emissive: "#000" });
        break;
      case this.states["HIGHLIGHTED"]:
        text.setAttribute("material", { color: "white", emissive: "#fff" });
        break;
      case this.states["OUTLINED"]:
        text.setAttribute("material", {
          color: "black", emissive: "#000"
        });
        break;
    }
  }
})