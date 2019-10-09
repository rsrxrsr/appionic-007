import { Injectable } from "@angular/core";
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
// ====================================================================================================================
export class FirebaseService {
  //-------------------------------------------------------------------------------------------------------------------
  public modelo=[];
  public model=[];
  constructor(public afs: AngularFirestore,
              public storage: AngularFireStorage,
              public auth: AngularFireAuthModule
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
  public agregarSubDocumento(id:string, coleccion: string, doc: any){
    let objeto = Object.assign({}, doc);  
    delete objeto.id;  
    return new Promise<any>((resolve, reject) => {
      this.afs.collection(coleccion).doc(id).collection(coleccion).add(objeto)
      .then(
        res => resolve(res),
        err => reject(err)
      );
    });
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // Método genérico para editar un documento en firebase, es necesario que el objeto tenga el id inyectado o pasado como parámetro
  // params: objeto: objeto javascript, colección: nombre de la colección.
  public editarDocumento( coleccion: string, id: string, doc: any){
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
  public eliminarDocumento(coleccion, id){
    return new Promise<any>((resolve, reject) => {
      this.afs.collection(coleccion).doc(id).delete()
      .then(
        res => resolve(res),
        err => reject(err)
      );
    });
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

  public getColeccion(coleccion: string){
    return new Promise<any>((resolve, reject) => {
      this.afs.collection(coleccion).snapshotChanges().subscribe(querySnapshot => {
        var snapshot = {};
        querySnapshot. forEach(function(doc) {
          snapshot[doc.payload.doc.id]=doc.payload.doc.data();
        });
        console.log("Consulta: ", coleccion, snapshot );
        this.model[coleccion]=snapshot;
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
        snapshot['id'] =  querySnapshot.id;
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

public findChild(coleccion: string, subcoleccion:string, document: string){
  return new Promise<any>((resolve, reject) => {
    this.afs.collection(coleccion).doc(document)
            .collection(subcoleccion).snapshotChanges().subscribe(querySnapshot => {
      var snapshot = [];
      querySnapshot.forEach(function(doc) {          
        var item=doc.payload.doc.data();
        item['id']=doc.payload.doc.id;
        snapshot.push(item);
      });
      console.log("Current SUB snapshot 0: ", snapshot[0], snapshot.length);
      resolve(snapshot);
    })      
  })
}            

public watchColeccion(coleccion:string) {
    var db = this.afs.firestore;
    return new Promise<any>((resolve, reject) => {
      db.collection(coleccion)
        .onSnapshot(function(querySnapshot) {
          var snapshot = [];
          querySnapshot.forEach(function(doc) {
            var item=doc.data();
            item.id=doc.id;
            snapshot.push(item);
          });
          console.log("Current snapshot 0: ", snapshot[0], snapshot.length);
          console.log("Current snapshot 1: ", snapshot[1]);
          resolve(snapshot);
          this.saveTextAsFile(snapshot);           
        });
    }); 
  }

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

// File Upload
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
        //this.agregarDocumento('files',fileInfo);
      }) 
    }, err => {
      console.log("err",err);
      reject(err);
    })
  })
}       
  
public imageUpload(data:any) {
  console.log("Subiendo", data, "fin");
  //var imagen = 'data:image/jpeg;base64,' + data;
  const file = this.storage.ref('casos/evidencias/file.jpg');
  file
  .putString(data, 'base64', {contentType: 'image/jpeg'})
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
        this.addDocument('files',fileInfo);
      }) 
    }, err => {
      console.log("err",err);
    })
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
  
  loginUser(email, password) {
    console.log('Loging user ' + email);  
    this.afs.firestore.app.auth().signInWithEmailAndPassword(email, password)
    .then(function (user) {
      console.log('Credenciales correctas, ¡bienvenido!');
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  
  logoutUser() {
    this.afs.firestore.app.auth().signOut();
    console.log("Logout User");
  }

} // End Service
