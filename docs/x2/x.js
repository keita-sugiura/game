import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

const width = window.innerWidth, height = window.innerHeight;

// scene  &  camera //////////////////////////////
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 20);
scene.add(camera);
scene.background = new THREE.Color().setHex(0x22bb77);

// object //////////////////////////////



const addOne = (color, x, y, z) => {
    const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    const material = new THREE.MeshPhongMaterial({ color: color });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.scale.set(x, y, z);
    mesh.renderOrder = 1;
    //scene.add(mesh);
    return mesh;
}
const cubes = [];
for(let i = 0; i < 50; i++){
    let obj = addOne(0x0000ff, 1, 1, 1);
    scene.add(obj);
    const genRand=(l,r)=>l+(r-l)*Math.random();
    obj.position.set(genRand(-5,5),genRand(0,8),genRand(-5,5));
    cubes.push(obj);
}
{ // crosshair
    const geometry = new THREE.RingGeometry(0, 0.001, 10);
    const material = new THREE.MeshBasicMaterial({ color: 0x555555 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, -0.1);
    mesh.renderOrder = 0;
    camera.add(mesh);
}

var map1 = new THREE.TextureLoader().load('sougen.jpg');
const ground = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), new THREE.MeshPhongMaterial({ map: map1 }));
scene.add(ground);
ground.rotation.x = -Math.PI / 2;


// フォントを読み込み、テキストを作成
const loader = new FontLoader();
loader.load('font.json', function (font) {
    const textGeometry = new TextGeometry('press x to control the view', {
        font: font,
        size: 0.06,
        height: 0.001,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.01,
        bevelSize: 0.001,
        bevelOffset: 0,
        bevelSegments: 5
    });
    const textMaterial = new THREE.MeshPhongMaterial({ color: "#1D1B7B" });
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.set(0.05, 0.1, 0); // テキストの位置を設定
    scene.add(textMesh);
});


// axes   //////////////////////////////
const axes = new THREE.AxesHelper();
axes.material.depthTest = false;
axes.renderOrder = 10;
scene.add(axes);

// light   //////////////////////////////
const addL = (x, y, z) => {
    const light = new THREE.DirectionalLight(0xFFFFFF, 3);
    light.position.set(x, y, z);
    scene.add(light);
    return light
};
const light1 = addL(-1, 2, 4);


// keyboard  //////////////////////////////
let pressW = 0, pressS = 0, pressD = 0, pressA = 0;
document.addEventListener('keydown', (e) => {
    //console.log('code:' + e.code + ', key:' + e.key);
    if (e.code == 'KeyX') {
        if (pointer.isLocked) pointer.unlock();
        else pointer.lock();
        return;
    }
    if (e.code == 'Space') jump();
    if (e.code == 'KeyW') pressW = 1;
    if (e.code == 'KeyS') pressS = 1;
    if (e.code == 'KeyD') pressD = 1;
    if (e.code == 'KeyA') pressA = 1;
});

document.addEventListener('keyup', (e) => {
    if (e.code == 'KeyW') pressW = 0;
    if (e.code == 'KeyS') pressS = 0;
    if (e.code == 'KeyD') pressD = 0;
    if (e.code == 'KeyA') pressA = 0;
});

// レイキャスターを作成
const raycaster = new THREE.Raycaster();

// 赤色の円を描画する関数
function drawCircleAtIntersection(point) {
    const geometry = new THREE.CircleGeometry(0.1, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const circle = new THREE.Mesh(geometry, material);
    circle.position.copy(point);
    circle.rotation.x = -Math.PI / 2; // 地面に平行にする
    scene.add(circle);
}

// 右クリックイベントをリッスン
document.addEventListener('mousedown', (event) => {
    event.preventDefault();

    // カメラの視線方向にレイキャストを設定
    raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);

    // 地面との交点を計算
    const intersects = raycaster.intersectObject(ground);
    if (intersects.length > 0) {
        const intersectionPoint = intersects[0].point;
        intersectionPoint.y += 0.01; // 少し浮かせる
        drawCircleAtIntersection(intersectionPoint);
    }
});

// render ///////////////////////////////////
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

// FPS
const pointer = new PointerLockControls(camera, renderer.domElement);
let moveSpeed = 0.03;

// jump
let baseHeight = 0.5;
const smalldif = 0.00001;
camera.position.set(1, baseHeight, 1);
camera.lookAt(0, 0, 0);
let speedY = 0;
function jump() {
    speedY = 0.1;
}

// baseHeightをオブジェクトのプロパティとして定義
const params = {
    baseHeight: 0.5
};

// GUI   ///////////////////
const gui = new GUI();
const groundFolder = gui.addFolder('Ground Scale');
groundFolder.add(ground.scale, 'x', 1, 10).name('Scale').onChange((value) => {
    ground.scale.set(value, value, value);
});
groundFolder.open();

// baseHeightのコントロールを追加
gui.add(params, 'baseHeight', 0.1, 2).name('Base Height').onChange((value) => {
    camera.position.y = value;
});

function animate(time) {

    let forward = pressW - pressS;
    let right = pressD - pressA;
    pointer.moveForward(forward * moveSpeed);
    pointer.moveRight(right * moveSpeed);

    if (camera.position.y > baseHeight - smalldif) {
        camera.position.y += speedY;
        camera.position.y = Math.max(camera.position.y, params.baseHeight);
        speedY -= 0.005;
    }

    renderer.render(scene, camera);

}