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
  }

  ngOnInit() {
    this.firebaseService.consultarColeccion("acciones");
  }
        
  public selectRow(event, item ){
    console.log("Item",item);
    item=JSON.stringify(item);
    this.router.navigate(["/accion",item]);
  }

}
