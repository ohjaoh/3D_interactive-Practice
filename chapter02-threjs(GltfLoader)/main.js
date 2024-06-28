import "./style.css";
import * as THREE from "three";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js"

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import {FlyControls} from "three/examples/jsm/controls/FlyControls.js"
import {FirstPersonControls} from "three/examples/jsm/controls/FirstPersonControls.js"
import {PointerLockControls} from "three/examples/jsm/controls/PointerLockControls.js"
import {TrackballControls} from "three/examples/jsm/controls/TrackballControls.js"

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 여기서 비교해볼것(성능높고 퀄리티 낮은거 -> 성능 낮고 퀄리티 높은거) BasicShadowMap, PCFShadowMap, PCFSoftShadowMap
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.x = 5;
camera.position.y = 5;
camera.position.z = 5;

const floorGeometry = new THREE.PlaneGeometry(20, 20);
const floorMaterial = new THREE.MeshStandardMaterial({ 
  color: 0xbbbbbb, 
});
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
floor.castShadow = true;
scene.add(floor);

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00 });
const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
boxMesh.castShadow = true;
boxMesh.receiveShadow = true;
boxMesh.position.y = 0.5;
// scene.add(boxMesh);

const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
directionalLight.castShadow = true;
directionalLight.position.set(3, 4, 5);
directionalLight.lookAt(0, 0, 0);
// 아래 두 속성을 추가해서 그림자의 퀄리티가 더 좋아짐
directionalLight.shadow.mapSize.width = 4096;
directionalLight.shadow.mapSize.height = 4096;

// 그림자 카메라
directionalLight.shadow.camera.top = 2;
directionalLight.shadow.camera.bottom = -2;
directionalLight.shadow.camera.left = -2;
directionalLight.shadow.camera.right = 2;

directionalLight.shadow.camera.near = 0.1;
directionalLight.shadow.camera.far = 100;

scene.add(directionalLight);
const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight,
  1
);
// scene.add(directionalLightHelper);

const gltfLoader = new GLTFLoader();
// gltfLoader.load("/dancer.glb",(gltf)=>{
//   console.log(gltf);
//   const character = gltf.scene;
//   character.position.y= 0.8;
//   character.scale.set(0.01,0.01,0.01);
//   scene.add(gltf.scene);
// });

const gltf = await gltfLoader.loadAsync("/dancer.glb");
console.log(gltf);
const character = gltf.scene;
character.position.y = 0.8;
character.scale.set(0.01, 0.01, 0.01);
character.castShadow = true;
character.receiveShadow = true;
// 위에서 한것은 그룹에 한것임 아래의 코드로 모든 자녀속성에 그림자속성을 추가한 것임
character.traverse(obj => {
  if(obj.isMesh){
    obj.castShadow = true;
    obj.receiveShadow=true;
  }
})
scene.add(gltf.scene);


// orbit컨트롤은 마우스로 이동하는 편리한 컨트롤러다.
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true;
orbitControls.dampingFactor = 0.03; // 기본이 0.05이고 작아질 수록 더 부드럽게 움직인다.



window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.render(scene, camera);
});

const clock = new THREE.Clock();

const render = () => {
  renderer.render(scene, camera);
  requestAnimationFrame(render);
  orbitControls.update();
}

render();
