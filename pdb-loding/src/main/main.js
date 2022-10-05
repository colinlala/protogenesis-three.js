// pdb: protein data bank
import * as THREE from "three";
import { Color } from "three";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls.js";
import { PDBLoader } from 'three/examples/jsm/loaders/PDBLoader.js'
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/loaders/CSS2DRenderer.js'

let scene, renderer, camera, css2DRenderer;
let controls;
const url = 'models/pdb/caffeine.pdb'

initRenderer();
initScene();
initAxesHelper();
initCamera();
initLight();
initMeshes();
initCSS2DRenderer();
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
    controls = new TrackballControls(camera, renderer.domElement);
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
    const axesHelper = new THREE.AxesHelper(1);
    scene.add(axesHelper);
}
function initLight(){
    const light1 = new THREE.HemisphereLight(0xffffff,0.8)
    light1.position.set(1,1,1)
    scene.add(light1)

    const light2 = new THREE.HemisphereLight(0xffffff,0.5)
    light2.position.set(-1,-1,1)
    scene.add(light2)
}
function initMeshes(){
    const loader = new PDBLoader()
    loader.load(url,function(pdb){
        // console.log(pdb);  
        // geometryAtoms : color[24], position[24] 原子模型的颜色和位置
        // geometryBonds ：position[50], 25对化学键
        // json : atoms[24], 0-2位置信息，3颜色，4label
        
        let positions = pdb.geometryAtoms.getAttribute(`position`)
        const colors = pdb.geometryAtoms .getAttribute(`color`)

        const position = new THREE.Vector3()
        const color = new THREE.Color()

        for(let i =0; i<positions.count;i++){
            position.x = positions.getX(i)
            position.y = positions.getY(i)
            position.z = positions.getZ(i)

            color.r = colors.getX(i)
            color.g = colors.getY(i)
            color.b = colors.getZ(i)

            // mesh
            const geometry = new THREE.IcosahedronGeometry(0.23,3)
            const material = new THREE.MeshPhongMaterial({
                color:color
            })
            const object = new THREE.Mesh(geometry,material)
            object.position.copy(position)
            scene.add(object)
        }

        // 
        positions = pdb.geometryBonds.getAttribute(`position`)
        const start = new THREE.Vector3()
        const end = new THREE.Vector3()

        for(let i =0; i<positions.count;i+=2){
            start.x = positions.getX(i)
            start.y = positions.getY(i)
            start.z = positions.getZ(i)

            end.x = positions.getX(i + 1)
            end.y = positions.getY(i + 1)
            end.z = positions.getZ(i + 1)

            // mesh
            const geometry = new THREE.BoxGeometry(0.05,0.05,0.05)
            const material = new THREE.MeshPhongMaterial({
                color:0xffffff
            })
            const object = new THREE.Mesh(geometry,material)
            object.position.copy(start)
            object.position.lerp(end,0.5)
            object.scale.z = start.distanceTo(end) * 10
            object.lookAt(end)
            scene.add(object)
        }

        // 
        const json = pdb.json()
        for(let i =0; i<json.atoms.length;i++){
            const stom = json.stoms[i]
            const text = document.createElement('div')
            const c = 'rgb(' + atom[3][0] + ','+ atom[3][1] + ',' + atom[3][2] + ')'
            text.style.color = c
            text.textContent = atom[4]

            position.x = atom[0]
            position.y = atom[1]
            position.z = atom[2]

            const label = new CSS2DObject(text)
            label.position.copy(position)
            scene.add(label)
        }

        
    })
}
function initCSS2DRenderer(){
    css2DRenderer = new CSS2DRenderer()
    css2DRenderer.setSize(window.innerWidth / window.innerHeight)
    css2DRenderer.domElement.style.position = `absolute`
    css2DRenderer.domElement.style.top = `0px`
    css2DRenderer.domElement.style.pointEvents = `none`
    document.body.appendChild(css2DRenderer.domElement)
}
function initCamera() {
    camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        100
    );
    camera.position.z = 10;
}
function animate(){
    requestAnimationFrame(animate)
    controls.update()
    renderer.render(scene,camera)
    css2DRenderer.render(scene,camera)
}