AFRAME.registerComponent('assign-position', {
    schema: {
        target: {type: 'string', default: '[translate-network]'}
    },

    init: function() {
        var data = this.data;
        var el = this.el;
        console.log('init translate');
        el.addEventListener('click', (e) => {
                var obj = this.el.object3D.position;
                var position = new THREE.Vector3(obj.x, obj.y, obj.z);
                translateElement = document.querySelector(this.el.getAttribute("assign-position"));
                translateElement.setAttribute("translate-network", "position", position.x + " " + position.y + " " + position.z);
        });
    }
});