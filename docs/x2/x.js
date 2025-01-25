import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

const width = window.innerWidth, height = window.innerHeight;

// scene  &  camera //////////////////////////////
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 50);
scene.add(camera);
scene.background = new THREE.Color().setHex(0x22bb77);
const boxScene = new THREE.Scene();
scene.add(boxScene);
camera.position.set(12, 12, 12);
camera.lookAt(0, 0, 0);

// light   //////////////////////////////
const addL = (x, y, z) => {
    const light = new THREE.DirectionalLight(0xFFFFFF, 3);
    light.position.set(x, y, z);
    scene.add(light);
    return light
};
const light1 = addL(-20, 20, 20);

// object //////////////////////////////

var map1 = new THREE.TextureLoader().load('steel2.jpg');

// オブジェクトを一度作成してシーンに追加
const blockMeshes = Array.from({ length: 10 }, (_, x) => 
    Array.from({ length: 10 }, (_, y) => 
        Array.from({ length: 10 }, (_, z) => {
            const geometry = new THREE.BoxGeometry(0.9, 0.9, 0.9);
            const material =new THREE.MeshPhongMaterial({ map: map1 })
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(x+0.05, y+0.05, z+0.05);
            mesh.visible = false; // 初期状態では非表示
            boxScene.add(mesh);
            return mesh;
        })
    )
);

// オブジェクトの表示・非表示を切り替える関数
const toggleBlock = (x, y, z) => {
    const mesh = blockMeshes[x][y][z];
    mesh.visible = !mesh.visible;
}
for(let i=0;i<10;i++){
    for(let j=0;j<10;j++){
       for(let k=0;k<10;k++){
           if(Math.random()<0.2){
               toggleBlock(i,j,k);
           }
       }
    }
}

{ // crosshair
    const geometry = new THREE.RingGeometry(0, 0.001, 10);
    const material = new THREE.MeshBasicMaterial({ color: 0x555555 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, -0.1);
    mesh.renderOrder = 0;
    camera.add(mesh);
}

// 文字  //////////////////////////////
const loader = new FontLoader();
let message = 'press x and drag to look around \n';
message+= 'press w,a,s,d,space,shift to move \n';
message+= 'click to toggle block';
loader.load('font.json', function (font) {
    const textGeometry = new TextGeometry(message, {
        font: font,
        size: 0.1,
        height: 0.001,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.01,
        bevelSize: 0.001,
        bevelOffset: 0,
        bevelSegments: 5
    });
    const textMaterial = new THREE.MeshPhongMaterial({ color: "#FF0000" });
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.set(10,11.5,10); // テキストの位置を設定
    scene.add(textMesh);
});


// axes   //////////////////////////////
const axes = new THREE.AxesHelper();
axes.material.depthTest = false;
axes.renderOrder = 10;
//scene.add(axes);

// keyboard  //////////////////////////////
let pressW = 0, pressS = 0, pressD = 0, pressA = 0, pressSpace = 0, pressShift = 0;
document.addEventListener('keydown', (e) => {
    //console.log('code:' + e.code + ', key:' + e.key);
    if (e.code == 'KeyX') {
        if (pointer.isLocked) pointer.unlock();
        else pointer.lock();
        return;
    }
    if (e.code == 'Space') pressSpace = 1;
    if (e.code == 'ShiftLeft') pressShift = 1;
    if (e.code == 'KeyW') pressW = 1;
    if (e.code == 'KeyS') pressS = 1;
    if (e.code == 'KeyD') pressD = 1;
    if (e.code == 'KeyA') pressA = 1;
});

document.addEventListener('keyup', (e) => {
    if(e.code == 'Space') pressSpace = 0;
    if(e.code == 'ShiftLeft') pressShift = 0;
    if (e.code == 'KeyW') pressW = 0;
    if (e.code == 'KeyS') pressS = 0;
    if (e.code == 'KeyD') pressD = 0;
    if (e.code == 'KeyA') pressA = 0;
});

// sound
const soundKachi = new Audio('kachi.mp3');

// レイキャスターを作成
const raycaster = new THREE.Raycaster();

// 左クリックイベントをリッスン
document.addEventListener('mousedown', (event) => {
    event.preventDefault();

    // カメラの視線方向にレイキャストを設定
    raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);

    //　最初にヒットしたブロックを取得
    const intersects = raycaster.intersectObjects(blockMeshes.flat(2)).filter(intersect => intersect.object.visible);
    if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;
        intersectedObject.visible = false;
        soundKachi.play();
    }
});

// render ///////////////////////////////////
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

// FPS
const pointer = new PointerLockControls(camera, renderer.domElement);
let moveSpeed = 0.1;

function animate(time) {

    let forward = pressW - pressS;
    let right = pressD - pressA;
    let up = pressSpace - pressShift;
    pointer.moveForward(forward * moveSpeed);
    pointer.moveRight(right * moveSpeed);
    camera.position.y += up * moveSpeed;

    renderer.render(scene, camera);

}