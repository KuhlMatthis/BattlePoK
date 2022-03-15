export default class Chemin {
    constructor(chemin, pos, fin,salles,scene) {
        this.salles = salles;
        this.box = BABYLON.Mesh.CreateBox("Box1", 10, scene);
        this.box.Color = new BABYLON.Color3(1, 0, 0);
        var materialBox = new BABYLON.StandardMaterial("mat", scene);
        var texture = new BABYLON.Texture("img/sole2.jpg", scene);
        materialBox.diffuseTexture = texture;
        this.box.material = materialBox;
        this.box.position.y = 0;
        this.boxes = [];
        this.pos = pos;
        this.copyBox(pos);
        this.portefin = fin;
        this.chemin = chemin;
        this.createconnection();
    }

    createconnection(){
        
    
        let decale = [this.portefin[0]-this.pos[0],this.portefin[1]-this.pos[1]];
        let found;
        let lastmouve = [this.pos[0],this.pos[1]];
        while(decale[0]!=0||decale[1]!=0){
            console.log("while1");
            found = true;
            if(decale[0]!=0){
                let d = this.isNegatifd(decale[0]);
                found = this.cheminMove(this.pos,[this.pos[0]+d,this.pos[1], this.pos[2]+d, this.pos[3]],decale,0,lastmouve,d);
            }
            if(decale[1]!=0){
                let d = this.isNegatifd(decale[1]);
                found = this.cheminMove(this.pos,[this.pos[0],this.pos[1]+d, this.pos[2], this.pos[3]+d],decale,1,lastmouve,d);
            }  
            if(!found){
                if(decale[1]==0){
                    let d = this.isNegatifd(decale[0]);
                    let opd = 1;
                    while(!this.cheminMove(this.pos,[this.pos[0]+d,this.pos[1], this.pos[2]+d, this.pos[3]],decale,0,lastmouve,d)){
                        this.pos = [this.pos[0],this.pos[1]+opd, this.pos[2], this.pos[3]+opd];
                        lastmouve = this.pos;
                        decale[1]-=1;
                        this.copyBox([this.pos[0]+1,this.pos[1]]);
                        this.copyBox([this.pos[0]-1,this.pos[1]]);
                        this.copyBox(this.pos)
                    }
                }
                if(decale[0]==0){
                    let d = this.isNegatifd(decale[1]);
                    let opd = 1;
                    while(!this.cheminMove(this.pos,[this.pos[0],this.pos[1]+d, this.pos[2], this.pos[3]+d],decale,1,lastmouve,d)){
                        this.pos = [this.pos[0]+opd,this.pos[1], this.pos[2]+opd, this.pos[3]];
                        lastmouve = this.pos;
                        decale[0]-=1;
                        this.copyBox([this.pos[0],this.pos[1]+1]);
                        this.copyBox([this.pos[0],this.pos[1]-1]);
                        this.copyBox(this.pos)
                    }
                }
            }
        }
    }

    copyBox(mypos){
        this.boxes[this.boxes.length+1] = this.box.clone();
        this.boxes[this.boxes.length-1].position.x = mypos[0]*10;
        this.boxes[this.boxes.length-1].position.z = mypos[1]*10;
    }

    isNegatifd(decale){
        if(decale<0){
            return -1;
        }
        return 1;
    }

    cheminMove(pos,interpos,decale,decalenb,lastmouve,d){
        //console.log(this.isCheminMove(interpos,lastmouve),interpos);
        let found = this.isCheminMove(interpos,lastmouve);
        if(found){
            lastmouve = this.pos;
            this.pos = interpos;
            this.copyBox(this.pos);
            if(decalenb==0){
                
                this.copyBox([this.pos[0],this.pos[1]+1]);
                this.copyBox([this.pos[0],this.pos[1]-1]);
            }
            if(decalenb==1){
                this.copyBox([this.pos[0]+1,this.pos[1]]);
                this.copyBox([this.pos[0]-1,this.pos[1]]);
            }
            decale[decalenb]-=d;
            this.chemin[this.chemin.length] = pos;
        }
        return found;
    }

    isCheminMove(interpos,lastmouve){
        if(lastmouve[0]== interpos[0] && lastmouve[1] == interpos[1]){
                return false;
        }
        return this.inOneSalle(interpos);
    }

    inOneSalle(interpos){
        for(let isalle= 0; isalle<this.salles.length; isalle++){
            let salle = this.salles[isalle]; 
            if(this.containe(interpos, salle.cub)){
                //console.log("In salle", isalle);
                return false;
            }
        }
        return true;
    }
    /**
     * forme x,y,x2,y2
     * @param {*} cube1 
     * @param {*} cube2 
     * @returns 
     */
    containe(cube1, cube2){
        if(cube2[2] < cube1[0] || cube1[2] < cube2[0]){
            return false;
        }
        if(cube2[3] < cube1[1] || cube1[3] < cube2[1]){
            return false;
        }
        return true;
    }



}

