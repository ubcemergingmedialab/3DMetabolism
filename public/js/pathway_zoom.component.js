AFRAME.registerComponent("pathway_zoom", {
    schema: {
        zoomPosition: {type: 'vec3'},
        cameraPos: {type: 'vec3'},
        edgeName: {type: 'string'}
    },
    init: function() {
        let zoom = 'into'; //zoom into or out of edge
        var el = this.el; //the element this component is attached to
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
    
        let zoomIn = this.data.zoomPosition.applyQuaternion(cameraGyro.GetQuaternion());

        this.MoveCameraRig(new THREE.Vector3(zoomIn.x, zoomIn.y, zoomIn.z + 1)); //todo: current issue to find a way to give this the midpoint
        cameraGyro.OnRemoveMouseDown(); //not working
        this.el.removeEventListener('click', this.ActivateZoomIn);
        this.el.addEventListener('click', this.ActivateZoomOut);
    },
    ActivateZoomOut: function(event) {
        console.log('zooming out');
        this.el.setAttribute('material', 'color', 'green');
        this.MoveCameraRig(new THREE.Vector3(1, -1.2, 5)); //todo: give this function the proper initial value
        document.getElementById('gyro').components['drag-rotate-component'].OnAddMouseDown(); //not working
        this.el.removeEventListener('click', this.ActivateZoomOut);
        this.el.addEventListener('click', this.ActivateZoomIn);
    },
    MoveCameraRig: function(vec3) {
        document.getElementById('camera-rig').setAttribute('animation',{
            property: 'position',
            to: vec3.x + " " + vec3.y + " " + vec3.z,
            dur: 1000,
            easing: 'linear',
            loop: false
        });
    }
});