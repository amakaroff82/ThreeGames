(function(){

	var speed = 0;
	var rotationSpeed = 0;
	
	var objects = [];

	var keyboard = new KeyboardState();	
	var clock = new THREE.Clock();

	var stats = new Stats();
	stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
	document.body.appendChild( stats.dom );

	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
	
	
	var renderer = new THREE.WebGLRenderer();
	renderer.setClearColor( 0xffffff, 1);
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
		
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
	
	var geometry = new THREE.PlaneGeometry( 1000, 1000 );
	var texture = THREE.ImageUtils.loadTexture( 'ground.jpg' );
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set( 32, 32 );

	var material = new THREE.MeshPhongMaterial(  {  map : texture, color: 0xdddddd, specular: 0x999999, shininess: 15, shading: THREE.FlatShading} );
	
	var groundMesh = new THREE.Mesh( geometry, material );
	groundMesh.receiveShadow = true;
	
	groundMesh.rotation.x = - Math.PI / 2;

	objects.push(groundMesh);
	scene.add( groundMesh );

	camera.position.z = 24;
	camera.position.y = 1;
	
	
	var direction = 1;
	
	 addLights();
	
	function addLights() {
		
	/*	var ambLight = new THREE.AmbientLight(0x404040);
		scene.add(ambLight);
	*/
		var dirLight = new THREE.DirectionalLight(0xffffff, 1);
		dirLight.position.set(0, 50, 50);
		dirLight.castShadow = true;
		dirLight.shadow.mapSize.width = 1024;  // default 512
		dirLight.shadow.mapSize.height = 1024; // default 512
		dirLight.shadow.camera.near = 2;       // default 0.5
		dirLight.shadow.camera.far = 500;      // default 500

		dirLight.shadow.camera.left = 500;      // default 500



		scene.add(dirLight);
	}
	
	function update()
	{
		keyboard.update();

		var moveDistance = 0.05 * clock.getDelta(); 
		
		if(rotationSpeed > 0){
			rotationSpeed -= (moveDistance/1.5);
			if(rotationSpeed < 0){
				rotationSpeed = 0;
			}
		}
		else if(rotationSpeed < 0){
			rotationSpeed += (moveDistance/1.5);
			if(rotationSpeed > 0){
				rotationSpeed = 0;
			}
		}
		else{
			rotationSpeed = 0;
		}
						
		if(speed > 0){
			speed -= (moveDistance/2);
			if(speed < 0)
				speed = 0;
		}
		if(speed < 0){
			speed += (moveDistance/2);
			if(speed > 0)
				speed = 0;
		}		

		if ( keyboard.pressed("up") ) {
			speed += moveDistance;
		}
			
		if ( keyboard.pressed("down") ) {
			speed -= moveDistance;
			direction = -1;
		}

		if ( keyboard.up("down") ) {
			speed -= moveDistance;
			direction = 1;
		}

		if ( keyboard.pressed("left") ){	
			if(speed != 0){
				rotationSpeed -= moveDistance * direction;
			}
		}
			
		if ( keyboard.pressed("right") ){
			if(speed != 0){
				rotationSpeed += moveDistance * direction;
			}
		}

		if ( keyboard.down("space") ){
		}

		
		var speedOffset = 1;
		var rotationSpeedOffset = 0.1;

		if(speed > speedOffset)
			speed = speedOffset;

		if(speed < -speedOffset)
			speed = -speedOffset;

		if(rotationSpeed > rotationSpeedOffset)
			rotationSpeed = rotationSpeedOffset;

		if(rotationSpeed < -rotationSpeedOffset)
			rotationSpeed = -rotationSpeedOffset;
		
		
		camera.rotation.y -= (rotationSpeed);

		var angle1 = Math.sin(camera.rotation.y);
		var angle2 = Math.cos(camera.rotation.y);
		
		//console.log(camera.rotation.y + " > " + angle1 + " : " + angle2);
		
			
		camera.position.z -= speed * angle2;
		camera.position.x -= speed * angle1;
		
	}

		
	function generateBox(){
		var box = new THREE.TorusGeometry( 5, 1.5, 0.1, 30);

			var boxMaterial = new THREE.MeshPhysicalMaterial(  { color: new THREE.Color(Math.random(), Math.random(), Math.random()) } );

		var boxMesh = new THREE.Mesh( box, boxMaterial );
		
		boxMesh.position.y = Math.random() * 2 - 0.5;
		boxMesh.position.x = Math.random() * 1000 - 500;
		boxMesh.position.z = Math.random() * 1000 - 500;
		
		boxMesh.rotation.x = Math.random() * Math.PI * 2;
		boxMesh.rotation.y = Math.random() * Math.PI * 2;
		boxMesh.rotation.z = Math.random() * Math.PI * 2;	
	//	groundMesh.receiveShadows = true;
		//boxMesh.castShadow = true;



		objects.push(boxMesh);
		
		scene.add( boxMesh );
	}

	
	for(var i = 0; i < 3000; i ++ ){
		generateBox();
	}
	

	
	
	function render() {
		requestAnimationFrame( render );
		
		stats.begin();

		renderer.render( scene, camera );
		update();
		
		
		/*var vector = new THREE.Vector3(camera.position.x, 100, camera.position.z );
		vector.normalize();
		var cameraPos = new THREE.Vector3(camera.position.x, -2, camera.position.z );
		var cast = new THREE.Raycaster(cameraPos,vector );
		
		var topObject = 1;
		
		for(var i = 0; i < objects.length; i++){
			var intersect = cast.intersectObject(objects[i], true);
				
			for(var j = 0; j < intersect.length; j++){
				if(topObject < intersect[j].distance)
					topObject = intersect[j].distance;
			}
		}*/
		
		camera.position.y = /*topObject + */1;
		
		stats.end();
	}
	render();

	
	
	window.onresize = function(){
		camera.aspect = renderer.domElement.width / renderer.domElement.height;
		camera.updateProjectionMatrix ();
		renderer.setSize( window.innerWidth, window.innerHeight );
	}

})();

