import { Box, Circle, Cone, Cylinder, Plane, Sphere, Torus, TorusKnot } from "@react-three/drei";
import * as THREE from "three";

export const Meshes = () => {
  return (
    <>
      {/* <mesh >
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color={0xff0000} />
      </mesh> */}
      {/* 아래로 하면 성능, 코드가 더 향샹된 것이다. 아래는 버퍼에서 사용해서 성능이 더 좋다함 */}
      <Plane args={[40, 40]} rotation-x={-Math.PI / 2}
        receiveShadow>
        <meshStandardMaterial />
      </Plane>
      {/* <Box args={[1, 1, 1]} castShadow position-y={0.5}>
        <meshStandardMaterial color={0xff0000} />
      </Box>
      <Sphere args={[1]} position={[0, 1, 3]} material-color={0xffff00} />
      <Circle args={[1]}
        position={[0, 1, -3]}
        material-color={"violet"}
        material-side={THREE.DoubleSide}
      />
      <Cone
        args={[1, 2]}
        position={[3, 1, 3]}
        material-color={"brown"}
      />
      <Cylinder
        args={[2, 1, 2]} position={[3, 1, -3]}
        material-color={"pink"}
      />
      <Torus
        args={[1, 0.2]}
        position={[-3, 1.2, -3]}
        material-color={"hotpink"}
      /> */}
      <TorusKnot args={[1, 0.2, 128, 128, 2, 3]}

        position={[-3, 1.6, 0]}
        material-color={'teal'}
        castShadow
        receiveShadow>
        <meshStandardMaterial
          color={0xff0000}
          roughness={0.5}
          metalness={1}
        />
      </TorusKnot>
      <TorusKnot args={[1, 0.2, 128, 128, 2, 3]}

        position={[-7, 1.6, 0]}
        material-color={'teal'}
        castShadow
        receiveShadow>
        <meshLambertMaterial
          color={0x0abff0}
          emissive={0xff0000}
          emissiveIntensity={0.5}
        />
      </TorusKnot>
      <TorusKnot args={[1, 0.2, 128, 128, 2, 3]}

        position={[-11, 1.6, 0]}
        material-color={'teal'}
        castShadow
        receiveShadow>
        <meshPhongMaterial
          color={0xff0000}
          emissive={0x00ff00}
          emissiveIntensity={0.5}
          specular={0x0000ff}
          shininess={100}
        />
      </TorusKnot>
      <TorusKnot args={[1, 0.2, 128, 128, 2, 3]}

        position={[-15, 1.6, 0]}
        material-color={'teal'}
        castShadow
        receiveShadow>
        <meshDepthMaterial opacity={0.5}
        />
      </TorusKnot>


    </>
  );
}