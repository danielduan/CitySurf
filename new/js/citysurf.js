var CitySurf = {};

CitySurf.resize = function() {
	CitySurf.config.WIDTH = window.innerWidth;
	CitySurf.config.HEIGHT = window.innerHeight;

	CitySurf.config.ASPECT = CitySurf.config.WIDTH/CitySurf.config.HEIGHT;
}

CitySurf.init = function () {
	//initialize values
	CitySurf.config = {};
	CitySurf.resize();

	//camera attributes
	CitySurf.config.VIEW_ANGLE = 45;
	CitySurf.config.NEAR = 0.1;
	CitySurf.config.FAR = 10000;

	//create webgl renderer camera and scene
	CitySurf.renderer = new THREE.WebGLRenderer();

	CitySurf.camera = new THREE.PerspectiveCamera(
		CitySurf.config.VIEW_ANGLE, CitySurf.config.ASPECT,
		CitySurf.config.NEAR, CitySurf.config.FAR);

	CitySurf.scene = new THREE.Scene();

	CitySurf.camera.position.z = 600;
	CitySurf.scene.add(CitySurf.camera);

	CitySurf.renderer.setSize(CitySurf.config.WIDTH,
		CitySurf.config.HEIGHT);

	//attach dom element
	document.body.appendChild(CitySurf.renderer.domElement);

	var boundingBoxConfig = {
		width: 360, height: 360, depth: 1200,
		splitX: 6, splitY: 6, splitZ: 20
	};

	//setup surrounding box
	CitySurf.boundingBoxConfig = boundingBoxConfig;
	CitySurf.blockSize = boundingBoxConfig.width/boundingBoxConfig.height;

	//bounding box object
	var boundingBox = new THREE.Mesh(
		new THREE.CubeGeometry(
			boundingBoxConfig.width, boundingBoxConfig.height,
			boundingBoxConfig.depth, boundingBoxConfig.splitX,
			boundingBoxConfig.splitY, boundingBoxConfig.splitZ),
		new THREE.MeshBasicMaterial( {color: 0xffaa00, wireframe: true})
		);
	CitySurf.scene.add(boundingBox);

	//render box
	CitySurf.renderer.render(CitySurf.scene, CitySurf.camera);

	//add render stats
	CitySurf.stats = new Stats();
	CitySurf.stats.domElement.style.position = 'absolute';
	CitySurf.stats.domElement.style.top = '10px';
	CitySurf.stats.domElement.style.left = '10px';
	document.body.appendChild 

	document.getElementById("play_button").addEventListener('click', function(event) {
		event.preventDefault();
		CitySurf.start();
	});
}

//starts CitySurf
CitySurf.start = function () {
	document.getElementById("menu").style.display = "none";
	CitySurf.pointsDOM = document.getElementById("points");
	CitySurf.pointsDOM.style.display = "block";

	CitySurf.animate();
};

//Rendering stuff

//time variables in ms
CitySurf.CitySurfStepTime = 1000;

CitySurf.frameTime = 0;
CitySurf.cumulatedFrameTime = 0;
CitySurf._lastFrameTime = Date.now(); //timestamp

CitySurf.CitySurfOver = false;

CitySurf.animate = function() {
	var time = Date.now();
	CitySurf.frameTime = time - CitySurf._lastFrameTime;
	CitySurf._lastFrameTime = time;
	CitySurf.cumulatedFrameTime += CitySurf.frameTime;

	while (CitySurf.cumulatedFrameTime > CitySurf.CitySurfStepTime) {
		//block movement
		CitySurf.cumulatedFrameTime -= CitySurf.CitySurfStepTime;
	}

	CitySurf.renderer.render(CitySurf.scene, CitySurf.camera);

	CitySurf.stats.update();

	if (!CitySurf.CitySurfOver) {
		window.requestAnimationFrame(CitySurf.animate);
	}
}

CitySurf.currentPoints = 0;
CitySurf.addPoints = function(n) {
	CitySurf.currentPoints += n;
	CitySurf.pointsDOM.innerHTML = CitySurf.currentPoints;
	Cufon.replace('#points');
}

window.addEventListener("load", CitySurf.init);