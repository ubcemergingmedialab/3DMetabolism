var EdgePresenter = (function () {
  _initAnimationEl = function (srcEl, parentEl, colorStr, localPos) {
    let animationEl = document.createElement("a-entity");
    parentEl.appendChild(animationEl);

    if (srcEl == undefined) {
      animationEl.setAttribute("geometry", {
        primitive: "box",
        width: 0.2,
        height: 0.2,
        depth: 0.2,
      });
      animationEl.setAttribute("material", "color", colorStr);
    } else {
      console.log("adding model");
      animationEl.setAttribute("gltf-model", "url(" + srcEl + ")");
    }
    animationEl.setAttribute("position", localPos);
    animationEl.setAttribute("scale", "0.009 0.009 0.009");
    animationEl.setAttribute("rotation", "0 0 90");
  };

  _grabEdges = function (sequence) {
    return Model.pathways[sequence];
  };

  present = function (currentEdges) {
    for (var index = 0; index < currentEdges.length; index++) {
      let height, targetPosition, targetAngles;
      try {
        targetPosition = currentEdges[index].GetPosition();
        targetAngles = currentEdges[index].GetRotation();
        height = currentEdges[index].GetHeight();
      } catch (e) {
        console.log("Error while reading Model: " + e.message);
        continue;
      }
      let entityEl = document.createElement("a-entity");
      entityEl.setAttribute("highlight-behavior", "elem: edge");
      entityEl.setAttribute("class", "interactible");
      let cameraEl = document.createElement("a-camera");
      cameraEl.setAttribute("camera", "active", false);
      let cameraRigEdge = document.createElement("a-entity");

      _initAnimationEl(currentEdges[index].leftElSrc, entityEl, "orange", new THREE.Vector3(0, 0.1, 0));
      _initAnimationEl(currentEdges[index].rightElSrc, entityEl, "brown", new THREE.Vector3(0, -0.1, 0));

      let edgeName = currentEdges[index].input + "/" + currentEdges[index].output;
      cameraRigEdge.setAttribute("id", edgeName + "_rig");
      cameraRigEdge.setAttribute("class", "edgeCamera");
      cameraEl.setAttribute("id", edgeName + "-camera");
      cameraEl.setAttribute("id", "edgeCamera");
      entityEl.setAttribute("id", edgeName);

      const sceneModel = document.getElementById("sceneModel");

      sceneModel.appendChild(cameraRigEdge);
      cameraRigEdge.appendChild(cameraEl);
      sceneModel.appendChild(entityEl);

      entityEl.setAttribute("material", "shader:displace;");
      entityEl.setAttribute("material-displacement", "");
      cameraEl.setAttribute("look-controls", "enabled", false);

      entityEl.setAttribute("geometry", {
        primitive: "cylinder",
        height: height,
        radius: 0.1,
      });
      
      entityEl.setAttribute('arrow-edge', {
        input: currentEdges[index].input,
        output: currentEdges[index].output
      });

      entityEl.object3D.position.set(targetPosition.x, targetPosition.y, targetPosition.z);
      entityEl.object3D.rotation.set(targetAngles.x, targetAngles.y, targetAngles.z);

      let cameraOffset = new THREE.Vector3();
      entityEl.object3D.getWorldPosition(cameraOffset);

      cameraOffset.add(new THREE.Vector3(0, 0, 0.1));

      let edgeRotation = new THREE.Quaternion();
      entityEl.object3D.getWorldQuaternion(edgeRotation);

      cameraRigEdge.object3D.applyQuaternion(edgeRotation);
      cameraRigEdge.object3D.rotateZ(Math.PI / 2);
      cameraRigEdge.object3D.position.copy(cameraOffset);

      var cameraRig = document.getElementById("camera-rig");
      entityEl.setAttribute("pathway_zoom", { edgeName: edgeName });

      if (currentEdges[index].imgSrc != undefined) {
        imgEl = document.createElement("a-image");
        imgEl.setAttribute("src", currentEdges[index].imgSrc);
        imgEl.setAttribute("rotation", "0 0 90");
        imgEl.setAttribute("scale", "0.09 0.09 0.09");
        entityEl.appendChild(imgEl);
      }
    }
  };

  setEdgeAnimation = function (sequenceNum, isActive, changeColorMaterialFcn) {
    const nodes = Model.sequences.nodes[sequenceNum];
    for (let idx = 1; idx < nodes.length; idx++) {
      const edge = Model.fetchEdge(nodes[idx - 1], nodes[idx]);
      if (edge) {
        if (!edge.components["animation-behavior"]) {
          edge.setAttribute("animation-behavior", "");
        }
        const animationBehaviorComponent = edge.components["animation-behavior"];
        if (isActive) {
          animationBehaviorComponent.callAnimate();
          changeColorMaterialFcn("orange");
        } else {
          animationBehaviorComponent.callStopAnimation();
          changeColorMaterialFcn("#22252a");
        }
      }
    }
  };

  removeOutline = function (sequence) {
    const edges = _grabEdges(sequence);
    for (edge of edges) {
      const element = Model.fetchEdge(edge.input, edge.output);
      element.components["highlight-behavior"].RemoveOutline();
      element.components["highlight-behavior"].DecrementHighlightCounter();
    }
  };

  highlight = function (sequence) {
    const edges = _grabEdges(sequence);
    for (edge of edges) {
      const element = Model.fetchEdge(edge.input, edge.output);
      element.components["highlight-behavior"].IncrementHighlightCounter();
    }
  };

  outline = function (sequence) {
    const edges = _grabEdges(sequence);
    for (edge of edges) {
      const element = Model.fetchEdge(edge.input, edge.output);
      element.components["highlight-behavior"].Outline();
    }
  };

  return {
    present,
    setEdgeAnimation,
    removeOutline,
    highlight,
    outline,
  };
})();
