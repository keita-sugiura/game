import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

const width = window.innerWidth, height = window.innerHeight;

// camera //////////////////////////////
const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 10);
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
addOne(0x00ff00, 1, 1, 1);

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
document.addEventListener('keydown', (e) => {
    console.log('code:' + e.code + ', key:' + e.key);
    let x=0,y=0,z=0;
    if(e.code=='KeyW')z++;
    if(e.code=='KeyS')z--;
    if(e.code=='KeyA')x--;
    if(e.code=='KeyD')x++;
    if(e.code=='Space')y++;
    if(e.shiftKey==true)y--;
    const uni=0.1;
    camera.position.x+=x*uni;
    camera.position.z+=z*uni;
    camera.position.y+=y*uni;
});

// render ///////////////////////////////////
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);
function animate(time) {

    //mesh.rotation.x = time / 2000;
    //mesh.rotation.y = time / 1000;
    //mesh.scale.set(0.2,1,1);
    //camera.position.x = (time%1000) / 1000;

    renderer.render(scene, camera);

}