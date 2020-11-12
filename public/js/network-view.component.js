AFRAME.registerComponent('network-view', {

  schema: {
    activePathway: { type: 'string', default: 'all_pathways' }
  },

  init: function () {
    var sceneEl = document.querySelector('a-scene'); //parent scene
    this.sceneModel = document.createElement('a-entity'); //child entit
    sceneEl.appendChild(this.sceneModel);
    this.sceneModel.flushToDOM();
    this.sceneModel.setAttribute('id', 'sceneModel');

    for (let node in Model.nodes) {
      let entityEl = document.createElement('a-entity');
      let curNode = Model.nodes[node];
      entityEl.setAttribute('geometry', {
        primitive: 'sphere',
        radius: 0.2
      });
      entityEl.setAttribute("highlight-behavior", "elem: ");
      entityEl.setAttribute("id", node);
      entityEl.object3D.position.set(curNode.position.x, curNode.position.y, curNode.position.z);

      if (curNode.isPlaceholder) {
        entityEl.setAttribute('material', 'visible', 'false');
      }
      else {
        entityEl.setAttribute('material', { color: "#999", shader: "displace" });
        entityEl.setAttribute('label-behavior', { text: curNode.name, alignment: curNode.flippedText ? 'right' : 'left' });
      }

      entityEl.setAttribute("class", "interactible");
      entityEl.setAttribute('assign-position', '[translate-network]');
      console.log(curNode.name);
      this.sceneModel.appendChild(entityEl);
    }

    //NodePresenter.present(Model.nodes)
    EdgePresenter.present(Model.pathways["gluconeogenesis"]);
  },

  update: function () {
    var data = this.data;
    console.log("change in pathway " + data.activePathway);
    document.querySelectorAll('[pathway_zoom]').forEach(edge => {
      edge.removeAttribute("pathway_zoom");
      edge.remove();
    })
    document.querySelectorAll('.edgeCamera').forEach(edge => edge.remove());
    if (!!Model.pathways[data.activePathway]) {
      EdgePresenter.present(Model.pathways[data.activePathway]);
    }
  },

});
