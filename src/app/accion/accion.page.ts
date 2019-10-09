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
  doc = {id:"",tipo:""};
  delta:any; 

  constructor(

    private alertController:AlertController,
    private activatedRoute :ActivatedRoute, 
    private firebaseService:FirebaseService
  ) {
  }

  ngOnInit() {
    console.log('ngOnInit');
    this.doc = JSON.parse(this.activatedRoute.snapshot.params["item"]);
    this.firebaseService.consultarColeccion("encuestas");
  }

  public register() {
    this.firebaseService.editarDocumento (this.coleccion, this.doc.id, this.doc );
    this.presentAlert("Documento actualizado");          
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
