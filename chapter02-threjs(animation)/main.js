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
const gltf = await gltfLoader.loadAsync("/dancer.glb");
// gltf에 들어있는 속성을 체크하기 위한 디버그
console.log(gltf);
const character = gltf.scene;
// glb 파일에 있는 애니매이션을 꺼내기위한 상수선언
const animationClips = gltf.animations;
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

// 애니매이션을 위해서 믹서를 만들고 들어있는 애니매이션을 잡고 실행함 맨 아래에 애니매이션부분에서 시간에 따른 업데이트를 추가해야함
const mixer = new THREE.AnimationMixer(character);
const action = mixer.clipAction(animationClips[3]);
action.setLoop(THREE.LoopRepeat); // 애니매이션 반복을 지정 LoopPingPong은 재생완료후 역재생
// action.setDuration(10); // 애니매이션의 속도느리게
// action.setEffectiveTimeScale(0.5); // 애니메이션의 속도를 바르게
// action.setEffectiveWeight(2.5); // 애니메이션의 분명함정도를 지정
action.play();

// 아래코드는 특정시간에 동작을 정지시키는 코드임 단 실험해보니 클립이 위에서 지정한 액션의 클립과 다르면 정지않함
// setTimeout(() => {
// mixer.clipAction(animationClips[3]).paused = true;
// },3000);



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
  if(mixer){
    mixer.update(clock.getDelta());
  }
}

render();
