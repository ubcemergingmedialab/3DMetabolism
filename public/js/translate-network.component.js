AFRAME.registerComponent('translate-network', {
    schema: {
        position: {type: 'string', default: '0 0 0'}
    },

    init: function() {
        console.log('init translate-network');
    },

    update: function() {
        var targetPos = AFRAME.utils.coordinates.parse(this.data.position);
        var translation = new THREE.Vector3(-targetPos.x, -targetPos.y, -targetPos.z);
        console.log('translating ' + translation.x + " " + translation.y + " " + translation.z);
        var sceneModel = document.getElementById('sceneModel');
        if(sceneModel != null) {
            sceneModel.setAttribute('animation',{
                property: 'position',
                dir: 'normal',
                dur: 1500,
                to: translation.x + " " + translation.y+ " " + translation.z,
                easing: 'easeInQuad'
            });
            
            document.getElementById("mitochondrion").setAttribute('animation',{
                property: 'position',
                dir: 'normal',
                dur: 1500,
                to: translation.x + " " + (translation.y - 0.5) + " " + translation.z,
                easing: 'easeInQuad'
            });
        }
    }
})