AFRAME.registerComponent("pathway-focus", {
    schema: {
        animationDur: {type: 'number', default: 1200},
        initialPos: {type: 'string', default: '1 0 11'},
        defaultQuat: {default: new THREE.Quaternion(0,0,0,1)}
    },

    init : function() {
        this.ZoomIn = this.ZoomIn.bind(this);
        this.ZoomOut = this.ZoomOut.bind(this);
        this.zoom = this.zoom.bind(this)
    },

   /**
   * activates the rig to animate towards given pathway position
   * @param pathwayPos - the position of the pathway
   */
    ZoomIn: function(pathwayPos) {
        const pos = pathwayPos.x + " " + pathwayPos.y + " " + pathwayPos.z;
        this.zoom(pos, '__zoomIn');
    },

    /**
     * animates the camera rig towards initial position before zooming in
     */
    ZoomOut: function() {
        this.zoom(this.data.initialPos, '__zoomOut');
    },

    zoom: function(pos, eventTag) {
        const camera = document.getElementById('main-camera');
        const cameraRig = document.getElementById('camera-rig');
        const networkView = document.getElementById('parent-model').components['network-view']
        networkView.ResetCameraRotation()
        networkView.ResetSceneModelPosition()
        cameraRig.setAttribute('animation' + eventTag, {
            property: 'position',
            dur: this.data.animationDur,
            to: pos,
            easing: 'easeInCubic' 
        });
        window.setTimeout(e => {
            cameraRig.removeAttribute('animation' + eventTag)
            camera.getObject3D('camera').quaternion.copy(this.data.defaultQuat)
        }, this.data.animationDur)
    }
});