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
  doc = {id:"",dateCreation: new Date().toISOString(),idCase:"",titulo:"",idClassification:"",riesgo:"",impacto:"",description:"",municipio:"",address:""};

  observador:any;
  constructor(
    private router:Router,
    private alertController:AlertController,
    public firebaseService: FirebaseService,
    public nativeGeocoder: NativeGeocoder
    ) {}

  ngOnInit() {
    console.log("ngOnInit",this.doc,this.firebaseService["usuario"]);      
    if (this.firebaseService.model["rowCaso"]) {
      this.isUpdate=true;
      this.doc=this.firebaseService.model["rowCaso"];
    } else {
      this.firebaseService.getLocation().then(coords=>{
        this.doc["latitude"]=coords.latitude;
        this.doc["longitude"]=coords.longitude;
        this.getGeoencoder(coords.latitude,coords.longitude)
          .then(address=>this.doc["address"]=address)
      })
      this.firebaseService.getFolio("caso").then(snap=>{
        this.doc["idCase"]=snap.folio});
    }
    this.doc["idObservador"]=this.firebaseService["usuario"].id;
    this.firebaseService.consultarColeccion("clases");
    this.firebaseService.getRegiones("regiones").then(snap=>{
      console.log("Regiones", this.firebaseService.modelo['regiones'].length);
    });
    console.log("init doc", this.doc);
  }

  public registrar() {
    this.firebaseService.addDocument(this.coleccion, this.doc );
    this.presentAlert("Caso registrado"); 
  }

  public actualizar() {
    this.firebaseService.updateDocument(this.coleccion, this.doc.id, this.doc );
    this.presentAlert("Caso actualizado"); 
  }

  public borrar() {
    this.firebaseService.deleteDocument(this.coleccion, this.doc.id );  
    this.presentAlert("Caso borrado"); 
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