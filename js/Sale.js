//import * as BABYLON from "@babylonjs/core";
import Enemi from "./Enemi.js";

export default class Sale {
    constructor(x,z,y,length,width,height,taille,scene) {
        this.gx = x;
        this.gy = y;
        this.gz = z;
        this.ox = x*taille;
        this.oy = y*taille;
        this.oz = z*taille;
        this.length = length;
        this.width = width;
        this.height = height;
        this.taille = taille;
        this.t = 3;
        this.porte = this.createporte();
        this.cub = [this.gx,this.gz,this.gx+this.length-1,this.gz+this.width-1];
        this.loaded = 0;
        this.boxes;
        this.box1;
        this.lights = []
    }

    create(vlight,marowakobj,scene) {
        

        let posx = parseInt(this.ox+Math.random()*60+80);
        let posz = parseInt(this.oz+Math.random()*60+80);
        let cvlight = vlight.createInstance("vlight1")
        cvlight.position = new BABYLON.Vector3(posx,  20, posz)
        this.lights[0] = cvlight;
        let cplight = new BABYLON.PointLight("myLight1", new BABYLON.Vector3(posx,  20, posz), scene);
        this.lights[1] = cplight;
        cplight.intensity = 5;
        cplight.range = 100;
        cplight.diffuse = new BABYLON.Color3(1, 0.1, 0.1);  
        cplight.specularColor = new BABYLON.Color3(0, 0, 0);
        let choice = parseInt(Math.random()*3)
        if(choice===0){
            cplight.diffuse = new BABYLON.Color3(1, 0.1, 0.1);    
        }
        if(choice===1){
            cplight.diffuse = new BABYLON.Color3(0.1, 1, 0.1);    
        }
        if(choice===2){
            cplight.diffuse = new BABYLON.Color3(0.1, 0.1, 1);    
        }
        
        
        let pos2x = parseInt(this.ox+Math.random()*40+20);
        let pos2z = parseInt(this.oz+Math.random()*40+20);
        let cvlight2 = vlight.createInstance("vlight1")
        cvlight2.position = new BABYLON.Vector3(pos2x,  20, pos2z)
        this.lights[2] = cvlight2;
        let cplight2 = new BABYLON.PointLight("myLight2", new BABYLON.Vector3(pos2x,  20, pos2z), scene);
        this.lights[3] = cplight2;
        cplight2.intensity = 5;
        cplight2.range = 100;
        

        let choice2 = parseInt(Math.random()*3)
        cplight2.diffuse = new BABYLON.Color3(1, 0.1, 0.1);  
        cplight2.specularColor = new BABYLON.Color3(0, 0, 0);
        if(choice2===0){
            cplight2.diffuse = new BABYLON.Color3(1, 0.1, 0.1);   
        }else if(choice2===1){
            cplight2.diffuse = new BABYLON.Color3(0.1, 1, 0.1);     
        }
        else{
            cplight2.diffuse = new BABYLON.Color3(0.1, 0.1, 1);    
        }

        var box1 = BABYLON.Mesh.CreateBox("Box1", this.taille, scene);
        this.box1 = box1;
        //light of all copies are only affexted by cplight2
        cplight.includedOnlyMeshes.push(box1);
        cplight2.includedOnlyMeshes.push(box1);


        box1.Color = new BABYLON.Color3(1, 0, 0);
        var materialBox = new BABYLON.StandardMaterial("mat", scene);
        var texture = new BABYLON.Texture("img/sole2.jpg", scene);
        materialBox.specularColor = new BABYLON.Color3(0, 0, 0);
        materialBox.diffuseTexture = texture;
        materialBox.freeze();
        box1.material = materialBox;
        box1.position.y= this.oy;
        box1.position.x= this.ox;
        box1.position.z= this.oz;
        box1.checkCollisions = true;
        box1.setEnabled(false);
        box1.addLODLevel(500, null);
        box1.computeWorldMatrix();
        box1.freezeWorldMatrix();
        box1.convertToUnIndexedMesh();
        
        var box2 = BABYLON.Mesh.CreateBox("Box1", this.taille, scene);
        
        // light only
        cplight2.includedOnlyMeshes.push(box2);
        cplight.includedOnlyMeshes.push(box1);
        
        var materialBox2 = new BABYLON.StandardMaterial("mat", scene);
        materialBox2.specularColor = new BABYLON.Color3(0, 0, 0);
        var texture2 = new BABYLON.Texture("img/mure.jpg", scene);
        materialBox2.diffuseTexture = texture2;
        materialBox2.freeze()
        // to be taken into account by collision detection
        //box1.checkCollisions = true;

        box2.material = materialBox2;
        box2.position.y= this.oy;
        box2.position.x= this.ox;
        box2.position.z= this.oz;
        box2.setEnabled(false);
        box2.addLODLevel(500, null);
        box2.checkCollisions = true;
        box2.computeWorldMatrix();
        box2.freezeWorldMatrix();
        box2.convertToUnIndexedMesh();
        // to be taken into account by collision detection
        //
        let boxes = [];
        let nb = 0
        for (let x = 0; x < this.length; x++) {
            for(let z = 0; z < this.width; z++){
                if(x==0 || x==this.length-1 || z==0 || z==this.width-1){
                    if(this.porte[0]<=x && x<=this.porte[2] && this.porte[1]<=z && z<=this.porte[3]){
                        boxes[nb] = box1.createInstance("copySaleSolebox"+nb);
                        boxes[nb].position.x += x*this.taille;
                        boxes[nb].position.z += z*this.taille;
                        boxes[nb].freezeWorldMatrix();
                        //collision
                        boxes[nb].checkCollisions = true;
                        //boxes[nb].physicsImpostor = new BABYLON.PhysicsImpostor(boxes[nb], BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0 }, scene);
                        nb+=1;
                    }else{
                        for(let y = 0; y < this.height; y++){
                            boxes[nb] = box2.createInstance("copySaleMurebox"+nb);
                            boxes[nb].position.x += x*this.taille;
                            boxes[nb].position.z += z*this.taille;
                            boxes[nb].position.y += y*this.taille;
                            boxes[nb].freezeWorldMatrix();
                            //boxes[nb].physicsImpostor = new BABYLON.PhysicsImpostor(boxes[nb], BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 1 }, scene);
                            boxes[nb].checkCollisions = true;
                            nb+=1;  
                        }
                    }
                }
            }    
        }
        this.boxes = boxes;
    }
    createporte() {
        
        let descript = [];
        let val = parseInt(Math.random ()*4);
        if(val==0){
            let positionz = parseInt( Math.random ()*(this.length-this.t));
            descript[0] = 0; 
            descript[1] = positionz;
            descript[2] = 0;
            descript[3] = positionz+this.t;
        }else if(val==1){
            let positionz = parseInt(Math.random ()*(this.length-this.t));
            descript[0] = this.length-1; 
            descript[1] = positionz; 
            descript[2] = this.length-1; 
            descript[3] = positionz+this.t;
        }else if(val==2){
            let positionx = parseInt(Math.random ()*(this.width-this.t));
            descript[0] = positionx; 
            descript[1] = 0;
            descript[2] = positionx+this.t;
            descript[3] = 0;
        }else{
            let positionx = parseInt(Math.random ()*(this.width-this.t));
            descript[0] = positionx;
            descript[1] = this.length-1; 
            descript[2] = positionx+this.t;
            descript[3] = this.length-1;
        }
        
        return descript;

    }

    createroom(marowakobj,scene){
        if(this.loaded == 0){
            let boxes = this.boxes;
            let nb = this.boxes.length;
            let marowakmesh = this.doClone(marowakobj.meshes[0],  marowakobj.skeletons,1)
            marowakmesh.addLODLevel(200, null);
            marowakmesh.position = new BABYLON.Vector3(this.ox+100, 8, this.oz+100)
            let marowak = new Enemi(marowakmesh,marowakmesh.skeleton,1,7,scene);
            scene.enemies.push(marowakmesh);
            console.log("passe");
            this.loaded=1;
            for (let x = 0; x < this.length; x++) {
                for(let z = 0; z < this.width; z++){
                    boxes[nb] = this.box1.createInstance("copySaleSolebox"+nb);
                    boxes[nb].position.x += x*this.taille;
                    boxes[nb].position.z += z*this.taille;
                    boxes[nb].freezeWorldMatrix();
                    boxes[nb].checkCollisions = true;
                    nb+=1;
                }
            }
        }
        
    }

    disposesalle(){
        this.boxes.forEach(box => {
            box.dispose()
        }); 
        this.lights.forEach(light => {
            light.dispose()
        });
    }


    doClone(originalMesh, skeletons,id) {
        let myClone;
    
        myClone = originalMesh.clone("enemimarowak");
        if(!skeletons) return myClone;
    
        // The mesh has at least one skeleton
        if(!originalMesh.getChildren()) {
            myClone.skeleton = skeletons[0].clone("clone_" + id + "_skeleton");
            return myClone;
        } else {
            if(skeletons.length === 1) {
                // the skeleton controls/animates all children, like in the Dude model
                let clonedSkeleton = skeletons[0].clone("clone_" + id + "_skeleton");
                myClone.skeleton = clonedSkeleton;
                let nbChildren = myClone.getChildren().length;
    
                for(let i = 0; i < nbChildren;  i++) {
                    myClone.getChildren()[i].skeleton = clonedSkeleton
                }
                return myClone;
            } else if(skeletons.length === originalMesh.getChildren().length) {
                // each child has its own skeleton
                for(let i = 0; i < myClone.getChildren().length;  i++) {
                    myClone.getChildren()[i].skeleton = skeletons[i].clone("clone_" + id + "_skeleton_" + i);
                }
                return myClone;
            }
        }
    }
}