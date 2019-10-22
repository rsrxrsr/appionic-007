import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

declare var google;

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit {
//@ViewChild("map", {static:false}) mapEle:ElementRef;
  item={latitude:19.36,longitude:-99.18,address:"somewhere beyonce de sea"}; 
  map:any;
 
  constructor() { }
  
  ngOnInit() {
    this.loadMap();
  }

  loadMap(){
    console.log("LoadMap");

    let mapEle: HTMLElement = document.getElementById('map');

    let myLatLng = {lat: Number(this.item.latitude), lng: Number(this.item.longitude)};
    //let myLatLng = new google.maps.LatLng(Number(this.item.latitude), Number(this.item.longitude));
    this.map = new google.maps.Map(mapEle, {
      center: myLatLng,
      zoom: 12
    });
    console.log(myLatLng);
    console.log(mapEle);
    console.log(this.map);  
   
    let marker = new google.maps.Marker({
      position: myLatLng,
      map: this.map,
      title: 'Lugar de los hechos'
    });

    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      mapEle.classList.add('show-map');
      google.maps.event.trigger(mapEle, 'resize');
    });
/*
    google.maps.event.trigger(mapEle, 'resize');

    google.maps.event.addListener(this.map, "click", function(event) {
      alert(event.latLng);
      });

*/
  }

}
