import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
let scene, renderer, camera;

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
    scene.fog = new THREE.Fog(0,250,1400)
}
function initAxesHelper() {
    const axesHelper = new THREE.AxesHelper(100);
    scene.add(axesHelper);
}
function initLight(){
    const dirLight = new THREE.DirectionalLight(0xffffff,0.125)
    dirLight.position.set(0,0,1).normalize()
    scene.add(dirLight)

    const pointLight = new THREE.PointLight(0xffffff,1.5)
    pointLight.position.set(0,100,90)
    pointLight.color.setHSL(Math.random(),1,0.5)
    scene.add(pointLight)
    
}
function initMeshes(){
    // plane
    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(1000,1000),
        new THREE.MeshBasicMaterial({
            color: 0xffffff,
            opacity: 0.5,
            transparent: true
        })
    )
    plane.position.y = -10
    plane.position.x = - Math.PI/2
    scene.add(plane)

    // text
    const materials = [
        new THREE.MeshPhongMaterial( {
            color: 0xffffff, flatShading: true
        } ), // font
        new THREE.MeshPhongMaterial( { color: 0xffffff } )  // side
    ] 

    const loader = new FontLoader()
    loader.load('fonts/helvetiker_bold.typeface.json',function(font){
        // console.log(font);
        const geometry = new TextGeometry(
            'Hello colincclala',
            {
                font: font,
                size: 50,
                height: 20,  // 厚度
                curveSegments: 20,
                bevelEnabled: true,
                bevelThickness: 2,
                bevelSize: 1.5
            }
        )
        geometry.computeBoundingBox();
        const xOffet = (geometry.boundingBox.max.x - geometry.boundingBox.min.x )/2
        const textMesh = new THREE.Mesh(geometry,materials)
        textMesh.position.set(-xOffet,30,0)
        scene.add(textMesh)

        // 倒影
        const textMesh2 = new THREE.Mesh(geometry,materials)
        textMesh.position.set(-xOffet,-30,0)
        textMesh2.rotation.x = Math.PI
        scene.add(textMesh2)
    })
}
function initCamera() {
    camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        1,
        1500
    );
    camera.position.set(0, 250, 700);
    camera.lookAt( new THREE.Vector3(0,0,0) )
}
function animate(){
    requestAnimationFrame(animate)
    renderer.render(scene,camera)
}