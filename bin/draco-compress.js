const gltfPipeline = require('gltf-pipeline');
const fsExtra = require('fs-extra');
const path = require('path');
const glbToGltf = gltfPipeline.glbToGltf;
const processGltf = gltfPipeline.processGltf;

const glb = fsExtra.readFileSync(path.resolve(__dirname+'/LipidBilayerv001.glb'));
const options = {
  dracoOptions: {
    compressionLevel: 10
  }
};
glbToGltf(glb)
  .then(gltf => {
    processGltf(gltf.gltf, options)
        .then(results => {
          fsExtra.writeJsonSync(path.resolve(__dirname + '/compressionFiles/LipidBilayerv001.gltf'), results.gltf);
        });
  });