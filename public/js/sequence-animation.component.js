AFRAME.registerComponent("sequence-animation", {
  schema: {
    activeSequence: { type: "string", default: "1" }
  },

  init: function () {
    this.activateNextAnimation = this.activateNextAnimation.bind(this);
    this.findNextMolecule = this.findNextMolecule.bind(this);
    this.findNextMoleculeRandom = this.findNextMoleculeRandom.bind(this);
    this.getFirstMolecule = this.getFirstMolecule.bind(this);
    this.triggerAnimation = this.triggerAnimation.bind(this);
  },

  triggerAnimation(sequence) {
    const sequences = Model.sequences.nodes[sequence]
    sequences.forEach((nodeList, index) => {
      let animationStarted = false;
      nodeList.forEach((node, nodeIndex) => {
        if (animationStarted) {
          return
        }
        if (nodeIndex >= nodeList.length) {
          return
        }
        const firstMolecule = this.getFirstMolecule(sequence, index)
        const nextMolecule = this.findNextMolecule(node, sequence, index)
        if (firstMolecule === undefined || nextMolecule === undefined) {
          return;
        } else {
          console.log('starting animation at ' + node)
          this.activateNextAnimation(firstMolecule, nextMolecule, 1000, sequence, index)
          animationStarted = true
          return;
        }
      })
    })
  },

  //@param1: id of element on which animatio will start
  //@param2: id of element on which this animation will end
  //@param3: how long the animation will go for
  //@param4: the sequence this animation is a part of (if null, decide randomly)
  activateNextAnimation: function (start, end, time, sequence, index) {
    const startMolecule = document.getElementById(start.split("-")[0])
    const endMolecule = document.getElementById(end.split("-")[0])
    if (startMolecule === null || endMolecule === null) {
    } else {
      const edge = Model.fetchEdge(start.split("-")[0], end.split("-")[0]);
      if (edge) {
        if (!edge.components["animation-behavior"]) {
          edge.setAttribute("animation-behavior", "");
        }
        edge.components['animation-behavior'].callAnimate();
      }
      const startAnimationComponent = startMolecule.components['node-animation']
      const endAnimationComponent = endMolecule.components['node-animation']
      if (!startAnimationComponent || !endAnimationComponent) {
      } else {
        startAnimationComponent.ResetColor()
        startAnimationComponent.AnimateToDefaultColor(time, sequence)
        endAnimationComponent.AnimateFromDefaultColor(time, sequence)
      }
    }

    setTimeout(() => {
      console.log(time)
      let curStart = end;
      let curEnd = this.findNextMolecule(end, sequence, index);
      if (curEnd === undefined) {
        const edge = Model.fetchEdge(start.split("-")[0], end.split("-")[0])
        if (edge !== undefined) {
          edge.components['animation-behavior'].callStopAnimation();
        } else {
          console.log('could not find edge to stop animation ' + curEnd + ' ' + curStart)
        }
      } else {
        this.activateNextAnimation(curStart, curEnd, time, sequence, index);
        const edge = Model.fetchEdge(start.split("-")[0], end.split("-")[0])
        if (edge !== null) {
          edge.components['animation-behavior'].callStopAnimation();
        }
      }
      if (startMolecule !== null) {
        const lastStartAnimationComponent = startMolecule.components['node-animation']
        if (!lastStartAnimationComponent) {
        } else {
          lastStartAnimationComponent.AnimateToDefaultColor(time, sequence)
        }
      }
      if (endMolecule !== null) {
        const lastEndAnimationComponent = endMolecule.components['node-animation']
        if (!lastEndAnimationComponent) {
          console.log('node missing animation component')
        } else {
          lastEndAnimationComponent.AnimateToDefaultColor(time, sequence)
        }
      }
    }, time);
  },

  //@param1 the name of the active sequence to get first molecule from
  getFirstMolecule(sequence, index) {
    return Model.sequences.nodes[sequence][index][0];
  },

  //@param1 element for which we want to find the next molecule
  //@param2 sequence within which to search for next molecule
  findNextMolecule(current, sequence, index) {
    let currentSequence = Model.sequences.nodes[sequence][index];
    let foundElement = false;
    for (let element of currentSequence) {
      if (foundElement == true) {
        console.log("found element " + element + " " + index)
        return element;
      }
      if (element == current) {
        foundElement = true;
      }
    }
    console.log("couldnt find element " + current + " " + sequence)
    return undefined;
  },

  findNextMoleculeRandom: function (current) {
    console.log('called random');
    return;
  }
});