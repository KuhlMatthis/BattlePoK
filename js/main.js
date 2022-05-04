//import * as BABYLON from "@babylonjs/core";
import Pica from "./Pica.js";
import Sale from "./Sale.js";
import Chemin from "./Chemin.js";
import Enemi from "./Enemi.js";

let canvas;
let engine;
let scene;
let camera;


let inputStates = {};
let mymouse = {};

let playground = [0,0,50,50]
let salles = [];
let chemin = [];
let cubes = [];
let chargecubes = [];
    

window.onload = startGame;

function startGame() {
    canvas = document.querySelector("#myCanvas");
    engine = new BABYLON.Engine(canvas, true);
    engine.displayLoadingUI();
    const promise = createScene();
    promise.then(() => { 
        let picamesh = scene.pica.bounder;
        //picamesh.position.x = salles[0].ox+50;
        //picamesh.position.z = salles[0].oz+50;
        picamesh.position.y = 10;
        scene.activeCamera = createFollowCamera(scene,picamesh.position, scene.pica.vuecube);


        modifySettings();

        setTimeout(() => {
            engine.hideLoadingUI() 
        }, 1000)
         // main animation loop 60 times/s
        engine.runRenderLoop(() => {
            let picatchu = scene.getMeshByName("mypicatchu");
            if(picatchu){
                picatchu.Pica.move(scene,inputStates,mymouse);
                //console.log(picatchu.Pica.bounder.x);
                if(picatchu.Pica.life <=0){
                picatchu.Pica.animation(scene,9);
                setTimeout(() => {
                        const promise = createScene();
                        while(!promise){}
                        promise.then(() => {
                        let picamesh = scene.pica.bounder;
                        scene.activeCamera = createFollowCamera(scene,picamesh.position, scene.pica.vuecube);
                        modifySettings();
                        });
                    }, 1000 * 4)
                    
                }
                effect();
                // when the picka is not on the ground he dies
                if (picatchu.position.y <=0.1){
                    setTimeout(() => {
                        if (picatchu.position.y <=0.1){
                            picatchu.Pica.degat(0.5);
                    }},5000);
                }
            }

            actionEnemies();    
            scene.render();
        });
    });
    //scene.assetsManager.load();
}

async function createScene () {

    scene = new BABYLON.Scene(engine);
    canvas = document.querySelector("#myCanvas");
    scene.enablePhysics();
    scene.enemies = [];
    scene.blockMaterialDirtyMechanism = true;
    scene.blockfreeActiveMeshesAndRenderingGroups = true;
    var physicsEngine =  scene.getPhysicsEngine();
    //Get gravity
    var gravity = physicsEngine.gravity;

    //Set gravity
    physicsEngine.setGravity(new BABYLON.Vector3(0, 0, 0))
    
    let ground = BABYLON.MeshBuilder.CreateGround("myGround", {width: 1500, height: 1500, segments:1000}, scene);
    ground.position = new BABYLON.Vector3(250,-1,250);
    ground.checkCollisions = true;
    //ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0.5, restitution: 0.7 }, scene);
    let groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
    groundMaterial.diffuseTexture = new BABYLON.Texture("img/ground.jpg", scene);
    // groundMaterial.diffuseTexture = new BABYLON.Texture("img/sole1.jpg", scene);
    ground.material = groundMaterial;
    scene.ground = ground;

    var skybox = BABYLON.Mesh.CreateBox("BackgroundSkybox", 1500, scene, undefined, BABYLON.Mesh.BACKSIDE);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
	skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("img/skybox/skybox", scene);
	skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
	skyboxMaterial.diffuseColor = new BABYLON.Color3(0.72, 0.4, 0.61);
	skyboxMaterial.specularColor = new BABYLON.Color3(0.4, 0.4, 0.95);
	skyboxMaterial.disableLighting = true;
	skybox.material = skyboxMaterial;
    skyboxMaterial.luminance = 100;
    scene.skybox = skybox;

    var waterMesh = BABYLON.Mesh.CreateGround("waterMesh", 1500, 1500, 32, scene, false);
	var water = new BABYLON.WaterMaterial("water", scene, new BABYLON.Vector2(512, 512));
	water.bumpTexture = new BABYLON.Texture("img/waterbump.png", scene);
	water.windForce = -15;
	water.waveHeight = 0.1;
	water.windDirection = new BABYLON.Vector2(1, 1);
	water.waterColor = new BABYLON.Color3(0.75, 0.02, 0.78);
	water.colorBlendFactor = 0.3;
	water.bumpHeight = 1;
	water.waveLength = 0.4;
	//water.addToRenderList(skybox);
	water.addToRenderList(ground);
	waterMesh.material = water;
    scene.waterground = waterMesh; 

    BABYLON.ParticleHelper.BaseAssetsUrl = "./particuleeffects"
    let Psystem = await BABYLON.ParticleHelper.CreateAsync("bluesmoke", scene);
    scene.bluesmoke = Psystem.systems[0];
    let Prain = await BABYLON.ParticleHelper.CreateAsync("rain", scene);
    let rain = Prain.systems[0];
    
    
    scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
    scene.fogColor = new BABYLON.Color3(0.50, 0.25, 0.40);
    scene.fogDensity = 0.004;
    
    //scene.fogStart = 0.0;
    //scene.fogEnd = 500.0;
    /*scene.debugLayer.show({
        embedMode: true,
    });
    */
    camera = new BABYLON.FreeCamera("myCamera", new BABYLON.Vector3(0, 5, 10), scene);
    camera.attachControl(canvas);
    //scene.assetsManager = configureAssetManager(scene);

    const vlightmesh = await BABYLON.SceneLoader.ImportMeshAsync("", "3dmodule/light/", "light.babylon", scene);
    const marowakobj = await BABYLON.SceneLoader.ImportMeshAsync("", "3dmodule/Marowak/", "marowak.babylon", scene);
    const picaeclaireobj = await BABYLON.SceneLoader.ImportMeshAsync("", "3dmodule/Picatchu/Picalightatac/", "picalightatc.babylon", scene); 
    const picamesh = await BABYLON.SceneLoader.ImportMeshAsync("", "3dmodule/Picatchu/", "picatchu5d.babylon", scene);
    const labras = await BABYLON.SceneLoader.ImportMeshAsync("", "3dmodule/Labras/", "lapras.babylon", scene);
    labras.meshes[0].position.x=-50;
    labras.meshes[0].position.y=0;
    marowakobj.meshes[0].setEnabled(false);
    
    // Create and tweak the background material.
    /*backgroundMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/TropicalSunnyDay", scene);
    backgroundMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skybox.material = backgroundMaterial;
    */
    // background

    //let ground = BABYLON.MeshBuilder.CreateGround("myGround", {width: 60, height: 60}, scene);
    
    scene.collisionsEnabled = true;

    
    let alllight = new BABYLON.HemisphericLight("myLight", new BABYLON.Vector3(0, 20, 0), scene);
    alllight.intensity = 0.8;
    // color of the light
    alllight.diffuse = new BABYLON.Color3(0.5, 0.5, 0.5);

    var clowlayer = new BABYLON.GlowLayer("lightglow",scene);
    clowlayer.intensity = 5;
    
    
    let vlight = vlightmesh.meshes[0];
    vlight.addLODLevel(200, null);
    vlight.setEnabled(false);
    let larmature = vlightmesh.skeletons[0];
    scene.beginAnimation(larmature, 0, 16, true, 1);
    vlight.name = "vlight"
    vlight.scaling = new BABYLON.Vector3(0.5, 0.5, 0.5)
    
    
    //clowlayer.addIncludedOnlyMesh(vlight)
    vlight.diffuseColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
    
    
    let picatchu = picamesh.meshes[0];

    let armature = picamesh.skeletons[0];
    picatchu.name = "mypicatchu";
    scene.pica = new Pica(picatchu,armature,picaeclaireobj,rain, 2,scene);    

    createenv(vlight,marowakobj,scene);

    return scene;
}

function createenv(vlight,marowakobj,scene){
    let taille = 10;
    let nbsalles = 4;
    let found = false;
    for(let i = 0; i<nbsalles;i++){
        found = false;
        let x;
        let y;
        let z;
        while(!found){
            found = true;
            x = parseInt(playground[0]+Math.random()*(playground[2]-playground[0]));
            z = parseInt(playground[1]+Math.random()*(playground[3]-playground[1]));
            y = 0;
            for(let icubes= 0; icubes<cubes.length; icubes++){
                if(containe([x,z,x+20,z+20], cubes[icubes])){
                    found=false;
                }
            }
        }
        cubes[i] = [x,z,x+20,z+20];
        chargecubes[i] = new BABYLON.Mesh.CreateBox("cobesi",185,scene);
        chargecubes[i].position = new BABYLON.Vector3((x+9)*taille,y,(z+9)*taille);
        chargecubes[i].actionManager = new BABYLON.ActionManager(scene);
        chargecubes[i].actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
              {
                trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                parameter: scene.pica.bounder,
              },
              () => {
                    salles[i].portesmoke.reset();
                    salles[i].portesmoke.stop();
                    salles[i].createroom(marowakobj, scene);
                    scene.pica.rain.stop();
                    // boucles sur les autres salles est les décharger
                }
            )
        );
        chargecubes[i].actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
              {
                trigger: BABYLON.ActionManager.OnIntersectionExitTrigger,
                parameter: scene.pica.bounder,
              },
              () => {
                    salles[i].portesmoke.start();
                    salles[i].disolveroom(scene);
                    scene.pica.rain.start();
                    // boucles sur les autres salles est les décharger
                }
            )
        );
        chargecubes[i].visibility = 0;
        salles[i] = new Sale(x,z,y,19,19,5,taille, scene);
        salles[i].create(vlight, scene);
    }
    
    for(let isalle = 0; isalle<salles.length-1; isalle++){
        let debutsalle = salles[isalle];
        let debut = [debutsalle.porte[0]+debutsalle.gx,debutsalle.porte[1]+debutsalle.gz,debutsalle.porte[0]+debutsalle.gx,debutsalle.porte[1]+debutsalle.gz]
        let endsalle = salles[isalle+1];
        let fin = [endsalle.porte[0]+endsalle.gx,endsalle.porte[1]+endsalle.gz,endsalle.porte[0]+endsalle.gx,endsalle.porte[1]+endsalle.gz]
        debut = decalcub(debut, debutsalle);
        fin  = decalcub(fin, endsalle);
        chemin[isalle] = new Chemin([debut],debut,fin,salles);
    }
    let debutsalle = salles[salles.length-1];
    let debut = [debutsalle.porte[0]+debutsalle.gx,debutsalle.porte[1]+debutsalle.gz,debutsalle.porte[0]+debutsalle.gx,debutsalle.porte[1]+debutsalle.gz]
    let fin = [playground[2]+20,playground[3]+20,playground[2]+20,playground[3]+20+1]
    debut = decalcub(debut, debutsalle);
    chemin[chemin.length] = new Chemin([debut],debut,fin,salles);
    debutsalle = salles[0];
    debut =  [playground[0]-2,playground[1]-2,playground[0]-2,playground[1]-2]
    fin = [debutsalle.porte[0]+debutsalle.gx,debutsalle.porte[1]+debutsalle.gz,debutsalle.porte[0]+debutsalle.gx,debutsalle.porte[1]+debutsalle.gz]
    fin  = decalcub(fin, debutsalle);
    chemin[chemin.length] = new Chemin([debut],debut,fin,salles);
    let chargenext = new BABYLON.Mesh.CreateBox("cobesi",30,scene);
    chargenext.position = new BABYLON.Vector3((playground[2]+20)*taille,10,(playground[3]+20)*taille);
    chargenext.actionManager = new BABYLON.ActionManager(scene);
    chargenext.actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(
        {
        trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
        parameter: scene.pica.bounder,
        },
        () => {
            chargenext.dispose();
            salles.forEach(salle => {
                salle.disposesalle()
            });
            chemin.forEach(unchemin => {
                unchemin.chemindispose()
            });
            chargecubes.forEach(chargecube => {
                chargecube.dispose();
            });
            
            playground=[playground[2]+20,playground[3]+20,playground[2]+70,playground[3]+70]
            scene.ground.position = new BABYLON.Vector3((playground[2]+playground[2]/2)*5,0,(playground[3]+playground[3]/2)*5);
            scene.skybox.position = new BABYLON.Vector3((playground[2]+playground[2]/2)*5,0,(playground[3]+playground[3]/2)*5);
            scene.waterground.position = new BABYLON.Vector3((playground[2]+playground[2]/2)*5,0,(playground[3]+playground[3]/2)*5);
            createenv(vlight,marowakobj,scene);      
        }
    )
    );
    chargenext.visibility = 0;
    //music();
}

function decalcub(cube,salle){
    let decaleb = [[1,0,1,0],[0,1,0,1],[-1,0,-1,0],[0,-1,0,-1]];
    let sallecub = salle.cub;
    if(containe(cube,sallecub)){
        for (let index = 0; index < decaleb.length; index++) {
            const d = decaleb[index];  
            if(!containe([cube[0]+d[0],cube[1]+d[1],cube[2]+d[2],cube[3]+d[3]],sallecub)){
                return [cube[0]+d[0],cube[1]+d[1],cube[2]+d[2],cube[3]+d[3]];
            }
        }
    }
    return cube;
}


function actionEnemies() {
    if(scene.enemies) {
        
        scene.enemies.forEach(enemi => {
            enemi.Enemi.action(scene);
            //remove dead enemi from enemies list
            if(enemi.Enemi.life<0){
                var enemiIndex = scene.enemies.indexOf(enemi);
                scene.enemies.splice(enemiIndex, 1);
            }
        });

    }    
}



/**
 * forme x,y,x2,y2
 * @param {*} cube1 
 * @param {*} cube2 
 * @returns 
 */
function containe(cube1, cube2){
    if(cube2[2] < cube1[0] || cube1[2] < cube2[0]){
        return false;
    }
    if(cube2[3] < cube1[1] || cube1[3] < cube2[1]){
        return false;
    }
    return true;
}


window.addEventListener("resize", () => {
    engine.resize()
})

//gerer key:

function createFreeCamera(scene) {
    let camera = new BABYLON.FreeCamera("freeCamera", new BABYLON.Vector3(0, 50, 0), scene);
    camera.attachControl(canvas);
    // prevent camera to cross ground
    camera.checkCollisions = true; 
    // avoid flying with the camera
    camera.applyGravity = true;


    // Add extra keys for camera movements
    // Need the ascii code of the extra key(s). We use a string method here to get the ascii code
    camera.keysUp.push('z'.charCodeAt(0));
    camera.keysDown.push('s'.charCodeAt(0));
    camera.keysLeft.push('q'.charCodeAt(0));
    camera.keysRight.push('d'.charCodeAt(0));
    camera.keysUp.push('Z'.charCodeAt(0));
    camera.keysDown.push('S'.charCodeAt(0));
    camera.keysLeft.push('Q'.charCodeAt(0));
    camera.keysRight.push('D'.charCodeAt(0));

    return camera;
}

function createFollowCamera(scene, pos, target) {
    //let camera = new BABYLON.ArcFollowCamera("picatchuFollowCamera", target.position, scene)
    let camera = new BABYLON.FollowCamera("picatchuFollowCamera", pos, scene, target);
    //camera.setMeshTarget(target);
    camera.radius = 30; // how far from the object to follow
	camera.heightOffset = 5; // how high above the object to place the camera
	camera.rotationOffset = 180; // the viewing angle
	
    camera.cameraAcceleration = .2; // how fast to move
	camera.maxCameraSpeed = 12; // speed limit
    //camera.minZ = 10;
    

    return camera;
}

function modifySettings() {
    // as soon as we click on the game window, the mouse pointer is "locked"
    // you will have to press ESC to unlock it
    
    scene.onPointerDown = (event) => {
        if(!scene.alreadyLocked) {
            console.log("requesting pointer lock");
            canvas.requestPointerLock();
        } else {
            console.log(event.button)
            //event.preventDefault();
            if(event.button==0){
                inputStates.fire2 = true;
            }
            if(event.button==1){
                inputStates.switch = true;
            }
            if(event.button==2){
                inputStates.fight = true;
            }

        }
    }

    document.addEventListener("pointerlockchange", () => {
        let element = document.pointerLockElement || null;
        if(element) {
            // lets create a custom attribute
            scene.alreadyLocked = true;
        } else {
            scene.alreadyLocked = false;
        }
    })
    
    // key listeners for the player
    inputStates.left = false;
    inputStates.right = false;
    inputStates.up = false;
    inputStates.down = false;
    inputStates.space = false;
    inputStates.run = false;
    inputStates.fight = false;
    inputStates.fight2 = false;
    inputStates.fire2 = false;
    inputStates.switch = false;
    


    // mouse listener for the player
    mymouse.x = 0;
    mymouse.y = 0;
    
    //add the listener to the main, window object, and update the states
    window.addEventListener('keydown', (event) => {
        if ((event.key === "ArrowLeft") || (event.key === "q")|| (event.key === "Q")) {
           inputStates.left = true;
        } else if ((event.key === "ArrowUp") || (event.key === "z")|| (event.key === "Z")){
           inputStates.up = true;
        } else if ((event.key === "ArrowRight") || (event.key === "d")|| (event.key === "D")){
           inputStates.right = true;
        } else if ((event.key === "ArrowDown")|| (event.key === "s")|| (event.key === "S")) {
           inputStates.down = true;
        } else if (event.key === "f") {
            inputStates.fire1 = true;
        } else if (event.key === "g"){
            inputStates.fire2 = true;
        } else if(event.key === "h"){
            inputStates.fight = true;
        } else if(event.key === "j"){
            inputStates.fight2 = true;
        } else if (event.key === " ") {
           inputStates.space = true;
        } else if (event.key === "r") {
            inputStates.run = true;
        } 
    }, false);

    //if the key will be released, change the states object 
    window.addEventListener('keyup', (event) => {
        if ((event.key === "ArrowLeft") || (event.key === "q")|| (event.key === "Q")) {
           inputStates.left = false;
        } else if ((event.key === "ArrowUp") || (event.key === "z")|| (event.key === "Z")){
           inputStates.up = false;
        } else if ((event.key === "ArrowRight") || (event.key === "d")|| (event.key === "D")){
           inputStates.right = false;
        } else if ((event.key === "ArrowDown")|| (event.key === "s")|| (event.key === "S")) {
           inputStates.down = false;
        }else if (event.key === "f") {
            inputStates.fire1 = false;
        }else if (event.key === "g"){
            inputStates.fire2 = false;
        }else if(event.key === "h"){
            inputStates.fight = false;
        }else if(event.key === "j"){
            inputStates.fight2 = false;
        }else if (event.key === " ") {
           inputStates.space = false;
        }else if (event.key === "r") {
           inputStates.run = false;
        }
    }, false);

    window.addEventListener('mousemove', (event) => {
        // fait varier la position de la souris en pourcentage entre -1 et 1 avec 0 le centre de l'ecran
        //if(event.movementX)
        mymouse.x = event.movementX;
        mymouse.y = event.movementY;
        //mymouse.x = event.pageX/document.documentElement.clientWidth*2 -1;
        //mymouse.y = event.pageY/document.documentElement.clientHeight*2-1;
        //console.log(mymouse.x, mymouse.y);
      },false);
    
}

function clear() {
  
  scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction({
  }, clear));
}

function music(){
   //adding audio 
  var music = new BABYLON.Sound("music","twostepsfromhell.mp3", scene, function(){music.play();},{loop:true, volume: 0.1});
}
function gui(){
    // GUI
    var plane = BABYLON.Mesh.CreatePlane("plane", 10);
    plane.position.y = 2;

   plane.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;

    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(plane);
    

    var button1 = BABYLON.GUI.Button.CreateSimpleButton("but1", "Play!");
    button1.width = 0.15;
    button1.height = 0.05;
    button1.top = -120;
    button1.color = "white";
    button1.fontSize = 12;
    button1.background = "green";
    button1.onPointerUpObservable.add(function() {
        advancedTexture.removeControl(button1);
    });
    advancedTexture.addControl(button1);

    var button2 = BABYLON.GUI.Button.CreateSimpleButton("but3", "Replay");
    button2.width = 0.15;
    button2.height = 0.05;
    button2.top = -60;
    button2.color = "white";
    button2.fontSize = 12;
    button2.background = "yellow";
    button2.onPointerUpObservable.add(function() {
        advancedTexture.removeControl(button1);
        advancedTexture.removeControl(button2);
        advancedTexture.removeControl(button3);
        setTimeout(gui,1000);
    });
    advancedTexture.addControl(button2);

    var button3 = BABYLON.GUI.Button.CreateSimpleButton("but2", "Exit");
    button3.width = 0.15;
    button3.height = 0.05;
    button3.color = "white";
    button3.fontSize = 12;
    button3.background = "red";
    button3.onPointerUpObservable.add(function() {
        advancedTexture.removeControl(button1);
        advancedTexture.removeControl(button2);
        advancedTexture.removeControl(button3);
        setTimeout(gui,3000);
    });
    advancedTexture.addControl(button3);

}

function spark(){
    var spark = new BABYLON.Sound("spark","spark.mp3",scene, function(){spark.play();},{loop:false, volume : 0.1})
}

function effect(){
    window.addEventListener("mousedown", function(evt) {
		// left click to attack
		if (evt.button === 0) {
			spark();  
		}
	});
	
	window.addEventListener("keyGdown", function (evt) {
        // Press g key to attack with spark
        if (evt.keyCode === 71) {
            spark();
        }
    });
}