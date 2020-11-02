AFRAME.registerComponent("pathway_zoom", {
    schema: {
        edgeName: { type: 'string' },
        initPos: { type: 'string', default: '1 0 11' }
    },
    init: function () {
        var el = this.el;
        this.ActivateZoomIn = this.ActivateZoomIn.bind(this);
        this.ActivateZoomOut = this.ActivateZoomOut.bind(this);
        this.CreateEventPlane = this.CreateEventPlane.bind(this);
        this.AnimateCameraZoom = this.AnimateCameraZoom.bind(this);
        this.ZoomInAnimationCompleteHandler = this.ZoomInAnimationCompleteHandler.bind(this);
        this.ZoomOutAnimationCompleteHandler = this.ZoomOutAnimationCompleteHandler.bind(this);
        this.RemoveAnimationCompleteHandlers = this.RemoveAnimationCompleteHandlers.bind(this);
        el.addEventListener('click', this.ActivateZoomIn);
    },

    ActivateZoomIn: function (event) {

        let edge = this.el;
        console.log('zooming in');

        //this.el.setAttribute('material', 'color', 'yellow');
        eventPlane = this.CreateEventPlane(edge);
        this.AnimateCameraZoom();

        document.querySelector("[presenter]").setAttribute("raycaster", "objects:.eventPlane");

        document.getElementById('gyro').components['drag-rotate-component'].OnRemoveMouseDown();
        document.querySelector('a-scene').components['drag-rotate-component'].OnRemoveMouseDown();

        this.el.removeEventListener('click', this.ActivateZoomIn);
        eventPlane.addEventListener('click', this.ActivateZoomOut);
    },

    ActivateZoomOut: function (event) {
        let mainCamera = document.getElementById('main-camera');
        mainCamera.setAttribute('camera', 'active', true);
        let edgeCamera = document.getElementById(this.data.edgeName + "_rig").querySelector("[camera]");
        edgeCamera.setAttribute('camera', 'active', false);

        document.querySelector("[presenter]").setAttribute("raycaster", "objects:.interactible");

        console.log('zooming out');
        //this.el.setAttribute('material', 'color', 'green');

        document.getElementById('gyro').components['drag-rotate-component'].OnAddMouseDown();
        document.querySelector('a-scene').components['drag-rotate-component'].OnAddMouseDown();

        eventPlane.removeEventListener('click', this.ActivateZoomOut);
        this.el.addEventListener('click', this.ActivateZoomIn);
        eventPlane.remove();
    },

    CreateEventPlane: function (edge) {
        let sceneModel = document.getElementById('sceneModel');
        let entityEl = document.createElement('a-entity');
        entityEl.setAttribute('id', 'eventPlane');

        entityEl.setAttribute('geometry', {
            primitive: 'box',
            width: 1,
            height: 1,
            depth: .05
        });

        let pos = edge.object3D.position;
        entityEl.object3D.position.copy(pos);
        let rot = entityEl.object3D.rotation.clone();
        entityEl.object3D.rotation.copy(rot);
        entityEl.setAttribute('material', 'opacity', '0.0');
        entityEl.setAttribute('id', 'eventPlane');
        entityEl.setAttribute("class", "eventPlane");
        entityEl.setAttribute('material', 'color', 'red')

        sceneModel.appendChild(entityEl);
        return entityEl;
    },

    AnimateCameraZoom: function () {
        let cameraGyro = document.getElementById("gyro");
        let cameraMainRig = document.getElementById('camera-rig');
        document.querySelector("[presenter]").setAttribute("raycaster", "objects:.eventPlane");
        let targetVector = (new THREE.Vector3())
        this.el.object3D.getWorldPosition(targetVector)
        cameraGyro.object3D.worldToLocal(targetVector);

        cameraMainRig.addEventListener('animationcomplete__zoomIn', this.ZoomInAnimationCompleteHandler);
        cameraMainRig.addEventListener('animationcomplete__zoomOut', this.ZoomOutAnimationCompleteHandler);

        cameraMainRig.setAttribute('animation__zoomIn', {
            property: 'position',
            dir: 'alternate',
            dur: 1200,
            from: this.data.initPos,
            to: targetVector.x + " " + targetVector.y + " " + (targetVector.z),
            easing: 'easeInCubic'
        });

        eventPlane.addEventListener('click', () => {
            cameraMainRig.setAttribute('animation__zoomOut', {
                property: 'position',
                dur: 1200,
                to: this.data.initPos,
                easing: 'easeOutCubic'
            });
            document.querySelector("[presenter]").setAttribute("raycaster", "objects:.interactible");
        });
    },

    ZoomInAnimationCompleteHandler: function () {
        let cameraMainRig = document.getElementById('camera-rig');
        console.log("looking for camera: " + this.data.edgeName + "_rig")
        let edgeCamera;
        try {
            edgeCamera = document.getElementById(this.data.edgeName + "_rig").querySelector("[camera]");
        } catch (e) {
            console.log(e);
            this.RemoveAnimationCompleteHandlers();
            return;
        }
        let mainCamera = document.getElementById('main-camera');
        edgeCamera.setAttribute('camera', 'active', true);
        mainCamera.setAttribute('camera', 'active', false);
        cameraMainRig.removeAttribute('animation__zoomIn');
    },

    ZoomOutAnimationCompleteHandler: function () {
        let cameraMainRig = document.getElementById('camera-rig');
        let edgeCamera;
        try {
            edgeCamera = document.getElementById(this.data.edgeName + "_rig").querySelector("[camera]");
        } catch (e) {
            console.log(e);
            this.RemoveAnimationCompleteHandlers();
            return;
        }
        let mainCamera = document.getElementById('main-camera');
        edgeCamera.setAttribute('camera', 'active', false);
        mainCamera.setAttribute('camera', 'active', true);
        cameraMainRig.removeAttribute('animation__zoomOut');
    },

    RemoveAnimationCompleteHandlers: function () {
        let cameraMainRig = document.getElementById('camera-rig');
        cameraMainRig.removeEventListener('animationcomplete__zoomIn', this.ZoomInAnimationCompleteHandler);
        cameraMainRig.removeEventListener('animationcomplete__zoomOut', this.ZoomOutAnimationCompleteHandler);
    },

    remove: function () {
        console.log('removing handlers');
        this.RemoveAnimationCompleteHandlers();
    }
});