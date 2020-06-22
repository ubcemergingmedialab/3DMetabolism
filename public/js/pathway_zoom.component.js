AFRAME.registerComponent("pathway_zoom", {
    schema: {
        zoomPosition: {type: 'vec3'},
        camera: {type: 'string', default: 'camera-rig'},
        defaultPos: {type: 'vec3'}
    },
    init: function() {
        let zoom = 'into'; //zoom into or out of edge
        var el = this.el; //the element this component is attached to
        var data = this.data;

        var cameraRig = document.getElementById('camera-rig');
        var pos = cameraRig.getAttribute('position');
        var cameraInitialPos = (new THREE.Vector3(pos.x, pos.y, pos.z)); //todo: not going back to initial position
        
        el.addEventListener('click', this.ActivateZoomIn.bind(this));

    
  
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
        this.MoveCameraRig(new THREE.Vector3(1,2,3)); //todo: current issue to find a way to give this the midpoint
       // moveCameraRig(zoomPosition);
        console.log();
        document.getElementById('sceneModel').components['drag-rotate-component'].OnRemoveMouseDown(); //not working
        this.el.removeEventListener('click', this.ActivateZoomIn.bind(this));
        this.el.addEventListener('click', this.ActivateZoomOut.bind(this));
    },
    ActivateZoomOut: function(event) {
        console.log('zooming out');
        this.el.setAttribute('material', 'color', 'green');
        this.MoveCameraRig(new THREE.Vector3(1, -1.2, 5)); //todo: give this function the proper initial value
        document.getElementById('sceneModel').components['drag-rotate-component'].OnAddMouseDown(); //not working
        this.el.removeEventListener('click', this.ActivateZoomOut.bind(this));
        this.el.addEventListener('click', this.ActivateZoomIn.bind(this));
    },
    MoveCameraRig: function(vec3) {
        document.getElementById(this.el.getAttribute('pathway_zoom').camera).setAttribute('animation',{
            property: 'position',
            to: vec3.x + " " + vec3.y + " " + vec3.z,
            dur: 1000,
            easing: 'linear',
            loop: false
        });
    }
});