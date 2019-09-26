import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
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
        alert('Get token:'+token);
        this.firebase.addDocument("notificaciones",{"user":"user","token":token,msg:'Get'});
      });
      this.fcm.onTokenRefresh().subscribe(token => {
        alert('Refresh:'+token);
        this.firebase.addDocument("notificaciones",{"user":"user","token":token,msg:'Refresh'});
      });
      this.fcm.onNotification().subscribe(data => {
        console.log(data);
        if (data.wasTapped) {
          console.log('Received in background ',data);
          alert('Received in background: '+data.page);
          this.router.navigate([data.page,data.price]);
        } else {
          console.log('Received in foreground ',data);
          alert('Received in foreground: '+data.page+data.wasTapped);
          this.router.navigate([data.page,data.price]);
        }
      });
      this.fcm.subscribeToTopic('people');
      this.fcm.unsubscribeFromTopic('marketing');
      // End-FCM
    });
  }    
}