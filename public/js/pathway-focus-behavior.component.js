AFRAME.registerComponent("pathway-focus", {
    schema: {
        animationDur: {type: 'number', default: 1200},
        initialPos: {type: 'string', default: '1 0 11'},
        defaultQuat: {default: new THREE.Quaternion(0,0,0,1)}
    },

    init : function() {
        this.ZoomIn = this.ZoomIn.bind(this);
        this.ZoomOut = this.ZoomOut.bind(this);
    },

   /**
   * activates the rig to animate towards given pathway position
   * @param pathwayPos - the position of the pathway
   */
    ZoomIn: function(pathwayPos) {
        const camera = document.getElementById('main-camera');
        const cameraRig = document.getElementById('camera-rig');
        const networkView = document.getElementById('parent-model').components['network-view']
        networkView.ResetCameraRotation()
        networkView.ResetSceneModelPosition()
        cameraRig.setAttribute('animation__zoomIn', {
            property: 'position',
            dur: this.data.animationDur,
            to: pathwayPos.x + " " + pathwayPos.y + " " + pathwayPos.z,
            easing: 'easeInCubic' 
        });
        window.setTimeout(e => {
            cameraRig.removeAttribute('animation__zoomIn')
            camera.getObject3D('camera').quaternion.copy(this.data.defaultQuat)
        }, this.data.animationDur)
    },

    /**
     * animates the camera rig towards initial position before zooming in
     */
    ZoomOut: function() {
        const camera = document.getElementById('main-camera');
        const cameraRig = document.getElementById('camera-rig');
        const networkView = document.getElementById('parent-model').components['network-view']
        networkView.ResetCameraRotation()
        networkView.ResetSceneModelPosition()
        cameraRig.setAttribute('animation__zoomOut', {
            property: 'position',
            dur: this.data.animationDur,
            to: this.data.initialPos,
            easing: 'easeInCubic' 
        });
        window.setTimeout(e => {
            cameraRig.removeAttribute('animation__zoomOut')
            camera.getObject3D('camera').quaternion.copy(this.data.defaultQuat)
        }, this.data.animationDur)
    },
});