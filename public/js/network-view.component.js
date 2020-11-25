AFRAME.registerComponent('network-view', {

  schema: {
    activePathway: { type: 'string', default: 'all_pathways' },
    defaultCameraRotation: {type: 'string', default:'0 0 0'},
    defaultSceneModelPosition: {type: 'string', default:'0 0 0'},
    defaultMitochondrionPosition: {type: 'string', default:'0 -0.4 0'}
  },

  init: function () {
    var sceneEl = document.querySelector('a-scene'); //parent scene
    this.sceneModel = document.createElement('a-entity'); //child entity
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

  ResetCameraRotation: function () {
    const gyro = document.getElementById('gyro');
    const scene = document.querySelector('a-scene');
    const animationName= 'animation__resetRotate'
    const animationProperties = {
      property: 'rotation',
      dir: 'to',
      dur: 1000,
      to: this.data.defaultCameraRotation,
      easing: 'linear'
    }
    console.log("resetting camera's rotation")
    if(gyro.hasAttribute(animationName)) { gyro.removeAttribute(animationName) }
    if(scene.hasAttribute(animationName)) { scene.removeAttribute(animationName) }
    scene.setAttribute(animationName, animationProperties);
    gyro.setAttribute(animationName, animationProperties);
  },

  ResetSceneModelPosition: function () {
    const sceneModel = document.getElementById('sceneModel');
    const mitochondrion = document.getElementById('mitochondrion')
    const animationName= 'animation__resetPosition'
    const animationProperties = {
      property: 'position',
      dir: 'to',
      dur: 1000,
      easing: 'linear'
    }
    console.log("resetting scene-model's position")
    if(sceneModel.hasAttribute(animationName)) { sceneModel.removeAttribute(animationName) }
    if(mitochondrion.hasAttribute(animationName)) { mitochondrion.removeAttribute(animationName) }
    sceneModel.setAttribute(animationName, animationProperties);
    sceneModel.setAttribute(animationName, { to: this.data.defaultSceneModelPosition })
    mitochondrion.setAttribute(animationName, animationProperties);
    mitochondrion.setAttribute(animationName, { to: this.data.defaultMitochondrionPosition })
  }
});
