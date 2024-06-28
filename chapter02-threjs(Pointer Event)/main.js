import "./style.css";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { FlyControls } from "three/examples/jsm/controls/FlyControls.js"
import { FirstPersonControls } from "three/examples/jsm/controls/FirstPersonControls.js"
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js"
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls.js"

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
floor.name="FLOOR";
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
  if (obj.isMesh) {
    obj.castShadow = true;
    obj.receiveShadow = true;
  }
})
scene.add(gltf.scene);

// 애니매이션을 위해서 믹서를 만들고 들어있는 애니매이션을 잡고 실행함 맨 아래에 애니매이션부분에서 시간에 따른 업데이트를 추가해야함
const mixer = new THREE.AnimationMixer(character);
const action = mixer.clipAction(animationClips[3]);
action.setLoop(THREE.LoopPingPong);
action.play();


// orbit컨트롤은 마우스로 이동하는 편리한 컨트롤러다.
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true;
orbitControls.dampingFactor = 0.03; // 기본이 0.05이고 작아질 수록 더 부드럽게 움직인다.

const newPosition = new THREE.Vector3(0,1,0);
const rayCaster = new THREE.Raycaster();

renderer.domElement.addEventListener("pointerdown", (e) => {
  // 기존의 좌표와 다르게 THREE의 좌표는 좌상단이 -1,1 우하단이 1,-1이다. 중앙이 0,0 
  // 그래서 밑에서 기존의 좌표를 THREE의 좌표로 환산하는 계산이 들어간 것
  const x = (e.clientX / window.innerWidth) * 2 - 1;
  const y = -((e.clientY / window.innerHeight) * 2 - 1);

  rayCaster.setFromCamera(new THREE.Vector2(x,y), camera);
  const intersects = rayCaster.intersectObjects(scene.children); // 레이캐스터로 특정 물체를 관통하는데 씬의 자녀로 한정한다는 것
 // console.log("intersects",intersects);

  const intersectFloor = intersects.find((i)=>i.object.name ==="FLOOR");
  console.log("intersectFloor",intersectFloor);
  newPosition.copy(intersectFloor.point);
  newPosition.y = 1;
})



window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.render(scene, camera);
});

const clock = new THREE.Clock();
const targetVector = new THREE.Vector3();

const render = () => {
  character.lookAt(newPosition);
  targetVector
  .subVectors(newPosition, character.position) // newposition에서 캐릭터의 위치를 빼서 
  .normalize() // 정규화 길이를 1단위로 짜름
  .multiplyScalar(0.01); // 백터의 방향은 놔두고 크기만 0.01배 함 짜른 거를 100토막냄

  // 클릭한 곳으로 캐릭터가 이동하고 이동하는 동안 멈추고 도착하면 다시 춤춘다.
  // 밑에서 완전히 같은 값인 경우가 없는 경우 도착해도 도착안했다고 계산이 될 수 있다.
  // 정확하게 하려면 1 대신 0.1이나 0.01을 넣으면 된다.
  if(Math.abs(character.position.x -newPosition.x)>=1||
  Math.abs(character.position.z -newPosition.z)>=1
){
    character.position.x += targetVector.x;
    character.position.z += targetVector.z;
    action.stop();
  }
  action.play();

  renderer.render(scene, camera);
  requestAnimationFrame(render);
  orbitControls.update();
  if (mixer) {
    mixer.update(clock.getDelta());
  }
}

render();
