AFRAME.registerComponent("arrow-edge", {
  schema: {
    input: { type: "string", default: "" },
    output: { type: "string", default: "" },
  },

  init: function () {
    this.SetDirection = this.SetDirection.bind(this);
    this.cylinderExists = this.cylinderExists.bind(this);
    this.arrowExists = this.arrowExists.bind(this);
    this.createStructure = this.createStructure.bind(this);
    this.createArrow = this.createArrow.bind(this);
    this.createCylinder = this.createCylinder.bind(this);
    this.removeStructure = this.removeStructure.bind(this);

    this.CYLINDER_ID_SUFFIX = "_arrow-cylinder";
    this.ARROW_ID = "_arrow_";

    this.COLOR = "yellow";

    // TODO - REMOVE THESE TESTS
    this.SetDirection(this.data.input, this.data.output, true);
    this.SetDirection(this.data.output, this.data.input, true);
    this.SetDirection(this.data.output, this.data.input, false);
    // this.SetDirection(this.data.input, this.data.output, false);
  },

  /**
   * Creates or removes an arrow from tail to head placed at the head position
   * @param tail - id of tail node
   * @param head - id of head node
   * @param isVisible - flag to show or hide arrow
   */
  SetDirection: function (tail, head, isVisible) {
    const edge = Model.fetchEdge(tail, head);
    const isReverse = this.el.getAttribute("id").substring(0, head.length) === head;
    isVisible
      ? this.createStructure(edge, tail, head, isReverse)
      : this.removeStructure(head, tail);
  },

  cylinderExists: function (id) {
    return !!this.el.parentElement.querySelectorAll(
      "[class='" + id + this.CYLINDER_ID_SUFFIX
    ).length;
  },

  arrowExists: function (id, headId) {
    return !!this.el.parentElement.querySelectorAll(
      "[class='" + id + this.ARROW_ID + headId
    ).length;
  },

  createStructure: function (edge, tail, head, isReverse) {
    // only create cylinder if no existing cylinder
    if (!this.cylinderExists(this.el.getAttribute("id"))) {
    this.createCylinder(edge, tail, head);
    }
    // only create arrow if no existing arrow
    if (!this.arrowExists(this.el.getAttribute("id"), head)) {
      this.createArrow(edge, head, isReverse);
    }
  },

  createArrow: function (edge, head, isReverse) {
    const headNode = Model.fetchNode(head);
    const arrow = document.createElement("a-entity");
    const { x: posX, y: posY, z: posZ } = headNode.getAttribute("position");
    const { x: rotX, y: rotY, z: rotZ } = edge.getAttribute("rotation");
    arrow.setAttribute(
      "class",
      this.el.getAttribute("id") + this.ARROW_ID + head
    );
    arrow.setAttribute("geometry", {
      primitive: "cone",
      height: 0.4,
      radiusBottom: 0.2,
    });
    arrow.setAttribute("material", {
      color: this.COLOR,
      opacity: 1,
    });
    arrow.setAttribute("position", posX + " " + posY + " " + posZ);
    arrow.setAttribute("rotation", rotX  + " " + rotY + " " + rotZ);
    // TODO - figure out how to reflect object properly..
    if (isReverse) {
      const obj = new THREE.Object3D(arrow.object3D);
      obj.matrix.makeRotationZ(Math.PI/2);
      arrow.setObject3D("Group", obj);
    }
    edge.parentElement.appendChild(arrow);
  },

  createCylinder: function (edge, tail, head) {
    const cylinder = document.createElement("a-entity");
    const { x: posX, y: posY, z: posZ } = edge.getAttribute("position");
    const height = edge.getAttribute("geometry")?.height || 0;
    const { x: rotX, y: rotY, z: rotZ } = edge.getAttribute("rotation");
    cylinder.setAttribute("geometry", "height:" + height);
    cylinder.setAttribute("rotation", rotX + " " + rotY + " " + rotZ);
    cylinder.setAttribute("geometry", "primitive:cylinder");
    cylinder.setAttribute("material", {
      color: this.COLOR,
      opacity: 1,
    });
    cylinder.setAttribute("scale", "0.14 1.0 0.15");
    cylinder.setAttribute("position", posX + " " + posY + " " + posZ);
    cylinder.setAttribute(
      "class",
      this.el.getAttribute("id") + this.CYLINDER_ID_SUFFIX
    );
    edge.parentElement.appendChild(cylinder);
  },

  removeStructure: function (arrowToRemoveId, otherArrowId) {
    if (this.arrowExists(this.el.getAttribute("id"), arrowToRemoveId)) {
      for (let element of this.el.parentElement.querySelectorAll("[class='" + this.el.getAttribute("id") + this.ARROW_ID + arrowToRemoveId)) {
        element.remove();
      }
    }
    if (!this.arrowExists(this.el.getAttribute("id"), otherArrowId)) {
      for (let element of this.el.parentElement.querySelectorAll("[class='" + this.el.getAttribute("id") + this.CYLINDER_ID_SUFFIX)) {
        element.remove();
      }
    }
  },
});
