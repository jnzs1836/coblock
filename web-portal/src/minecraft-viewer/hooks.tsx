import React, { useRef, useState, useEffect, useMemo, useLayoutEffect } from 'react';
import * as THREE from 'three';
import { GUI } from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { MinecraftBlock } from '../types/minecraft';

interface MinecraftViewerState {
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>,
  containerRef: React.MutableRefObject<HTMLDivElement | null>,

  scene: THREE.Scene | null,
  camera: THREE.PerspectiveCamera | null,
  renderer: THREE.WebGLRenderer | null,
};

interface MinecraftViewerActions {
  resetCamera: () => void
}

const MouseMovingDistance = 0.5;

function useRenderer(canvasRef: React.MutableRefObject<HTMLCanvasElement | null>) {
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null);

  useEffect(
    () => {
      if (canvasRef.current) {
        const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current as HTMLCanvasElement, antialias: true });
        setRenderer(renderer);
      }
    }, [canvasRef]
  );

  return { renderer };

}

function useMinecraftViewer(blocks: MinecraftBlock[], enabled?: boolean): [MinecraftViewerState, MinecraftViewerActions] {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  // const [scene, setScene] = useState<THREE.Scene | null>(null);
  // const [camera, setCamera] = useState<THREE.PerspectiveCamera | null>(null);
  // const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null);
  const [mouseDown, setMouseDown] = useState(false);
  const [prevMousePosition, setPrevMousePosition] = useState<{ x: number; y: number } | null>(null);
  const controlsRef = useRef<OrbitControls>();


  const camera = useMemo(() => {
    // const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const camera = new THREE.PerspectiveCamera(10, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    camera.lookAt(0, 0, 0);
    // camera.position.set(10, 10, 10);
    // camera.rotation.set(-Math.PI / 4, 0, 0);


    return camera;
  }, [enabled]);

  useEffect(() => {
    if (canvasRef.current) {
      const controls = new OrbitControls(camera, canvasRef.current);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.rotateSpeed = 0.5;
      controlsRef.current = controls;
    }

  }, [canvasRef.current, enabled]);


  const scene = useMemo(() => new THREE.Scene(), [enabled]);

  const { renderer } = useRenderer(canvasRef);

  const materials: { [key: string]: THREE.MeshBasicMaterial } = {
    red: new THREE.MeshBasicMaterial({ color: 0xff0000 }),
    green: new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
    blue: new THREE.MeshBasicMaterial({ color: 0x0000ff }),
    purple: new THREE.MeshBasicMaterial({ color: 0x6A0DAD }),
    yellow: new THREE.MeshBasicMaterial({ color: 0xFFFF00 }),
    black: new THREE.MeshBasicMaterial({ color: 0x080808 }),
  };

  const [prevBlocks, setPrevBlocks] = useState<Array<MinecraftBlock>>([]);

  useEffect(() => {
    // Create the scene
  }, []);

  useEffect(() => {
    if (canvasRef.current) {
      const { clientWidth, clientHeight } = canvasRef.current;
      // setWidth(clientWidth);
      // setHeight(clientHeight);
      if (renderer) {
        renderer.setSize(clientWidth, clientHeight);
      }
    }
  }, [canvasRef, canvasRef.current, enabled]);
  useEffect(() => {
  }, [canvasRef.current?.clientHeight])
  const addGround = () => {
    // Create a large plane geometry
    const groundGeometry = new THREE.PlaneGeometry(1000, 1000);

    // Create a material for the ground
    const groundMaterial = new THREE.MeshBasicMaterial({ color: 0x8B4513, transparent: true, opacity: 0.5}); // Green, or any color you prefer

    // Create a mesh from the geometry and material
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);

    // Rotate the plane to be parallel to the xz-plane
    ground.rotation.x = -Math.PI / 2;

    // Set the y position to 0
    ground.position.y = -0.5;

    // Add the ground to the scene
    scene.add(ground);
  }

  useEffect(() => {
    if (renderer) {
      renderer.setClearColor(0xffffff);

      // const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
      // scene.add(ambientLight);
      if (camera) {
        // const gui = new GUI()
        // const cameraFolder = gui.addFolder('Camera');
        // cameraFolder.add(camera.position, 'x', 0, 20);
        // cameraFolder.add(camera.position, 'y', 0, 20);
        // cameraFolder.add(camera.position, 'z', 0, 20);

        // cameraFolder.open();
      }
      if (renderer) {
        renderer.setClearColor(0xffffff);

        // const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        // scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.1);
        directionalLight.position.set(1, 1, 1);
        scene.add(directionalLight);
        // const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.6);
        // directionalLight2.position.set(-1, -1, 1);

        // scene.add(directionalLight2);

        const groundGeometry = new THREE.PlaneGeometry(50000, 50000);
        // const groundMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
        // const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        // ground.rotation.x = -Math.PI / 2;
        // scene.add(ground);

        const axisHelper = new THREE.AxesHelper(5);
        // scene.add(axisHelper);
        // addGround()
      }
    }
  }, [renderer, camera]);

  const updateBlockMesh = (block: MinecraftBlock) => {
    const { blockType, pos, uid } = block;
    // const color = mapColorNameToHex(type);
    const blockGeometry = new THREE.BoxGeometry(1, 1, 1);
    const blockMaterial = materials[block.blockType];
    const blockMesh = new THREE.Mesh(blockGeometry, blockMaterial);

    // Create a wireframe geometry from the existing box geometry
    const edges = new THREE.EdgesGeometry(blockGeometry);

    // Create a line material
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 }); // Black

    // Create the wireframe (i.e., the lines)
    const wireframe = new THREE.LineSegments(edges, lineMaterial);

    // Add the wireframe as a child of the blockMesh
    blockMesh.add(wireframe);


    const existingBlock = scene.getObjectByName(`${uid}`);
    if (existingBlock) {
      scene.remove(existingBlock);
    }

    blockMesh.position.set(pos.x, pos.y, pos.z);
    blockMesh.name = `${uid}`;
    scene.add(blockMesh);
  };

  const removeBlockMesh = (block: MinecraftBlock) => {
    const { uid } = block;
    const existingBlock = scene.getObjectByName(`${uid}`);
    if (existingBlock) {
      scene.remove(existingBlock);
    }
  }

  useEffect(() => {
    for (const block of blocks) {
      updateBlockMesh(block);

    }
    for (let block of prevBlocks) {
      if (!blocks.map((b) => b.uid).includes(block.uid)) {
        removeBlockMesh(block);
      }
    }
    setPrevBlocks(blocks);
  }, [blocks, scene, enabled]);



  // useLayoutEffect(() => {
  //   // Create the scene
  //   if(renderer && camera && scene){
  //     blocks.forEach((block) => {
  //       const geometry = new THREE.BoxGeometry(1, 1, 1);
  //       const material = materials[block.blockType];
  //       const cube = new THREE.Mesh(geometry, material);
  //       cube.position.set(block.pos.x, block.pos.y, block.pos.z);
  //       scene.add(cube);
  //     });
  //   }

  // }, [scene, camera, renderer, blocks]);


  useLayoutEffect(() => {
    // Create the scene

    // const scene = new THREE.Scene();
    // setScene(scene);

    if (!camera) {
      // const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      // camera.position.z = 10;
      // setCamera(camera);

    }

    // Create the camera
    // const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current as HTMLCanvasElement });
    // setRenderer(renderer);

    // Create the X-Y-Z axis








    if (camera && renderer && scene) {
      // Create the cube material for each color

      // Create a cube for each block

      const onWindowResize = () => {
        const canvas = canvasRef.current;
        if (canvas && containerRef.current) {
          const clientWidth = containerRef.current.clientWidth;
          const clientHeight = containerRef.current.clientHeight;

          camera.aspect = clientWidth / clientHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(clientWidth, clientHeight);
        }

      }
      window.addEventListener('resize', onWindowResize);
      // Resize the renderer when the window is resized

      ;
      // Handle mouse events for adjusting the view
      const onMouseDown = (event: MouseEvent) => {
        setMouseDown(true);
        setPrevMousePosition({ x: event.clientX, y: event.clientY });
      }
      const onMouseMove = (event: MouseEvent) => {
        if (mouseDown && prevMousePosition && controlsRef.current) {
          const deltaMove = {
            x: event.clientX - prevMousePosition.x,
            y: event.clientY - prevMousePosition.y,
          };
          const deltaRotationQuaternion = new THREE.Quaternion()
            .setFromEuler(new THREE.Euler(toRadians(deltaMove.y * MouseMovingDistance), toRadians(deltaMove.x * MouseMovingDistance), 0, 'XYZ'));
          camera.quaternion.multiplyQuaternions(deltaRotationQuaternion, camera.quaternion);
          setPrevMousePosition({ x: event.clientX, y: event.clientY });
          controlsRef.current.target.set(0, 0, 0);
          camera.lookAt(controlsRef.current.target);
        }
      }
      const onMouseUp = () => {
        setMouseDown(false);
        setPrevMousePosition(null);
      }
      const onMouseLeave = () => {
        setMouseDown(false);
        setPrevMousePosition(null);
      }

      const onWheel = (event: WheelEvent) => {
        event.preventDefault();
        camera.position.z += event.deltaY * 0.1;
      }


      const toRadians = (angle: number) => {
        return angle * (Math.PI / 180);
      }
      canvasRef.current?.addEventListener('mousedown', onMouseDown);
      canvasRef.current?.addEventListener('mousemove', onMouseMove);
      canvasRef.current?.addEventListener('mouseup', onMouseUp);
      canvasRef.current?.addEventListener('mouseleave', onMouseLeave);
      canvasRef.current?.addEventListener('wheel', onWheel);


      // Render the scene
      const render = () => {
        requestAnimationFrame(render);
        renderer.render(scene, camera);
      }
      render();
      return () => {
        window.removeEventListener('resize', onWindowResize);
        canvasRef.current?.removeEventListener('mousedown', onMouseDown);
        canvasRef.current?.removeEventListener('mousemove', onMouseMove);
        canvasRef.current?.removeEventListener('mouseup', onMouseUp);
        canvasRef.current?.removeEventListener('mouseleave', onMouseLeave);
        canvasRef.current?.removeEventListener('wheel', onWheel);

        renderer.dispose();
        // scene.dispose();
      };
    }


    // Create the renderer





    // Clean up the event listener and Three.js objects when the component unmounts

  }, [blocks, mouseDown, prevMousePosition, camera, renderer, enabled]);

  useEffect(() => {
  },
    [canvasRef.current]);



  useEffect(() => {
    if (camera) {

    }

  }, [camera]);

  let state: MinecraftViewerState = {
    canvasRef, scene, camera, renderer, containerRef
  };

  let actions: MinecraftViewerActions = {
    resetCamera: () => {
      if (controlsRef && controlsRef.current) {
        controlsRef.current.target.set(0, 0, 0);
        camera.lookAt(controlsRef.current.target);
        camera.position.z = 5;
        camera.position.y = 0;
        camera.position.x = 0;
      }
    }
  };
  return [state, actions,];
}

export { useMinecraftViewer };