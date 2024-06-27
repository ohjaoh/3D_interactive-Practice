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
const boxMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
boxMesh.castShadow = true;
boxMesh.receiveShadow = true;
boxMesh.position.y = 0.5;
scene.add(boxMesh);

// 아래의 엠비언트라이트는 모든 곳에 동일한 빛을 줘서 3D가 구분이 잘 안된다.
// const ambientLight = new THREE.AmbientLight(0xffffff,5);
// scene.add(ambientLight);

// const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
// directionalLight.castShadow = true;
// directionalLight.position.set(3, 4, 5);
// directionalLight.lookAt(0, 0, 0); // 초기에는 원점을 봐서 굳이 필요없는 코드임
// scene.add(directionalLight);
// const directionalLightHelper = new THREE.DirectionalLightHelper(
//   directionalLight,
//   1
// );
// scene.add(directionalLightHelper);

//아래 코드를 진행하기 위해서 박스의 색을 흰색으로 변경함 다른 빛을 확인할 때는 다른 색으로 ㄱㄱ

// const hemisphereLight = new THREE.HemisphereLight(0xb4a912,0x12f34f,5);
// hemisphereLight.position.set(0,1,0);
// hemisphereLight.lookAt(0,0,0);
// scene.add(hemisphereLight);
// const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight,1);
// scene.add(hemisphereLightHelper);
// 위의 것을 제대로 확인하려면 , side: THREE.DoubleSide 를 바닥에 추가해보기

// const pointLight = new THREE.PointLight(0xffffff, 5, 5, 4);
// pointLight.castShadow = true;
// pointLight.position.set(1,1,1);
// scene.add(pointLight);

// const pointLightHelper = new THREE.PointLightHelper(pointLight, 1);
// scene.add(pointLightHelper); // 위에서 THREE.PointLight(0xffffff, 5, 5, 4); 뒤의 2개의 값을 변경하며 차이 알아보기

// 이건 별도로 헬퍼가 없다.
// const rectAreaLight =new THREE.RectAreaLight(0xffffff, 5, 2, 2);
// rectAreaLight.position.set(0,1,2);
// scene.add(rectAreaLight);

// 이건 룩엣을 못하고 타겟으로 해야한다.
const targetObj = new THREE.Object3D();
scene.add(targetObj);

const spotLight = new THREE.SpotLight(0xffffff,
  10, 100, Math.PI / 4, 1, 1);
spotLight.castShadow =true;
spotLight.position.set(0,3,0);
spotLight.target = targetObj;
spotLight.target.position.set(1,0,2);
scene.add(spotLight);

const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);



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
