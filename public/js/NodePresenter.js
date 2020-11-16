var NodePresenter = (function () {


  //Public
  present = function (nodes) {
    const sceneModel = document.getElementById('sceneModel');
    this.nodes = nodes
    for (const node in this.nodes) {
      const curNode = this.nodes[node]
      const elem = document.createElement('a-entity');
      sceneModel.appendChild(elem);
      setBehavior(curNode, elem);
      elem.setAttribute('id', node);
    }
  };


  removeOutline = function (sequence) {
    const nodes = _grabNodes(sequence);
    for (node of nodes) {
      const element = Model.fetchNode(node);
      element.components["highlight-behavior"].RemoveOutline();
      element.components["highlight-behavior"].DecrementHighlightCounter();
    }
  };

  highlight = function (sequence) {
    const nodes = _grabNodes(sequence);
    for (node of nodes) {
      const element = Model.fetchNode(node);
      element.components["highlight-behavior"].IncrementHighlightCounter();
    }
  };

  outline = function (sequence) {
    const nodes = _grabNodes(sequence);
    for (node of nodes) {
      const element = Model.fetchNode(node);
      element.components["highlight-behavior"].Outline();
    }
  };

  //private
  setBehavior = function (node, elem) {
    elem.object3D.position.copy(node.position)
    elem.setAttribute('class', 'interactible');
    elem.setAttribute('highlight-behavior', 'elem: ');
    elem.setAttribute('assign-position', '[translate-network]');
    elem.setAttribute('geometry', {
      primitive: 'sphere',
      radius: 0.2
    });
    if (!!!node.isPlaceholder) {
      elem.setAttribute('material', { color: '#999', shader: 'displace' });
      elem.setAttribute('label-behavior', {
        text: node.name,
        alignment: node.flippedText ? 'right' : 'left'
      });
    }
    else {
      elem.setAttribute('material', 'visible', 'false');
    }
  };

  _grabNodes = function (sequence) {
    let result = {}
    Model.pathways[sequence].forEach((e) => {
      if (!(e.input in result)) result[e.input] = e.input
      if (!(e.output in result)) result[e.output] = e.output
    });
    return Object.keys(result);
  };

  return {
    present,
    highlight,
    removeOutline,
    outline
  }
})();