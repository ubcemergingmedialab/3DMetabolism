AFRAME.registerComponent("pathway_zoom", {
    schema: {
        zoomPosition: {type: 'vec3'},
        cameraPos: {type: 'vec3'},
        edgeName: {type: 'string'}
    },
    init: function() {
        var el = this.el;
        var data = this.data;
        this.ActivateZoomIn = this.ActivateZoomIn.bind(this);
        this.ActivateZoomOut = this.ActivateZoomOut.bind(this);
        this.MoveCameraRig = this.MoveCameraRig.bind(this);
        el.addEventListener('click', this.ActivateZoomIn);
    },

    ActivateZoomIn: function(event) {
        console.log('zooming in');
        this.el.setAttribute('material', 'color', 'yellow'); 
        let edge = View.edges[this.data.edgeName];

        let cameraGyro = document.getElementById('gyro').components['drag-rotate-component'];
        let gyroQuaternion = (new THREE.Quaternion()).copy(cameraGyro.GetQuaternion());
        let inputPosition = (new THREE.Vector3()).copy(View.nodes[edge.input].position);
        let outputPosition = (new THREE.Vector3()).copy(View.nodes[edge.output].position);
        let negInputPosition = (new THREE.Vector3()).copy(inputPosition).negate();
        let edgeVector = (new THREE.Vector3()).add(outputPosition).add(negInputPosition);

        let cameraRotation = new THREE.Quaternion();
        document.getElementById("camera-rig").object3D.getWorldQuaternion(cameraRotation);
        let edgeQuaternion = new THREE.Quaternion();
        this.el.object3D.getWorldQuaternion(edgeQuaternion);
        cameraRotation.slerp(edgeQuaternion, 1);

        //let rotation = (new THREE.Quaternion()).setFromUnitVectors(cameraRotation, edgeVector);
        let rotationEuler = (new THREE.Euler()).setFromQuaternion(cameraRotation);

        //console.log("edge angle: " + JSON.stringify(edgeAngle));

        let zoomIn = new THREE.Vector3()
        this.el.object3D.getWorldPosition(zoomIn);
        console.log(JSON.stringify(zoomIn));
        let cameraOffset = new THREE.Vector3();
        document.getElementById("camera-rig").object3D.getWorldPosition(cameraOffset);
        cameraOffset.add(new THREE.Vector3(-1, 1.2, -5));
        console.log(JSON.stringify(cameraOffset));
        zoomIn.add(cameraOffset.negate());
        console.log(zoomIn);

        /* todo- fix this rotation */
        let rotationX = -edge.GetRotation().x - cameraGyro.GetRotation().x;
        let rotationY = -edge.GetRotation().y - cameraGyro.GetRotation().y;
        let rotationZ = -edge.GetRotation().z - cameraGyro.GetRotation().z;
        let properRotation = new THREE.Vector3(rotationX, rotationY, Math.PI/2 - rotationZ).applyQuaternion(gyroQuaternion);

        //this.MoveCameraRig(new THREE.Vector3(zoomIn.x, zoomIn.y, zoomIn.z + 1),properRotation);
        this.MoveCameraRig(new THREE.Vector3(zoomIn.x, zoomIn.y, zoomIn.z), rotationEuler);
        cameraGyro.OnRemoveMouseDown();

        this.el.removeEventListener('click', this.ActivateZoomIn);
        this.el.addEventListener('click', this.ActivateZoomOut);
    },

    ActivateZoomOut: function(event) {
        console.log('zooming out');
        this.el.setAttribute('material', 'color', 'green');
        this.MoveCameraRig(new THREE.Vector3(1, -1.2, 5), new THREE.Vector3(0, 0, 0));
        document.getElementById('gyro').components['drag-rotate-component'].OnAddMouseDown(); 
        this.el.removeEventListener('click', this.ActivateZoomOut);
        this.el.addEventListener('click', this.ActivateZoomIn);
    },

    MoveCameraRig: function(position, rotation) {
        let radToDeg = 180 / Math.PI;
        let rotationDeg = new THREE.Vector3(rotation.x * radToDeg, rotation.y * radToDeg,rotation.z * radToDeg)

        document.getElementById('camera-rig').setAttribute('animation',{
            property: 'position',
            to: position.x + " " + position.y + " " + position.z,
            easing: 'linear',
            loop: false
        });
        
        document.getElementById('camera-rig').setAttribute('animation__2', {
            property: 'rotation',
            to: rotationDeg.x + " " + rotationDeg.y + " " + rotationDeg.z,
            easing: 'linear',
            loop: false

        }); 
    }
});