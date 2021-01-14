AFRAME.registerComponent("pathway-focus", {
    schema: {
        animationDur: {type: "number", default: 1200},
        initialPos: {type: "string", default: '1 0 11'},
        targetPos: {type:"vec3", default: new THREE.Vector3(0, -3.5, 7)},
        defaultQuat: {default: new THREE.Quaternion(0,0,0,1)}
    },

    init : function() {
        this.zoomIn = this.zoomIn.bind(this);
        this.zoomOut = this.zoomOut.bind(this);
        this.zoom = this.zoom.bind(this)
        this.createZoomOutButton = this.createZoomOutButton.bind(this);
        this.clickListener = this.clickListener.bind(this);
        this.el.addEventListener("click", this.clickListener);
    },

    clickListener: function (e) {
        try {
            this.createZoomOutButton();
            this.zoomIn();
        }catch(e) {
            console.log(e)
        }
    },

   /**
   * activates the rig to animate towards given pathway position
   */
    zoomIn: function() {
        const pos = this.data.targetPos.x + " " + this.data.targetPos.y + " " + this.data.targetPos.z;
        this.zoom(pos, "__zoomIn");
    },

    /**
     * animates the camera rig towards initial position prior zooming in
     */
    zoomOut: function() {
        this.zoom(this.data.initialPos, "__zoomOut");
    },

    zoom: function(pos, eventTag) {
        const camera = document.getElementById("main-camera");
        const cameraRig = document.getElementById("camera-rig");
        const networkView = document.getElementById("parent-model").components["network-view"]
        networkView.ResetCameraRotation()
        networkView.ResetSceneModelPosition()
        cameraRig.setAttribute("animation" + eventTag, {
            property: "position",
            dur: this.data.animationDur,
            to: pos,
            easing: "easeInCubic"
        });
        window.setTimeout(e => {
                cameraRig.removeAttribute("animation" + eventTag)
                camera.getObject3D("camera").quaternion.copy(this.data.defaultQuat)
            }, this.data.animationDur);
    },

    createZoomOutButton: function() {
        window.setTimeout(e => {    
            const cameraRig = document.getElementById("camera-rig");
            const flexContainer = document.createElement("a-gui-flex-container");
            const button = document.createElement("a-gui-button");
            button.setAttribute("width","1.75");
            button.setAttribute("height","0.75");
            button.setAttribute("value","Zoom out");
            button.setAttribute("class","interactible");
            button.addEventListener("click", e => { 
                this.zoomOut();
                button.remove();
                flexContainer.remove();
            });
            flexContainer.appendChild(button);
            cameraRig.appendChild(flexContainer);
            flexContainer.object3D.position.copy(new THREE.Vector3(-7, -2.5, -5))}, this.data.animationDur)
    }
});

