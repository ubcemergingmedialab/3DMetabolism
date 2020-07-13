AFRAME.registerComponent("pathway_zoom", {
    schema: {
        zoomPosition: {type: 'vec3'},
        cameraPos: {type: 'vec3'},
        edgeName: {type: 'string'}
    },
    init: function() {
        var el = this.el;
        this.ActivateZoomIn = this.ActivateZoomIn.bind(this);
        this.ActivateZoomOut = this.ActivateZoomOut.bind(this);
        this.MoveCameraRig = this.MoveCameraRig.bind(this);
        this.CreateEventPlane = this.CreateEventPlane.bind(this);
        el.addEventListener('click', this.ActivateZoomIn);
    },

    ActivateZoomIn: function(event) {
        console.log('zooming in');
        this.el.setAttribute('material', 'color', 'yellow'); 

        let edge = View.edges[this.data.edgeName];
        let cameraGyro = document.getElementById("gyro");
        cameraRig = document.getElementById('camera-rig');

        let localEdgePosition = new THREE.Vector3();
        this.el.object3D.getWorldPosition(localEdgePosition);
        cameraGyro.object3D.worldToLocal(localEdgePosition);

        cameraPos = new THREE.Vector3()//localEdgePosition.x + this.data., this.data.cameraPos- localEdgePosition.)
        let edgeRotation = new THREE.Matrix4()
        edgeRotation.extractRotation(this.el.object3D.matrix);
        let targetForward = new THREE.Vector3(0, 0, -1);
        targetForward.applyMatrix4(edgeRotation).normalize();
        let targetUp = new THREE.Vector3(1, 0, 0);
        targetUp.applyMatrix4(edgeRotation).normalize();

        cameraGyro.object3D.worldToLocal(targetUp);
        cameraGyro.object3D.worldToLocal(targetForward);

        targetCross = new THREE.Vector3().copy(targetUp);
        targetCross.cross(targetForward);

        let inputPosition = (new THREE.Vector3()).copy(View.nodes[edge.input].position);
        let outputPosition = (new THREE.Vector3()).copy(View.nodes[edge.output].position);
        let negInputPosition = (new THREE.Vector3()).copy(inputPosition).negate();
        let edgeVector = (new THREE.Vector3()).add(outputPosition).add(negInputPosition);

        let cameraRotation = new THREE.Quaternion();
        cameraRig.object3D.getWorldQuaternion(cameraRotation);
        let edgeQuaternion = new THREE.Quaternion();
        this.el.object3D.getWorldQuaternion(edgeQuaternion);

        let edgeVecNorm = ((new THREE.Vector3()).copy(edgeVector)).normalize()
        console.log(edgeVecNorm)
        let edgeVecUp = (edgeVecNorm.cross(document.getElementById(this.data.edgeName).object3D.up)).cross(edgeVecNorm)
        let edgeVecCross = edgeVecNorm.cross(edgeVecUp)

        // cameraGyro.object3D.lookAt(gyroDragRotate.GetPosition(), edge.GetPosition(), perpendicular)
        // cameraRig.object3D.lookAt(cameraRig.object3D.position, edge.GetPosition, perpendicular)



        edgeMatrix = (new THREE.Matrix4()).set(edgeVecCross.x,edgeVecUp.x,edgeVecNorm.x,0,
                                               edgeVecCross.y,edgeVecUp.y,edgeVecNorm.y,0,
                                               edgeVecCross.z,edgeVecUp.z,edgeVecNorm.z,0,
                                               0,0,0,0);

        
        let camRotation = new THREE.Matrix4();
        camRotation.extractRotation(cameraRig.object3D.matrix);

        let cameraUp = new THREE.Vector3(0, 1, 0);
        cameraUp.applyMatrix4(camRotation).normalize();
        let cameraForward = new THREE.Vector3(0, 0, -1);
        cameraForward.applyMatrix4(camRotation).normalize();
        let camCross = (new THREE.Vector3()).copy(cameraForward);
        camCross.cross(cameraUp).normalize();

        

        //let camRigOrt = camRigVec.normalize()
        //let camRigVecUp = (camRigVecNorm.cross(cameraRig.object3D.up)).cross(camRigVecNorm);
        //let camRigVecCross = camRigVecNorm.cross(camRigVecUp)

        camRigMatrix = (new THREE.Matrix4()).set(cameraUp.x, cameraForward.x,camCross.x, 0,
                                                 cameraUp.y,cameraForward.y,camCross.y, 0,
                                                 cameraUp.z,cameraForward.z,camCross.z, 0,
                                                 0, 0, 0, 1);

        targetMatrix = (new THREE.Matrix4()).set(targetUp.x, targetForward.x, targetCross.x, 0,
                                                targetUp.y, targetForward.y, targetCross.y, 0,
                                                targetUp.z, targetForward.z, targetCross.z, 0,
                                                0, 0, 0, 1);

        console.log(JSON.stringify(camRigMatrix));
        console.log(JSON.stringify(targetMatrix));

        rotationMatrix = (new THREE.Matrix4());
        inverseCamRig = new THREE.Matrix4().getInverse(camRigMatrix);
        rotationMatrix.multiply(targetMatrix * inverseCamRig);

        cameraRig.object3D.setRotationFromMatrix(rotationMatrix);

        let  camGyroVec = (new THREE.Vector3())
        cameraGyro.object3D.getWorldPosition(camGyroVec)
        console.log('break')
        console.log(camGyroVec)
        let camGyroVecNorm = camGyroVec.normalize()
        let camGyroVecUp = (camGyroVecNorm.cross(cameraGyro.object3D.up)).cross(camGyroVecNorm);
        let camGyroVecCross = camGyroVecNorm.cross(camGyroVecUp)
                                                
        camGyroMatrix = (new THREE.Matrix4()).set(camGyroVecCross.x, camGyroVecUp.x, camGyroVecNorm.x,0,
                                                  camGyroVecCross.y, camGyroVecUp.y, camGyroVecNorm.y,0,
                                                  camGyroVecCross.z, camGyroVecUp.z, camGyroVecNorm.z,0,
                                                  0,0,0,0);  

        let camRigMatrixInv = (new THREE.Matrix4()).getInverse(camRigMatrix)
        let camGyroMatrixInv = (new THREE.Matrix4()).getInverse(camGyroMatrix)
                            

        let vec2 = (new THREE.Vector3())
        cameraRig.object3D.getWorldPosition(vec2)
        cameraPos = (new THREE.Vector3()).copy(vec2)

       // cameraRig.object3D.setRotationFromMatrix(edgeMatrix.multiply(camRigMatrixInv))
       // cameraGyro.object3D.setRotationFromMatrix(edgeMatrix.multiply(camGyroMatrixInv))

        //cameraRig.object3D.translateOnAxis(vec,vec.distanceTo(vec2))


        let zoomIn = new THREE.Vector3()
        this.el.object3D.getWorldPosition(zoomIn);

      //  document.getElementById('gyro').components['drag-rotate-component'].OnRemoveMouseDown(); 
       // this.MoveCameraRig(new THREE.Vector3(zoomIn.x, zoomIn.y, zoomIn.z), edge.GetRotation(), new THREE.Vector3(0, 0, 90));

        let eventPlane = this.CreateEventPlane(edge);

        this.el.removeEventListener('click', this.ActivateZoomIn);
        eventPlane.addEventListener('click', this.ActivateZoomOut);
    },

    ActivateZoomOut: function(event) {
        let GyroDragComp = document.getElementById('gyro').components['drag-rotate-component'];  
        let cameraGyro = document.getElementById("gyro");  


        let vec = (new THREE.Vector3())
        this.el.object3D.getWorldPosition(vec)

        let vec2 = (new THREE.Vector3())
        cameraRig.object3D.getWorldPosition(vec2)

        cameraRig.object3D.translateOnAxis(cameraPos,-cameraPos.distanceTo(vec2))
        //cameraGyro.object3D.translateOnAxis(cameraPos,-cameraPos.distanceTo(vec2))

        let camRigMatrixInv = (new THREE.Matrix4()).getInverse(camRigMatrix)
        let camGyroMatrixInv = (new THREE.Matrix4()).getInverse(camGyroMatrix)

        //cameraRig.object3D.setRotationFromMatrix(edgeMatrix.transpose())
        //cameraGyro.object3D.setRotationFromMatrix(edgeMatrix.transpose())
        cameraRig.object3D.setRotationFromMatrix(camRigMatrixInv)
        cameraGyro.object3D.setRotationFromMatrix(camGyroMatrixInv)


        console.log('zooming out');
        this.el.setAttribute('material', 'color', 'green');

        document.getElementById('gyro').components['drag-rotate-component'].OnAddMouseDown(); 
        //this.MoveCameraRig(new THREE.Vector3(1, -1.2, 5), cameraGyro.GetRotation(), new THREE.Vector3(0, 0, 0));
        this.MoveCameraRig(cameraPos, GyroDragComp.GetRotation(), new THREE.Vector3(0, 0, 0));

        eventPlane.removeEventListener('click', this.ActivateZoomOut);
        this.el.addEventListener('click', this.ActivateZoomIn);
        eventPlane.remove();
    },

    CreateEventPlane: function(edge) {
        let sceneModel = document.getElementById('sceneModel');
        let entityEl = document.createElement('a-entity');

        entityEl.setAttribute('geometry', {
            primitive: 'box',
            width: .5,
            height: 1,
            depth: .05
          });

        entityEl.object3D.position.copy(edge.GetPosition());
        entityEl.object3D.rotation.copy(edge.GetRotation());
        entityEl.setAttribute('material', 'opacity', '0.5');
        entityEl.setAttribute('material','color','red');
        entityEl.setAttribute('id','eventPlane');

        sceneModel.appendChild(entityEl);
        return entityEl;
    },

    MoveCameraRig: function(position, initRotation, finalRotation) {
        var rotationOffset;
        let cameraOffset = new THREE.Vector3(0, 0, 0.10);
        let radToDeg = 180 / Math.PI;

        position.add(cameraOffset);
        try {
            rotationOffset = initRotation.toVector3();
        } catch(e) {
            console.log("Error: can not convert given edge to THREE.Vector3()");
        }

        rotationOffset.multiplyScalar(radToDeg);
        finalRotation.add(rotationOffset.negate());
        // rotationOffset.negate().add(finalRotation);
    
        document.getElementById('camera-rig').setAttribute('animation',{
            property: 'position',
            to: position.x + " " + position.y + " " + position.z,
            easing: 'linear',
            loop: false
        });
        
        document.getElementById('camera-rig').setAttribute('animation__2', {
            property: 'rotation',
            to: finalRotation.x + " " + finalRotation.y + " " + finalRotation.z,
            easing: 'linear',
            loop: false

        }); 
    }
});