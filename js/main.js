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
        picamesh.position.x = salles[0].ox+50;
        picamesh.position.z = salles[0].oz+50;
        picamesh.position.y = 10;
        
        
        
        scene.activeCamera = createFollowCamera(scene,picamesh.position, scene.pica.vuecube);
        
        
        modifySettings();
        setTimeout(() => {
            engine.hideLoadingUI() 
        }, 2000)

         // main animation loop 60 times/s
        engine.runRenderLoop(() => {
            
            let picatchu = scene.getMeshByName("mypicatchu");
            if(picatchu){
                picatchu.Pica.move(scene,inputStates);
                
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
    
    let ground = BABYLON.MeshBuilder.CreateGround("myGround", {width: 3000, height: 3000, segments:1}, scene);
    ground.checkCollisions = true;
    //ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0.5, restitution: 0.7 }, scene);
    let groundMatrial = new BABYLON.StandardMaterial("mat", scene);
    var texture = new BABYLON.Texture("img/sole1.jpg", scene);
    groundMatrial.diffuseTexture = texture;
    ground.material = groundMatrial;
    scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
    scene.fogColor = new BABYLON.Color3(0.2, 0.2, 0.2);
    scene.fogDensity = 0.005;
    camera = new BABYLON.FreeCamera("myCamera", new BABYLON.Vector3(0, 5, 10), scene);
    camera.attachControl(canvas);
    //scene.assetsManager = configureAssetManager(scene);

    const vlightmesh = await BABYLON.SceneLoader.ImportMeshAsync("", "3dmodule/light/", "light.babylon", scene);
    const marowakobj = await BABYLON.SceneLoader.ImportMeshAsync("", "3dmodule/Marowak/", "marowak.babylon", scene);
    const picaeclaireobj = await BABYLON.SceneLoader.ImportMeshAsync("", "3dmodule/Picatchu/Picalightatac/", "picalightatc.babylon", scene); 
    const picamesh = await BABYLON.SceneLoader.ImportMeshAsync("", "3dmodule/Picatchu/", "picatchu5d.babylon", scene);
    //var skybox = BABYLON.Mesh.CreateBox("BackgroundSkybox", 500, scene, undefined, BABYLON.Mesh.BACKSIDE);
    
    // Create and tweak the background material.
    /*var backgroundMaterial = new BABYLON.BackgroundMaterial("backgroundMaterial", scene);
    backgroundMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/TropicalSunnyDay", scene);
    backgroundMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skybox.material = backgroundMaterial;
    */
    // background

    //let ground = BABYLON.MeshBuilder.CreateGround("myGround", {width: 60, height: 60}, scene);
    
    scene.collisionsEnabled = true;

    
    let alllight = new BABYLON.HemisphericLight("myLight", new BABYLON.Vector3(1, 100, 1), scene);
    alllight.intensity = 0.5;
    // color of the light
    alllight.diffuse = new BABYLON.Color3(1, 1, 1);

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
    scene.pica = new Pica(picatchu,armature,picaeclaireobj, 2,scene);    


    createenv(vlight,marowakobj,scene);

    let box = new BABYLON.Mesh.CreateBox("Box1", 4, scene);
    box.position.x = 0;
    box.position.z = -10;
    box.position.y = 7;
    
    
    
    //camera.position = new BABYLON.Vector3(picatchu.position.x-10,picatchu.position.y+3, picatchu.position.z);

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
            x = parseInt(Math.random()*50);
            z = parseInt(Math.random()*50);
            y = 0;
            for(let icubes= 0; icubes<cubes.length; icubes++){
                if(containe([x,z,x+20,z+20], cubes[icubes])){
                    found=false;
                }
            }
        }
        cubes[i] = [x,z,x+20,z+20];
        chargecubes[i] = new BABYLON.Mesh.CreateBox("cobesi",220,scene);
        chargecubes[i].position = new BABYLON.Vector3((x+9)*taille,y,(z+9)*taille);
        chargecubes[i].actionManager = new BABYLON.ActionManager(scene);
        chargecubes[i].actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
              {
                trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                parameter: scene.pica.bounder,
              }, // dude is the mesh, Dude is the instance if Dude class that has a bbox as a property named bounder.
              // see Dude class, line 16 ! dudeMesh.Dude = this;
              () => {
                    salles[i].createroom(marowakobj, scene);
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
	camera.maxCameraSpeed = 6; // speed limit
    //camera.minZ = 10;
    

    return camera;
}

function modifySettings() {
    // as soon as we click on the game window, the mouse pointer is "locked"
    // you will have to press ESC to unlock it
    scene.onPointerDown = () => {
        if(!scene.alreadyLocked) {
            console.log("requesting pointer lock");
            canvas.requestPointerLock();
        } else {
            console.log("Pointer already locked");
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

    // key listeners for the tank
    inputStates.left = false;
    inputStates.right = false;
    inputStates.up = false;
    inputStates.down = false;
    inputStates.space = false;
    inputStates.run = false;
    inputStates.fight = false;
    inputStates.fight2 = false;
    inputStates.fire2 = false;
    
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

    
}