import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, NavParams, AlertController, MenuController } from '@ionic/angular';

import {FirebaseService} from '../services/firebase.service';

@Component({
  selector: 'app-accion',
  templateUrl: './accion.page.html',
  styleUrls: ['./accion.page.scss'],
})
export class AccionPage implements OnInit {

  coleccion="acciones";
  isUpdate=false; 
  createSuccess = false;
  doc = {id:"",tipo:"",idCaso:"",accion:"",descripcion:"",fhAlta:"",fhFinPlan:"",responsable:"",informe:"",avance:"",fhFin:"",estatus:""};
  delta:any; 

  constructor(

    private alertController:AlertController,
    private activatedRoute :ActivatedRoute, 
    public firebaseService:FirebaseService,
  ) {
  }

  ngOnInit() {
    console.log('ngOnInit');
    this.doc = JSON.parse(this.activatedRoute.snapshot.params["item"]);
    this.firebaseService.consultarColeccion("encuestas");
  }

  public registrar() {
    this.firebaseService.updateDocument(this.coleccion, this.doc.id, this.doc );
    this.presentAlert("Documento actualizado");          
  }

  public actualizar() {
    this.firebaseService.updateDocument(this.coleccion, this.doc.id, this.doc );
    this.presentAlert("Caso actualizado"); 
  }

  public borrar() {
    this.firebaseService.deleteDocument(this.coleccion, this.doc.id );  
    this.presentAlert("Caso borrado"); 
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

}
