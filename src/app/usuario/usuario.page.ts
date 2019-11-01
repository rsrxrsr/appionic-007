import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, AlertController, MenuController } from '@ionic/angular';

import {FirebaseService} from '../services/firebase.service';

declare var google;

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.page.html',
  styleUrls: ['./usuario.page.scss'],
})
export class UsuarioPage implements OnInit {
  coleccion="usuarios";
  regiones="regiones";
  isUpdate=false; 
  createSuccess = false;
  forma = {id:'', confirmation_password: '' };
  doc = { id: "",pass:"",foto:"",usuario:"",correo:"",roles:"",estatus:""};
  file:any;
  delta={estado:{id:'',nombre:''}, municipio:{id:'',nombre:''},colonia:{id:'',nombre:''},safeUrl:""};

  map:any;

  constructor(
    private alertController:AlertController,
    public firebaseService: FirebaseService
    ) {
      this.firebaseService.modelo[this.regiones]=[];
      this.isUpdate = true;
      this.doc = this.firebaseService["usuario"];
      //this.forma.confirmation_password=this.doc.pass;
      console.info("usuario",this.doc);
    }

  ngOnInit() {
    this.getRegiones(this.regiones);
    //this.firebaseService.getRegiones(this.regiones).then(snap=>{
    //  this.setRegiones(this.doc["idRegion"]);                  
    //})
  }

  public register() {
    //Validar
    if (this.doc.pass != this.forma.confirmation_password) {
      this.presentAlert('The password confirmation does not match.');
    } else 
    if (this.file) {
      this.firebaseService.fileUpload(this.file).then(fileInfo=>{
        this.doc["foto"]=fileInfo.downloadUrl;
        this.firebaseService.addDocument("usuarios", this.doc );
        this.firebaseService.createUser(this.doc["correo"],this.doc.pass);    
        this.presentAlert("Documento creado");          
      })
    } else {
      this.firebaseService.addDocument("usuarios", this.doc ); 
      this.firebaseService.createUser(this.doc["correo"],this.doc.pass);   
      this.presentAlert("Documento creado");          
    }
  }

  public editar() {
    if (this.file) {
      this.firebaseService.fileUpload(this.file).then(fileInfo=>{
      this.doc["foto"]=fileInfo.downloadUrl;
      this.firebaseService.updateDocument(this.coleccion, this.doc.id, this.doc );
      this.presentAlert("Documento actualizado");          
    })} else {
      this.firebaseService.updateDocument(this.coleccion, this.doc.id, this.doc );
      this.firebaseService.createUser(this.doc["correo"],this.doc.pass);   
      this.presentAlert("Documento actualizado");          
    }
  }

  public borrar() {
    this.firebaseService.deleteDocument(this.coleccion, this.doc.id );  
    this.presentAlert("Documento borrado"); 
  }

  setFile(event) {
    this.file = event.target.files[0];
    this.doc['foto']='data:image/jpeg;base64,'+this.file;
    console.log("File:",this.file);
    var reader = new FileReader();
    reader.onload = function (fd) {
      let fn = document.getElementById("idImg")['src']=fd.target['result'];
    };
    reader.readAsDataURL(this.file);
  }

  getRegiones(coleccion) {
    console.log('Consultar');
  //this.firebaseService.consultarColecciones(coleccion);
  //
    this.firebaseService.consultarColeccion(coleccion).then( snap1 => {
        snap1.forEach((element, index) => {
          let ref:string = coleccion+"/"+element.id+"/"+coleccion;
          this.firebaseService.consultarColeccion(ref).then(snap2 =>{
            this.firebaseService.modelo[coleccion][index][coleccion]=snap2;
  //
            snap2.forEach((element2, index2) => {
              let ref2=ref+"/"+element2.id+"/"+coleccion;
              this.firebaseService.consultarColeccion(ref2).then(snap3 =>{
                this.firebaseService.modelo[coleccion][index][coleccion][index2][coleccion]=snap3;
                if (this.doc["idRegion"] && this.doc["idRegion"].indexOf(element2.id) >=0 && this.isUpdate) this.setRegiones(this.doc["idRegion"]);                  
              });
            });
  //
          });   
        });
    });
  //
  }

  setRegiones(idRegion) {
    console.log("setEdo", idRegion);
    let coleccion="regiones";
    if (!idRegion) return;
    let idx = idRegion.split("/");
    let idxEdo=null, idxMun=null;
    this.firebaseService.modelo[coleccion].filter((element,index)=>{
        if (element.id==idx[1]) {
          idxEdo=index;
          this.delta.estado=element;
          return true;
        }      
    });    
    console.log("setMun", idxEdo);
    this.firebaseService.modelo[coleccion][idxEdo][coleccion].filter((element,index)=>{
      if (element.id==idx[3]) {
         idxMun=index;
         this.delta.municipio=element;
         return true;
      }      
    });
    console.log("setCol", idxMun);
    this.firebaseService.modelo[coleccion][idxEdo][coleccion][idxMun][coleccion].filter((element,index)=>{
      if (element.id==idx[5]) {
         this.delta.colonia=element;
         return true;
      }      
    });
    this.loadMap(this.delta.colonia);
  }

  setIdRegion(coleccion) {
    let ref:string = coleccion+"/"+this.delta.estado.id+"/"+coleccion+"/"+this.delta.municipio.id+"/"+coleccion+"/"+this.delta.colonia.id;
    this.doc["idRegion"]=ref;
    this.doc["region"]=this.delta.estado["region"]+"/"+this.delta.municipio["region"]+"/"+this.delta.colonia["region"];
    this.loadMap(this.delta.colonia);
  }

  loadMap(mapa:any){
    console.log("LoadMap", mapa);
    let latitude = Number(mapa.latitude);
    let longitude = Number(mapa.longitude);
    let myLatLng = {lat: latitude, lng: longitude};     
    // create a new map by passing HTMLElement
    let mapEle: HTMLElement = document.getElementById('mapauser');
    // create map
    this.map = new google.maps.Map(mapEle, {
      center: myLatLng,
      zoom: 12
    });
    // crete marker
    let marker = new google.maps.Marker({
      position: myLatLng,
      map: this.map,
      title: 'Centro'
    });
    // 
    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      mapEle.classList.add('show-map');
      google.maps.event.trigger(mapEle, 'resize');
    });
    //
    var poligono = new google.maps.Polygon({
      path: mapa.demarcacion,
      map: this.map,
      strokeColor: 'rgb(255, 0, 0)',
      fillColor: 'rgb(255, 255, 0)',
      strokeWeight: 4,
    });
    console.log("Mapa",this.map);
    google.maps.event.trigger(mapEle, 'resize');
  }

  async presentAlert(message) {
    const alert = await this.alertController.create({
      header: 'Alerta',
      subHeader: 'Usuarios',
      "message": message,
      buttons: ['OK']
    });
    await alert.present();
  }

}
