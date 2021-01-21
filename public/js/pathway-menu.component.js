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
    const parentContainer = this.createFlexContainers();
    const cameraRig = document.getElementById("camera-rig");
    cameraRig.appendChild(parentContainer);
  },

  createFlexContainers: function () {
    const parentContainer = document.createElement("a-gui-flex-container");
    const contentContainer = document.createElement("a-gui-flex-container");

    parentContainer.setAttribute("position", "0.5, -0.1, -1");
    parentContainer.setAttribute("flex-direction", "column");
    parentContainer.setAttribute("class", "interactible");
    parentContainer.setAttribute("opacity", "0.5");
    parentContainer.setAttribute("class", "pathwayMenu")
    
    contentContainer.setAttribute("flex-direction", "column");

    const titleElem = document.createElement('a-gui-label');
    titleElem.setAttribute('value', this.data.pathwayName);
    titleElem.setAttribute('height', 0.1);
    titleElem.setAttribute('font-size', '42px');
    titleElem.setAttribute('opacity', 0.9);

    const descriptionElem = document.createElement('a-gui-label');
    descriptionElem.setAttribute('value', 'a description about the pathway');
    descriptionElem.setAttribute('font-size', '30px');
    descriptionElem.setAttribute('opacity', 0.9);

    contentContainer.appendChild(titleElem);
    contentContainer.appendChild(descriptionElem);
    parentContainer.appendChild(contentContainer);

    return parentContainer;
  },
});
