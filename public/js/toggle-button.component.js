AFRAME.registerComponent('toggledropdown', {
    schema: {
        target: { type: 'selector', default: '' }
    },

    init: function () {
        var target = this.data.target;
        if (target) {
            this.el.addEventListener('click', () => {
                if (!this.el.getAttribute('gui-icon-label-button').toggle) {
                    target.dispatchEvent(new Event('closedropdown', { 'bubbles': true }));
                    this.el.setAttribute('toggle', 'true');
                    this.el.setAttribute('icon', 'chevron-right');
                }
                else {
                    target.dispatchEvent(new Event('opendropdown', { 'bubbles': true }));
                    this.el.setAttribute('toggle', 'false');
                    this.el.setAttribute('icon', 'chevron-left');
                }
            });
        }
    }
});
