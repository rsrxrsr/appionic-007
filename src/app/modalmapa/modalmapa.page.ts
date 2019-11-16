import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
declare var google;

@Component({
  selector: "app-modalmapa",
  templateUrl: "./modalmapa.page.html",
  styleUrls: ["./modalmapa.page.scss"]
})
export class ModalmapaPage implements OnInit {
  item = null;
  map: any;
  constructor(private activatedRoute: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.item = this.activatedRoute.snapshot.paramMap.get("item");
    console.log(this.item);
    this.item = JSON.parse(this.item);
    this.loadMap(this.item);
  }

  loadMap(mapa: any) {
    console.log("LoadMap", mapa);
    let latitude = Number(mapa.latitude);
    let longitude = Number(mapa.longitude);
    let myLatLng = { lat: latitude, lng: longitude };
    console.log(myLatLng);
    // create a new map by passing HTMLElement
    let mapEle: HTMLElement = document.getElementById("mapauser");
    // create map
    this.map = new google.maps.Map(mapEle, {
      center: myLatLng,
      zoom: 12
    });
    // crete marker
    let marker = new google.maps.Marker({
      position: myLatLng,
      map: this.map,
      title: "Centro"
    });
    //
    google.maps.event.addListenerOnce(this.map, "idle", () => {
      mapEle.classList.add("show-map");
      google.maps.event.trigger(mapEle, "resize");
    });
    //
    var poligono = new google.maps.Polygon({
      path: mapa.demarcacion,
      map: this.map,
      strokeColor: "rgb(255, 0, 0)",
      fillColor: "rgb(255, 255, 0)",
      strokeWeight: 4
    });
    console.log("Mapa", this.map);
    google.maps.event.trigger(mapEle, "resize");
  }
  salir() {
    this.router.navigate(["usuario"]);
  }
}
