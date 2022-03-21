//import * as BABYLON from "@babylonjs/core";

export default class Dude {
    constructor(dudeMesh, armature , speed,scene) {
        this.dudeMesh = dudeMesh;
        this.armature = armature;
        this.allanymation = armature._ranges;
        console.log(this.allanymation)
        this.dudeMesh.frontVector = new BABYLON.Vector3(0, 0, 1);
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
        dudeMesh.Dude = this;
    }

    move(scene,inputStates) {
        if(inputStates.up) {
            if(this.isrunning){
                this.dudeMesh.moveWithCollisions(this.dudeMesh.frontVector.multiplyByFloats(this.runspeed, this.runspeed, this.runspeed));
            }else{
                this.dudeMesh.moveWithCollisions(this.dudeMesh.frontVector.multiplyByFloats(this.speed,this.speed,this.speed));
            }
        }    
        if(inputStates.down) {
            //tank.moveWithCollisions(new BABYLON.Vector3(0, 0, -1*tank.speed));
            if(this.isrunning){
                this.dudeMesh.moveWithCollisions(this.dudeMesh.frontVector.multiplyByFloats(-this.runspeed, -this.runspeed, -this.runspeed));
            }else{
                this.dudeMesh.moveWithCollisions(this.dudeMesh.frontVector.multiplyByFloats(-this.speed, -this.speed, -this.speed));
            }
        }    
        if(inputStates.left) {
            //tank.moveWithCollisions(new BABYLON.Vector3(-1*tank.speed, 0, 0));
            this.dudeMesh.rotation.y -= 0.06;
            this.dudeMesh.frontVector = new BABYLON.Vector3(Math.sin(this.dudeMesh.rotation.y), 0, Math.cos(this.dudeMesh.rotation.y));
        }    
        if(inputStates.right) {
            //tank.moveWithCollisions(new BABYLON.Vector3(1*tank.speed, 0, 0));
            this.dudeMesh.rotation.y += 0.06;
            this.dudeMesh.frontVector = new BABYLON.Vector3(Math.sin(this.dudeMesh.rotation.y), 0, Math.cos(this.dudeMesh.rotation.y));
        }
        
        
        if(this.notbloque){
            if(inputStates.space){
                if(this.isrunning){
                    this.animation(scene,1)
                }
            }else if(inputStates.run){
                if(this.isrunning){
                    this.isrunning=false;
                    this.animation(scene,5) 
                }else{
                    this.isrunning=true;
                    this.animation(scene,0)
                }
            }else if(inputStates.up || inputStates.down || inputStates.left || inputStates.right){
                if(this.isrunning){
                    this.animation(scene,2);
                }else{
                    this.animation(scene,6);
                } 
            }else{
                if(this.isrunning){
                    this.animation(scene,4); 
                }else{
                    this.animation(scene,3); 
                }
            } 
        }
    }

    //0 down 1 jump 2 run 3 stand 4 staydown 5 up 6 walk 
    animation(scene,number){
        if(this.animationstate!==number){
            //await this.anim.waitAsync();
            this.animationstate = number;
            let myanimation = Object.values(this.allanymation)[number];
            if(number==0 || number == 5 || number == 1){
                this.notbloque = false;
                setTimeout(async () => {
                    this.anim = scene.beginAnimation(this.armature, myanimation.from+1, myanimation.to, false);
                    await this.anim.waitAsync();
                    this.notbloque = true;
                });
            }else{
                this.anim = scene.beginAnimation(this.armature, myanimation.from+2, myanimation.to, true,1);
            }
        }         
    }

}