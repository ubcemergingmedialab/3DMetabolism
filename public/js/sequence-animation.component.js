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
    let firstMolecule = this.getFirstMolecule(sequence);
    if (firstMolecule == null) {
      console.log("could not find molecule in sequence " + sequence);
      return;
    } else {
      this.activateNextAnimation(firstMolecule, this.findNextMolecule(firstMolecule, sequence), 1000, sequence);
    }
  },

  //@param1: element on which animatio will start
  //@param2: element on which this animation will end
  //@param3: how long the animation will go for
  //@param4: the sequence this animation is a part of (if null, decide randomly)
  activateNextAnimation: function (start, end, time, sequence) {
    let startObject = start.object3D;
    let endObject = end.object3D;
    let edge = Model.fetchEdge(start.getAttribute("id"), end.getAttribute("id"));
    if (edge) {
      if (!edge.components["animation-behavior"]) {
        edge.setAttribute("animation-behavior", "");
      }
      edge.components['animation-behavior'].callAnimate();
    }

    let startColor, endColor;
    startColor = start.getAttribute("material").color;
    start.setAttribute("material", { color: "#fff" });
    endColor = end.getAttribute("material").color;
    let startAnimationName = "animation__" + sequence;
    start.setAttribute(startAnimationName, {
      property: 'material.color',
      dur: 1000,
      to: startColor
    })

    end.setAttribute("animation__" + sequence, {
      property: 'material.color',
      dur: 1000,
      to: "#fff"
    })

    setTimeout(() => {
      let curStart = end;
      let curEnd = this.findNextMolecule(end, sequence);
      if (curEnd != null) {
        this.activateNextAnimation(curStart, curEnd, time, sequence);
      } else {
        console.log("animation ended")
      }
      if (edge) {
        edge.components['animation-behavior'].callStopAnimation();
      }

      end.setAttribute("animation__" + sequence, {
        property: 'material.color',
        dur: 1000,
        to: endColor
      });
      start.removeAttribute(startAnimationName);
      //markerEl.remove();
    }, time);
  },

  //@param1 the name of the active sequence to get first molecule from
  getFirstMolecule(sequence) {
    return document.getElementById(Model.sequences.nodes[sequence][0]);
  },

  //@param1 element for which we want to find the next molecule
  //@param2 sequence within which to search for next molecule
  findNextMolecule(current, sequence) {
    let currentSequence = Model.sequences.nodes[sequence];
    let currentName = current.getAttribute("id");
    let foundElement = false;
    for (let element of currentSequence) {
      if (foundElement == true) {
        return document.getElementById(element);
      }
      if (element == currentName) {
        foundElement = true;
      }
    }
    return null;
  },

  findNextMoleculeRandom: function (current) {
    console.log('called random');
    return;
  }
});