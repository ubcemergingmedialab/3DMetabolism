AFRAME.registerComponent('presenter', {

  init: function() {
    var sceneEl = document.querySelector('a-scene'); //parent scene
    var sceneModel = document.createElement('a-entity'); //child entit
    sceneEl.setAttribute('id','sceneModel');
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

    var drawEdges = function() {
      for (var index = 0; index < View.edges.length; index++) {
        let height, targetPosition, targetAngles
        try {
          targetPosition = View.edges[index].GetPosition();
          targetAngles = View.edges[index].GetRotation();
          height = View.edges[index].GetHeight();
        } catch(e) {
          console.log("Error while reading view: " + e.message);
          continue;
        }

        let entityEl = document.createElement('a-entity');
        let cameraEl = document.createElement('a-camera');
        let cameraRigEdge = document.createElement('a-entity');

        cameraRigEdge.setAttribute('id',index+'_rig'); 
        cameraEl.setAttribute('id', index+'-camera');
        entityEl.setAttribute('id',index);

        cameraEl.setAttribute('look-controls','enabled',false);

        cameraRigEdge.appendChild(cameraEl);
        sceneModel.appendChild(cameraRigEdge)
        sceneModel.appendChild(entityEl);

        if(View.edges[index].src != undefined) {
          imgEl = document.createElement('a-image', );
          imgEl.setAttribute("src", View.edges[index].src);
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

        let cameraOffset  = new THREE.Vector3()
        entityEl.object3D.getWorldPosition(cameraOffset)

        cameraOffset.add((new THREE.Vector3(0,0,0.10)))

        cameraRigEdge.object3D.rotation.set(-targetAngles.x, -targetAngles.y, Math.PI/2 - targetAngles.z);
        cameraRigEdge.object3D.position.copy(cameraOffset)

  
        entityEl.setAttribute('material', 'color', 'green');
        //console.log(targetPosition)
        var cameraRig = document.getElementById("camera-rig");
        cameraRig.flushToDOM();
        console.log(cameraRig.getAttribute("position"));
        var pos = cameraRig.object3D.position;
        var cameraPos = (new THREE.Vector3()).copy(pos);
        entityEl.setAttribute('pathway_zoom', {edgeName: index});
        //entityEl.setAttribute('varying-transparency', '0.0');
        
      }
    };
    drawEdges();
  }
});
