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
  doc = {id:"",tipo:"",idCaso:"",accion:"",descripcion:"",fhAlta:"",fhFinPlan:"",responsable:"",informe:"",avance:"",fhFin:"",estatus:"",idEncuesta:""};
  delta:any;
  //fecha: String = new Date().toISOString();

  constructor(

    private alertController:AlertController,
    private activatedRoute :ActivatedRoute, 
    public firebaseService:FirebaseService,
  ) {
  }

  ngOnInit() {
    console.log('ngOnInit');
    this.doc = JSON.parse(this.activatedRoute.snapshot.params["item"]);
    this.firebaseService.getColeccion("encuestas");
  }

  public registrar() {
    this.firebaseService.updateDocument(this.coleccion, this.doc.id, this.doc );
    this.presentAlert("Documento actualizado");          
  }

  public actualizar() {
    this.firebaseService.updateDocument(this.coleccion, this.doc.id, this.doc );
    this.presentAlert("Acción actualizado"); 
  }

  public borrar() {
    this.firebaseService.deleteDocument(this.coleccion, this.doc.id );  
    this.presentAlert("Acción borrado"); 
  }

  async presentAlert(message) {
    const alert = await this.alertController.create({
      header: 'Actividades',
      subHeader: 'Asignación',
      "message": message,
      buttons: ['OK']
    });
    await alert.present();
  }

  public valrang() {
    return Number(this.doc.avance) < 0 || Number(this.doc.avance)>100;
  }

}
