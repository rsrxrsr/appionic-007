import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {FirebaseService} from '../services/firebase.service';

@Component({
  selector: 'app-acciones',
  templateUrl: './acciones.page.html',
  styleUrls: ['./acciones.page.scss'],
})
export class AccionesPage implements OnInit {

  constructor(
    private router: Router,
    public firebaseService:FirebaseService
  ) {
    if (!this.firebaseService["usuario"]) {
      this.router.navigate(["/login"]);
      return;
    } 
  }

  ngOnInit() {
    this.firebaseService.findAcciones("acciones", "estatus","==","Activo")
  }
        
  public selectRow(event, item ){
    console.log("Item",item);
    item=JSON.stringify(item);
    this.router.navigate(["/accion",item]);
  }

}
