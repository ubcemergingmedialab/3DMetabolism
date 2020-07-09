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
        let edgeElement = document.getElementById(this.data.edgeName);
        let gyroDragRotate = document.getElementById('gyro').components['drag-rotate-component'];
        let cameraGyro = document.getElementById("gyro");
        let cameraRig = document.getElementById('camera-rig');

        cameraDefaultPos = new THREE.Vector3(this.data.cameraPos.x, this.data.cameraPos.y, this.data.cameraPos.z);
        currentCameraPosition = new THREE.Vector3();
        cameraRig.object3D.getWorldPosition(currentCameraPosition);

        let inputPosition = (new THREE.Vector3());
        document.getElementById(edge.input).object3D.getWorldPosition(inputPosition);
        let outputPosition = (new THREE.Vector3());
        document.getElementById(edge.output).object3D.getWorldPosition(outputPosition);
        let negInputPosition = (new THREE.Vector3()).copy(inputPosition).negate(); // -A
        let edgeVector = (new THREE.Vector3()).add(outputPosition).add(negInputPosition); // AB = B - A
        let perpendicular = edgeVector.cross(this.el.object3D.up)


        let q = (new THREE.Quaternion()).setFromUnitVectors(perpendicular, edgeVector);
        let tarQ = cameraRig.object3D.quaternion.clone().premultiply(q);

        //cameraGyro.object3D.lookAt(gyroDragRotate.GetPosition(), edge.GetPosition(), perpendicular)
        //cameraRig.object3D.lookAt(cameraRig.object3D.position, edgePosition, perpendicular)

        let zoomIn = new THREE.Vector3()
        this.el.object3D.getWorldPosition(zoomIn);

        //zoomIn.add(cameraOffset.negate());

        document.getElementById('gyro').components['drag-rotate-component'].OnRemoveMouseDown(); 
        this.MoveCameraRig(new THREE.Vector3(zoomIn.x, zoomIn.y, zoomIn.z), tarQ);

        let eventPlane = this.CreateEventPlane(edge);

        this.el.removeEventListener('click', this.ActivateZoomIn);
        eventPlane.addEventListener('click', this.ActivateZoomOut);
    },

    ActivateZoomOut: function(event) {
        let cameraGyro = document.getElementById('gyro').components['drag-rotate-component'];

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

    MoveCameraRig: function(position, finalRotation) {
        var rotationOffset;
        let cameraOffset = new THREE.Vector3(0, 0, 0.10);
        let radToDeg = 180 / Math.PI;
/*
        position.add(cameraOffset);
        try {
            rotationOffset = initRotation.toVector3();
        } catch(e) {
            console.log("Error: can not convert given edge to THREE.Vector3()");
        }

        rotationOffset.multiplyScalar(radToDeg);
        finalRotation.add(rotationOffset.negate());
        // rotationOffset.negate().add(finalRotation);
    */
        //finalRotation.multiplyScalar(radToDeg);

        finalEuler = (new THREE.Euler()).setFromQuaternion(finalRotation);
        console.log("final rotation: " + JSON.stringify(finalRotation));
        /*
        document.getElementById('camera-rig').setAttribute('animation',{
            property: 'position',
            to: position.x + " " + position.y + " " + position.z,
            easing: 'linear',
            loop: false
        });*/
        
        document.getElementById('camera-rig').setAttribute('animation__2', {
            property: 'rotation',
            to: finalEuler.x*radToDeg + " " + finalEuler.y*radToDeg + " " + finalEuler.z*radToDeg,
            easing: 'linear',
            loop: false
        }); 
    }
});