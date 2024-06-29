import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";

/**
 * GLBModel 컴포넌트는 dancer.glb 모델을 렌더링하는 React 컴포넌트입니다.
 * 모델의 메시 오브젝트들에 그림자 캐스팅 및 그림자 수신을 설정합니다.
 * @returns {JSX.Element} GLB 모델의 primitive 요소를 반환합니다.
 */
export const GLBModel = () => {
    const three = useThree();
    // console.log("three",three);
    const { scene, animations } = useGLTF("/dancer.glb");
    const ref = useRef(null);

    // const anim = useAnimations(animations, ref);
    // console.log("anim",anim);

    const {actions} = useAnimations(animations, ref);

    useEffect(() => {
        // scene을 traverse하여 모든 메시 오브젝트에 그림자 설정
        scene.traverse((obj) => {
            if (obj.isMesh) {
                obj.castShadow = true;  // 그림자 캐스팅 설정
                obj.receiveShadow = true;  // 그림자 수신 설정
            }
        });

        actions["wave"].play();
    }, [actions, scene]);  // scene이 변경될 때마다 useEffect가 실행되도록 설정

    useFrame((status, delta) => {
        // ref.current.rotation.y +=0.02;


    })

    // GLB 모델을 렌더링하고, 크기와 위치를 설정하여 반환
    return <primitive ref={ref} scale={0.01} object={scene} position-y={0.8} />;
}
