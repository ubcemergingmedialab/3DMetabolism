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
    
  
        //animation="property: position; to: 1 8 -10; dur: 2000; easing: linear; loop: true"
        //register click event that:
            // [x] 1 creates animation component string leaving "from" blank and setting "to" to
            // [x] cylinder entity's position
            // []  2 finds drag-rotate-component and call function to de-register mousemove
            // [x] 3 registers another click function (might have to de-register the current one) that:
            // [x] 1. creates animation component back to original camera position
            // []  2. finds drag-rotate-component and call function to re-register mousemove
            // []  3. re-register the click event above
    },

    ActivateZoomIn: function(event) {
        console.log('zooming in');
        this.el.setAttribute('material', 'color', 'yellow'); 
        let cameraGyro = document.getElementById('gyro').components['drag-rotate-component'];
    
        let zoomIn = this.data.zoomPosition.applyQuaternion(cameraGyro.GetQuaternion());
        console.log(zoomIn)

        this.MoveCameraRig(new THREE.Vector3(zoomIn.x, zoomIn.y, zoomIn.z + 1)); //todo: current issue to find a way to give this the midpoint
        console.log(cameraGyro.GetMatrix());
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