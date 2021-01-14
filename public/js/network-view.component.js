AFRAME.registerComponent('network-view', {

  schema: {
    activePathway: { type: 'string', default: 'all_pathways' },
    defaultCameraRotation: { type: 'string', default: '0 0 0' },
    defaultSceneModelPosition: { type: 'string', default: '0 0 0' },
  },

  init: function () {
    var sceneEl = document.querySelector('a-scene'); //parent scene
    this.sceneModel = document.createElement('a-entity'); //child entity
    sceneEl.appendChild(this.sceneModel);
    this.sceneModel.flushToDOM();
    this.sceneModel.setAttribute('id', 'sceneModel');
    EdgePresenter.present(Model.pathways["gluconeogenesis"]);
    NodePresenter.present(Model.nodes)
    UIPresenter(Model.pathways, Model.sequences)

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
    const animationName = 'animation__resetRotation'
    const animationProperties = {
      property: 'rotation',
      dir: 'to',
      dur: 1500,
      to: this.data.defaultCameraRotation,
      easing: 'linear'
    }
    console.log("resetting gyro's rotation")
    if (gyro.hasAttribute(animationName)) { gyro.removeAttribute(animationName) }
    if (scene.hasAttribute(animationName)) { scene.removeAttribute(animationName) }
    try {
      scene.setAttribute(animationName, animationProperties);
      gyro.setAttribute(animationName, animationProperties);
    } catch (e) {
      console.log("Failed to reset gyro's rotation")
    }
  },

  ResetSceneModelPosition: function () {
    console.log("Resetting sceneModel's position")
    try {
      this.el.setAttribute('translate-network', { position: this.data.defaultSceneModelPosition })
    } catch (e) {
      console.log("Failed to reset sceneModel's position")
    }
  },

  var : pathways_focus_pos = {
    "all_pathways": new THREE.Vector3(1,0,11),
    "glycolysis": new THREE.Vector3(0, 3, 7),
    "gluconeogenesis": new THREE.Vector3(0,1.5,9),
    "pyruvate_dehydrogenase": new THREE.Vector3(0,-3.5,7),
    "citric_acid_cycle": new THREE.Vector3(0, -3.5, 7),
    "glycogenesis": new THREE.Vector3(2, 4, 7),
    "glycogenolysis": new THREE.Vector3(2, 4, 7),
    "oxidative_phosphorylation": new THREE.Vector3(1,0,11)
  }
});
