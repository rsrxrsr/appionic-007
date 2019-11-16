import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { FirebaseService } from "../services/firebase.service";

@Component({
  selector: "app-casos",
  templateUrl: "./casos.page.html",
  styleUrls: ["./casos.page.scss"]
})
export class CasosPage implements OnInit {
  public coleccion = "caso";
  public items = [];
  public searchData: string = "";
  public swFind = false;
  public toggle = [];

  constructor(
    private router: Router,
    public firebaseService: FirebaseService
  ) {
    if (!this.firebaseService["usuario"]) {
      this.router.navigate(["/login"]);
      return;
    } 
  }

  ngOnInit() {
    this.firebaseService.watchColeccion(this.coleccion, this).then(snap => {
      this.items = this.firebaseService.modelo[this.coleccion].slice();
    });
    console.log(this.items);
  }

  public selectRow(event, item) {
    this.firebaseService.modelo["casoEntity"] = item;
    console.log("Item", this.firebaseService.modelo["casoEntity"]);
    this.router.navigate(["/tabs"]);
  }

  public setFilter(searchData, data) {
    const searchValue = document.querySelector("ion-searchbar").value;
    console.log("Filter", searchData, searchValue);
    this.swFind = true;
    this.items = data.filter(item => {
      let searchText = item.titulo + item.idClassification + item.municipio;
      return searchText.toLowerCase().indexOf(searchValue.toLowerCase()) > -1;
    });
    this.swFind = false;
  }

  public watchColeccion() {
    this.setFilter("searchValue", this.firebaseService.modelo[this.coleccion]);
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
