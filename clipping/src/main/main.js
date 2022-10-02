import * as THREE from "three";
import { Color } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'

let scene, renderer, camera;
let ground, object;
let spotLight, dirLight;
let material;

initRenderer();
initScene();
initAxesHelper();
initCamera();
initLight();
initMeshes();
initControls();
enableShadow();
enableClipping()
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
    scene.background = new Color(0x999999);
}
function initAxesHelper() {
    const axesHelper = new THREE.AxesHelper(1);
    scene.add(axesHelper);
}
function initLight(){
    scene.add(new THREE.AmbientLight(0x505050))
    spotLight = new THREE.SpotLight(0xffffffff)
    spotLight.angle = Math.PI / 5
    spotLight.penumbra = 0.3
    spotLight.position.set(2,3,3)
    scene.add(spotLight)

    dirLight = new THREE.DirectionalLight(0x55505a,1)
    dirLight.position.set(0,3,0)
    scene.add(dirLight)
}
function initMeshes(){
    // ground
    ground = new THREE.Mesh(
        new THREE.PlaneGeometry(9,9,1,1),
        new THREE.MeshPhongMaterial({color:0xa0adaf,shininess:150})
    );
    ground.rotation.x = - Math.PI / 2;
    ground.position.y = -1;
    scene.add(ground);
    // object
    material = THREE.MeshPhongMaterial({
        color: 0x80ee10,
        shininess:100,
    })
    const geometry = new THREE.TorusKnotGeometry(0.4,0.08,95,20);
    object = new THREE.Mesh(geometry,material);
    scene.add(object);
}
function enableShadow(){
    renderer.shadowMap.enabled = true;

    spotLight.castShadow = true
    spotLight.shadow.camera.near = 3
    spotLight.shadow.camera.far = 10
    spotLight.shadow.mapSize.width = 1024
    spotLight.shadow.mapSize.height = 1024

    dirLight.castShadow = true
    dirLight.shadow.camera.near = 1
    dirLight.shadow.camera.far = 10
    dirLight.shadow.camera.right = 1
    dirLight.shadow.camera.left = -1
    dirLight.shadow.camera.top = 1
    dirLight.shadow.camera.bottom = -1
    dirLight.shadow.mapSize.width = 1024
    dirLight.shadow.mapSize.height = 1024


    object.castShadow = true
    ground.receiveShadow = true
}
function initCamera() {
    camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(0,0,4);
}
function enableClipping(){
    const plane = new THREE.Plane(
        new THREE.Vector3(1,0,0),  // 保留了右边，(-1,0,0)保留左边
        0  // plane to origin  正数左移
    )

    const plane1 = new THREE.Plane(
        new THREE.Vector3(-1,0,0),  // 保留了右边，(-1,0,0)保留左边
        0  // plane to origin  
    )

    // localclipping  只作用某个物体
    material.clippingPlanes = [plane, plane1]
    material.side = THREE.DoubleSide
    material.clipShadows = true    // 让影子也切掉
    renderer.localClippingEnabled = true
    
    //  globalClipping 全切
    // renderer.clippingPlanes = [plane]
}
function animate(){
    requestAnimationFrame(animate)
    renderer.render(scene,camera)
}