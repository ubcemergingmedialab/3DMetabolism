AFRAME.registerComponent("sequence-animation", {
    schema: {
        activeSequence: { type: "string", default: "1" }
    },

    init: function () {
        var data = this.data;
        this.activateNextAnimation = this.activateNextAnimation.bind(this);
        this.findNextMolecule = this.findNextMolecule.bind(this);
        this.findNextMoleculeRandom = this.findNextMoleculeRandom.bind(this);
        this.getFirstMolecule = this.getFirstMolecule.bind(this);

        /*     setInterval(() => {
                 if (data.activeSequence == "random") {
                     console.log("calling random");
                     return;
                 } else {
                     let firstMolecule = this.getFirstMolecule(data.activeSequence);
                     if (firstMolecule == null) {
                         console.log("could not find molecule in sequence " + data.activeSequence);
                         return;
                     }
                     this.activateNextAnimation(firstMolecule, this.findNextMolecule(firstMolecule, data.activeSequence), 1000, data.activeSequence);
                 }
             }, 2000)*/
        document.addEventListener('keydown', (e) => {
            console.log("keydown");
            switch (e.keyCode) {
                case 49:
                    this.el.setAttribute("sequence-animation", "activeSequence", "1");
                    break;
                case 50:
                    console.log("changing active sequence");
                    this.el.setAttribute("sequence-animation", "activeSequence", "2");
                    break;
                case 32:
                    let firstMolecule = this.getFirstMolecule(data.activeSequence);
                    if (firstMolecule == null) {
                        console.log("could not find molecule in sequence " + data.activeSequence);
                        break;
                    }
                    this.activateNextAnimation(firstMolecule, this.findNextMolecule(firstMolecule, data.activeSequence), 1000, data.activeSequence);
                    break;
            }
        })
    },

    //@param1: element on which to creat animation marker
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
        start.setAttribute("animation__" + this.data.activeSequence, {
            property: 'material.color',
            dur: 1000,
            to: startColor
        })
        end.setAttribute("animation__" + this.data.activeSequence, {
            property: 'material.color',
            dur: 1000,
            to: "#fff"
        })
        /*
        let markerEl = document.createElement("a-entity");
        markerEl.setAttribute("geometry", {
            primitive: 'sphere',
            radius: 0.3
        });
        markerEl.setAttribute("material", {
            emissive: "#fff",
            emissiveIntensity: 20
        })
        let startPosition = startObject.position;
        let endPosition = endObject.position;
        markerEl.setAttribute("animation",{
            property: 'position',
            dir: 'normal',
            dur: 1000,
            from: startPosition.x + " " + startPosition.y + " " + startPosition.z,
            to: endPosition.x + " " + endPosition.y+ " " + endPosition.z,
            easing: 'easeInQuad'
        });
        document.getElementById("sceneModel").appendChild(markerEl);
        */
        setTimeout(() => {
            let curStart = end;
            let curEnd;
            //if sequence is null, go with random behaviour, otherwise go by sequence list
            if (sequence == null) {
                curEnd = this.findNextMoleculeRandom(end)
            } else {
                curEnd = this.findNextMolecule(end, sequence);
            }
            if (curEnd != null) {
                this.activateNextAnimation(curStart, curEnd, time, sequence);
            }
            if (edge) {
                edge.components['animation-behavior'].callStopAnimation();
            }

            end.setAttribute("animation__" + this.data.activeSequence + "end", {
                property: 'material.color',
                dur: 1000,
                to: endColor
            })
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
    },

    findNextMoleculeRandom: function (current) {
        console.log('called random');
        return;
    }
});