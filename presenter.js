AFRAME.registerComponent('presenter', {

  init: function() {
    const NODES_ITERATOR = Object.values(View.nodes);
    const EDGES_ITERATOR = Object.values(View.edges);

    console.log(NODES_ITERATOR)
    console.log(EDGES_ITERATOR)

    var sceneEl = document.querySelector('a-scene');

    var drawEdges = function(node) {
      var index = 0;
      for (index = 0; index < EDGES_ITERATOR.length; index++) {
        var entityEl = document.createElement('a-entity');
        entityEl.setAttribute('geometry', {
          primitive: 'cylinder',
          height: 1,
          radius: 0.3
        });
        entityEl.setAttribute('position', {
          x: (NODES_ITERATOR[index+1].xPosition - NODES_ITERATOR[index].xPosition)/2,
          y: (NODES_ITERATOR[index+1].yPosition - NODES_ITERATOR[index].yPosition)/2,
          z: (NODES_ITERATOR[index+1].zPosition - NODES_ITERATOR[index].zPosition)/2
        });
        entityEl.setAttribute('material', 'color', 'green');
        sceneEl.appendChild(entityEl);
      }
    };

    drawEdges();


    NODES_ITERATOR.forEach(function(node) {
      var entityEl = document.createElement('a-entity');
      entityEl.setAttribute('geometry', {
        primitive: 'sphere',
        radius: 0.5
      });
      entityEl.setAttribute('position', {
        x: node.xPosition,
        y: node.yPosition,
        z: node.zPosition
      });
      entityEl.setAttribute('material', 'color', 'blue');
      sceneEl.appendChild(entityEl);
    });


  }

});
