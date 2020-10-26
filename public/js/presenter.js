AFRAME.registerComponent('presenter', {

  schema: {
    activePathway: { type: 'string', default: 'all_pathways' }
  },

  init: function () {
    this.DrawEdges = this.DrawEdges.bind(this);
    this.initAnimationEl = this.initAnimationEl.bind(this);
    var sceneEl = document.querySelector('a-scene'); //parent scene
    this.sceneModel = document.createElement('a-entity'); //child entit
    sceneEl.appendChild(this.sceneModel);
    this.sceneModel.flushToDOM();
    this.sceneModel.setAttribute('id', 'sceneModel');

    for (let node in View.nodes) {
      let entityEl = document.createElement('a-entity');
      let curNode = View.nodes[node];
      entityEl.setAttribute('geometry', {
        primitive: 'sphere',
        radius: 0.2
      });
      entityEl.setAttribute("highlight-behavior", "elem: ");
      entityEl.setAttribute("id", node);
      entityEl.object3D.position.set(curNode.position.x, curNode.position.y, curNode.position.z);

      if (curNode.isPlaceholder) {
        entityEl.setAttribute('material', 'visible', 'false');
      }
      else {
        entityEl.setAttribute('material', 'color', 'blue');
      }

      entityEl.setAttribute("class", "interactible");
      entityEl.setAttribute('assign-position', '[translate-network]');
      console.log(curNode.name);
      let textEl = document.createElement('a-entity');
      textEl.setAttribute('look-at', 'a-camera');
      console.log(curNode);
      textEl.setAttribute('look-at', 'a-camera');
      if (!curNode.isPlaceholder) {
        if (curNode.flippedText) {
          textEl.setAttribute('text', {
            value: curNode.name,
            color: 'black',
            width: 4,
            anchor: 'align',
            xOffset: -0.2,
            zOffset: 1,
            align: 'right'
          });
        }
        else {
          textEl.setAttribute('text', {
            value: curNode.name,
            color: 'black',
            width: 4,
            anchor: 'align',
            xOffset: 0.2,
            zOffset: 1,
            align: 'left'
          });
        }
      }
      this.sceneModel.appendChild(entityEl);
      entityEl.appendChild(textEl)
    }
    this.DrawEdges(View.pathways["gluconeogenesis"]);
  },

  update: function () {
    var data = this.data;
    console.log("change in pathway " + data.activePathway);
    document.querySelectorAll('[pathway_zoom]').forEach(edge => {
      edge.removeAttribute("pathway_zoom");
      edge.remove();
    })
    document.querySelectorAll('.edgeCamera').forEach(edge => edge.remove());
    if (!!View.pathways[data.activePathway]) {
      this.DrawEdges(View.pathways[data.activePathway]);
    }
  },

  DrawEdges: function (currentEdges) {
    for (var index = 0; index < currentEdges.length; index++) {
      let height, targetPosition, targetAngles
      try {
        targetPosition = currentEdges[index].GetPosition();
        targetAngles = currentEdges[index].GetRotation();
        height = currentEdges[index].GetHeight();
      } catch (e) {
        console.log("Error while reading view: " + e.message);
        continue;
      }
      let entityEl = document.createElement('a-entity');
      entityEl.setAttribute("highlight-behavior", "elem: edge");
      entityEl.setAttribute("class", "interactible");
      let cameraEl = document.createElement('a-camera');
      cameraEl.setAttribute("camera", "active", false);
      let cameraRigEdge = document.createElement('a-entity');

      this.initAnimationEl(currentEdges[index].leftElSrc, entityEl, "orange", new THREE.Vector3(0, 0.1, 0))
      this.initAnimationEl(currentEdges[index].rightElSrc, entityEl, "brown", new THREE.Vector3(0, -0.1, 0))

      let edgeName = currentEdges[index].input + "/" + currentEdges[index].output
      cameraRigEdge.setAttribute('id', edgeName + '_rig');
      cameraRigEdge.setAttribute('class', 'edgeCamera')
      cameraEl.setAttribute('id', edgeName + '-camera');
      cameraEl.setAttribute('id', 'edgeCamera');
      entityEl.setAttribute('id', edgeName);

      this.sceneModel.appendChild(cameraRigEdge)
      cameraRigEdge.appendChild(cameraEl);
      this.sceneModel.appendChild(entityEl);

      cameraEl.setAttribute('look-controls', 'enabled', false);

      entityEl.setAttribute('geometry', {
        primitive: 'cylinder',
        height: height,
        radius: 0.1
      });


      entityEl.object3D.position.set(targetPosition.x, targetPosition.y, targetPosition.z);
      entityEl.object3D.rotation.set(targetAngles.x, targetAngles.y, targetAngles.z);

      let cameraOffset = new THREE.Vector3()
      entityEl.object3D.getWorldPosition(cameraOffset)

      cameraOffset.add((new THREE.Vector3(0, 0, 0.10)))

      let edgeRotation = new THREE.Quaternion()
      entityEl.object3D.getWorldQuaternion(edgeRotation)

      cameraRigEdge.object3D.applyQuaternion(edgeRotation);
      cameraRigEdge.object3D.rotateZ(Math.PI / 2)
      cameraRigEdge.object3D.position.copy(cameraOffset);


      entityEl.setAttribute('material', 'color', 'green');

      var cameraRig = document.getElementById("camera-rig");
      console.log(cameraRig.getAttribute("position"));
      entityEl.setAttribute('pathway_zoom', { edgeName: edgeName });

      if (currentEdges[index].imgSrc != undefined) {
        imgEl = document.createElement('a-image');
        imgEl.setAttribute("src", currentEdges[index].imgSrc);
        imgEl.setAttribute("rotation", "0 0 90");
        imgEl.setAttribute("scale", "0.4 0.4 0.4");
        entityEl.appendChild(imgEl);
      }
    }
  },
  initAnimationEl: function (srcEl, parentEl, colorStr, localPos) {
    let animationEl = document.createElement('a-entity');
    parentEl.appendChild(animationEl);

    if (srcEl == undefined) {
      animationEl.setAttribute('geometry', {
        primitive: 'box',
        width: 0.2,
        height: 0.2,
        depth: 0.2
      })
      animationEl.setAttribute("material", "color", colorStr)
    } else {
      console.log("adding model");
      animationEl.setAttribute("gltf-model", "url(" + srcEl + ")");
    }
    animationEl.setAttribute('position', localPos)
    animationEl.setAttribute('scale', "0.07 0.07 0.07")
    animationEl.setAttribute('rotation', "0 0 90");
  },
});
