//import * as BABYLON from "@babylonjs/core";

export default class Dude {
    constructor(dudeMesh, armature , speed,scene) {
        this.dudeMesh = dudeMesh;
        this.armature = armature;
        this.allanymation = armature._ranges;
        this.dudeMesh.frontVector = new BABYLON.Vector3(0, 0, 1);
        this.animationstate = 0;
        this.anim;
        if(speed)
            this.speed = speed;
        else
            this.speed = 1;

        // in case, attach the instance to the mesh itself, in case we need to retrieve
        // it after a scene.getMeshByName that would return the Mesh
        // SEE IN RENDER LOOP !
        dudeMesh.Dude = this;
    }

    move(scene,inputStates) {
        
        if(inputStates.up) {
            //tank.moveWithCollisions(new BABYLON.Vector3(0, 0, 1*tank.speed));
            this.dudeMesh.moveWithCollisions(this.dudeMesh.frontVector.multiplyByFloats(this.speed,this.speed,this.speed));
        }    
        if(inputStates.down) {
            //tank.moveWithCollisions(new BABYLON.Vector3(0, 0, -1*tank.speed));
            this.dudeMesh.moveWithCollisions(this.dudeMesh.frontVector.multiplyByFloats(-this.speed, -this.speed, -this.speed));

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
        

        if(inputStates.up || inputStates.down || inputStates.left || inputStates.right){
            this.animation(scene,1);
        }else{
            this.animation(scene,0);
        }
    }
    animation(scene,number){
        if(this.animationstate!==number){
            //await this.anim.waitAsync();
            this.animationstate = number;
            let myanimation = Object.values(this.allanymation)[number];
            this.anim = scene.beginAnimation(this.armature, myanimation.from, myanimation.to, true, 1);
        }         
    }

}