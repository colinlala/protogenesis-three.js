import * as THREE from "three";
import { Color, Mesh } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'

let scene, renderer, camera;
let textureCube;
let count = 500;
let spheres = []

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
    const controls = new OrbitControls(camera, renderer.domElement);
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
    // scene.background = new Color(0xa0a0a0);
    // 天空盒子作用scene  p正方向，n反方向
    const urls = [
        'textures/px.png',
        'textures/nx.png',
        'textures/py.png',
        'textures/ny.png',
        'textures/pz.png',
        'textures/nz.png',
    ]
    textureCube = new THREE.CubeTextureLoader().load(urls);
    scene.background = textureCube;

}
function initAxesHelper() {
    const axesHelper = new THREE.AxesHelper(1);
    scene.add(axesHelper);
}
function initLight(){
    const hemiLight = new THREE.HemisphereLight(0xffffff,0x444444)
    scene.add(hemiLight)
}
function initMeshes(){
    const geometry = new THREE.SphereGeometry(0.1,64,64);
    const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        envMap: textureCube     // 小球反光
    })
    for(let i=0;i<count;i++){
        const mesh = new Mesh(geometry,material);
        mesh.position.x = Math.random() * 10 - 5;    // -5 ~ 5
        mesh.position.y = Math.random() * 10 - 5;
        mesh.position.z = Math.random() * 10 - 5;
        mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 3 + 1;
        scene.add(mesh)
        spheres.push(mesh)
    }
}
function initCamera() {
    camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        100
    );
    camera.position.set(1, 2, -3);
}
function animate(){
    requestAnimationFrame(animate)
    const timer = 0.0001 * Date.now()
    renderer.render(scene,camera)
    for(let i=0;i<count;i++){
        const s = spheres[i];
        s.position.x = 5 * Math.cos(timer + i)
        s.position.y = 5 * Math.cos(timer + i * 1.1)
    }

}