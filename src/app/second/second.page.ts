import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-second',
  templateUrl: './second.page.html',
  styleUrls: ['./second.page.scss'],
})
export class SecondPage implements OnInit {
  mensaje: any = {};
  estatus: any = "";
  doc: any = '';

  constructor(private route: ActivatedRoute) { 
    this.mensaje = this.route.snapshot.params["mensaje"];
    this.estatus = this.route.snapshot.params["estatus"];
    this.doc = JSON.parse(this.mensaje);
  }

  ngOnInit() {
  }

}
