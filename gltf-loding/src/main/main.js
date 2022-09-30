import * as THREE from "three";
import { Color } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'

let scene, renderer, camera;
let mixer;
let dirLight;
let plane , model;

let clock = new THREE.Clock()

initRenderer();
initScene();
initAxesHelper();
initCamera();
initLight();
initMeshes();
initControls();
enableShadow();
// loader异步调用，需要时间，在一段时间内，mixer是空的。1. 判断mixer不为空就运行 2. 在加载后再运行
// animate();  

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
    renderer.outputEncoding = THREE.sRGBEncoding;
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
    controls.target.set(0,1,0)
    controls.update()
}
function initScene() {
    scene = new THREE.Scene();
    scene.background = new Color(0xa0a0a0);
    scene.fog = new THREE.Fog(0xa0a0a0,3,10)
}
function initAxesHelper() {
    const axesHelper = new THREE.AxesHelper(1);
    scene.add(axesHelper);
}
function initLight(){
    const hemiLight = new THREE.HemisphereLight(0xffffff,0x444444)
    scene.add(hemiLight)
    dirLight = new THREE.DirectionalLight(0xffffff)
    dirLight.position.set(-3,0,-10)
    scene.add(dirLight)
}
function initMeshes(){
    // plane
    plane = new THREE.Mesh(
        new THREE.PlaneGeometry(20,20),
        new THREE.MeshPhongMaterial({
            color:0xffffff
        })
    )
    plane.rotation.x = -Math.PI / 2
    scene.add(plane)

    // model
    const loader = new GLTFLoader()
    loader.load('models/gltf/Soldier.glb',function(gltf){
        // console.log(gltf);
        const model = gltf.scene
        scene.add(model)

        gltf.scene.traverse(function(object){
            // console.log(object.type);
            if(object.isMesh){
                console.log(object.name);
                object.castShadow = true
            }
        })

        // 多个动作 0摊手 1跑 2pose 3走路
        const clip = gltf.animations[0]
        mixer = new THREE.AnimationMixer(gltf.scene)
        const action = mixer.clipAction(clip)
        action.play()

        animate();
    })
}
function initCamera() {
    camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        100
    );
    camera.position.set(1, 2, -3);
    camera.lookAt(0,1,0)
}
function enableShadow(){
    renderer.shadowMap.enabled = true;
    dirLight.castShadow = true
    plane.receiveShadow = true
}
function animate(){
    let delta = clock.getDelta()
    requestAnimationFrame(animate)
    renderer.render(scene,camera)

    mixer.update(delta) 
}