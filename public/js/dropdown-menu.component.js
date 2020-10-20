AFRAME.registerComponent('opendropdown', {
    schema: {
        target: { type: 'selector', default: '' }
    },

    init: function () {
        var target = this.data.target;
        if (target) {
            this.el.addEventListener('click', () => {
                target.dispatchEvent(new Event('opendropdown', {'bubbles': true}));
            });
        }
    }
});

AFRAME.registerComponent('closedropdown', {
    schema: {
        target: { type: 'selector', default: '' }
    },

    init: function () {
        var target = this.data.target;
        if(target) {
          this.el.addEventListener('click', () => {
              target.dispatchEvent(new Event('closedropdown', {'bubbles': true}));
          });
        }
    }
});
