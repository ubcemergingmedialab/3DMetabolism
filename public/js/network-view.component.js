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
    EdgePresenter.present(Model.pathways["gluconeogenesis"]);
    NodePresenter.present(Model.nodes)
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
