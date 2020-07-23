AFRAME.registerComponent('presenter', {

  schema : {
    activePathway: {type: 'string', default: 'gluconeogenesis'}
  },

  init: function() {
    this.DrawEdges = this.DrawEdges.bind(this);
    var sceneEl = document.querySelector('a-scene'); //parent scene
    this.sceneModel = document.createElement('a-entity'); //child entit
    sceneEl.appendChild(this.sceneModel);
    this.sceneModel.flushToDOM();
    this.sceneModel.setAttribute('id', 'sceneModel');

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
      this.sceneModel.appendChild(entityEl);
      entityEl.appendChild(textEl)
    }
    this.DrawEdges(View.pathways["gluconeogenesis"]);
  },

  update: function() {
    var data = this.data;
    console.log("change in pathway");
    document.querySelectorAll('[pathway_zoom]').forEach(edge => edge.remove());
    this.DrawEdges(View.pathways[data.activePathway]);
    this.sceneModel.flushToDOM();
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
      let cameraEl = document.createElement('a-camera');
      cameraEl.setAttribute("camera", "active", false);
      let cameraRigEdge = document.createElement('a-entity');

      cameraRigEdge.setAttribute('id',index+'_rig'); 
      cameraEl.setAttribute('id', index+'-camera');
      entityEl.setAttribute('id',index);
      
      
      cameraRigEdge.appendChild(cameraEl);
      this.sceneModel.appendChild(cameraRigEdge)
      
      this.sceneModel.appendChild(entityEl);

      cameraEl.setAttribute('look-controls','enabled',false);

      entityEl.setAttribute('geometry', {
        primitive: 'cylinder',
        height: height,
        radius: 0.1
      });

      entityEl.object3D.position.set(targetPosition.x, targetPosition.y, targetPosition.z);
      entityEl.object3D.rotation.set(targetAngles.x, targetAngles.y, targetAngles.z);

      let cameraOffset  = new THREE.Vector3()
      entityEl.object3D.getWorldPosition(cameraOffset)

      cameraOffset.add((new THREE.Vector3(0,0,0.10)))

      cameraRigEdge.object3D.rotation.set(-targetAngles.x, -targetAngles.y, Math.PI/2 - targetAngles.z);
      cameraRigEdge.object3D.position.copy(cameraOffset);

      entityEl.setAttribute('material', 'color', 'green');
      //console.log(targetPosition)
      var cameraRig = document.getElementById("camera-rig");
      console.log(cameraRig.getAttribute("position"));
      var pos = cameraRig.object3D.position;
      var cameraPos = (new THREE.Vector3()).copy(pos);
      entityEl.setAttribute('pathway_zoom', {edgeName: index});
      //entityEl.setAttribute('varying-transparency', '0.0');
      if(currentEdges[index].src != undefined) {
        imgEl = document.createElement('a-image', );
        imgEl.setAttribute("src", currentEdges[index].src);
        imgEl.setAttribute("rotation", "0 0 90");
        entityEl.appendChild(imgEl);
      }
    }
  }
});
