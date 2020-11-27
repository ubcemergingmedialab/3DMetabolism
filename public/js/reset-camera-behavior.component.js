AFRAME.registerComponent('reset-camera', {

    init: function () {
        this.resetCamera = this.resetCamera.bind(this)
        this.el.addEventListener('click',this.resetCamera)
    },

    resetCamera: function() {
        const networkView = document.getElementById('parent-model').components['network-view']
        networkView.ResetCameraRotation();
        networkView.ResetSceneModelPosition();
    } 
})