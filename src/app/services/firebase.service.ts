import { Injectable } from "@angular/core";
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth'

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { HttpClient } from '@angular/common/http';

//import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
 
@Injectable({
  providedIn: 'root',
})
// ====================================================================================================================
export class FirebaseService {
//-------------------------------------------------------------------------------------------------------------------
  public modelo=[];
  constructor(
              public http: HttpClient,
              public afs: AngularFirestore,
              public storage: AngularFireStorage,
              public auth: AngularFireAuthModule,
              public geolocation: Geolocation,
  //          public nativeGeocoder: NativeGeocoder,
  //          public nativeGeocoderOptions:NativeGeocoderOptions
              ) {}

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // Método genérico para subir elementos a firebase.
  // params: objeto: objeto javascript, coleccion: nombre de la colección
  public addDocument(coleccion: string, objeto: any){
    delete objeto.id;
    return new Promise<any>((resolve, reject) => {
      this.afs.collection(coleccion).add(objeto)
      .then(
        res => resolve(res),
        err => reject(err)
      );
    });
  }

  public upsertDocument( coleccion: string, id: string, doc: any){
    console.log("Upsert",coleccion,id,doc);
    return new Promise<any>((resolve, reject) => {
      this.afs.collection(coleccion).doc(id).set(doc)
      .then(
        res => resolve(res),
        err => reject(err)
      )
    })
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // Método genérico para editar un documento en firebase, es necesario que el objeto tenga el id inyectado o pasado como parámetro
  // params: objeto: objeto javascript, colección: nombre de la colección.
  public updateDocument( coleccion: string, id: string, doc: any){
    //if(id != null)
    //objeto.id = id;
    console.log("Update",coleccion,id,doc);
    let objeto = Object.assign({}, doc);  
    delete objeto.id;  
    return new Promise<any>((resolve, reject) => {
      this.afs.collection(coleccion).doc(id).update(objeto)
      .then(
        res => resolve(res),
        err => reject(err)
      )
    })
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // Método genérico para eliminar un documento en firebase
  // params: id del documento, colección
  public deleteDocument(coleccion, id){
    return new Promise<any>((resolve, reject) => {
      this.afs.collection(coleccion).doc(id).delete()
      .then(
        res => resolve(res),
        err => reject(err)
      );
    });
  }

  public getId(){  
    return this.afs.createId();
  }

  public getFolio( coleccion: string) {
    console.log("Folio",coleccion);
    return new Promise<any>((resolve, reject) => {
      this.docById("secuencias/"+coleccion)
      .then(snap=>{
        if (snap) {
          snap.folio++;
        } else {
          snap={"folio":1};
        }
        this.upsertDocument("secuencias", coleccion, snap)
        .then (
          res => resolve(snap),
          err => reject(err)
        )  
      })
    })
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // Método genérico para obtener una colección
  // params: colección: nombre de la colección
  // para leer un elemento obtenido com un objeto normal javascript: respuesta[i].payload.doc.data()
  //item['municipios']=[{id:1,cvMunicipio:"CV",municipio:"mun"}];
  public consultarColeccion(coleccion: string){
    return new Promise<any>((resolve, reject) => {
      this.afs.collection(coleccion).snapshotChanges().subscribe(querySnapshot => {
        var snapshot = [];
        querySnapshot. forEach(function(doc) {
          var item=doc.payload.doc.data();
          item['id']=doc.payload.doc.id;
          snapshot.push(item);
        });
        console.log("Consulta: ", coleccion, snapshot );
        this.modelo[coleccion]=snapshot;
        resolve(snapshot);
      })      
    })
  }

  public watchColeccion(coleccion: string, componente:any){
    console.log("Watches: ", coleccion);
    return new Promise<any>((resolve, reject) => {
      this.afs.collection(coleccion, ref =>
        ref.where("idObservador", "==", this["usuario"].id).where("estatus","==","Activo").orderBy('fhAlta'))
      .snapshotChanges().subscribe(querySnapshot => {
        var snapshot = [];
        querySnapshot. forEach(function(doc) {
          var item=doc.payload.doc.data();
          item['id']=doc.payload.doc.id;
          snapshot.push(item);
        });
        console.log("Watches: ", coleccion, snapshot );
        this.modelo[coleccion]=snapshot;
        componente.watchColeccion();
        resolve(snapshot);
      })      
    })
  }

  public getColeccion(coleccion: string){
    return new Promise<any>((resolve, reject) => {
      this.afs.collection(coleccion).snapshotChanges().subscribe(querySnapshot => {
        var snapshot = {};
        querySnapshot. forEach(function(doc) {
          snapshot[doc.payload.doc.id]=doc.payload.doc.data();
        });
        console.log("Consulta: ", coleccion, snapshot );
        this.modelo[coleccion]=snapshot;
        resolve(snapshot);
      })      
    })
  }

  public findOrderCollection(coleccion: string, campo:string, operador, value) {
    return new Promise<any>((resolve, reject) => {
      this.afs.collection(coleccion, ref => ref.where(campo, operador, value).orderBy('fhAlta'))
        .snapshotChanges().subscribe(querySnapshot => {
          var snapshot = [];
          let ids = [];
          querySnapshot. forEach(function(doc) {
            var item=doc.payload.doc.data();
            item['id']=doc.payload.doc.id;
            snapshot.push(item);
            ids["id"]=doc.payload.doc.id;
          });
          console.log("Consulta: ", coleccion, snapshot );
          this.modelo[coleccion]=snapshot;
          resolve(snapshot);
          })     
    });
  }

  public getOrderCollection(coleccion: string) {
    return new Promise<any>((resolve, reject) => {
      this.afs.collection(coleccion, ref => ref.orderBy('fhAlta'))
        .snapshotChanges().subscribe(querySnapshot => {
          var snapshot = [];
          querySnapshot. forEach(function(doc) {
            var item=doc.payload.doc.data();
            item['id']=doc.payload.doc.id;
            snapshot.push(item);
          });
          console.log("Consulta: ", coleccion, snapshot );
          this.modelo[coleccion]=snapshot;
          resolve(snapshot);
          })     
    });
  }

  public docById(doc: string){
    console.log("doc", doc)
    return new Promise<any>((resolve, reject) => {
      this.afs.doc(doc).ref.get()
      .then(querySnapshot => {
        let snapshot = querySnapshot.data();
        if (snapshot) {
          snapshot['id'] =  querySnapshot.id;
        }
        //console.log("docById", querySnapshot.ref.parent , "par", querySnapshot.ref.parent.parent, "path", querySnapshot.ref.path); 
        resolve(snapshot);
      })
    })
  }

  public findById(coleccion: string, id:string){
    console.log("Coll", coleccion,"cfb",id)
    return new Promise<any>((resolve, reject) => {
      this.afs.collection(coleccion).doc(id).ref.get()
      .then(querySnapshot => {
        let snapshot = querySnapshot.data();
        snapshot['id'] = id;
        console.log("snapshot", snapshot); 
        resolve(snapshot);
      })
    })
  }

  public findColeccion(coleccion: string, campo:string, operador, value){
    return new Promise<any>((resolve, reject) => {
      this.afs.collection(coleccion, ref => ref.where(campo, operador, value))
        .snapshotChanges().subscribe(querySnapshot => {
          var snapshot = [];
          querySnapshot. forEach(function(doc) {
            var item=doc.payload.doc.data();
            item['id']=doc.payload.doc.id;
            snapshot.push(item);
          });
          console.log("Consulta: ", coleccion, snapshot );
          this.modelo[coleccion]=snapshot;
          resolve(snapshot);
        })     
    });
  }

  public findAcciones(coleccion: string, campo:string, operador, value){
    return new Promise<any>((resolve, reject) => {
      let region=this["usuario"].region;
      this.afs.collection(coleccion, ref => ref.where(campo, operador, value))
        .snapshotChanges().subscribe(querySnapshot => {
          var snapshot = [];
          querySnapshot. forEach(function(doc) {
            let item=doc.payload.doc.data();
            if (region.includes(item["region"])) {
              item['id']=doc.payload.doc.id;
              snapshot.push(item);  
            }
          });
          console.log("Consulta: ", coleccion, snapshot );
          this.modelo[coleccion]=snapshot;
          resolve(snapshot);
        })     
    });
  }

  public consultarColecciones(coleccion: string){
    return new Promise<any>((resolve, reject) => {
      this.afs.collectionGroup(coleccion).snapshotChanges().subscribe(querySnapshot => {
        var snapshot = [];
        querySnapshot.forEach(function(doc) {          
          var item=doc.payload.doc.data();
          item['id']=doc.payload.doc.id;
          snapshot.push(item);
        });
        console.log("Current snapshot 0: ", snapshot, snapshot.length);
        this.modelo[coleccion]=snapshot;
        resolve(snapshot);
      })      
    })
  }

  public getInstancias(coleccion,region) {
    console.log('Instancias');
    let f = new Date();
    let fecha=f.getFullYear() + "/" + (f.getMonth() +1) + "/" + f.getDate() ;
    this.modelo["encuestaInstancia"]=[];
    return new Promise<any>((resolve, reject) => {
      this.consultarColeccion(coleccion).then( snap1 => {
        console.log("snap1", snap1);
        snap1.forEach((element1, index1) => {
          let ref1:string = coleccion+"/"+element1.id+"/instancias";
          //, ref => ref.where("fhFin", ">", fecha)        
          this.afs.collection(ref1)
            .snapshotChanges().subscribe(snap2 => {
              console.log("snap2", snap2);
              let max:any;
              snap2.forEach(element2=>{
                let doc=element2.payload.doc.data();
                doc["id"]=element2.payload.doc.id;
                console.log("MaxInstancia",region,doc["idRegion"],doc["fhFin"]);
                if(region.includes(doc["idRegion"])) {
                  if (!max || max.fhFin<doc["fhFin"]) {
                    max=doc;
                  }  
                }
              })
              if (max) {
                console.log("max",max);
                element1.instancia=max;
                this.modelo["encuestaInstancia"].push(element1);  
              }
          });   
        });
        console.log("resolve",snap1);
        resolve(snap1);
      });
    });
  }

  public getRegiones(coleccion) {
    console.log('Regiones');
    return new Promise<any>((resolve, reject) => {
    this.consultarColeccion(coleccion).then( snap1 => {
        snap1.forEach((element1, index1) => {
          let ref1:string = coleccion+"/"+element1.id+"/"+coleccion;
          this.consultarColeccion(ref1).then(snap2 =>{
            this.modelo[coleccion][index1][coleccion]=snap2;
  //
            snap2.forEach((element2, index2) => {
              let ref2=ref1+"/"+element2.id+"/"+coleccion;
              this.consultarColeccion(ref2).then(snap3 =>{
                this.modelo[coleccion][index1][coleccion][index2][coleccion]=snap3;
              });
              if (snap1.length==index1+1 && snap2.length==index2+1) {
                resolve(this.modelo[coleccion]);
              }
            });
  //
          });   
        });
      });
    });
  //
  }

  setRegiones(idRegion) {
    console.log("setEdo", idRegion);
    let coleccion="regiones";
    if (!idRegion) return;
    let idx = idRegion.split("/");
    let idxEdo=null, idxMun=null;
    this.modelo[coleccion].filter((element,index)=>{
        if (element.id==idx[1]) {
          idxEdo=index;
          this.modelo["estado"]=element;
          return true;
        }      
    });    
    console.log("setMun", idxEdo);
    this.modelo[coleccion][idxEdo][coleccion].filter((element,index)=>{
      if (element.id==idx[3]) {
         idxMun=index;
         this.modelo["municipio"]=element;
         return true;
      }      
    });
    console.log("setCol", idxMun);
    this.modelo[coleccion][idxEdo][coleccion][idxMun][coleccion].filter((element,index)=>{
      if (idx.length<=5 && element.id==idx[5]) {
         this.modelo["colonia"]=element;
         return true;
      }      
    });
  }

// File Upload

  public uploadDocumento(coleccion: string, objeto: any){
    delete objeto.id;
    return new Promise<any>((resolve, reject) => {
      this.afs.collection(coleccion).add(objeto)
      .then(
        res => resolve(res),
        err => reject(err)
      );
    });
  }

public fileUpload(data:any) {
  console.log("Subiendo", data, "fin");
  let coleccion='casos/evidencias/'+data.name;
  const file = this.storage.ref(coleccion);
  return new Promise<any>((resolve, reject) => {
    file.put(data)
    .then(snapshot => {
      console.log("success",snapshot);
      file.getDownloadURL().subscribe(downloadUrl=>{
        console.log(downloadUrl);
        let fileInfo = {
          name: snapshot.metadata.name,
          created: snapshot.metadata.timeCreated,
          downloadUrl: downloadUrl,
          fullPath: snapshot.metadata.fullPath,
          contentType: snapshot.metadata.contentType,
          size: snapshot.metadata.size }
        resolve(fileInfo);  
        this.addDocument('files',fileInfo);
      }) 
    }, err => {
      console.log("err",err);
      reject(err);
    })
  })
}       
  
public imageUpload(filename:string, data:any, ext:string) {
  console.log("Subiendo", data, "fin");
  //var imagen = 'data:image/jpeg;base64,' + data;
  const file = this.storage.ref('casos/evidencias/'+filename+ext);
  let type:string;
  let base:string;
  if (ext===".jpg") {
    type='image/jpeg';
    base='base64';
  } else {
    type='video/mp4';
    base='data_url';
  }
  return new Promise<any>((resolve, reject) => {
    file
    .putString(data, base, {contentType: type})
    .then(snapshot => {
        console.log("success",snapshot);
        file.getDownloadURL().subscribe(downloadUrl=>{
          console.log(downloadUrl);
          let fileInfo = {
            name: snapshot.metadata.name,
            created: snapshot.metadata.timeCreated,
            url: downloadUrl,
            fullPath: snapshot.metadata.fullPath,
            contentType: snapshot.metadata.contentType,
            size: snapshot.metadata.size }
          resolve(fileInfo);  
          this.addDocument('files',fileInfo);
        }) 
      }, err => {
        console.log("err",err);
        alert(err);
      })
    });  
  } 

  // Authentication
  
  createUser(email, password) {
    console.log('Creando el usuario con email ' + email);  
    //this.auth  createUserWithEmailAndPassword(email, password)    .then(function (user) {
    this.afs.firestore.app.auth().createUserWithEmailAndPassword(email, password)
    .then(function (user) {
      console.log('¡Creamos al usuario!');
    })
    .catch(function (error) {
      console.error(error)
    });
  }
  
  loginUser(a_email, a_password) {
    console.log('Loging user ' + a_email);
    let email="ricardo.romero@people-media.com.mx";
    let crashtapen="Ventana6561"; 
    return new Promise<any>((resolve, reject) => {
      this.afs.firestore.app.auth().signInWithEmailAndPassword(email, crashtapen)
      .then(function (user) {
        console.log('Credenciales correctas, ¡bienvenido!');
        resolve(email);
      })
      .catch(function (error) {
        console.log(error);
      });
    });
  }
  
  logoutUser() {
    this.afs.firestore.app.auth().signOut();
    console.log("Logout User");
  }

// Geolocation

getLocation() {
  return new Promise<any>((resolve, reject) => {
  const options : any = {
     enableHighAccuracy : false,
     timeout : 3000,
     maximumAge : 0
  }
  this.geolocation.getCurrentPosition(options).then((resp) => {       
    console.log('Coords',  resp.coords);
    this.modelo["coords"] = resp.coords;
    this.modelo["latitude"]  = resp.coords.latitude;
    this.modelo["longitude"] = resp.coords.longitude;
    //this.getGeoencoder(resp.coords.latitude, resp.coords.longitude);
    resolve(resp.coords);
  }).catch((error) => {
    console.log('Error getting location', error);
  });
/*
  let watch = this.geolocation.watchPosition();
  watch.subscribe((resp) => {
    console.log('Watch Coords',  resp.coords);
    this.modelo["coords"] = resp.coords;
    this.modelo["latitud"]  = resp.coords.latitude;
    this.modelo["longitud"] = resp.coords.longitude;
  });
*/
})}

public sendEmail(message:any){
  console.log("Send Email",message)
  let url = "https://us-central1-pm-soluciones.cloudfunctions.net/sendMail";
  return new Promise<any>((resolve, reject) => {
    this.http.post(url, JSON.stringify(message), {responseType:'text'}).subscribe(
      res => resolve(res),
      err => reject(err)
      );
  });
}


} // End Service

//geocoder method to fetch address from coordinates passed as arguments
/*
getGeoencoder(latitude,longitude){
  let geoencoderOptions: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
  };
  this.nativeGeocoder.reverseGeocode(latitude, longitude, geoencoderOptions)
  .then((result: NativeGeocoderResult[] ) => {
    this.modelo["address"] = this.generateAddress(result[0]);
  })
  .catch((error: any) => {
    alert('Error getting location'+ JSON.stringify(error));
  });
}
//Return Comma saperated address
generateAddress(addressObj){
  let obj = [];
  let address = "";
  for (let key in addressObj) {
    obj.push(addressObj[key]);
  }
  obj.reverse();
  for (let val in obj) {
    if(obj[val].length)
    address += obj[val]+', ';
  }
return address.slice(0, -2);
}
*/

