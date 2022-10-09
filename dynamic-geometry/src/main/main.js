import * as THREE from "three";
import { FirstPersonControls } from "three/examples/jsm/controls/FirstPersonControls";

let scene, renderer, camera;
let geometryPlane, materialPlane, plane;
let clock = new THREE.Clock()
let controls

initRenderer();
initScene();
initAxesHelper();
initCamera();
initLight();
initMeshes();
initControls();
animate();

window.addEventListener("resize", function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    controls.handleResize()
});

function initRenderer() {
    // antialias是否执行抗锯齿。默认为false.
    renderer = new THREE.WebGLRenderer({ antialias: true });
    // 设置设备像素比。通常用于避免HiDPI设备上绘图模糊
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
}
function initControls() {
    controls = new FirstPersonControls(camera, renderer.domElement);
    controls.movementSpeed = 500
    controls.lookSpeed = 0.05

    // 将其设置为true以启用阻尼（惯性），这将给控制器带来重量感。默认值为false。
    // 请注意，如果该值被启用，你将必须在你的动画循环里调用.update()。
    // controls.enableDamping = true;
    // 设置相机的缩放
    // controls.enableZoom = false;
    // 启用或禁用摄像机平移，默认为true。
    // controls.enablePan = false;
}
function initScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xaaccff)
    scene.fog = new THREE.FogExp2(0xaaccff,0.0007)
}
function initAxesHelper() {
    const axesHelper = new THREE.AxesHelper(100);
    scene.add(axesHelper);
}
function initLight(){
    const hemiLight = new THREE.HemisphereLight(0xffffff,0x444444)
    scene.add(hemiLight)
}
function initMeshes(){
    // geometry
    geometryPlane = new THREE.PlaneGeometry(20000,20000,127,127)
    geometryPlane.rotateX(-Math.PI/2)

    const positions = geometryPlane.attributes.position
    positions.usage = THREE.DynamicDrawUsage   // 动态
    for(let i=0;i<positions.count;i++){
        const y = 35 * Math.sin(i/2)  // 水波正玄波
        positions.setY(i,y) 
    }
    // material
    const texture = new THREE.TextureLoader().load('img/water.jpg')
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping  // 重复
    texture.repeat.set(5,5) // 密度
    materialPlane = new THREE.MeshBasicMaterial({
        color: '#93b7d1',
        map: texture
    })

    // mesh
    plane = new THREE.Mesh(geometryPlane,materialPlane)
    scene.add(plane)
}
function initCamera() {
    camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        1,
        2000
    );
    camera.position.set(0, 100, 300);
    camera.lookAt(0,0,0)
}
function animate(){
    requestAnimationFrame(animate)
    const delta = clock.getDelta()
    const time = clock.getElapsedTime() * 10
    const positions = geometryPlane.attributes.position
    for(let i=0;i<positions.count;i++){
        const y = 35 * Math.sin(i/5 + (time+i) / 7)  // 水波正玄波
        positions.setY(i,y) 
    }
    positions.needsUpdate = true

    controls.update(delta)
    renderer.render(scene,camera)
}