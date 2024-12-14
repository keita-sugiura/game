import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

const width = window.innerWidth, height = window.innerHeight;

// camera //////////////////////////////
const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 20);
camera.position.set(1,1,1);
//camera.up.set(0, 0, 1);
camera.lookAt(0, 0, 0);


// object //////////////////////////////
const scene = new THREE.Scene();

const addOne = (color, x, y, z) => {
    const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    const material = new THREE.MeshPhongMaterial({ color: color });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.scale.set(x, y, z);
    mesh.renderOrder=0;
    scene.add(mesh);
}
addOne(0x0000ff, 1, 1, 1);

var map1 =new THREE.TextureLoader().load('sougen.jpg' ); 
const ground=new THREE.Mesh(new THREE.PlaneGeometry(10,10),new THREE.MeshPhongMaterial( { map: map1 } ));
scene.add(ground);
ground.rotation.x = -Math.PI / 2;

// axes   //////////////////////////////
const axes=new THREE.AxesHelper();
axes.material.depthTest = false;
axes.renderOrder=1;
scene.add(axes);

// light   //////////////////////////////
const addL = (x, y, z)=>{
    const light = new THREE.DirectionalLight(0xFFFFFF, 3);
    light.position.set(x,y,z);
    scene.add(light);
    return light
};
const light1=addL(-1,2,4);
//addL(1,-2,4);

// GUI   ///////////////////
const gui = new GUI();
gui.add(camera.position, 'x', -10, 10);

// keyboard  //////////////////////////////
let pressW=0,pressS=0,pressD=0,pressA=0;
document.addEventListener('keydown', (e) => {
    //console.log('code:' + e.code + ', key:' + e.key);
    if(e.code=='KeyX'){
        if(pointer.isLocked)pointer.unlock();
        else pointer.lock();
        return;
    }
    if(e.code=='KeyW')pressW=1;
    if(e.code=='KeyS')pressS=1;
    if(e.code=='KeyD')pressD=1;
    if(e.code=='KeyA')pressA=1;
});

document.addEventListener('keyup',(e)=>{
    if(e.code=='KeyW')pressW=0;
    if(e.code=='KeyS')pressS=0;
    if(e.code=='KeyD')pressD=0;
    if(e.code=='KeyA')pressA=0;
});

// render ///////////////////////////////////
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

// FPS
const pointer = new PointerLockControls(camera,renderer.domElement);
let moveSpeed=0.06;

function animate(time) {

    //mesh.rotation.x = time / 2000;
    //mesh.rotation.y = time / 1000;
    //mesh.scale.set(0.2,1,1);
    //camera.position.x = (time%1000) / 1000;
    let forward=pressW-pressS;
    let right=pressD-pressA;
    pointer.moveForward(forward*moveSpeed);
    pointer.moveRight(right*moveSpeed);
    renderer.render(scene, camera);

}