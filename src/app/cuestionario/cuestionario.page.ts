import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

import {FirebaseService} from '../services/firebase.service';

@Component({
  selector: 'app-cuestionario',
  templateUrl: './cuestionario.page.html',
  styleUrls: ['./cuestionario.page.scss'],
})
export class CuestionarioPage implements OnInit {
  coleccion="encuestas";
  doc={id:'',encuesta:"",descripcion:"",instancias:{fhInicio:"",fhFin:""},preguntas:[],respuesta:{}};
  isUpdate=false;
  createSuccess = false;
  delta={idObservador:"", idRegion:"", idInstancia:"",encuesta:{}};

  constructor(
    public firebaseService: FirebaseService,
    private alertController: AlertController,
    private router : Router
    ) {
      if (!this.firebaseService["usuario"]) {
        this.router.navigate(["/login"]);
        return;
      }   
    }

  ngOnInit() {
    console.log("ngOnInit");
    this.delta.idRegion=this.firebaseService.modelo["usuarios"][0].idRegion;
    this.delta.idObservador=this.firebaseService.modelo["usuarios"][0].id;
    this.firebaseService.getInstancias("encuestas",this.delta.idRegion);
    //this.delta.idInstancia="encuestas/EyiOj3b1ejzm96UvbCON/instancias/boOOkwpfTbYi6q9x71eH";
    //this.firebaseService.consultarColeccion("encuestas");
    //this.consultarEncuesta();
  }

  setIdRegion(){
    console.log(this.delta.encuesta);
    this.delta.idRegion=this.delta.encuesta["instancia"].id;
    this.consultarEncuesta();    
  }

  public consultarEncuesta() {
    console.log('Consultar', this.delta);
    //
    let refI:string, refE:string, refP:string, refO:string ; 
    this.delta.idInstancia="encuestas/"+this.delta.encuesta["id"]+"/instancias/"+this.delta.encuesta["instancia"]["id"];
    refI=this.delta.idInstancia;
    this.firebaseService.docById(refI).then( docI => {
      refE=refI.substring(0,refI.indexOf('/i'));
      this.firebaseService.docById(refE).then( docE => {
        this.firebaseService.modelo['encuesta']=docE;
        docE["instancias"]=docI;
        refP=refE+"/preguntas";
        this.firebaseService.consultarColeccion(refP).then(snapP =>{
          docE["preguntas"]=snapP;
          snapP.forEach((element, index) => {
            refO = refP+"/"+element.id+"/opciones";
            this.firebaseService.consultarColeccion(refO).then(snapO =>{
              docE["preguntas"][index]["opciones"]=snapO;
              console.log(docE);
              this.doc=docE;
            });   
          });                
        });
      });
    });
    console.log("Consultar Encuesta",this.firebaseService.modelo['encuesta']);
    //
  }

  public setRespuestas() {
    console.log("setRespuestas",this.doc);
    let respuesta:any;
    let cuestionario={idObservador:this.delta.idObservador,fecha:new Date()};
    let refC:string = this.delta.idInstancia+"/cuestionarios";
    this.firebaseService.addDocument(refC, cuestionario ).then(res => {
      cuestionario["id"]=res.id;
      console.log("Cuestionario",cuestionario);  
      let refR=refC+"/"+cuestionario["id"]+"/respuestas";
      for (let pregunta of this.doc["preguntas"]){
        console.log("pregunta",pregunta)
        switch (pregunta.tipo) {
          case "cerrada":
            respuesta={idPregunta:pregunta.id,respuesta:pregunta.respuesta};
            this.register(refR,respuesta);
            console.log("cerrada",pregunta, pregunta.respuesta);
            break;          
          case "multiple":
            console.log("multiple", pregunta.opciones);        
            for (let opcion of pregunta.opciones) {
              if (opcion.isChecked) {
                respuesta={idPregunta:pregunta.id,idOpcion:opcion.id,respuesta:opcion.valor};
                this.register(refR,respuesta);
                console.log("Respuesta",opcion.valor);
              }
            }
            break;      
          default: //abierta
            respuesta={idPregunta:pregunta.id,respuesta:pregunta.respuesta};
            this.register(refR,respuesta);
            console.log("abierta",pregunta, pregunta.respuesta);
            break;
        }
      }
      this.presentAlert("Cuestionario registrado");
    })
  }

  public register(ref,doc) {
    console.log("Insert",ref);
    this.firebaseService.addDocument(ref, doc ) 
    .then(res => {
      console.log("idInsert;", res.id);
      doc.id=res.id;
      /*
      for (let item in this.doc.preguntas) {
        item["respuesta"]="";
      } 
      */                 
    }).catch(err =>
      this.presentAlert ("Error al registrar documento")
    );
  }

  async presentAlert(message) {
    const alert = await this.alertController.create({
      header: 'Alerta',
      subHeader: 'Encuesta',
      "message": message,
      buttons: ['OK']
    });
    await alert.present();
  }

}