import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, NavParams, AlertController, MenuController } from '@ionic/angular';

import {FirebaseService} from '../services/firebase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  isUpdate=false; 
  createSuccess = false;
  forma = {id:'' };
  usuario = {id:'', correo: '', pass: '', estatus:''};

  constructor(
    private router: Router,
    private navController:NavController,
    private alertController:AlertController,
    private firebaseService:FirebaseService) { }

  ngOnInit() {
    console.log('OnInit');
    this.firebaseService.logoutUser();
  }
  
  public login() {
    //this.navCtrl.push(TabsPage);  //remove for prod
    //this.firebaseService.loginUser(this.usuario.correo,this.usuario.pass);
    var usuarios:any =[];
    this.firebaseService.findColeccion("usuarios",'correo','==',this.usuario.correo).then(
      snap =>{usuarios = snap;
        console.info('FrmUsuarios',usuarios[0], this.usuario);        
        if (usuarios.length==1 && this.usuario.pass === usuarios[0].pass && usuarios[0].estatus=="Activo") {
          //this.showPopup("Success", "Account created.");
          this.usuario=usuarios[0];
          this.usuario["token"]=this.firebaseService.model["token"] ? this.firebaseService.model["token"] : "token";
          this.firebaseService.editarDocumento("usuarios",this.usuario.id, this.usuario)
          this.router.navigate(['/home']);
        } else {
          this.presentAlert("The password confirmation does not match.");
        }
      }
    );     
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
