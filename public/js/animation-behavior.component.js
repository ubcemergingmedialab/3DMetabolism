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
        console.log("calling animate")
        //here is where we change the animation material's shader parameter
    },

    stopAnimation: function () {
        console.log("calling stopAnimation");
        //here is where we change the animation material's shader parameter
    }
})