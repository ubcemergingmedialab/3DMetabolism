class NodePresenter {
    constructor(){
        this.sceneModel = document.getElementById('sceneModel');
        this.present = this.present.bind(this);
        this.setBehavior = this.setBehavior.bind(this);
    };

    //Public
    present(nodes) {
        this.nodes = nodes   
        for(const node in this.nodes) {
            const curNode = this.nodes[node]
            const elem = document.createElement('a-entity');
            this.sceneModel.appendChild(elem);
            this.setBehavior(curNode, elem);
            elem.setAttribute('id', node);
        }
    }

    //private
    setBehavior(node, elem) {
        elem.object3D.position.copy(node.position)
        elem.setAttribute('class','interactible');
        elem.setAttribute('highlight-behavior', 'elem: ');
        elem.setAttribute('assign-position', '[translate-network]');
        elem.setAttribute('geometry', {
            primitive: 'sphere',
            radius: 0.2
        });
        if(!!!node.isPlaceholder) {
            elem.setAttribute('material', {color: '#999', shader:'displace'});
            elem.setAttribute('label-behavior', { 
                text: node.name, 
                alignment: node.flippedText ? 'right' : 'left' 
            });
        }
        else {
            elem.setAttribute('material','visible','false');
        }
    }
}