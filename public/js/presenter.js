AFRAME.registerComponent('presenter', {

  schema : {
    activePathway: {type: 'string', default: 'gluconeogenesis'}
  },

  init: function() {
    var sceneEl = document.querySelector('a-scene'); //parent scene
    var sceneModel = document.createElement('a-entity'); //child entit
    sceneEl.appendChild(sceneModel);
    sceneModel.flushToDOM();
    sceneModel.setAttribute('id', 'sceneModel');

    for(let node in View.nodes){
      let entityEl = document.createElement('a-entity');
      let curNode = View.nodes[node];
      entityEl.setAttribute('geometry', {
        primitive: 'sphere',
        radius: 0.2
      });
      entityEl.object3D.position.set(curNode.position.x, curNode.position.y, curNode.position.z);
      entityEl.setAttribute('material', 'color', 'blue');
      console.log(curNode.name);
      let textEl = document.createElement('a-entity');
      textEl.setAttribute('look-at', 'a-camera');
      console.log(curNode);
      textEl.setAttribute('look-at', 'a-camera');
      if(curNode.flippedText)
      {
        textEl.setAttribute('text', {value: curNode.name, color: 'black', width: 4, anchor: 'align', xOffset: -0.2, zOffset: 1, align: 'right'});
      }
      else {
        textEl.setAttribute('text', {value: curNode.name, color: 'black', width: 4, anchor: 'align', xOffset: 0.2, zOffset: 1, aligh: 'left'});
      };
      sceneModel.appendChild(entityEl);
      entityEl.appendChild(textEl)
    }
    this.DrawEdges(View.pathways["gluconeogenesis"]);
  },

  update: function() {
    var data = this.data;
    console.log("change in pathway");
    document.querySelectorAll('[pathway_zoom]').forEach(edge => edge.remove());
    this.DrawEdges(View.pathways[data.activePathway]);
  },

  DrawEdges: function(currentEdges) {
    for (var index = 0; index < currentEdges.length; index++) {
      let height, targetPosition, targetAngles
      try {
        targetPosition = currentEdges[index].GetPosition();
        targetAngles = currentEdges[index].GetRotation();
        height = currentEdges[index].GetHeight();
      } catch(e) {
        console.log("Error while reading view: " + e.message);
        continue;
      }

      let entityEl = document.createElement('a-entity');
      sceneModel.appendChild(entityEl);

      if(currentEdges[index].src != undefined) {
        imgEl = document.createElement('a-image', );
        imgEl.setAttribute("src", currentEdges[index].src);
        imgEl.setAttribute("rotation", "0 0 90");
        entityEl.appendChild(imgEl);
      }

      entityEl.setAttribute('geometry', {
        primitive: 'cylinder',
        height: height,
        radius: 0.1
      });
      entityEl.object3D.position.set(targetPosition.x, targetPosition.y, targetPosition.z);
      entityEl.object3D.rotation.set(targetAngles.x, targetAngles.y, targetAngles.z);

      entityEl.setAttribute('material', 'color', 'green');
      //console.log(targetPosition)
      var cameraRig = document.getElementById("camera-rig");
      cameraRig.flushToDOM();
      console.log(cameraRig.getAttribute("position"));
      var pos = cameraRig.object3D.position;
      var cameraPos = (new THREE.Vector3()).copy(pos);
      entityEl.setAttribute('pathway_zoom', {zoomPosition: targetPosition,
        edgeName: index, cameraPos: cameraPos});
      //entityEl.setAttribute('varying-transparency', '0.0');
    }
  }
});
