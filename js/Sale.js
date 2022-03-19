//import * as BABYLON from "@babylonjs/core";
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
    }

    create(scene) {
        var box1 = BABYLON.Mesh.CreateBox("Box1", this.taille, scene);
        box1.Color = new BABYLON.Color3(1, 0, 0);
        var materialBox = new BABYLON.StandardMaterial("mat", scene);
        var texture = new BABYLON.Texture("img/sole2.jpg", scene);
        materialBox.specularColor = new BABYLON.Color3(0, 0, 0);
        materialBox.diffuseTexture = texture;
        box1.material = materialBox;
        box1.position.y= this.oy;
        box1.position.x= this.ox;
        box1.position.z= this.oz;
        var box2 = BABYLON.Mesh.CreateBox("Box1", this.taille, scene);
        box2.Color = new BABYLON.Color3(1, 0, 0);
        var materialBox2 = new BABYLON.StandardMaterial("mat", scene);
        var texture2 = new BABYLON.Texture("img/mure.jpg", scene);
        materialBox2.diffuseTexture = texture2;
        // to be taken into account by collision detection
        box1.checkCollisions = true;

        box2.material = materialBox2;
        box2.position.y= this.oy;
        box2.position.x= this.ox;
        box2.position.z= this.oz;
        // to be taken into account by collision detection
        box2.checkCollisions = true;
        let boxes = [];
        let nb = 0
        for (let x = 0; x < this.length; x++) {
            for(let z = 0; z < this.width; z++){
                if(x==0 || x==this.length-1 || z==0 || z==this.width-1){
                    if(this.porte[0]<=x && x<=this.porte[2] && this.porte[1]<=z && z<=this.porte[3]){
                        boxes[nb] = box1.clone();
                        boxes[nb].position.x += x*this.taille;
                        boxes[nb].position.z += z*this.taille;
                        //collision
                        boxes[nb].checkCollisions = true;
                        nb+=1;
                    }else{
                        for(let y = 0; y < this.height; y++){
                            boxes[nb] = box2.createInstance("copySalebox"+nb);
                            boxes[nb].position.x += x*this.taille;
                            boxes[nb].position.z += z*this.taille;
                            boxes[nb].position.y += y*this.taille;
                            boxes[nb].checkCollisions = true;
                            nb+=1;  
                        }
                    }
                }else{
                    boxes[nb] = box1.createInstance("copySalebox"+nb);
                    boxes[nb].position.x += x*this.taille;
                    boxes[nb].position.z += z*this.taille;
                    boxes[nb].checkCollisions = true;
                    nb+=1;
                }
            }    
        }
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
    
}