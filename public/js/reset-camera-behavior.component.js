AFRAME.registerComponent('reset-camera', {

    init: function () {
        this.resetCamera = this.resetCamera.bind(this)
        this.el.addEventListener('click',this.resetCamera)
    },

    resetCamera: function() {
        const networkView = document.querySelector('[network-view]').components['network-view']
        networkView.ResetCameraRotation();
        networkView.ResetSceneModelPosition();
    } 
})