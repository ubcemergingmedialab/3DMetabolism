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
        let edge = View.edges[this.data.edgeName]
        console.log('zooming in');
        this.el.setAttribute('material', 'color', 'yellow'); 
        let edgeCamera = document.getElementById(this.data.edgeName+"-camera");
        edgeCamera.setAttribute('camera','active',true);

        eventPlane = this.CreateEventPlane(edge);

        this.el.removeEventListener('click', this.ActivateZoomIn);
        eventPlane.addEventListener('click', this.ActivateZoomOut);
    },

    ActivateZoomOut: function(event) {
        let mainCamera = document.getElementById('main-camera');

        mainCamera.setAttribute('camera','active',true);

        console.log('zooming out');
        this.el.setAttribute('material', 'color', 'green');

        document.getElementById('gyro').components['drag-rotate-component'].OnAddMouseDown(); 

        eventPlane.removeEventListener('click', this.ActivateZoomOut);
        this.el.addEventListener('click', this.ActivateZoomIn);
        eventPlane.remove();
    },

    CreateEventPlane: function(edge) {
        let sceneModel = document.getElementById('sceneModel');
        let entityEl = document.createElement('a-entity');
        entityEl.setAttribute('id','eventPlane');

        entityEl.setAttribute('geometry', {
            primitive: 'box',
            width: .5,
            height: 1,
            depth: .05
          });

        entityEl.object3D.position.copy(edge.GetPosition());
        entityEl.object3D.rotation.copy(edge.GetRotation());
        entityEl.setAttribute('material', 'opacity', '0.5');
        entityEl.setAttribute('id','eventPlane');
        entityEl.setAttribute('material','color','red')

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
        
        // document.getElementById('camera-rig').setAttribute('animation__2', {
        //     property: 'rotation',
        //     to: finalRotation.x + " " + finalRotation.y + " " + finalRotation.z,
        //     easing: 'linear',
        //     loop: false

        // }); 
    }
});