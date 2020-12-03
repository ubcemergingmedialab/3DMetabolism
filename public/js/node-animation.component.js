AFRAME.registerComponent("node-animation", {
  schema: {},

  init: function () {
    this.defaultColor = "#fff"; // white
    this.activeHighlightColor = this.el.components["highlight-behavior"].activeColor;

    this._animateColor = this._animateColor.bind(this);
    this._changeMaterialColor = this._changeMaterialColor.bind(this);
    this.AnimateToDefaultColor = this.AnimateToDefaultColor.bind(this);
    this.AnimateFromDefaultColor = this.AnimateFromDefaultColor.bind(this);
    this.MakeDefaultColor = this.MakeDefaultColor.bind(this);
    this.ResetColor = this.ResetColor.bind(this);

    this.AnimateFromDefaultColor(1000);
  },

  _animateColor: function(time, color, sequence) {
    const startAnimationName = "animation__" + sequence;
    this.el.setAttribute(startAnimationName, {
      property: 'material.color',
      dur: time,
      to: color,
    });
  },

  _changeMaterialColor: function (color) {
    this.el.setAttribute("material", "color: " + color);
  },

  /**
   * Animates the node's material to the default color
   * @param time the animation duration
   * @param sequence the sequence this node is part of, if null decide randomly
   */
  AnimateToDefaultColor: function (time, sequence) {
    this._animateColor(time, this.defaultColor, sequence);
  },

  /**
   * First changes the node's material to the default color, then animates to the currently highlighted color
   * @param time the animation duration
   * @param sequence the sequence this node is part of, if null decide randomly
   */
  AnimateFromDefaultColor: function (time, sequence) {
    this.MakeDefaultColor();
    this._animateColor(time, this.activeHighlightColor, sequence);
  },

  /** Changes the node's material to the default color without animation */
  MakeDefaultColor: function () {
    this._changeMaterialColor(this.defaultColor);
  },

  /** Resets the node's material to the currently highlighted color without animation */
  ResetColor: function () {
    this._changeMaterialColor(this.activeHighlightColor);
  },
});
