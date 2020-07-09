AFRAME.registerComponent("pathway_zoom", {
    schema: {
        zoomPosition: {type: 'vec3'},
        cameraPos: {type: 'vec3'},
        edgeName: {type: 'string'}
    },
    init: function() {
        var el = this.el;
        this.ActivateZoomIn = this.ActivateZoomIn.bind(this);
        this.ActivateZoomOut = this.ActivateZoomOut.bind(this);
        this.MoveCameraRig = this.MoveCameraRig.bind(this);
        this.CreateEventPlane = this.CreateEventPlane.bind(this);
        el.addEventListener('click', this.ActivateZoomIn);
    },

    ActivateZoomIn: function(event) {
        console.log('zooming in');
        this.el.setAttribute('material', 'color', 'yellow'); 

        let edge = View.edges[this.data.edgeName];
        let gyroDragRotate = document.getElementById('gyro').components['drag-rotate-component'];
        let cameraGyro = document.getElementById("gyro");
        cameraRig = document.getElementById('camera-rig');

        cameraPos = (new THREE.Vector3()).copy(cameraRig.object3D.position)

        let inputPosition = (new THREE.Vector3()).copy(View.nodes[edge.input].position);
        let outputPosition = (new THREE.Vector3()).copy(View.nodes[edge.output].position);
        let negInputPosition = (new THREE.Vector3()).copy(inputPosition).negate();
        let edgeVector = (new THREE.Vector3()).add(outputPosition).add(negInputPosition);
        let perpendicular = edgeVector.cross(this.el.object3D.up)

        let cameraRotation = new THREE.Quaternion();
        cameraRig.object3D.getWorldQuaternion(cameraRotation);
        let edgeQuaternion = new THREE.Quaternion();
        this.el.object3D.getWorldQuaternion(edgeQuaternion);

        // cameraGyro.object3D.lookAt(gyroDragRotate.GetPosition(), edge.GetPosition(), perpendicular)
        // cameraRig.object3D.lookAt(cameraRig.object3D.position, edge.GetPosition, perpendicular)

        let vec = (new THREE.Vector3())
        this.el.object3D.getWorldPosition(vec)

        let vec2 = (new THREE.Vector3())
        cameraRig.object3D.getWorldPosition(vec2)
        cameraPos = (new THREE.Vector3()).copy(vec2)

        cameraRig.object3D.translateOnAxis(vec,vec.distanceTo(vec2))

        let zoomIn = new THREE.Vector3()
        this.el.object3D.getWorldPosition(zoomIn);

        document.getElementById('gyro').components['drag-rotate-component'].OnRemoveMouseDown(); 
        this.MoveCameraRig(new THREE.Vector3(zoomIn.x, zoomIn.y, zoomIn.z), edge.GetRotation(), new THREE.Vector3(0, 0, 90));

        let eventPlane = this.CreateEventPlane(edge);

        this.el.removeEventListener('click', this.ActivateZoomIn);
        eventPlane.addEventListener('click', this.ActivateZoomOut);
    },

    ActivateZoomOut: function(event) {
        let cameraGyro = document.getElementById('gyro').components['drag-rotate-component'];


        let vec = (new THREE.Vector3())
        this.el.object3D.getWorldPosition(vec)

        let vec2 = (new THREE.Vector3())
        cameraRig.object3D.getWorldPosition(vec2)

        cameraRig.object3D.translateOnAxis(cameraPos,-cameraPos.distanceTo(vec2))


        console.log('zooming out');
        this.el.setAttribute('material', 'color', 'green');

        document.getElementById('gyro').components['drag-rotate-component'].OnAddMouseDown(); 
        //this.MoveCameraRig(new THREE.Vector3(1, -1.2, 5), cameraGyro.GetRotation(), new THREE.Vector3(0, 0, 0));
        this.MoveCameraRig(cameraPos, cameraGyro.GetRotation(), new THREE.Vector3(0, 0, 0));

        eventPlane.removeEventListener('click', this.ActivateZoomOut);
        this.el.addEventListener('click', this.ActivateZoomIn);
        eventPlane.remove();
    },

    CreateEventPlane: function(edge) {
        let sceneModel = document.getElementById('sceneModel');
        let entityEl = document.createElement('a-entity');

        entityEl.setAttribute('geometry', {
            primitive: 'box',
            width: .5,
            height: 1,
            depth: .05
          });

        entityEl.object3D.position.copy(edge.GetPosition());
        entityEl.object3D.rotation.copy(edge.GetRotation());
        entityEl.setAttribute('material', 'opacity', '0.0');
        entityEl.setAttribute('id','eventPlane');

        sceneModel.appendChild(entityEl);
        return entityEl;
    },

    MoveCameraRig: function(position, initRotation, finalRotation) {
        var rotationOffset;
        let cameraOffset = new THREE.Vector3(0, 0, 0.10);
        let radToDeg = 180 / Math.PI;

        position.add(cameraOffset);
        try {
            rotationOffset = initRotation.toVector3();
        } catch(e) {
            console.log("Error: can not convert given edge to THREE.Vector3()");
        }

        rotationOffset.multiplyScalar(radToDeg);
        finalRotation.add(rotationOffset.negate());
        // rotationOffset.negate().add(finalRotation);
    
        document.getElementById('camera-rig').setAttribute('animation',{
            property: 'position',
            to: position.x + " " + position.y + " " + position.z,
            easing: 'linear',
            loop: false
        });
        
        document.getElementById('camera-rig').setAttribute('animation__2', {
            property: 'rotation',
            to: finalRotation.x + " " + finalRotation.y + " " + finalRotation.z,
            easing: 'linear',
            loop: false

        }); 
    }
});