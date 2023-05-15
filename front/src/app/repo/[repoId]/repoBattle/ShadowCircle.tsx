import { Html } from "@react-three/drei";

export const ShadowCircle = () => {
  return (
    <Html style={{ position: "relative" }}>
      <div
        style={{
          position: "absolute",
          width: "150px",
          height: "20px",
          backgroundColor: "black",
          borderRadius: "50%",
          opacity: "30%",
          top: "-0.5em",
          right: "-27em",
          zIndex: 1,
        }}
      />
    </Html>
  );
};

export default ShadowCircle;
