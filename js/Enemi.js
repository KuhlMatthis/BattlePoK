//import * as BABYLON from "@babylonjs/core";


export default class Enemi {
    constructor(enemiMesh, armature , speed, height,scene) {
        this.enemiMesh = enemiMesh;
        this.armature = armature;
        this.allanymation = armature._ranges;
        if (speed) this.speed = speed;
        else this.speed = 1;
        enemiMesh.Enemi = this;




        ///////////////////////         creer les affichage statistique       //////////////////////

        this.life = 5;
        this.maxlife=5;
        this.lifebar = new BABYLON.MeshBuilder.CreateBox("enemilivebar", {height: 0.8, width: 1, depth: 0.4},scene);
        this.lifebar.parent = this.enemiMesh;
        this.lifebar.position.y += height + 1;
        this.lifebar.scaling.x = this.life;

        const lifemat = new BABYLON.StandardMaterial("mat");
        lifemat.Color = new BABYLON.Color3(1, 0, 0);
        lifemat.diffuseColor = new BABYLON.Color3(1, 0, 0);
        lifemat.specularColor  = new BABYLON.Color3(0, 0, 0);
        this.lifebar.material = lifemat;

        

        //creer bar d'energie
        this.maxenergie=5;
        this.energie = 5;
        this.energiebar = new BABYLON.MeshBuilder.CreateBox("enemilivebar", {height: 0.4, width: 1, depth: 0.4},scene);
        this.energiebar.parent = this.enemiMesh;
        this.energiebar.position.y += height;
        this.energiebar.scaling.x = this.energie;

        const energiemat = new BABYLON.StandardMaterial("mat");
        energiemat.Color = new BABYLON.Color3(0, 1, 1);
        energiemat.diffuseColor = new BABYLON.Color3(0, 1, 1);
        energiemat.specularColor  = new BABYLON.Color3(0, 0, 0);
        this.energiebar.material = energiemat;



        this.level = 1;
        this.maxlevel = 15;
        this.dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", {width:30, height:30}, scene, false);
        var mat = new BABYLON.StandardMaterial("mat", scene);
        mat.diffuseTexture = this.dynamicTexture;
        //Set font
	    
        this.dynamicTexture.drawText(""+this.level, null, null, "bold " + 16 + "px Arial", "#000000", "#ffffff", true);
        
    
        //Create plane and set dynamic texture as material
        this.planelevel = BABYLON.MeshBuilder.CreatePlane("plane", {width:1, height:1}, scene);
        this.planelevel.parent = this.enemiMesh;
        this.planelevel.position.y += height + 0.7;
        this.planelevel.position.x -= 3.5;
        this.planelevel.material = mat;

    }
}