import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {FirebaseService} from '../services/firebase.service';

@Component({
  selector: 'app-acciones',
  templateUrl: './acciones.page.html',
  styleUrls: ['./acciones.page.scss'],
})
export class AccionesPage implements OnInit {
  public coleccion = "acciones";
  public items = [];
  public searchData: string = "";
  public swFind = false;
  public toggle = [];

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
    console.log("ngOninit:findAcciones")
    this.firebaseService.findAcciones(this.coleccion, this)
    .then(snap => {
      this.items = this.firebaseService.modelo[this.coleccion].slice();
    });
    console.log(this.items);
  }
        
  public selectRow(event, item ){
    console.log("Item",item);
    item=JSON.stringify(item);
    this.router.navigate(["/accion",item]);
  }

  public watchColeccion() {
    this.setFilter("searchValue", this.firebaseService.modelo[this.coleccion]);
  }

  public setFilter(searchData, data) {
    this.swFind = true;
    let searchValue = document.querySelector("#searchAcciones")["value"];
    console.log("Filter", searchData, " value=", searchValue);
    this.items = data.filter(item => {
      let searchText = item.accion;
      return searchText.toLowerCase().indexOf(searchValue.toLowerCase()) > -1;
    });
    this.swFind = false;
  }

  public setSort(item) {
    console.log(item);
    if (!this.toggle[item]) {
      this.toggle[item] = -1;
    }
    this.toggle[item] = this.toggle[item] * -1;
    let _this = this;
    this.items.sort(function(a, b) {
      if (a[item] > b[item]) {
        return 1 * _this.toggle[item];
      }
      if (a[item] < b[item]) {
        return -1 * _this.toggle[item];
      }
      return 0;
    });
  }

}
