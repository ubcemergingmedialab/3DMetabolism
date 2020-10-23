AFRAME.registerComponent('toggledropdown', {
    schema: {
        target: { type: 'selector', default: '' }
    },

    init: function () {
        var target = this.data.target;
        if(target) {
          this.el.addEventListener('click', () => {
              if (!this.el.getAttribute('gui-icon-button').toggle) {
                  target.dispatchEvent(new Event('closedropdown', {'bubbles': true}));
                  this.el.getAttribute('gui-icon-button').toggle = true;
              }
              else {
                target.dispatchEvent(new Event('opendropdown', {'bubbles': true}));
                this.el.getAttribute('gui-icon-button').toggle = false;
              }
          });
        } 
    }
});
