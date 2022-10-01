import * as THREE from "three";
import { Color } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'

let scene, renderer, camera;
let mesh;
let clip, mixer;
let clock = new THREE.Clock()


initRenderer();
initScene();
initAxesHelper();
initCamera();
initLight();
initMeshes();
initControls();

makeClip();
enableAnimation();

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
    scene.background = new Color(0xa0a0a0);
}
function initAxesHelper() {
    const axesHelper = new THREE.AxesHelper(10);
    scene.add(axesHelper);
}
function initLight(){
    const hemiLight = new THREE.HemisphereLight(0xffffff,0x444444)
    scene.add(hemiLight)
}
function initMeshes(){
    const geometry = new THREE.BoxGeometry(2,2,2)
    const material = new THREE.MeshPhongMaterial({color:0xff0000})
    mesh = new THREE.Mesh(geometry,material)
    scene.add(mesh)
}
function makeClip(){
    // 位置
    const positionKF = new THREE.VectorKeyframeTrack(
        '.position',   // 位置变化
        [0,1,2,3],   // 0,1,2,3帧
        [
            0,0,0,
            10,10,0,
            10,0,0,
            0,0,0
        ]
    );
    // 缩放
    const scaleKF = new THREE.VectorKeyframeTrack(
        '.scale',
        [0,1,2,3],
        [
            1,1,1,
            2,2,2,
            0.5,0.5,2,
            1,1,1
        ]
    )
    // 旋转
    const xAxis = new THREE.Vector3(1,0,0)
    const qInitial = new THREE.Quaternion().setFromAxisAngle(xAxis,0)   // 设置初始角度
    const qFinal = new THREE.Quaternion().setFromAxisAngle(xAxis, Math.PI)  // 设置终止角度
    const quaternionKF = new THREE.VectorKeyframeTrack(
        '.quaternion',
        [0,1,2,3],
        [
            qInitial.x,qInitial.y,qInitial.z,qInitial.w,
            qFinal.x,qFinal.y,qFinal.z,qFinal.w,
            qInitial.x,qInitial.y,qInitial.z,qInitial.w,
            qFinal.x,qFinal.y,qFinal.z,qFinal.w,
        ]
    )
    // 颜色
    const colorKF = new THREE.ColorKeyframeTrack(
        '.material.color',
        [0,1,2,3],
        [
            1,0,0,
            0,1,0,
            0,0,1,
            0,0,0
        ]
    )
    // 透明度
    const opacityKF = new THREE.NumberKeyframeTrack(
        '.material.opacity',
        [0,1,2,3],
        [
            1,
            0.6,
            0.4,
            0.01
        ]
    )

    clip = new THREE.AnimationClip(
        'Action',
        4,   // 持续时间
        [positionKF, scaleKF, quaternionKF, colorKF, opacityKF]
    );
}
function enableAnimation(){
    mixer = new THREE.AnimationMixer(mesh);  // 使用哪个物体进行动画
    const clipAction =  mixer.clipAction(clip);  // 让mesh和clip结合起来
    clipAction.play();
}
function initCamera() {
    camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        100
    );
    camera.position.set(10,30,50);
}
function animate(){
    let delta = clock.getDelta()
    requestAnimationFrame(animate)
    renderer.render(scene,camera)
    mixer.update(delta)
}