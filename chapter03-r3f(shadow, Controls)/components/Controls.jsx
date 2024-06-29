import { FirstPersonControls, FlyControls, OrbitControls, PointerLockControls, TrackballControls } from "@react-three/drei";

export const Controls = () => {
    return (
        // <OrbitControls enableDamping
        // dampingFactor={0.03}
        // enableZoom
        // enablePan 
        // // autoRotate
        // // autoRotateSpeed={1}
        // // maxPolarAngle={Math.PI/2} // 위로는 pi/2 회전제한
        // // minPolarAngle={Math.PI/4} // 위로는 pi/4 회전제한
        // // maxAzimuthAngle={Math.PI/2} // 좌우 회전 각도제한
        // // minAzimuthAngle={-Math.PI/2} // 좌우 회전 각도제한
        // />
        // <FlyControls
        // movementSpeed={1}
        // rollSpeed={Math.PI/20}
        // autoForward = {false}/>

        // <FirstPersonControls
        //     lookSpeed={0.1}
        //     movementSpeed={1}
        //     lookVertical={false}
        // />

        // <PointerLockControls />

        <TrackballControls
            rotateSpeed={2}
            zoomSpeed={1.5}
            panSpeed={0.5}
            noRotate={true}
            noZoom={false}
            noPan={false}
            staticMoving={false}
            dynamicDampingFactor={0.05}
        />
    );
}