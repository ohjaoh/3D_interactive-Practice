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
camera.position.x = 5;
camera.position.y = 5;
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

const frontSideGeometry = new THREE.BoxGeometry(1, 1, 1);
const frontSideMaterial = new THREE.MeshStandardMaterial({ color: 0x00ffff, side: THREE.FrontSide, });
const frontSideMesh = new THREE.Mesh(frontSideGeometry, frontSideMaterial);
frontSideMesh.position.z = 4;
frontSideMesh.position.y = 0.5;
frontSideMesh.castShadow = true;
frontSideMesh.receiveShadow = true;
scene.add(frontSideMesh);

const backSideGeometry = new THREE.BoxGeometry(1, 1, 1)
const backSideMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00, side: THREE.BackSide, });
const backSideMesh = new THREE.Mesh(backSideGeometry, backSideMaterial);
backSideMesh.position.set(2, 0.5, 4);
backSideMesh.position.y = 0.51; // 포지션을 수정해서 동일한 위치값을 가지면 생기는 제트파이닝? 그걸 해결할 수 있다.
// backSideMesh.castShadow =true;
backSideMesh.receiveShadow = true;
scene.add(backSideMesh);

const doubleSideGeometry = new THREE.BoxGeometry(1, 1, 1)
const doubleSideMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00, side: THREE.DoubleSide, });
const doubleSideMesh = new THREE.Mesh(doubleSideGeometry, doubleSideMaterial);
doubleSideMesh.position.set(4, 0.5, 4);
doubleSideMesh.position.y = 0.51; // 포지션을 수정해서 동일한 위치값을 가지면 생기는 제트파이닝? 그걸 해결할 수 있다.
// doubleSideMesh.castShadow =true; //더블사이드에서 캐스트쉐도우를 주면 비정상적으로 나온다.
doubleSideMesh.receiveShadow = true;
scene.add(doubleSideMesh);

const torusKontgeometry = new THREE.TorusKnotGeometry(0.5, 0.15, 100, 20);
const torusKnotStandMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000, });
torusKnotStandMaterial.roughness = 0.5; // 거친정도
torusKnotStandMaterial.metalness = 1;  // 금속성
const torusKnotStandardMesh = new THREE.Mesh(
  torusKontgeometry,
  torusKnotStandMaterial
);
torusKnotStandardMesh.castShadow = true;
torusKnotStandardMesh.receiveShadow = true;
torusKnotStandardMesh.position.set(-4, 1, 0);
scene.add(torusKnotStandardMesh);

const torusKnotLambertMaterial = new THREE.MeshLambertMaterial({
  color: 0xff0000,
});
torusKnotLambertMaterial.emissive = new THREE.Color(0x0000ff); // 여기서 은은한 색이 들어간거
torusKnotLambertMaterial.emissiveIntensity = 0.2;
const torusKnotLamberMesh = new THREE.Mesh(
  torusKontgeometry,
  torusKnotLambertMaterial
);
torusKnotLamberMesh.castShadow = true;
torusKnotLamberMesh.receiveShadow = true;
torusKnotLamberMesh.position.set(-2, 1, 0);
scene.add(torusKnotLamberMesh);

const torusKnotPhongMaterial = new THREE.MeshPhongMaterial({
  color: 0xff0000,
});
torusKnotPhongMaterial.emissive = new THREE.Color(0x00ff00);
torusKnotPhongMaterial.emissiveIntensity = 0.2;
torusKnotPhongMaterial.specular = new THREE.Color(0x0000ff);
torusKnotPhongMaterial.shininess = 100;
const torusKnotPhongMesh = new THREE.Mesh(torusKontgeometry, torusKnotPhongMaterial);
torusKnotPhongMesh.castShadow = true;
torusKnotPhongMesh.receiveShadow = true;
torusKnotPhongMesh.position.set(0, 1, 0);
scene.add(torusKnotPhongMesh);

const torusKnotBasicMaterial = new THREE.MeshBasicMaterial({color:0xff0000});
const torusKnotBasicMesh = new THREE.Mesh(torusKontgeometry, torusKnotBasicMaterial);
torusKnotBasicMesh.castShadow = true;
torusKnotBasicMesh.receiveShadow = true;
torusKnotBasicMesh.position.set(2, 1, 0);
scene.add(torusKnotBasicMesh);


const torusKnotDepthMaterial = new THREE.MeshDepthMaterial({color : 0xffffff});
torusKnotDepthMaterial.opacity = 0.5;
const torusKnotDepthMesh = new THREE.Mesh(
  torusKontgeometry,
  torusKnotDepthMaterial
)
torusKnotDepthMesh.castShadow = true;
torusKnotDepthMesh.receiveShadow = true;
torusKnotDepthMesh.position.set(4, 1, 0);
scene.add(torusKnotDepthMesh);

const textureLoader = new THREE.TextureLoader();
// textureLoader.load("/threejs.webp", (texture) =>{
//   const textureBoxGeometry = new THREE.BoxGeometry(1,1,1);
//   const textureMaterial = new THREE.MeshStandardMaterial({
//     map:texture,
//   });
//   const textureMesh = new THREE.Mesh(textureBoxGeometry, textureMaterial);
//   textureMesh.castShadow =true;
//   textureMesh.receiveShadow = true;
//   textureMesh.position.set(0,0.5,2);
//   scene.add(textureMesh);
// });

const texture = await textureLoader.loadAsync("/threejs.webp");
const textureBoxGeometry = new THREE.BoxGeometry(1,1,1);
  const textureMaterial = new THREE.MeshStandardMaterial({
    map:texture,
  });
  const textureMesh = new THREE.Mesh(textureBoxGeometry, textureMaterial);
  textureMesh.castShadow =true;
  textureMesh.receiveShadow = true;
  textureMesh.position.set(0,0.5,2);
  scene.add(textureMesh);


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
  textureMesh.rotation.y +=0.01;
}

render();
