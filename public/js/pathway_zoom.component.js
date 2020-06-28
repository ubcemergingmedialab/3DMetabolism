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

        let cameraGyro = document.getElementById('gyro').components['drag-rotate-component'];
        let gyroQuaternion = (new THREE.Quaternion()).copy(cameraGyro.GetQuaternion());
        let zoomIn = this.data.zoomPosition.applyQuaternion(gyroQuaternion);

        console.log(cameraGyro.GetWorldPos())
        this.MoveCameraRig(new THREE.Vector3(zoomIn.x, zoomIn.y, zoomIn.z + 1),new THREE.Vector3(0, .2, 0.25));
        cameraGyro.OnRemoveMouseDown();

        this.el.removeEventListener('click', this.ActivateZoomIn);
        this.el.addEventListener('click', this.ActivateZoomOut);
    },
    ActivateZoomOut: function(event) {
        console.log('zooming out');
        this.el.setAttribute('material', 'color', 'green');
        this.MoveCameraRig(new THREE.Vector3(1, -1.2, 5), new THREE.Vector3(0, 0, 0)); //todo: give this function the proper initial value
        document.getElementById('gyro').components['drag-rotate-component'].OnAddMouseDown(); //not working
        this.el.removeEventListener('click', this.ActivateZoomOut);
        this.el.addEventListener('click', this.ActivateZoomIn);
    },
    MoveCameraRig: function(position, rotation) {
        let rotationDeg = new THREE.Vector3(rotation.x * (180 / Math.PI), rotation.y * (180 / Math.PI),rotation.z * (180 / Math.PI))
        document.getElementById('camera-rig').setAttribute('animation',{
            property: 'position',
            to: position.x + " " + position.y + " " + position.z,
            dur: 1000,
            easing: 'linear',
            loop: false
        });
        document.getElementById('camera-rig').setAttribute('animation__2', {
            property: 'rotation',
            to: rotationDeg.x + " " + rotationDeg.y + " " + rotationDeg.z,
            dur: 1000,
            easing: 'linear',
            loop: false

        }); 
    }
});