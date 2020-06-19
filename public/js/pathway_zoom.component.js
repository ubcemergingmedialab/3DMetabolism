AFRAME.registerComponent("pathway_zoom", {
    schema: {
        zoomPosition: {type: 'vec3'}
    },
    init: function() {
        let zoom = 'into'; //zoom into or out of edge
        var el = this.el; //the element this component is attached to

        var cameraRig = document.getElementById('camera-rig');
        var cameraInitialPos = (new THREE.Vector3()).copy(cameraRig.getAttribute('position')); //todo: not going back to initial position
        
        el.addEventListener('click', function (evt) {
            //console.log('An element was clicked!');
            switch(zoom) {
                case 'into':
                    el.setAttribute('material', 'color', 'yellow'); 
                    moveCameraRig(new THREE.Vector3(1,2,3)); //todo: current issue to find a way to give this the midpoint
                   // moveCameraRig(zoomPosition);
                    //document.getElementById('sceneModel').removeAttribute("drag-rotate-component"); //not working
                    zoom = 'out';
                    break;
                case 'out':
                    el.setAttribute('material', 'color', 'green');
                    moveCameraRig(new THREE.Vector3(1, -1.2, 5)); //todo: give this function the proper initial value
                    //document.querySelector('sceneModel').setAttribute('drag-rotate-component',''); //not working
                    zoom = 'into';
                    break;
            }
        });

        var moveCameraRig = function(vec3) {
            cameraRig.setAttribute('animation',{
                property: 'position',
                to: vec3.x + " " + vec3.y + " " + vec3.z,
                dur: 1000,
                easing: 'linear',
                loop: false
            });
        }
    
  
        //animation="property: position; to: 1 8 -10; dur: 2000; easing: linear; loop: true"
        //register click event that:
            // [x] 1 creates animation component string leaving "from" blank and setting "to" to
            // [x] cylinder entity's position
            // []  2 finds drag-rotate-component and call function to de-register mousemove
            // [x] 3 registers another click function (might have to de-register the current one) that:
            // [x] 1. creates animation component back to original camera position
            // []  2. finds drag-rotate-component and call function to re-register mousemove
            // []  3. re-register the click event above
    }

});