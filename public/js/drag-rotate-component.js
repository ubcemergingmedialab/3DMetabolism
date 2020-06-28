AFRAME.registerComponent('drag-rotate-component', {
  schema: {
    speed: {
      default: 1.5
    }
  },
  init: function() {
    this.ifMouseDown = false;
    this.x_cord = 0;
    this.y_cord = 0;
    this.OnDocumentMouseDown = this.OnDocumentMouseDown.bind(this);
    this.OnDocumentMouseUp = this.OnDocumentMouseUp.bind(this);
    this.OnDocumentMouseMove = this.OnDocumentMouseMove.bind(this);
    this.OnRemoveMouseDown = this.OnRemoveMouseDown.bind(this);
    this.OnAddMouseDown = this.OnAddMouseDown.bind(this);
    document.addEventListener('mousedown', this.OnDocumentMouseDown);
    document.addEventListener('mouseup', this.OnDocumentMouseUp);
    document.addEventListener('mousemove', this.OnDocumentMouseMove);
  },
  OnDocumentMouseDown: function(event) {
    this.ifMouseDown = true;
    this.x_cord = event.clientX;
    this.y_cord = event.clientY;
  },
  OnDocumentMouseUp: function() {
    this.ifMouseDown = false;
  },
  OnDocumentMouseMove: function(event) {
    if (this.ifMouseDown) {
      var temp_x = event.clientX - this.x_cord;
      var temp_y = event.clientY - this.y_cord;
      if (Math.abs(temp_y) < Math.abs(temp_x)) {
        this.el.object3D.rotateY(temp_x * this.data.speed / 1000);
      } else {
        this.el.object3D.rotateX(temp_y * this.data.speed / 1000);
      }
      this.x_cord = event.clientX;
      this.y_cord = event.clientY;
    }
  },
  GetQuaternion: function() {
    let worldQuaternion = this.el.object3D.getWorldQuaternion(new THREE.Quaternion());

    return this.el.object3D.quaternion;
  },
  GetWorldPos: function() {
    let worldPos = this.el.object3D.getWorldPosition();
    return worldPos;
  },
  OnRemoveMouseDown: function() {
    //document.querySelector('a-camera').setAttribute("look-controls", "enabled: true")
    document.removeEventListener('mousemove', this.OnDocumentMouseMove);
  },
  OnAddMouseDown: function() {
    //document.querySelector('a-camera').setAttribute("look-controls", "enabled: false")
    document.addEventListener('mousemove', this.OnDocumentMouseMove);
  }
    
  //define a function that de-register mousemove
  //define a funciton that re-registers mousemove
});
