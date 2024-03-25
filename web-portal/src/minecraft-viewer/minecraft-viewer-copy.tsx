import React, { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { MinecraftBlock } from "../types/minecraft";

interface MinecraftViewerProps {
  blocks: MinecraftBlock[];
}

const MinecraftViewer: React.FC<MinecraftViewerProps> = ({ blocks }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scene, setScene] = useState<THREE.Scene | null>(null);
  const [camera, setCamera] = useState<THREE.PerspectiveCamera | null>(null);
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null);
  const [mouseDown, setMouseDown] = useState(false);
  const [prevMousePosition, setPrevMousePosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => { }, []);

  useEffect(() => {
    // Create the scene

    const scene = new THREE.Scene();
    setScene(scene);

    if (!camera) {
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      //   camera.position.z = 5;
      setCamera(camera);
    }
    // Create the camera
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current as HTMLCanvasElement,
    });
    setRenderer(renderer);

    // Create the X-Y-Z axis
    const axisHelper = new THREE.AxesHelper(5);
    scene.add(axisHelper);

    renderer.setClearColor(0xffffff);

    // const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    // scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    if (camera && renderer && scene) {
      // Create the cube material for each color
      const materials: { [key: string]: THREE.MeshBasicMaterial } = {
        red: new THREE.MeshBasicMaterial({ color: 0xff0000 }),
        green: new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
        blue: new THREE.MeshBasicMaterial({ color: 0x0000ff }),
      };

      // Create a cube for each block
      blocks.forEach((block) => {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = materials[block.blockType];
        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(block.pos.x, block.pos.y, block.pos.z);
        scene.add(cube);
      });
      const onWindowResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener("resize", onWindowResize);
      // Resize the renderer when the window is resized

      // Handle mouse events for adjusting the view
      const onMouseDown = (event: MouseEvent) => {
        setMouseDown(true);
        setPrevMousePosition({ x: event.clientX, y: event.clientY });
      };
      const onMouseMove = (event: MouseEvent) => {
        if (mouseDown && prevMousePosition) {
          const deltaMove = {
            x: event.clientX - prevMousePosition.x,
            y: event.clientY - prevMousePosition.y,
          };
          const deltaRotationQuaternion = new THREE.Quaternion().setFromEuler(
            new THREE.Euler(
              toRadians(deltaMove.y * 1),
              toRadians(deltaMove.x * 1),
              0,
              "XYZ"
            )
          );
          camera.quaternion.multiplyQuaternions(
            deltaRotationQuaternion,
            camera.quaternion
          );
          setPrevMousePosition({ x: event.clientX, y: event.clientY });
        }
      };
      const onMouseUp = () => {
        setMouseDown(false);
        setPrevMousePosition(null);
      };
      const onMouseLeave = () => {
        setMouseDown(false);
        setPrevMousePosition(null);
      };

      const onWheel = (event: WheelEvent) => {
        event.preventDefault();
        camera.position.z += event.deltaY * 0.1;
      };

      const toRadians = (angle: number) => {
        return angle * (Math.PI / 180);
      };
      canvasRef.current?.addEventListener("mousedown", onMouseDown);
      canvasRef.current?.addEventListener("mousemove", onMouseMove);
      canvasRef.current?.addEventListener("mouseup", onMouseUp);
      canvasRef.current?.addEventListener("mouseleave", onMouseLeave);
      canvasRef.current?.addEventListener("wheel", onWheel);

      // Render the scene
      const render = () => {
        requestAnimationFrame(render);
        renderer.render(scene, camera);
      };
      render();
      return () => {
        window.removeEventListener("resize", onWindowResize);
        canvasRef.current?.removeEventListener("mousedown", onMouseDown);
        canvasRef.current?.removeEventListener("mousemove", onMouseMove);
        canvasRef.current?.removeEventListener("mouseup", onMouseUp);
        canvasRef.current?.removeEventListener("mouseleave", onMouseLeave);
        canvasRef.current?.removeEventListener("wheel", onWheel);
        renderer.dispose();
        // scene.dispose();
      };
    }

    // Create the renderer

    // Clean up the event listener and Three.js objects when the component unmounts
  }, [blocks, mouseDown, prevMousePosition]);
  useEffect(() => {
    if (camera) {
      camera.position.z = 5;
    }
  }, [camera]);

  useEffect(() => { }, [scene, camera, renderer]);

  return <canvas ref={canvasRef} />;

};

export default MinecraftViewer;
