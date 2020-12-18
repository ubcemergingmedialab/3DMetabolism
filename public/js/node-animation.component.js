AFRAME.registerComponent("node-animation", {
  schema: {},

  init: function () {
    this.activeHighlightColor = "#fff"; // white
    this.defaultColor = this.el.components["highlight-behavior"].activeColor;

    this._animateColor = this._animateColor.bind(this);
    this._changeMaterialColor = this._changeMaterialColor.bind(this);
    this.AnimateToDefaultColor = this.AnimateToDefaultColor.bind(this);
    this.AnimateFromDefaultColor = this.AnimateFromDefaultColor.bind(this);
    this.MakeDefaultColor = this.MakeDefaultColor.bind(this);
    this.ResetColor = this.ResetColor.bind(this);
  },

  _animateColor: function(time, color, sequence) {
    this.el.setAttribute('animation', {
      property: 'material.color',
      type: 'color',
      dur: time,
      from: this.el.getAttribute('material').color,
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
