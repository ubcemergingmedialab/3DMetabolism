AFRAME.registerComponent("label-behavior", {
    schema: {
        state: { type: 'number', default: 1 },
        text: { type: 'string', default: '' },
        alignment: { type: 'string', default: 'right' }
    },

    init: function () {
        this.states = { VISIBLE: 1, HIDDEN: 0 }

        this.Enable = this.Enable.bind(this);
        this.Disable = this.Disable.bind(this);

        this.updateState = this.updateState.bind(this);
        this.update = this.update.bind(this);
        this.appendLabel = this.appendLabel.bind(this);
        this.changeOpacity = this.changeOpacity.bind(this);

        this.appendLabel();
    },

    //public
    Enable: function () {
        this.updateState(this.states.VISIBLE);
    },
    //public
    Disable: function () {
        this.updateState(this.states.HIDDEN);
    },

    //private
    updateState(state) {
        this.el.setAttribute("label-behavior", "state: " + state);
    },

    //private
    update: function () {
        switch (this.data.state) {
            case this.states.VISIBLE:
                console.log("Changing visibility of label to VISIBLE");
                this.changeOpacity(this.states.VISIBLE);
                break;
            case this.states.HIDDEN:
                console.log("Changing visibility of label to HIDDEN");
                this.changeOpacity(this.states.HIDDEN);
                break;
        }
    },

    //private
    appendLabel: function () {
        const textEl = document.createElement('a-entity');
        let xOffset = (this.data.alignment === 'right' ? -0.3 : 0.3);
        textEl.setAttribute('id', 'label')
        textEl.setAttribute('look-at', 'a-camera');
        textEl.setAttribute('text', {
            value: this.data.text,
            color: 'white',
            width: 4,
            anchor: 'align',
            xOffset: xOffset,
            zOffset: 1,
            align: this.data.alignment
        });
        textEl.setAttribute('scale', '1.5 1.5 1.5');
        this.el.appendChild(textEl)
    },

    //private
    changeOpacity: function (visibility) {
        textEl = this.el.querySelector('#label');
        textEl.setAttribute("text", "opacity: " + visibility)
    },
})