AFRAME.registerComponent("pathway-menu", {
  schema: {
    pathwayName: { type: "string", default: "" },
  },

  init: function () {
    this.createPathwayMenu = this.createPathwayMenu.bind(this);
    this.clickListener = this.clickListener.bind(this);
    this.createPathwayMenu = this.createPathwayMenu.bind(this);
    this.createFlexContainers = this.createFlexContainers.bind(this);
    this.el.addEventListener("click", this.clickListener);
  },

  clickListener: function () {
    this.createPathwayMenu();
  },

  createPathwayMenu: function () {
    const parentFlexContainer = this.createFlexContainers();
    const cameraRig = document.getElementById("camera-rig");
    cameraRig.appendChild(parentFlexContainer);
  },

  createFlexContainers: function () {
    const parentFlexContainer = document.createElement("a-gui-flex-container");
    const titleFlexContainer = document.createElement("a-gui-flex-container");

    const titleElem = document.createElement('a-entity');
    titleElem.setAttribute('text', {
        value: this.data.pathwayName,
        color: 'white',
    });
    titleFlexContainer.appendChild(titleElem);
    parentFlexContainer.appendChild(titleFlexContainer);

    parentFlexContainer.setAttribute("position", "0.5, -0.1, -1");
    parentFlexContainer.setAttribute("flex-direction", "column");
    parentFlexContainer.setAttribute("class", "interactible");
    parentFlexContainer.setAttribute("opacity", "0.5");

    return parentFlexContainer;
  },
});
