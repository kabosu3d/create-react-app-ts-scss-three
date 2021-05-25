import React from 'react';
import './App.scss';

import * as THREE from "three";

const rend = (canvas: HTMLCanvasElement) => {
  const renderer = new THREE.WebGLRenderer({ canvas: canvas });
  renderer.setSize(800, 600);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(45, 800 / 600, 1, 10000);
  camera.position.set(0, 0, 1000);

  const geometry = new THREE.BoxGeometry(250, 250, 250);
  const material = new THREE.MeshStandardMaterial({ color: 0xffff00 });
  const box = new THREE.Mesh(geometry, material);
  box.position.z = -5;
  scene.add(box);

  const light = new THREE.DirectionalLight(0xffffff);
  light.position.set(1, 1, 1);
  scene.add(light);

  const tick = (): void => {
    requestAnimationFrame(tick);

    box.rotation.x += 0.005;
    box.rotation.y += 0.005;

    renderer.render(scene, camera);
  };
  tick();

  console.log("Hello Three.js");
};

function App() {
  return (
    <div className="App">
      <ThreeView></ThreeView>
    </div>
  );
}

export default App;

class ThreeView extends React.Component<{}> {
  ref: React.RefObject<HTMLCanvasElement>;

  constructor(props: {}) {
    super(props);
    this.ref = React.createRef<HTMLCanvasElement>();
  }

  componentDidMount() {
    rend(this.ref.current!);
  }

  render() {
    return (
      <canvas ref={this.ref} />
    );
  }
}