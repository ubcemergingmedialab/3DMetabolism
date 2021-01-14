function testZoom() {
    try {
        const scene = document.querySelector('a-scene');
        const button = document.getElementById("TEST");
        button.addEventListener("click", scene.components["pathway-focus"].ZoomIn(new THREE.Vector3(0,-3.5,7)))
    } catch (error) {
        console.log("failed")
        console.log(error)
    }
}
function testZoomOut() {
    try {
        const scene = document.querySelector('a-scene');
        const button = document.getElementById("TEST");
        button.addEventListener("click", scene.components["pathway-focus"].ZoomOut())
    } catch (error) {
        console.log("failed")
        console.log(error)
    }
}