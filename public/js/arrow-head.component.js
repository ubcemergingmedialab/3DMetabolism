AFRAME.registerComponent("arrow-head", {
  schema: {
    input: { type: "string", default: "" },
    output: { type: "string", default: "" },
  },

  init: function () {
    this.state = { FORWARD: 0, BACKWARD: 0 };
    this.states = { DISABLED: 0, ENABLED: 1 };
    this.directions = { FORWARD: this.data.output, BACKWARD: this.data.input };
    this.initArrowHeads();
  },

  //public should be called to set the direction
  SetDirection: function (tail, head, isVisible) {
    this.update(head, isVisible);
    console.log(this.edge.GetPosition());
  },

  fetchNode: function (node) {
    return Model.fetchNode(node);
  },

  update: function (direction, isVisible) {
    let showArrow;
    switch (direction) {
      case this.directions.FORWARD:
        showArrow = this.checkVisibilityEdgeCase(this.state.FORWARD, isVisible);
        if (showArrow != undefined) {
          this.changeOpacity(direction, showArrow);
        }
        this.updateState(isVisible);
        break;
      case this.directions.BACKWARD:
        showArrow = this.checkVisibilityEdgeCase(
          this.state.BACKWARD,
          isVisible
        );
        if (showArrow != undefined) {
          this.changeOpacity(direction, showArrow);
        }
        this.updateState(isVisible);
        break;
    }
  },

  checkVisibilityEdgeCase: function (state, isVisible) {
    var showElem;
    if (state === this.states.ENABLED && !!!isVisible) {
      showElem = false;
    }
    if (state === this.states.DISABLED && isVisible) {
      showElem = true;
    }
    return showElem;
  },

  updateState: function (isVisible) {
    if (this.state.FORWARD - 1 < 0 && !!!isVisible) {
      return;
    }
    isVisible ? this.state.FORWARD++ : this.state.FORWARD--;
  },

  changeOpacity: function (arrowHeadDirection, isVisible) {
    const parent = document.getElementById(
      "arrow-" + this.data.input + "/" + this.data.output
    );
    const child = parent.querySelector("#" + arrowHeadDirection);
    child.setAttribute("material", "opacity", isVisible ? 1 : 0);
  },

  //private create the cone primitive
  initArrowHeads: function () {
    const arrowParent = document.createElement("a-entity");
    const arrowHeadForward = document.createElement("a-entity");
    const arrowHeadBackward = document.createElement("a-entity");
    //boxes are set to offset the arrows heads so we are referencing the tip rather than the center
    const arrowHeadBoxForward = document.createElement("a-entity");
    const arrowHeadBoxBackward = document.createElement("a-entity");
    this.el.appendChild(arrowParent);
    arrowParent.appendChild(arrowHeadBoxForward);
    arrowParent.appendChild(arrowHeadBoxBackward);
    arrowHeadBoxBackward.appendChild(arrowHeadBackward);
    arrowHeadBoxForward.appendChild(arrowHeadForward);
    arrowParent.setAttribute(
      "id",
      "arrow-" + this.data.input + "/" + this.data.output
    );
    arrowHeadForward.setAttribute("id", this.directions.FORWARD);
    arrowHeadBackward.setAttribute("id", this.directions.BACKWARD);
    geometry = {
      primitive: "cone",
      height: 0.2,
      radiusBottom: 0.2,
    };

    //TODO: cleanup and extract
    //Used to calculate the local pos within the edge
    console.log(this.fetchNode(this.data.output).object3D.position);
    let head = new THREE.Vector3().copy(
      this.fetchNode(this.data.output).object3D.position
    );
    let tail = new THREE.Vector3().copy(
      this.fetchNode(this.data.input).object3D.position
    );
    let vect = head.add(tail.negate());
    vectorHeadOffset = vect.multiplyScalar(0.5);
    arrowHeadBox.object3D.translateY(vectorHeadOffset.length());
    arrowHeadBoxB.object3D.translateY(-vectorHeadOffset.length());
    arrowHeadBackward.object3D.rotateZ(Math.PI);
    arrowHeadForward.object3D.translateY(-0.2);
    arrowHeadBackward.object3D.translateY(-0.2);
    //
    arrowHeadForward.setAttribute("geometry", geometry);
    arrowHeadBackward.setAttribute("geometry", geometry);
    arrowHeadForward.setAttribute("material", "opacity", "1");
    arrowHeadBackward.setAttribute("material", "opacity", "1");
    arrowHeadForward.setAttribute("material", "color", "yellow");
    arrowHeadBackward.setAttribute("material", "color", "yellow");
  },
});
