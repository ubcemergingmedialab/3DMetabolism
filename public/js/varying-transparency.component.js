AFRAME.registerComponent('varying-transparency', {
    schema: { default: 1.0 },
    init: function () {
        this.el.addEventListener('model-loaded', this.update.bind(this))
        setInterval(() => {
            this.update();
        }, 100);
    },
    update: function () {
        var mesh = this.el.getObject3D('mesh');
        var data = this.data;
        if (!mesh) { return; }
        mesh.traverse(function (node) {
            if (node.isMesh) {
                node.material.opacity = data;
                node.material.transparent = data < 1.0;
                node.material.alphaTest = 0.1;
                node.material.depthWrite = false;
                node.material.needsUpdate = true;
            }
        });
    }
})