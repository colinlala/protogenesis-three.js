import * as THREE from "three";
import { Color, Mesh } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

let scene, renderer, camera;
let controls;


initRenderer();
initScene();
initAxesHelper();
initCamera();
initLight();
init()
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
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false  // 让鼠标滚轮不出盒子，滚轮失效
    controls.enablePan = false   // 让鼠标右键不出盒子，右键失效
    controls.enableDamping = true  // 有惯性，且需要update
    controls.rotateSpeed = - 0.5
}
function initScene() {
    scene = new THREE.Scene()
}
function initAxesHelper() {
    scene.add(new THREE.AxesHelper(1));
}
function initLight(){
    const hemiLight = new THREE.HemisphereLight(0xffffff,0x444444)
    scene.add(hemiLight)
}
function init(){
    const textures = getTexturesFromAtlasFile('textures/sun_temple_stripe.jpg',6)
    const materials = []
    for(let i=0;i<textures.length;i++){
        materials.push(
            new THREE.MeshBasicMaterial({
                map: textures[i]
            })
        )
    } 
    const skyBox = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        materials
    )
    skyBox.geometry.scale(1,1,-1)
    scene.add(skyBox)
}
function getTexturesFromAtlasFile(file,tilesNum){
    const textures = []
    for(let i=0;i<tilesNum;i++){
        textures[i] = new THREE.Texture()
    }
    new THREE.ImageLoader().load(
        file,
        function(image){
            // console.log(image);
            const width = image.height
            let canvas,context;
            for(let i=0;i<tilesNum;i++){
                canvas = document.createElement('canvas')
                context = canvas.getContext('2d')
                canvas.height = width
                canvas.width = width
                context.drawImage(image, width*i, 0, width,width,0,0,width,width)
                textures[i].image = canvas
                textures[i].needsUpdate = true
            }
        }
    )
    return textures
}
function initCamera() {
    camera = new THREE.PerspectiveCamera(
        90,
        window.innerWidth / window.innerHeight,
        0.1,
        100
    );
    camera.position.set(0.2, 0, 0.2);
}
function animate(){
    requestAnimationFrame(animate)
    controls.update(); 
    renderer.render(scene,camera)
}