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
                  try {
                    let testEdge = document.getElementById('glucose_6_phosphate/glucose_1_phosphate')
                    console.log("calling animate");
                    testEdge.setAttribute('material','active',1.0);
                } catch (error) {
                    console.log('could not start animation of edge:' + this.el.id);
                }
            
              }
              else {
                target.dispatchEvent(new Event('opendropdown', {'bubbles': true}));
                this.el.getAttribute('gui-icon-button').toggle = false;
              }
          });
        } 
    }
});
