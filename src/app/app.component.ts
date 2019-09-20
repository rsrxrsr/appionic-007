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
      this.firebase.addDocument("notificaciones",{"user":"user","token":"Start"});
      this.fcm.getToken().then(token => {
        console.log('Received in background');
        console.log(token);
        alert(token);
        this.firebase.addDocument("notificaciones",{"user":"user","token":token});
      });
      this.fcm.onTokenRefresh().subscribe(token => {
        console.log(token);
        alert(token);
        this.firebase.addDocument("notificaciones",{"user":"user","token":token});
      });
      this.fcm.onNotification().subscribe(data => {
        console.log(data);
        if (data.wasTapped) {
          console.log('Received in background');
          alert('Received in background');
          this.router.navigate([data.landing_page, data.price]);
        } else {
          console.log('Received in foreground');
          alert('Received in foreground');
          this.router.navigate([data.landing_page, data.price]);
        }
      });
      this.fcm.subscribeToTopic('people');
      this.fcm.unsubscribeFromTopic('marketing');
      // End-FCM
    });
  }    
}