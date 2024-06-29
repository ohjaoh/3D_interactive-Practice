import { Plane, TorusKnot } from "@react-three/drei";
import * as THREE from "three";

export const Meshes = () => {
  return (
    <>
            <Plane args={[40, 40]} rotation-x={-Math.PI / 2}
        receiveShadow>
        <meshStandardMaterial />
      </Plane>
      {/* <TorusKnot args={[1, 0.2, 128, 128, 2, 3]}

        position={[-0, 1.6, 0]}
        material-color={'teal'}
        castShadow
        receiveShadow>
        <meshStandardMaterial
          color={0xff0000}
        />
      </TorusKnot> */}
    </>
  );
}