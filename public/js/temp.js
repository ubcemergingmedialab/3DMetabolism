//Used for testing arrow-head.component. Delete before PR
// TODO DELETE
AFRAME.registerComponent('increment1', {
    schema: {
        target: { type: 'selector', default: '' }
    },

    init: function () {
        this.el.addEventListener('click', () => {
            const temp = document.getElementById('_1_3_bisphosphoglycerate/_3_phosphoglycerate').components["arrow-head"]
            temp.SetDirection("_1_3_bisphosphoglycerate","_3_phosphoglycerate",true)
        });

    }
});


AFRAME.registerComponent('decrement1', {
    schema: {
        target: { type: 'selector', default: '' }
    },

    init: function () {
        this.el.addEventListener('click', () => {
            const temp = document.getElementById('_1_3_bisphosphoglycerate/_3_phosphoglycerate').components["arrow-head"]
            temp.SetDirection("_1_3_bisphosphoglycerate","_3_phosphoglycerate",false)        });

    }
});