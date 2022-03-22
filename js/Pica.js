//import * as BABYLON from "@babylonjs/core";

export default class Pica {
    constructor(picaMesh, armature , speed,scene) {
        this.picaMesh = picaMesh;
        this.armature = armature;
        this.allanymation = armature._ranges;
        console.log(this.allanymation)
        this.picaMesh.frontVector = new BABYLON.Vector3(0, 0, 1);
        //initialiser la vision with a cube in front of the player
        this.vuecube = new BABYLON.Mesh.CreateBox("picavue",2,scene);
        this.vuecube.parent = this.picaMesh;
        this.vuecube.position.y += 8;
        this.vuecube.position.z += 5;
        this.vuecube.visibility = 0;

        ///////////////////////         creer les affichage statistique       //////////////////////

        const blackmat = new BABYLON.StandardMaterial("mat");
        blackmat.Color = new BABYLON.Color3(0, 0, 0);
        blackmat.diffuseColor = new BABYLON.Color3(0, 0, 0);
        blackmat.specularColor  = new BABYLON.Color3(0, 0, 0);

        this.life = 5;
        this.maxlife=5;
        this.lifebar = new BABYLON.MeshBuilder.CreateBox("picalivebar", {height: 0.2, width: 1},scene);
        this.lifebar.parent = this.picaMesh;
        this.lifebar.position.y += 11;
        this.lifebar.scaling.x = this.life;

        const lifemat = new BABYLON.StandardMaterial("mat");
        lifemat.Color = new BABYLON.Color3(1, 0, 0);
        lifemat.diffuseColor = new BABYLON.Color3(1, 0, 0);
        lifemat.specularColor  = new BABYLON.Color3(0, 0, 0);
        this.lifebar.material = lifemat;

        this.lifeblackbar = new BABYLON.MeshBuilder.CreatePlane("picablackbar", {height: 0.2, width: 1},scene);
        this.lifeblackbar.parent = this.picaMesh;
        this.lifeblackbar.position.y += 11;
        this.lifeblackbar.position.z -=0.1;
        this.lifeblackbar.material = blackmat;
        this.lifeblackbar.scaling.x = this.maxlife;


        this.nextlevelexperience = 5;
        this.experience = 0;
        this.experiencebar = new BABYLON.MeshBuilder.CreateBox("picalivebar", {height: 0.05, width: 1},scene);
        this.experiencebar.parent = this.picaMesh;
        this.experiencebar.position.y += 10.7;
        this.experiencebar.position.x -= 2.5;
        this.experiencebar.scaling.x = 0;

        const experiencemat = new BABYLON.StandardMaterial("mat");
        experiencemat.Color = new BABYLON.Color3(0, 1, 0);
        experiencemat.diffuseColor = new BABYLON.Color3(0, 1, 0);
        experiencemat.specularColor  = new BABYLON.Color3(0, 0, 0);
        this.experiencebar.material = experiencemat;

        this.expblackbar = new BABYLON.MeshBuilder.CreatePlane("picablackbar", {height: 0.05, width: 1},scene);
        this.expblackbar.parent = this.picaMesh;
        this.expblackbar.position.y += 10.7;
        this.expblackbar.position.z +=0.1;
        this.expblackbar.material = blackmat;
        this.expblackbar.scaling.x = this.nextlevelexperience;


        //creer bar d'energie
        this.maxenergie=5;
        this.energie = 5;
        this.energiebar = new BABYLON.MeshBuilder.CreateBox("picalivebar", {height: 0.08, width: 1},scene);
        this.energiebar.parent = this.picaMesh;
        this.energiebar.position.y += 10.4;
        this.energiebar.scaling.x = this.energie;

        const energiemat = new BABYLON.StandardMaterial("mat");
        energiemat.Color = new BABYLON.Color3(0, 1, 1);
        energiemat.diffuseColor = new BABYLON.Color3(0, 1, 1);
        energiemat.specularColor  = new BABYLON.Color3(0, 0, 0);
        this.energiebar.material = energiemat;

        this.energieblackbar = new BABYLON.MeshBuilder.CreatePlane("picablackbar", {height: 0.08, width: 1},scene);
        this.energieblackbar.parent = this.picaMesh;
        this.energieblackbar.position.y += 10.4;
        this.energieblackbar.position.z -=0.1;
        this.energieblackbar.material = blackmat;
        this.energieblackbar.scaling.x = this.maxenergie;



        this.level = 1;
        this.maxlevel = 15;
        this.dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", {width:30, height:30}, scene, false);
        var mat = new BABYLON.StandardMaterial("mat", scene);
        mat.diffuseTexture = this.dynamicTexture;
        //Set font
	    
        this.dynamicTexture.drawText(""+this.level, null, null, "bold " + 16 + "px Arial", "#000000", "#ffffff", true);
        
    
        //Create plane and set dynamic texture as material
        this.planelevel = BABYLON.MeshBuilder.CreatePlane("plane", {width:1, height:1}, scene);
        this.planelevel.parent = this.picaMesh;
        this.planelevel.position.y += 10.7;
        this.planelevel.position.x -= 3.5;
        this.planelevel.material = mat;

        ///////////////////////////////////////////////////////////////////////////////////////////////
        

        this.animationstate = 0;
        this.anim;
        this.isrunning = false;
        this.notbloque=true;
        if(speed)
            this.speed = speed;
        else
            this.speed = 1;
        if(speed)
            this.runspeed = speed*2;
        else
            this.runspeed = 2;
        // in case, attach the instance to the mesh itself, in case we need to retrieve
        // it after a scene.getMeshByName that would return the Mesh
        // SEE IN RENDER LOOP !
        

        this.boolincrenergie = true;
        this.jump = -2;
        
        picaMesh.Pica = this;

        //bounder to controle colision
        
        this.bounder = new BABYLON.Mesh.CreateBox("bounderpica", 1, scene);
        let bounderMaterial = new BABYLON.StandardMaterial("mat", scene);;
        bounderMaterial.alpha = .4;
        this.bounder.material = bounderMaterial;
        this.bounder.checkCollisions = true;
        this.bounder.ellipsoid = new BABYLON.Vector3(4, 5, 4);
        
        this.bounder.position = this.picaMesh.position.clone();
        this.bounder.position.y +=6;
        this.bounder.scaling.x = 10;
        this.bounder.scaling.y = 10;
        this.bounder.scaling.z = 10;
        
        this.bounder.physicsImpostor = new BABYLON.PhysicsImpostor(this.bounder, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 10 }, scene);
        

        this.bounder.isVisible = false;
        //this.picaMesh.showBoundingBox = true;
        this.picaMesh.checkCollisions = false;
        
        
        //this.picaMesh.showSubMeshesBoundingBox = true;
        //this.picaMesh.setBoundingInfo(this.bounder.getBoundingInfo());
        /*this.picaMesh.bounder.scaling.x = 3;
        this.picaMesh.bounder.scaling.y = 2;
        this.picaMesh.bounder.scaling.z = 1.3;
        */
        //this.bounder.picaMesh = this.picaMesh;
    }

    incrlevel(){
        this.level+=1;
        this.dynamicTexture.drawText(""+this.level, null, null, "bold " + 16 + "px Arial", "#000000", "#ffffff", true);
    }

    increxperience(val){
        if(this.level<this.maxlevel){
            this.experience+=val;
            if(this.experience>= this.nextlevelexperience){
                this.incrlevel();
                this.modifiemaxbar(this.experiencebar,-this.experiencebar.scaling.x);
                this.experience=0;
            }else{
                this.modifiemaxbar(this.experiencebar,val);
            }
        }
        
    }

    modifiemaxbar(bar,incr){
        bar.scaling.x +=incr;
        bar.position.x+=incr/2;
    }
    
    move(scene,inputStates) {
        
        // bloque mouvement si bounder not ready
        if (!this.bounder) return;
        this.bounder.computeWorldMatrix();
        this.picaMesh.position = new BABYLON.Vector3(this.bounder.position.x,
            this.bounder.position.y-5, this.bounder.position.z);
        this.bounder.moveWithCollisions(new BABYLON.Vector3(0,this.jump,0));
        if(this.jump>-2){
            this.jump-=0.5;
        }
        if(this.boolincrenergie){
            this.boolincrenergie = false;
            if(this.energie<this.maxenergie){
                this.energie += 1;
                this.modifiemaxbar(this.energiebar,1);
            }
            setTimeout(() => {
                this.boolincrenergie=true;   
            }, 1000 * 5)
        }
            

        if(inputStates.up) {
            if(this.isrunning){
                
                this.bounder.moveWithCollisions(this.picaMesh.frontVector.multiplyByFloats(this.runspeed, this.runspeed, this.runspeed));
            }else{
                this.bounder.moveWithCollisions(this.picaMesh.frontVector.multiplyByFloats(this.speed,this.speed,this.speed));
            }
        }    
        if(inputStates.down) {
            //tank.moveWithCollisions(new BABYLON.Vector3(0, 0, -1*tank.speed));
            if(this.isrunning){
                this.bounder.moveWithCollisions(this.picaMesh.frontVector.multiplyByFloats(-this.runspeed, -this.runspeed, -this.runspeed));
            }else{
                this.bounder.moveWithCollisions(this.picaMesh.frontVector.multiplyByFloats(-this.speed, -this.speed, -this.speed));
            }
        }    
        if(inputStates.left) {
            //tank.moveWithCollisions(new BABYLON.Vector3(-1*tank.speed, 0, 0));
            this.picaMesh.rotation.y -= 0.06;
            this.vuecube.rotation.y -= 0.06;
            this.picaMesh.frontVector = new BABYLON.Vector3(Math.sin(this.picaMesh.rotation.y), 0, Math.cos(this.picaMesh.rotation.y));
        }    
        if(inputStates.right) {
            //tank.moveWithCollisions(new BABYLON.Vector3(1*tank.speed, 0, 0));
            this.picaMesh.rotation.y += 0.06;
            this.vuecube.rotation.y += 0.06;
            this.picaMesh.frontVector = new BABYLON.Vector3(Math.sin(this.picaMesh.rotation.y), 0, Math.cos(this.picaMesh.rotation.y));
        }
        
        
        if(this.notbloque){
            if(inputStates.space){
                if(this.isrunning){
                    this.jump=4;
                    this.increxperience(1);
                    this.animation(scene,6)
                }
            }else if(inputStates.run){
                if(this.isrunning){
                    this.isrunning=false;
                    this.animation(scene,3) 
                }else{
                    this.isrunning=true;
                    this.animation(scene,2)
                }
            }else if(inputStates.fight){
                if(this.energie>0){
                    
                    this.energie-=1;
                    this.modifiemaxbar(this.energiebar,-1);
                    this.animation(scene,7)
                }
            }else if(inputStates.fight2){
                if(this.energie>0){
                    
                    this.animation(scene,8);
                    
                    this.energie-=1;
                    this.modifiemaxbar(this.energiebar,-1); 
                }
            }else if(inputStates.up || inputStates.down || inputStates.left || inputStates.right){
                if(this.isrunning){
                    this.animation(scene,5);
                }else{
                    this.animation(scene,4);
                } 
            }else{
                if(this.isrunning){
                    this.animation(scene,1); 
                }else{
                    this.animation(scene,0); 
                }
            } 
        }
    }

    //0 stand 1 staydown 2 up 3 down 4 walk 5 run  6 jump 7 .. attaque 
    animation(scene,number){
        if(this.animationstate!==number){
            //await this.anim.waitAsync();
            this.animationstate = number;
            let myanimation = Object.values(this.allanymation)[number];
            //wait end animation
            if(number==2 || number == 3 || number == 6 || number == 7 || number == 8){
                this.notbloque = false;
                setTimeout(async () => {
                    this.anim = scene.beginAnimation(this.armature, myanimation.from+2, myanimation.to, false);
                    await this.anim.waitAsync();
                    this.notbloque = true;
                });
            }else{
                this.anim = scene.beginAnimation(this.armature, myanimation.from+2, myanimation.to, true,1);
            }
        }         
    }

}