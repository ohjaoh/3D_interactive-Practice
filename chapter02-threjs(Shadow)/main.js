// 스타일 시트를 가져옵니다.
import "./style.css";

// Three.js 라이브러리를 가져옵니다.
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

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





const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.update();

// 창 크기가 변경될 때 실행될 함수를 설정합니다.
window.addEventListener('resize', () => {
  // 렌더러의 크기를 새 창 크기에 맞게 조정합니다.
  renderer.setSize(window.innerWidth, window.innerHeight);
  // 카메라의 화면 비율(aspect ratio)을 새 창 크기에 맞게 조정합니다.
  camera.aspect = window.innerWidth / window.innerHeight;
  // 카메라의 투영 행렬을 업데이트합니다.
  camera.updateProjectionMatrix();
  // 씬을 다시 렌더링합니다.
  renderer.render(scene, camera);
});

const render = () => {

  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

render();
