import * as THREE from "three";
import { Color } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";


let scene, renderer, camera;
let material;
let mouseX = 0, mouseY = 0;

initRenderer();
initScene();
// initAxesHelper();
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

document.body.addEventListener('pointermove', function(event){
    mouseX = event.clientX - window.innerWidth / 2  // - width/2 ~ width/2
    mouseY = event.clientY - window.innerHeight / 2
})

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
    const geometry = new THREE.BufferGeometry()
    const vertices = []
    for(let i=0;i<10000;i++){
        const x = 2000 * Math.random() - 1000;
        const y = 2000 * Math.random() - 1000;
        const z = 2000 * Math.random() - 1000;
        vertices.push(x,y,z)
    }
    geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(vertices,3)
    )
    // console.log(geometry);

    // material
    const textures = new THREE.TextureLoader().load('models/sprites/ball.png')
    material = new THREE.PointsMaterial({
        size: 50,
        map: textures,
        transparent: true,
        alphaTest: 0.5,
        sizeAttenuation: true,  // 变稀薄
    })

    // point
    const particies = new THREE.Points(geometry,material)
    scene.add(particies)
}
function initCamera() {
    camera = new THREE.PerspectiveCamera(
        55,
        window.innerWidth / window.innerHeight,
        2,
        2000
    );
    camera.position.z = 1000
}
function animate(){
    requestAnimationFrame(animate)
    const time = Date.now() * 0.00005
    camera.position.x += mouseX * 0.05
    camera.position.y += mouseY * 0.05
    camera.lootAt(scene.position)
    const h = (360*(1.0+time)%360)/260
    material.color.setHSL(h,0.5,0.5)
    renderer.render(scene,camera)
}