AFRAME.registerComponent("highlight-behavior", {
    schema: {
        state: { type: 'number', default: 1 },
        elem: { type: 'string', default: 'node' }
    },

    init: function () {
        this.highlightCounter = 0;
        this.states = { DEFAULT: 1, HIGHLIGHTED: 2, OUTLINED: 3, DISABLED: 0 };
        this.num_states = Object.keys(this.states).length;
        this.highlightColor = "red";
        this.defaultColor = "blue";

        this.removeHighlight = this.removeHighlight.bind(this);
        this.highlight = this.highlight.bind(this);
        this.updateState = this.updateState.bind(this);

        this.Outine = this.Outline.bind(this);
        this.RemoveOutline = this.RemoveOutline.bind(this);
        this.Enable = this.Enable.bind(this);
        this.Disable = this.Disable.bind(this);
        this.IncrementHighlightCounter = this.IncrementHighlightCounter.bind(this);
        this.DecrementHighlightCounter = this.DecrementHighlightCounter.bind(this);
        this.outlineElem = this.outlineElem.bind(this);
        this.removeOutlineElem = this.removeOutlineElem.bind(this);
        this.changeMaterialColor = this.changeMaterialColor.bind(this);
    },

    //private
    removeHighlight: function () {
        if (this.data.state === this.states.HIGHLIGHTED) {
            this.updateState(this.states.DEFAULT);
        }
    },

    //private
    highlight: function () {
        if (this.data.state === this.states.DEFAULT) {
            this.updateState(this.states.HIGHLIGHTED);
        }
    },

    //private
    updateState(state) {
        this.el.setAttribute("highlight-behavior", "state: " + state);
    },

    //public
    Outline: function () {
        if (this.data.state === this.states.HIGHLIGHTED) {
            this.outlineElem(this.el);
            this.updateState(this.states.OUTLINED);
        }
    },

    //public
    RemoveOutline: function () {
        if (this.data.state === this.states.OUTLINED) {
            console.log('removing outline');
            this.removeOutlineElem();
            this.updateState(this.states.HIGHLIGHTED);
        }
    },

    //public
    Enable: function () {
        if (this.data.state === this.states.DISABLED) {
            this.updateState(this.states.DEFAULT);
        }
    },

    //public
    Disable: function () {
        this.updateState(this.states.DEFAULT);
    },

    //public
    IncrementHighlightCounter: function () {
        this.highlightCounter++;
        console.log("increment");
        if (this.data.state === this.states.DEFAULT && this.highlightCounter > 0) {
            console.log("highlight");
            this.highlight();
        }
    },

    //public
    DecrementHighlightCounter: function () {
        this.highlightCounter--;
        if (this.data.state === this.states.HIGHLIGHTED && this.highlightCounter <= 0) {
            this.removeHighlight();
            this.highlightCounter = 0;
        }
    },

    update: function () {
        switch (this.data.state) {
            case this.states.DEFAULT:
                console.log("changing to default");
                this.changeMaterialColor(this.defaultColor);
                break;
            case this.states.HIGHLIGHTED:
                console.log("changing material to highlighted");
                this.changeMaterialColor(this.highlightColor);
                break;
            case this.states.DISABLED:
                console.log("change material to disabled");
            //TODO: add helper functions to switch in transparent material
        }
    },

    outlineElem: function (elem) {
        type = this.data.elem;
        const curElement = elem
        if (curElement == null) {
            console.log("called method outlineElem with null param");
        } else {
            const outlineElement = document.createElement('a-entity');
            const { x: posX, y: posY, z: posZ } = curElement.getAttribute('position');
            if (type === 'edge') {
                const height = curElement.getAttribute('geometry')?.height || 0;
                const { x: rotX, y: rotY, z: rotZ } = curElement.getAttribute('rotation');
                outlineElement.setAttribute('geometry', 'height:' + height);
                outlineElement.setAttribute('rotation', rotX + ' ' + rotY + ' ' + rotZ);
            }
            outlineElement.setAttribute('geometry', 'primitive:' + (type == 'edge' ? 'cylinder' : 'sphere'));
            outlineElement.setAttribute('material', 'color', 'orange');
            outlineElement.setAttribute('material', 'side', 'back');
            outlineElement.setAttribute('scale', '0.28 ' + (type === 'edge' ? '1.0' : '0.28') + ' 0.28');
            outlineElement.setAttribute('position', posX + ' ' + posY + ' ' + posZ);
            outlineElement.setAttribute('isoutline', 'true');
            outlineElement.setAttribute("class", this.el.getAttribute("id") + "_outline");
            curElement.parentElement.appendChild(outlineElement);
        }
    },

    removeOutlineElem: function () {
        for (let element of this.el.parentElement.querySelectorAll("[class='" + this.el.getAttribute("id") + "_outline'")) {
            console.log("removing element " + element.getAttribute("id"));
            element.remove();
        }
    },

    changeMaterialColor: function (color) {
        this.el.setAttribute("material", "color: " + color);
    }
})