if (!window.requestAnimationFrame) {
	window.requestAnimationFrame = (function() {
		return window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msReuqestAnimationFrame ||
		function(/* function FrameRequestCallback */
			callback, /* function DOM element */ element) {
			window.setTimeout (callback, 1000/60);
		};
	})();
}

var Game = {};

Game.init = function () {
	//set scene size
	var WIDTH = window.innerWidth, HEIGHT = window.innerHeight;

	//camera attributes
	var VIEW_ANGLE = 45, ASPECT = WIDTH / HEIGHT,
		NEAR = 0.1, FAR = 10000;

	//create WebGL renderer, camera, and scene
	//console.log("renderer");
	Game.renderer = new THREE.WebGLRenderer();
	//console.log("end renderer");
	Game.camera = new THREE.PerspectiveCamera(VIEW_ANGLE,
												ASPECT,
												NEAR,
												FAR);

	Game.scene = new THREE.Scene();

	//camera starts at 0,0,0 so we need to move it
	Game.camera.position.z = 600;
	Game.scene.add(Game.camera);

	//start renderer
	Game.renderer.setSize(WIDTH,HEIGHT);

	//console.log("appending child");
	//attach render DOM element
	document.body.appendChild(Game.renderer.domElement);

	var boundingBoxConfig = {
		width: 360, height: 360, depth: 1200,
		splitX: 6, splitY: 6, splitZ: 20
	};

	//setup surrounding box
	Game.boundingBoxConfig = boundingBoxConfig;
	Game.blockSize = boundingBoxConfig.width/boundingBoxConfig.height;

	var boundingBox = new THREE.Mesh(
		new THREE.CubeGeometry(
			boundingBoxConfig.width, boundingBoxConfig.height,
			boundingBoxConfig.depth, boundingBoxConfig.splitX,
			boundingBoxConfig.splitY, boundingBoxConfig.splitZ),
		new THREE.MeshBasicMaterial( {color: 0xffaa00, wireframe: true})
		);
	Game.scene.add(boundingBox);

	//render box
	Game.renderer.render(Game.scene, Game.camera);

	//add render stats
	Game.stats = new Stats();
	Game.stats.domElement.style.position = 'absolute';
	Game.stats.domElement.style.top = '10px';
	Game.stats.domElement.style.left = '10px';
	document.body.appendChild 

	document.getElementById("play_button").addEventListener('click', function(event) {
		event.preventDefault();
		Game.start();
	});
};

//starts game
Game.start = function () {
	document.getElementById("menu").style.display = "none";
	Game.pointsDOM = document.getElementById("points");
	Game.pointsDOM.style.display = "block";

	Game.animate();
};

//time variables in ms
Game.gameStepTime = 1000;

Game.frameTime = 0;
Game.cumulatedFrameTime = 0;
Game._lastFrameTime = Date.now(); //timestamp

Game.gameOver = false;

Game.animate = function() {
	var time = Date.now();
	Game.frameTime = time - Game._lastFrameTime;
	Game._lastFrameTime = time;
	Game.cumulatedFrameTime += Game.frameTime;

	while (Game.cumulatedFrameTime > Game.gameStepTime) {
		//block movement
		Game.cumulatedFrameTime -= Game.gameStepTime;
	}

	Game.renderer.render(Game.scene, Game.camera);

	Game.stats.update();

	if (!Game.gameOver) {
		window.requestAnimationFrame(Game.animate);
	}
}

Game.staticBlocks = [];
Game.zColors = [
  0x6666ff, 0x66ffff, 0xcc68EE, 0x666633, 0x66ff66, 0x9966ff, 0x00ff66, 0x66EE33, 0x003399, 0x330099, 0xFFA500, 0x99ff00, 0xee1289, 0x71C671, 0x00BFFF, 0x666633, 0x669966, 0x9966ff
];
Game.addStaticBlock = function(x,y,z) {
  if(Game.staticBlocks[x] === undefined) Game.staticBlocks[x] = [];
  if(Game.staticBlocks[x][y] === undefined) Game.staticBlocks[x][y] = [];
 
  var mesh = THREE.SceneUtils.createMultiMaterialObject(new THREE.CubeGeometry( Game.blockSize, Game.blockSize, Game.blockSize), [
    new THREE.MeshBasicMaterial({color: 0x000000, shading: THREE.FlatShading, wireframe: true, transparent: true}),
    new THREE.MeshBasicMaterial({color: Game.zColors[z]}) 
  ] );
     
  mesh.position.x = (x - Game.boundingBoxConfig.splitX/2)*Game.blockSize + Game.blockSize/2;
  mesh.position.y = (y - Game.boundingBoxConfig.splitY/2)*Game.blockSize + Game.blockSize/2;
  mesh.position.z = (z - Game.boundingBoxConfig.splitZ/2)*Game.blockSize + Game.blockSize/2;
  mesh.overdraw = true;
     
  Game.scene.add(mesh);   
  Game.staticBlocks[x][y][z] = mesh;
};

Game.currentPoints = 0;
Game.addPoints = function(n) {
	Game.currentPoints += n;
	Game.pointsDOM.innerHTML = Game.currentPoints;
	Cufon.replace('#points');
}

window.addEventListener("load", Game.init);