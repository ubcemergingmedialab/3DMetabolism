AFRAME.registerComponent("pathway_zoom", {
    schema: {
        edgeName: {type: 'string'}
    },
    init: function() {
        var el = this.el;
        this.ActivateZoomIn = this.ActivateZoomIn.bind(this);
        this.ActivateZoomOut = this.ActivateZoomOut.bind(this);
        this.CreateEventPlane = this.CreateEventPlane.bind(this);
        this.AnimateCameraZoom = this.AnimateCameraZoom.bind(this);
        el.addEventListener('click', this.ActivateZoomIn);
    },

    ActivateZoomIn: function(event) {
        let edge = View.edges[this.data.edgeName]
        console.log('zooming in');

        this.el.setAttribute('material', 'color', 'yellow'); 
        eventPlane = this.CreateEventPlane(edge);
        this.AnimateCameraZoom();

        document.getElementById('gyro').components['drag-rotate-component'].OnRemoveMouseDown(); 
        document.querySelector('a-scene').components['drag-rotate-component'].OnRemoveMouseDown();

        this.el.removeEventListener('click', this.ActivateZoomIn);
        eventPlane.addEventListener('click', this.ActivateZoomOut);
    },

    ActivateZoomOut: function(event) {
        let mainCamera = document.getElementById('main-camera');

        mainCamera.setAttribute('camera','active',true);

        console.log('zooming out');
        this.el.setAttribute('material', 'color', 'green');

        document.getElementById('gyro').components['drag-rotate-component'].OnAddMouseDown(); 
        document.querySelector('a-scene').components['drag-rotate-component'].OnAddMouseDown();

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

    AnimateCameraZoom: function() {
        let cameraMainRig = document.getElementById('camera-rig');
        let targetVector = (new THREE.Vector3())
        this.el.object3D.getWorldPosition(targetVector)

        cameraMainRig.addEventListener('animationcomplete__zoomIn', () => {
            let edgeCamera = document.getElementById(this.data.edgeName+"-camera");
            edgeCamera.setAttribute('camera','active',true);
            cameraMainRig.removeAttribute('animation__zoomIn');
        });

        cameraMainRig.setAttribute('animation__zoomIn',{
            property: 'position',
            dir: 'alternate',
            dur: 1500,
            from: "1 -1.2 5",
            to: targetVector.x + " " + targetVector.y+ " " + targetVector.z,
            easing: 'easeInElastic'
        });

        eventPlane.addEventListener('click', () => {
            cameraMainRig.setAttribute('animation__zoomOut',{
                property: 'position',
                dur: 1500,
                from: targetVector.x + " " + targetVector.y + " " + targetVector.z,
                to: "1 -1.2 5",
                easing: 'easeOutElastic'
            });
        });
    }
});