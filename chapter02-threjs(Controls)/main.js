// 스타일 시트를 가져옵니다.
import "./style.css";

// Three.js 라이브러리를 가져옵니다.
import * as THREE from "three";
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
scene.add(boxMesh);

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
scene.add(directionalLightHelper);




// orbit컨트롤은 마우스로 이동하는 편리한 컨트롤러다.
// const orbitControls = new OrbitControls(camera, renderer.domElement);
// orbitControls.enableDamping = true;
// orbitControls.dampingFactor = 0.03; // 기본이 0.05이고 작아질 수록 더 부드럽게 움직인다.
// orbitControls.enableZoom = true;
// orbitControls.enablePan= true;
// orbitControls.enableRotate = true;
// orbitControls.autoRotate = false; // 카메라 자동 회전기능
// orbitControls.autoRotateSpeed = 1; // 카메라 자동회전 속도 조절

// orbitControls.maxPolarAngle = Math.PI/2; // 수직회전의 최대값을 지정 지금상태로는 박스의 하단이 안보인다.
// orbitControls.minPolarAngle = Math.PI/4; // 수직회전의 최소값을 지정
// orbitControls.maxAzimuthAngle = Math.PI/2; // 수평회전의 최대값을 지정
// orbitControls.minAzimuthAngle = Math.PI/2; // 수평회전의 최소값을 지정

// 플라이컨트롤도 애니매이션에서 업데이트해야한다.
// const flyControls = new FlyControls(camera,renderer.domElement);
// flyControls.movementSpeed = 1;
// flyControls.rollSpeed = Math.PI/10;
// flyControls.autoForward = false;

// 주석필요
// camera.position.set(0,1,5);
// const firstPersonControls = new FirstPersonControls(camera, renderer.domElement);
// firstPersonControls.lookSpeed = 0.1;
// firstPersonControls.movementSpeed= 1; // 카메라 이동속력조정
// firstPersonControls.lookVertical = false; 

// camera.position.set(0,1,5);
// const pointerLockControls  = new PointerLockControls(camera, renderer.domElement);
// window.addEventListener("click",() => {
//   pointerLockControls.lock();
// })

// 가운데 공이 있는 듯한 움직임
camera.position.set(0,1,5);
const trackbollControls = new TrackballControls(camera, renderer.domElement)
trackbollControls.rotation = 2;
trackbollControls.zoomSpeed = 1.5;
trackbollControls.panSpeed = 0.5;
trackbollControls.noRotate = false;
trackbollControls.noZoom = false;
trackbollControls.noPan = false;
trackbollControls.staticMoving = false; // 뎀핑없는 움직임을 활성화 여부 지금은 활성화한다는 뜻
trackbollControls.dynamicDampingFactor = 0.05;

const target =new THREE.Mesh(
  new THREE.SphereGeometry(0.5),
  new THREE.MeshStandardMaterial({color : 0x0000ff})
);

// 이거도 타겟을 잡을 수 있음
target.position.set(4,0.5,0);
scene.add(target);
trackbollControls.target = target.position;


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
  // orbitControls.update();
  //flyControls.update(clock.getDelta());
  // firstPersonControls.update(clock.getDelta());
  trackbollControls.update();
}

render();
