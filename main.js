const THREE = window.MINDAR.IMAGE.THREE;
import {loadGLTF, loadAudio} from "./libs/loader.js";

document.addEventListener('DOMContentLoaded', () => {
	const start = async() => {
		const mindarThree = new window.MINDAR.IMAGE.MindARThree({
			container: document.body,
			imageTargetSrc: './lmn.mind',
			maxTrack: 3,
		});
		
		const {renderer, scene, camera} = mindarThree;
		
		const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
		scene.add(light);		

		const airplane = await loadGLTF("./airplane/scene.gltf");
		airplane.scene.scale.set(0.3, 0.3, 0.3);
		airplane.scene.position.set(0, -0.5, 0);
		
		const airplaneMixer = new THREE.AnimationMixer(airplane.scene);
		const airplaneAction = airplaneMixer.clipAction(airplane.animations[0]);
		airplaneAction.play();
		
		const airplaneAclip = await loadAudio("./sound/airplane.mp3");
		const airListener = new THREE.AudioListener();
		const airplaneAudio = new THREE.PositionalAudio(airListener);	
			
		const ball = await loadGLTF("./ball/scene.gltf");
		ball.scene.scale.set(18, 18, 18);
		ball.scene.position.set(0, -0.3, 0);
		
		const ballAclip = await loadAudio("./sound/ball.mp3");
		const ballListener = new THREE.AudioListener();
		const ballAudio = new THREE.PositionalAudio(ballListener);	
		
		
		const car = await loadGLTF("./car/scene.gltf");
		car.scene.scale.set(8, 8, 8);
		car.scene.position.set(0, -0.5, 0);
		
		const carAclip = await loadAudio("./sound/car.mp3");
		const carListener = new THREE.AudioListener();
		const carAudio = new THREE.PositionalAudio(carListener);	
		
		
		const airplaneAnchor = mindarThree.addAnchor(0);
		airplaneAnchor.group.add(airplane.scene);
		camera.add(airListener);
		airplaneAudio.setRefDistance(100);
		airplaneAudio.setBuffer(airplaneAclip);
		airplaneAudio.setLoop(true);
		airplaneAnchor.group.add(airplaneAudio)
		
		airplaneAnchor.onTargetFound = () => {
			airplaneAudio.play();
		}
		
		airplaneAnchor.onTargetLost = () => {
			airplaneAudio.pause();
		}
		
		const ballAnchor = mindarThree.addAnchor(1);
		ballAnchor.group.add(ball.scene);
		camera.add(ballListener);
		ballAudio.setRefDistance(100);
		ballAudio.setBuffer(ballAclip);
		ballAudio.setLoop(true);
		ballAnchor.group.add(ballAudio)
		
		ballAnchor.onTargetFound = () => {
			ballAudio.play();
		}
		ballAnchor.onTargetLost = () => {
			ballAudio.pause();
		}
		
		
		const carAnchor = mindarThree.addAnchor(2);
		carAnchor.group.add(car.scene);
		camera.add(carListener);
		carAudio.setRefDistance(100);
		carAudio.setBuffer(carAclip);
		carAudio.setLoop(true);
		carAnchor.group.add(carAudio)
		
		carAnchor.onTargetFound = () => {
			carAudio.play();
		}
		carAnchor.onTargetLost = () => {
			carAudio.pause();
		}
		
		const clock = new THREE.Clock();
		
		await mindarThree.start();		
		
		renderer.setAnimationLoop(() => {
			const delta = clock.getDelta();
			airplaneMixer.update(delta);
			ball.scene.rotation.set(0, ball.scene.rotation.y + delta, 0);
			car.scene.rotation.set(0, car.scene.rotation.y + delta, 0);
			renderer.render(scene, camera);
		});
	}
	start();
	
});