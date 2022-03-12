import Dude from "./Dude.js";
import Sale from "./Sale.js";

let canvas;
let engine;
let scene;
let camera;
let inputStates = {};
let salles = [];
let cubes = [];
    

window.onload = startGame;

function startGame() {
    canvas = document.querySelector("#myCanvas");
    engine = new BABYLON.Engine(canvas, true);
    scene = createScene();
    modifySettings();
    // main animation loop 60 times/s
    engine.runRenderLoop(() => {
        let picatchu = scene.getMeshByName("mypicatchu");
        if(picatchu)
            picatchu.Dude.move(scene,inputStates);
        scene.render();
    });
}

function createScene() {
    let scene = new BABYLON.Scene(engine);

    
    // background
    scene.clearColor = new BABYLON.Color3(1, 0, 1);

    //let ground = BABYLON.MeshBuilder.CreateGround("myGround", {width: 60, height: 60}, scene);
    //console.log(ground.name);
    camera = new BABYLON.FreeCamera("myCamera", new BABYLON.Vector3(0, 5, 10), scene);
    // This targets the camera to scene origin
    camera.attachControl(canvas);
   
    let light = new BABYLON.HemisphericLight("myLight", new BABYLON.Vector3(1, 1, 1), scene);
    light.intensity = 1;
    // color of the light
    light.diffuse = new BABYLON.Color3(1, 1, 1);
    
    createenv(scene);

    BABYLON.SceneLoader.ImportMesh("", "3dmodule/Picatchu/", "picatchu4d.babylon", scene,  (newMeshes,particles,skeletons) => {
        let picatchu = newMeshes[0];
        picatchu.position.x = salles[0].ox+50;
        picatchu.position.z = salles[0].oz+50;
        //console.log(newMeshes.length)
        let armature = skeletons[0];
        picatchu.name = "mypicatchu";
        let hero = new Dude(picatchu,armature, 1,scene);
        let followCamera = createFollowCamera(scene, picatchu);
        scene.activeCamera = followCamera;
        hero.animation(scene,1);

    });
    return scene;
}

function createenv(scene){
    let taille = 10;
    let nbsalles = 5;
    let found = false;
    for(let i = 0; i<nbsalles;i++){
        found = false;
        let x;
        let y;
        let z;
        while(!found){
            found = true;
            x = parseInt(Math.random()*100);
            z = parseInt(Math.random()*100);
            y = -1;
            for(let icubes= 0; icubes<cubes.length; icubes++){
                if(containe([x,z,y,20,20,5], cubes[icubes])){
                    found=false;
                }
            }
        }
        cubes[i] = [x,z,y,20,20,5];
        salles[i] = new Sale(x,z,y,19,19,5,taille,scene);
        salles[i].create();
    }
    for(let isalle = 0; isalle<salles.length-1; isalle++){
        let debutsalle = salles[isalle];
        let debut = [debutsalle.porte[0]+debutsalle.ox/taille,debutsalle.porte[1]+debutsalle.ox/taille,debutsalle.porte[2]+debutsalle.oz/taille,debutsalle.porte[3]+debutsalle.oz/taille]
        let endsalle = salles[isalle+1];
        let fin = [endsalle.porte[0]+endsalle.ox/taille,endsalle.porte[1]+endsalle.ox/taille,endsalle.porte[2]+endsalle.oz/taille,endsalle.porte[3]+endsalle.oz/taille]
        let chemin = createconnection([debut],debut,fin);
        console.log(chemin, debut, fin)
    }
    
    
}

function createconnection(chemin,pos, portefin){
    // les quatres decallages possible pour faire un for
    let decalL = [[1,1,0,0],[-1,-1,0,0],[0,0,1,1],[0,0,-1,-1]];
    for (let index = 0; index < decalL.length; index++) {
        const decale = decalL[index];
        let ncase = [pos[0]+decale[0], pos[1]+decale[1], pos[2]+decale[2],pos[3]+decale[3]]; 
        if(containe2(ncase,portefin)){
            console.log("find");
            return chemin;
        }
        for (let index = 0; index < salles.length; index++) {
            const salle = salles[index];
            if(containe2(ncase, [salle.x,salle.x+salle.width, salle.z, salle.z + salle.length])){
                return null;
            }
        }        
        chemin[chemin.length+1] = ncase;
        if(createconnection(chemin,ncase,portefin)!=null){
            return chemin
        }
    }
    return null;
}

/**
 * forme x,y,x2,y2
 * @param {*} cube1 
 * @param {*} cube2 
 * @returns 
 */
function containe(cube1, cube2){
    if(cube2[0]+cube2[2] < cube1[0] || cube1[0]+cube1[2] < cube2[0]){
        return false;
    }
    if(cube2[1]+cube2[3] < cube1[1] || cube1[1]+cube1[3] < cube2[1]){
        return false;
    }
    return true;
}
/**
 * forme x,x2,y,y2
 * @param {*} cube1 
 * @param {*} cube2 
 * @returns 
 */
function containe2(cube1, cube2){
    if(cube2[0]+cube2[1] < cube1[0] || cube1[0]+cube1[1] < cube2[0]){
        return false;
    }
    if(cube2[2]+cube2[3] < cube1[2] || cube1[2]+cube1[3] < cube2[2]){
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

function createFollowCamera(scene, target) {
    let camera = new BABYLON.FollowCamera("picatchuFollowCamera", target.position, scene, target);

    camera.radius = 40; // how far from the object to follow
	camera.heightOffset = 10; // how high above the object to place the camera
	camera.rotationOffset = 160; // the viewing angle
	
    camera.cameraAcceleration = .1; // how fast to move
	camera.maxCameraSpeed = 4; // speed limit

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
        }  else if (event.key === " ") {
           inputStates.space = true;
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
        }  else if (event.key === " ") {
           inputStates.space = false;
        }
    }, false);
}