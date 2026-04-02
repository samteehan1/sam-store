import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export function initViewer(canvas, options = {}) {
  const {
    cameraPosition = [0, 0.5, 3],
    fov = 35,
    enableZoom = false,
    autoRotate = true,
    autoRotateSpeed = 1.5,
    minPolarAngle = Math.PI * 0.3,
    maxPolarAngle = Math.PI * 0.7,
    modelSize = 1.67,
  } = options;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(fov, 1, 0.1, 100);
  camera.position.set(cameraPosition[0], cameraPosition[1], cameraPosition[2]);

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.enableRotate = true;
  controls.enablePan = false;
  controls.enableZoom = enableZoom;
  controls.autoRotate = autoRotate;
  controls.autoRotateSpeed = autoRotateSpeed;
  controls.minPolarAngle = minPolarAngle;
  controls.maxPolarAngle = maxPolarAngle;

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
  dirLight.position.set(3, 5, 4);
  scene.add(dirLight);

  const fillLight = new THREE.DirectionalLight(0xffffff, 0.6);
  fillLight.position.set(-3, 2, -2);
  scene.add(fillLight);

  const loader = new GLTFLoader();
  loader.load(
    '/snowboardbrazuca.glb',
    (gltf) => {
      const model = gltf.scene;

      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = modelSize / maxDim;
      model.scale.setScalar(scale);
      model.position.sub(center.multiplyScalar(scale));

      scene.add(model);
      controls.target.set(0, 0, 0);
      controls.update();
    },
    undefined,
    (err) => console.error('GLB load error:', err)
  );

  function resize() {
    const parent = canvas.parentElement;
    const w = parent.clientWidth;
    const h = parent.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  let animationFrameId = null;
  let isDisposed = false;

  function animate() {
    if (isDisposed) return;
    animationFrameId = requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }

  window.addEventListener('resize', resize);
  resize();
  animate();

  return () => {
    isDisposed = true;
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    window.removeEventListener('resize', resize);
    controls.dispose();
    renderer.dispose();
  };
}
