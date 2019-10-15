import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {FirebaseService} from '../services/firebase.service';

@Component({
  selector: 'app-casos',
  templateUrl: './casos.page.html',
  styleUrls: ['./casos.page.scss'],
})
export class CasosPage implements OnInit {

  public coleccion="caso";
  public items=[];
  public searchData;
  public swFind=false;
  public toggle=[];

  constructor(
    private router:Router,
    public firebaseService: FirebaseService
  ) { }

  ngOnInit() {
    this.firebaseService.consultarColeccion(this.coleccion).then(snap=>{
      this.items=snap;
    })
  }

  public selectRow(event, item ){
    this.firebaseService.model["rowCaso"]=item;
    console.log("Item",this.firebaseService.model["rowCaso"]);    
    this.router.navigate(["/tabs"]);
  }

  public setFilter(searchData, data){
    this.swFind=true;
    this.items = data.filter((item) => {
      let searchText=item.titulo+item.idClassification+item.municipio;
      return searchText.toLowerCase().indexOf(searchData)>-1;
    });
    this.swFind=false;
  }

  public setSort(item) {
    console.log(item);
    if (!this.toggle[item]) {
      this.toggle[item]=-1;
    } 
    this.toggle[item]=this.toggle[item]*-1;
    let _this=this;
    this.items.sort(
      function(a, b){
        if (a[item] > b[item]) {
          return 1*_this.toggle[item];
        }
        if (a[item] < b[item]) {
          return -1*_this.toggle[item];
        }
        return 0;
    })  
  }  

}
