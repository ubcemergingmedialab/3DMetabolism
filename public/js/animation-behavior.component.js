AFRAME.registerComponent("animation-behavior", {
    init: function () {
        this.states = { ANIMATING: 1, DEFAULT: 0 }
        this.state = 1;
        this.animationCounter;
    },

    callAnimate: function () {
        this.animationCounter++;
        this.update();
    },

    callStopAnimation: function () {
        this.animationCounter--;
        this.update();
    },

    update: function () {
        if (this.animationCounter <= 0) {
            stopAnimation();
            this.animationCounter = 0;
        } else if (this.animationCounter > 0) {
            animate();
        }
    },

    animate: function () {
        //here is where we change the animation material's shader parameter
        try {
            console.log("calling animate");
            this.el.setAttribute('material','active',ANIMATING);
        } catch (error) {
            console.log('could not start animation of edge:' + this.el.getAttribute('id'));
        }
    },

    stopAnimation: function () {
        //here is where we change the animation material's shader parameter
        try {
            console.log("calling stopAnimation");
            this.el.setAttribute('material','active',DEFAULT);
        } catch (error) {
            console.log('could not stop animation of edge:' + this.el.getAttribute('id'));
        }
    }
})