import { useAnimations, useGLTF } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";

/**
 * GLBModel 컴포넌트는 dancer.glb 모델을 렌더링하는 React 컴포넌트입니다.
 * 모델의 메시 오브젝트들에 그림자 캐스팅 및 그림자 수신을 설정합니다.
 * @returns {JSX.Element} GLB 모델의 primitive 요소를 반환합니다.
 */
export const GLBModel = () => {
    const { scene, animations } = useGLTF("/dancer.glb");  // dancer.glb 모델과 애니메이션을 불러옵니다.
    const ref = useRef(null);  // 모델의 참조를 생성합니다.
    const [currentAnimation, setCurrentAnimation] = useState("wave");  // 현재 재생 중인 애니메이션 상태를 관리합니다.

    const { actions } = useAnimations(animations, ref);  // 애니메이션 액션을 가져옵니다.

    useEffect(() => {
        // scene을 traverse하여 모든 메시 오브젝트에 그림자 설정합니다.
        scene.traverse((obj) => {
            if (obj.isMesh) {
                obj.castShadow = true;  // 그림자 캐스팅을 활성화합니다.
                obj.receiveShadow = true;  // 그림자 수신을 활성화합니다.
            }
        });

    }, [actions, scene]);  // 액션이나 scene이 변경될 때마다 실행되도록 useEffect를 설정합니다.

    useEffect(() => {
        // 현재 애니메이션 상태가 변경될 때마다 실행되는 useEffect를 설정합니다.
        actions[currentAnimation].fadeIn(0.5).play();  // 새로운 애니메이션을 페이드 인하고 재생합니다.
        return () => {
            actions[currentAnimation].fadeOut(0.5).stop();  // 이전 애니메이션을 페이드 아웃하고 정지합니다.
        }
    }, [actions, currentAnimation]);

    // GLB 모델을 렌더링하고, 크기와 위치를 설정하여 반환합니다.
    return <primitive
        onClick={() =>
            setCurrentAnimation(prev => {
                if (prev === "wave") return "windmill";
                return "wave";
            })
        }
        onPointerUp={() => {
            console.log("업 !");
        }}
        onPointerDown={() => {
            console.log("다운 !");
        }}
        ref={ref}  // 모델의 참조를 설정합니다.
        scale={0.01}  // 모델의 크기를 조정합니다.
        position-y={0.8}  // 모델의 y축 위치를 설정합니다.
        object={scene}  // 렌더링할 GLTF scene 객체를 지정합니다.
    />;
}
