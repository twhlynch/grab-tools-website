import * as THREE from 'https://unpkg.com/three@0.145.0/build/three.module.js';
import { TransformControls } from 'https://unpkg.com/three@0.145.0/examples/jsm/controls/TransformControls.js';
import { OrbitControls } from 'https://unpkg.com/three@0.145.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@v0.132.0/examples/jsm/loaders/GLTFLoader.js';

let camera, scene, renderer, light, controls, transforms, loader;
let objects = [];

loader = new GLTFLoader();
scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera( 75, window.innerWidth * .8 / window.innerWidth * .8, 0.1, 1000 );
renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize( window.innerWidth * .8, window.innerWidth * .8 );
document.getElementById('visual').appendChild( renderer.domElement );
light = new THREE.AmbientLight(0xffffff);
scene.add(light);
controls = new OrbitControls( camera, renderer.domElement );
controls.mouseButtons = {LEFT: 2, MIDDLE: 1, RIGHT: 0}

addEventListener('resize', () => {
    camera.aspect = window.innerWidth * .8 / window.innerWidth * .6;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth * .8, window.innerWidth * .6 );
});

function loadLevelNode(node, parent) {
    if (node.levelNodeGroup) {
        // let cube = new THREE.Object3D()
        // objects.push( cube );
        // parent.add( cube );
        // cube.position.x = node.levelNodeGroup.position.x
        // cube.position.y = node.levelNodeGroup.position.y
        // cube.position.z = node.levelNodeGroup.position.z
        // cube.scale.x = node.levelNodeGroup.scale.x
        // cube.scale.y = node.levelNodeGroup.scale.y
        // cube.scale.z = node.levelNodeGroup.scale.z
        // cube.quaternion.x = node.levelNodeGroup.rotation.x
        // cube.quaternion.y = node.levelNodeGroup.rotation.y
        // cube.quaternion.z = node.levelNodeGroup.rotation.z
        // cube.quaternion.w = node.levelNodeGroup.rotation.w
        // console.log(node.levelNodeGroup.childNodes);
        node.levelNodeGroup.childNodes.forEach(node => {
            loadLevelNode(node, scene/*cube*/)
        });
    } else if (node.levelNodeStatic) { 
        node = node.levelNodeStatic;
        var geometry = new THREE.BoxGeometry(1, 1, 1);
        let texture = new THREE.TextureLoader().load( 'textures/default.png' );
        let material = new THREE.MeshBasicMaterial( { map: texture } );
        var cube = new THREE.Mesh(geometry, material);
        node.position.x ? cube.position.x = node.position.x : cube.position.x = 0;
        node.position.y ? cube.position.y = node.position.y : cube.position.y = 0;
        node.position.z ? cube.position.z = node.position.z : cube.position.z = 0;
        node.rotation.w ? cube.quaternion.w = node.rotation.w : cube.quaternion.w = 1;
        node.rotation.x ? cube.quaternion.x = node.rotation.x : cube.quaternion.x = 0;
        node.rotation.y ? cube.quaternion.y = node.rotation.y : cube.quaternion.y = 0;
        node.rotation.z ? cube.quaternion.z = node.rotation.z : cube.quaternion.z = 0;
        node.scale.x ? cube.scale.x = node.scale.x : cube.scale.x = 1;
        node.scale.y ? cube.scale.y = node.scale.y : cube.scale.y = 1;
        node.scale.z ? cube.scale.z = node.scale.z : cube.scale.z = 1;
        parent.add(cube);
        objects.push(cube);
    } else if (node.levelNodeCrumbling) {
        node = node.levelNodeCrumbling;
        var geometry = new THREE.BoxGeometry(1, 1, 1);
        let texture = new THREE.TextureLoader().load( 'textures/grabbable_crumbling.png' );
        let material = new THREE.MeshBasicMaterial( { map: texture } );
        var cube = new THREE.Mesh(geometry, material);
        node.position.x ? cube.position.x = node.position.x : cube.position.x = 0;
        node.position.y ? cube.position.y = node.position.y : cube.position.y = 0;
        node.position.z ? cube.position.z = node.position.z : cube.position.z = 0;
        node.rotation.w ? cube.quaternion.w = node.rotation.w : cube.quaternion.w = 1;
        node.rotation.x ? cube.quaternion.x = node.rotation.x : cube.quaternion.x = 0;
        node.rotation.y ? cube.quaternion.y = node.rotation.y : cube.quaternion.y = 0;
        node.rotation.z ? cube.quaternion.z = node.rotation.z : cube.quaternion.z = 0;
        node.scale.x ? cube.scale.x = node.scale.x : cube.scale.x = 1;
        node.scale.y ? cube.scale.y = node.scale.y : cube.scale.y = 1;
        node.scale.z ? cube.scale.z = node.scale.z : cube.scale.z = 1;
        parent.add(cube);
        objects.push(cube);
    }
}

function loadScene() {
    let data = JSON.parse(document.getElementById('out').value);
    let levelNodes = data["levelNodes"];
    console.log(levelNodes);

    objects = [];

    levelNodes.forEach((node) => {
        loadLevelNode(node, scene);
    });
    renderer.render( scene, camera );
}
loadScene();
document.getElementById('out').addEventListener('change', loadScene);
document.getElementById('refresh').addEventListener('click', loadScene);
document.getElementById('functions').addEventListener('click', (e) => {
    if (e.target.nodeName == 'INPUT') {
        loadScene();
    }
});
camera.position.set(0, 10, 10);

function animate() {
	requestAnimationFrame( animate );

	renderer.render( scene, camera );
}

animate();