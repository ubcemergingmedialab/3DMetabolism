AFRAME.registerComponent("animation-behavior", {
    init: function () {
        this.states = { ANIMATING: 1, DEFAULT: 0 }
        this.animationCounter = 0;
        this.animate = this.animate.bind(this);
        this.callAnimate = this.callAnimate.bind(this);
        this.callStopAnimation = this.callStopAnimation.bind(this);
        this.stopAnimation = this.stopAnimation.bind(this);
        this.update = this.update.bind(this);
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
            this.stopAnimation();
            this.animationCounter = 0;
        } else if (this.animationCounter > 0) {
            this.animate();
        }
    },

    animate: function () {
        //here is where we change the animation material's shader parameter
        try {
            console.log("calling animate");
            this.el.setAttribute('material', 'active', this.states["ANIMATING"]);
        } catch (error) {
            console.log('could not start animation of edge:' + this.el.getAttribute('id'));
            console.log(error.message);
        }
    },

    stopAnimation: function () {
        //here is where we change the animation material's shader parameter
        try {
            console.log("calling stopAnimation");
            this.el.setAttribute('material', 'active', this.states["DEFAULT"]);
        } catch (error) {
            console.log('could not stop animation of edge:' + this.el.getAttribute('id'));
            console.log(error.message);
        }
    }
})