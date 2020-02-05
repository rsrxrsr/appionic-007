import { Component } from '@angular/core';

import { Platform, ToastController  } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { FCM } from '@ionic-native/fcm/ngx';
import { Router } from '@angular/router';

import {FirebaseService} from './services/firebase.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private fcm: FCM,
    private router: Router,
    public toastController: ToastController,
    private firebase: FirebaseService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      // FCM
      this.fcm.getToken().then(token => {
        //alert('Get token:'+token);
        this.firebase.modelo["token"]=token;
        //console.log("token",token);
        this.firebase.addDocument("notificaciones",{"user":"user","token":token,msg:'Get'});
      });
      this.fcm.onTokenRefresh().subscribe(token => {
        //alert('Refresh:'+token);
        this.firebase.modelo["control"]={"token":token};
        //console.log("token",token);
        this.firebase.addDocument("notificaciones",{"user":"user","token":token,msg:'Refresh'});
      });
      this.fcm.onNotification().subscribe(data => {
        //console.log(data);
        let doc:any;
        doc = JSON.parse(data.mensaje);
        let estatus:string=(this.firebase["usuario"]) ? 'foreground' : 'background';
        this.presentToastWithOptions(estatus,doc.accion);
        /*
        if (data.wasTapped) {
          this.presentToastWithOptions('background');
          //console.log('Received in background ',data);
          //alert('Background msg: '+doc.accion);
          this.router.navigate([data.page,data.mensaje,'background']);
        } else {
          this.presentToastWithOptions('foreground');
          //console.log('Received in foreground ',data);
          //alert('Foreground msg: '+doc.accion);
          this.router.navigate([data.page,data.mensaje,'foreground']);
        }
        */
      });
      //this.fcm.subscribeToTopic('observadores');
      //this.fcm.unsubscribeFromTopic('observadores');
      // End-FCM
    });
  }
  
  async presentToastWithOptions(estatus:string, mensaje:string) {
    const toast = await this.toastController.create({
      header: 'Tienes una nueva actividad',
      message: mensaje,
      position: 'top',
      buttons: [
        {
          side: 'start',
          icon: 'star',
          text: 'Acciones',
          handler: () => {
            if (estatus=='foreground') {
              this.router.navigate(['/acciones']);
            } else {
              this.firebase["start"]='/acciones';
            } 
        }
        }, {
          text: 'Ok',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    toast.present();
  }

  public logout() {
    navigator['app'].exitApp();   }
  
}