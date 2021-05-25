import React from 'react';
import './App.scss';
import * as THREE from 'three';
import { PerspectiveCamera } from 'three/src/cameras/PerspectiveCamera';
import { Vector2 } from 'three/src/math/Vector2';

function App() {
  return (
    <div className="App" style={{ backgroundColor: "yellow", height: "100vh", width: "100vw" }}>
      <ThreeView></ThreeView>
    </div>
  );
}

export default App;

class ThreeView extends React.Component<{}> {
  ref: React.RefObject<HTMLCanvasElement>;
  listener?: (this: Window, ev: MouseEvent) => any;

  constructor(props: {}) {
    super(props);
    this.ref = React.createRef<HTMLCanvasElement>();
  }

  componentDidMount() {
    const canvas = new Canvas(this.ref.current!)
    this.listener = (e) => {
      canvas.mouseMoved(e.clientX, e.clientY);
    }
    window.addEventListener('mousemove', this.listener);
  }

  componentWillUnmount() {
    if (this.listener != null) {
      window.removeEventListener('mousemove', this.listener);
    }
  }

  render() {
    return (
      <canvas ref={this.ref} style={{ backgroundColor: "blue", height: "50%", width: "50%" }} />
    );
  }
}

export class Canvas {

  mouse: Vector2;
  w: number;
  h: number;
  renderer: THREE.WebGLRenderer;
  camera: PerspectiveCamera;
  scene: THREE.Scene;
  light: THREE.PointLight
  mesh: THREE.Mesh

  constructor(element: HTMLCanvasElement) {
    // elementIdのついたDOM要素を取得
    const rect = element.getBoundingClientRect();

    // マウス座標
    this.mouse = new Vector2(0, 0);

    // ウインドウに合わせている
    this.w = rect.width;
    this.h = rect.height;

    // レンダラ: カメラで撮影した3Dモデルを画面に表示するためのもの
    // データを所定の形式によって処理し、描画するシステムのこと
    this.renderer = new THREE.WebGLRenderer({ canvas: element }
    );

    // レンダラが描画サイズを決める
    this.renderer.setSize(this.w, this.h);
    // レンダラが解像度を決める windowからデバイス解像度をとって設定している
    this.renderer.setPixelRatio(window.devicePixelRatio);

    const fov = 60;
    const fovRad = (fov / 2) * (Math.PI / 180);// 視野角をラジアンに変換
    const dist = (this.h / 2) / Math.tan(fovRad);// ウィンドウぴったりのカメラ距離    

    // カメラを作成
    this.camera = new PerspectiveCamera(
      fov /* 視野角 大きいほど広い範囲が表示される これは度数法で指定する radianではない  */,
      this.w / this.h /* アスペクト比　widthとheightの比にしないと画面が歪む */,
      1 /* カメラに映る最短距離 */,
      // https://threejsfundamentals.org/threejs/lessons/ja/threejs-fundamentals.html
      // ここの上下の値より前、または後の要素はクリップされ、描画されない。
      dist * 2 /*カメラに映る最遠距離 */);
    // これら4つの設定は「錐台」を決める。

    // ちなみにthree.jsの1単位は1mである。

    // カメラの位置
    this.camera.position.z = dist;

    // シーンを作成
    this.scene = new THREE.Scene();

    // ライトを作成
    this.light = new THREE.PointLight(0x0000ff /** ライトの色 */);
    // 他、ライトの種類 https://matorel.com/archives/503
    this.light.position.set(200, 200, 200)// ライトの位置を設定

    // ライトをシーンに追加
    this.scene.add(this.light);

    // 立方体のジオメトリを作成(幅, 高さ, 奥行き)
    const geo = new THREE.BoxGeometry(150, 150, 150);

    // THREE.jsのプリミティブ
    // https://threejsfundamentals.org/threejs/lessons/ja/threejs-primitives.html

    // マテリアルを作成
    const mat = new THREE.MeshLambertMaterial({ color: 0xff00ff });

    // ジオメトリとマテリアルからメッシュを作成
    this.mesh = new THREE.Mesh(geo, mat);
    this.mesh.rotation.x = Math.PI / 4;
    this.mesh.rotation.y = Math.PI / 4;

    // メッシュをシーンに追加
    this.scene.add(this.mesh);

    this.render();
  }

  render() {
    // 次のフレームを要求
    requestAnimationFrame(() => { this.render(); });

    // ミリ秒から秒に変換
    const sec = performance.now() / 1000;

    // 1秒で45°回転する
    this.mesh.rotation.x = sec * (Math.PI / 4);
    this.mesh.rotation.y = sec * (Math.PI / 4);
    this.mesh.position.x = sec * 0.4
      ;
    // 画面に表示
    this.renderer.render(this.scene, this.camera);
  }

  mouseMoved(x: number, y: number) {
    this.mouse.x = x - (this.w / 2);// 原点を中心に
    this.mouse.y = -y + (this.h / 2);// 軸を反転

    // ライトの xy座標 をマウス位置にする
    this.light.position.x = this.mouse.x;
    this.light.position.y = this.mouse.y;
  }
};
