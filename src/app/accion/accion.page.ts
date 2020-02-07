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
  //fecha: String = new Date().toISOString();
  //fh = new Date().toISOString().slice(0,10); 
  fecha: Date = new Date();
  fh = this.fecha.toLocaleDateString();
  doc = {id:"",tipo:"",idCaso:"",accion:"",descripcion:"",fhAlta:"",fhFinPlan:"",responsable:"",informe:"",avance:"",fhFin:this.fecha,estatus:"",idEncuesta:""};
  delta:any;
  informe:String="";

  constructor(

    private alertController:AlertController,
    private activatedRoute :ActivatedRoute, 
    public firebaseService:FirebaseService,
  ) {}

  ngOnInit() {
    console.log('ngOnInit', this.fecha);
    this.doc = JSON.parse(this.activatedRoute.snapshot.params["item"]);
    this.doc.fhFin=this.fecha;
    this.firebaseService.getColeccion("encuestas");
  }

  public registrar() {
    this.doc.informe = this.doc.informe ? this.doc.informe : "";
    this.doc.informe+="\r"+this.fh+" "+this.firebaseService["usuario"].usuario+": "+this.informe;
    this.firebaseService.updateDocument(this.coleccion, this.doc.id, this.doc );
    this.presentAlert("Documento registrado");          
  }

  public actualizar() {
    this.firebaseService.updateDocument(this.coleccion, this.doc.id, this.doc );
    this.presentAlert("Documento actualizado"); 
  }

  public borrar() {
    this.firebaseService.deleteDocument(this.coleccion, this.doc.id );  
    this.presentAlert("Documento borrado"); 
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
    return (this.doc.idCaso) ? Number(this.doc.avance) < 0 || Number(this.doc.avance)>100 : false ; 
  }

}
