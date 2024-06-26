// 스타일 시트를 가져옵니다.
import "./style.css";

// Three.js 라이브러리를 가져옵니다.
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

// 렌더러를 생성합니다. 안티엘리어싱을 사용하여 테두리가 매끄럽게 보이도록 설정합니다.
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true;
// 렌더러의 크기를 브라우저 창의 크기와 동일하게 설정합니다.
renderer.setSize(window.innerWidth, window.innerHeight);
// 렌더러의 DOM 요소를 문서의 바디에 추가합니다.
document.body.appendChild(renderer.domElement);

// 씬을 생성합니다. 씬은 모든 3D 객체가 포함될 공간입니다.
const scene = new THREE.Scene();

// 카메라를 생성합니다. 
// - 60: 시야각 (field of view) 
// - window.innerWidth / window.innerHeight: 화면 비율 (aspect ratio) 
// - 0.1: 가까이 보이는 거리 (near clipping plane) 
// - 100: 멀리 보이는 거리 (far clipping plane)
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
// 카메라의 위치를 설정합니다. (y 방향으로 1만큼, z 방향으로 5만큼 이동)
camera.position.y = 1;
camera.position.z = 5;

const directionalLight = new THREE.DirectionalLight(0xffffff, 5); //직사광선 태양빛 생각
directionalLight.castShadow = true;
directionalLight.position.set(3, 4, 5);
directionalLight.lookAt(0, 0, 0);
scene.add(directionalLight);

const floorGeometry = new THREE.PlaneGeometry(20, 20);
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xbbbbbb });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
floor.castShadow = true;
scene.add(floor);

// 박스(정육면체) 기하학을 생성합니다. (가로, 세로, 높이 1인 박스)
const geometry = new THREE.BoxGeometry(1, 1, 1);
// 재질(material)을 생성합니다. 기본 재질을 사용하고 색상을 빨간색으로 설정합니다.
const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
// 기하학과 재질을 결합하여 메쉬를 생성합니다.
const mesh = new THREE.Mesh(geometry, material);
mesh.position.y = 0.5;
mesh.receiveShadow = true;
mesh.castShadow = true;
// 메쉬를 씬에 추가합니다.
scene.add(mesh);

const capsuleGeometry = new THREE.CapsuleGeometry(1, 2, 20, 30);
const capsuleMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00 });
const capsuleMesh = new THREE.Mesh(capsuleGeometry, capsuleMaterial);
capsuleMesh.position.set(3, 1.74, 0);
capsuleMesh.castShadow = true;
capsuleMesh.receiveShadow = true;
scene.add(capsuleMesh);

const cylinderGeometry = new THREE.CylinderGeometry(1, 1, 2);
const cylinderMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const cylinderMesh = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
cylinderMesh.position.set(-3, 1, 0);
cylinderMesh.castShadow = true;
cylinderMesh.receiveShadow = true;
scene.add(cylinderMesh);

const torusGeometry = new THREE.TorusGeometry(0.5, 0.1, 16, 100, Math.PI*2);
const torusMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff });
const torusMash = new THREE.Mesh(torusGeometry, torusMaterial);
torusMash.position.set(0, 0.5, 1);
torusMash.castShadow = true;
torusMash.receiveShadow = true;
scene.add(torusMash);

const starShape = new THREE.Shape();

starShape.moveTo(0, 1);
starShape.lineTo(0.2, 0.2);
starShape.lineTo(1,0.2);
starShape.lineTo(0.4,-0.1);
starShape.lineTo(0.6,-1);
starShape.lineTo(0,-0.5);
starShape.lineTo(-0.6,-1);
starShape.lineTo(-0.4,-0.1);
starShape.lineTo(-1,0.2);
starShape.lineTo(-0.2,0.2);

const shapeGeometry = new THREE.ShapeGeometry(starShape);
const shapeMaterial = new THREE.MeshStandardMaterial({ color: 0xff00ff });
const shapeMesh = new THREE.Mesh(shapeGeometry, shapeMaterial);
shapeMesh.position.set(0, 1, 2);
scene.add(shapeMesh);

//아래는 주석추가
const extrudeSetting = {
  steps:1, 
  depth: 0.1,
  bevelEnabled: true,
  bevelThickenss:0.1,
  bevelSize:0.3,
  bevelSegments:100,
};

const extrudeGeometry = new THREE.ExtrudeGeometry(starShape, extrudeSetting);
const extrudeMaterial = new THREE.MeshStandardMaterial({ color: 0x0ddaaf });
const extrudeMesh = new THREE.Mesh(extrudeGeometry, extrudeMaterial);
extrudeMesh.position.set(2, 1.3, 2);
extrudeMesh.castShadow = true;
extrudeMesh.receiveShadow = true;
scene.add(extrudeMesh);

const sphereGeometry = new THREE.SphereGeometry(
  1,
  32,
  32,
  // Math.PI / 4,
  // Math.PI / 2,
  // Math.PI / 3,
  // Math.PI / 2
);
const spherMaterial = new THREE.MeshStandardMaterial({ color: 0x98daaf });
const sphere = new THREE.Mesh(sphereGeometry, spherMaterial);
sphere.position.set(0, 1, -3);
// scene.add(sphere);

//아래도 주석추가하기
const numPoints = 1000;
const positions = new Float32Array(numPoints*3);

for (let i = 0; i < numPoints; i += 1) {
  const x = (Math.random() - 0.5) * 1;
  const y = (Math.random() - 0.5) * 1;
  const z = (Math.random() - 0.5) * 1;
  positions[i * 3] = x;
  positions[i * 3 + 1] = y;
  positions[i * 3 + 2] = z;
}

//일반 지오메트리와 차이점 주석
const bufferGeometry = new THREE.BufferGeometry();
bufferGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions,3)
);
const posintsMaterial =new THREE.PointsMaterial({
  color:0xffff00,
  size:0.05,
});

const point = new THREE.Points(bufferGeometry,posintsMaterial); // bufferGeometry에 sphereGeometry 넣어보기
point.position.set(0,0,-5);
scene.add(point);

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
