import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, NavParams, AlertController, MenuController } from '@ionic/angular';

import {FirebaseService} from '../services/firebase.service';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';

@Component({
  selector: 'app-caso',
  templateUrl: './caso.page.html',
  styleUrls: ['./caso.page.scss'],
})
export class CasoPage implements OnInit {
  modelo={estado:{regiones:[]},municipio:{regiones:[]}};
  coleccion="caso";
  isUpdate=false; 
  doc = {id:"",dateCreation: new Date().toISOString(),idCase:"",titulo:"",idClassification:"",riesgo:"",impacto:"",description:"",municipio:"",address:"",estatus:"Activo"};

  observador:any;
  constructor(
    private router:Router,
    private alertController:AlertController,
    public firebaseService: FirebaseService,
    public nativeGeocoder: NativeGeocoder
    ) {}

  ngOnInit() {
    console.log("ngOnInit",this.doc,this.firebaseService["usuario"]);      
    if (this.firebaseService.modelo["casoEntity"]) {
      this.isUpdate=true;
      this.doc=this.firebaseService.modelo["casoEntity"];
      let refEvidencias="caso/"+this.doc.id+"/evidencias";
      this.firebaseService.consultarColeccion(refEvidencias)
        .then(snap=>this.firebaseService.modelo["evidencias"]=snap)
    } else {
      this.firebaseService.getLocation().then(coords=>{
        this.doc["latitude"]=coords.latitude;
        this.doc["longitude"]=coords.longitude;
        this.getGeoencoder(coords.latitude,coords.longitude)
          .then(address=>{
            this.doc.id=this.firebaseService.getId();
            this.doc["idObservador"]=this.firebaseService["usuario"].id;
            this.doc["address"]=address;
            this.firebaseService.getFolio("caso").then(snap=>{
              this.doc["idCase"]=snap.folio;
              this.firebaseService.modelo["casoEntity"]=this.doc;
              this.firebaseService.modelo["evidencias"]=[];
            });      
          })
      })
    }
    this.firebaseService.consultarColeccion("clases");
    this.getRegiones("regiones");
    console.log("init doc", this.doc);
  }
/*
  public registrar() {
    this.firebaseService.addDocumentGetId(this.coleccion, this.doc)
      .then(snap=>{
        let ref=this.coleccion+"/"+snap+"/evidencias";
        alert(ref);
        let long=this.firebaseService.modelo["evidencias"].length;
        alert(long);
        this.firebaseService.modelo["evidencias"].forEach((element, index) => {
          alert(index);
          this.firebaseService.upsertDocument(ref, index, element);
        });
    });
    this.presentAlert("Caso registrado"); 
  }
*/
  public actualizar() {
    this.firebaseService.upsertDocument(this.coleccion, this.doc.id, this.doc )
      .then(snap=>{
        let ref=this.coleccion+"/"+this.doc.id+"/evidencias";
        let deletes=0;
        this.firebaseService.modelo["evidencias"].forEach((element, index) => {
          if (element.delete) {
            this.firebaseService.deleteDocument(ref, element.id);
            deletes++;
          } else {
            let id= "sq-"+(index-deletes);
            this.firebaseService.upsertDocument(ref, id, element);
            //.then(success=>alert("success"),err=>alert(err));
          }  
        });
    });
    this.presentAlert("Caso actualizado"); alert
  }

  public borrar() {
    this.firebaseService.deleteDocument(this.coleccion, this.doc.id );  
    this.presentAlert("Caso borrado"); 
  }

  goCamara() {
    //this.router.navigate(["tabs/tabs/tab1/camara"]);
    this.router.navigate(["tabs/tabs/tab2/camara/video"]);
  }

  salir() {
    this.router.navigate(['casos']);
  }
  
  async presentAlert(message) {
    const alert = await this.alertController.create({
      header: 'Alert',
      subHeader: 'Subtitle',
      "message": message,
      buttons: ['OK']
    });
    await alert.present();
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
          this.modelo.estado=element;
          return true;
        }      
    });    
    console.log("setMun", idxEdo);
    this.firebaseService.modelo[coleccion][idxEdo][coleccion].filter((element,index)=>{
      if (element.id==idx[3]) {
         idxMun=index;
         this.modelo.municipio=element;
         return true;
      }      
    });
    console.log("setCol", idxMun);
    this.firebaseService.modelo[coleccion][idxEdo][coleccion][idxMun][coleccion].filter((element,index)=>{
      if (idx.length<=5 || element.id==idx[5]) {
         this.modelo["colonia"]=element;
         return true;
      }      
    });
  }

  setIdRegion(coleccion) {
    let ref:string = coleccion+"/"+this.modelo.estado["id"]+"/"+coleccion+"/"+this.modelo["municipio"]["id"];
    this.doc["idRegion"]=ref;
    this.doc["municipio"]=this.modelo.estado["region"]+"/"+this.modelo["municipio"]["nombre"];
  }

  getGeoencoder(latitude,longitude){  
    //Return Comma saperated address
    function generateAddress(addressObj){
      let obj = [];
      let address = "";
      for (let key in addressObj) {
        obj.push(addressObj[key]);
      }
      obj.reverse();
      for (let val in obj) {
        if(obj[val].length)
        address += obj[val]+', ';
      }
      return address.slice(0, -2);
    }
    //
    return new Promise<any>((resolve, reject) => {
      let geoencoderOptions: NativeGeocoderOptions = {
        useLocale: true,
        maxResults: 5
      };
      this.nativeGeocoder.reverseGeocode(latitude, longitude, geoencoderOptions)
      .then((result: NativeGeocoderResult[] ) => {
        this.modelo["address"] = generateAddress(result[0]);
        resolve(this.modelo["address"]);
      })
      .catch((error: any) => {
        alert('Error getting location'+ JSON.stringify(error));
      });
    });
  }

}