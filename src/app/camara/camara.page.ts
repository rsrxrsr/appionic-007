import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { MediaCapture, MediaFile, CaptureError, CaptureVideoOptions } from '@ionic-native/media-capture/ngx';
import { File } from '@ionic-native/file/ngx';

//import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
 
import {FirebaseService} from '../services/firebase.service';

@Component({
  selector: 'app-camara',
  templateUrl: './camara.page.html',
  styleUrls: ['./camara.page.scss'],
})
export class CamaraPage implements OnInit {
  doc:any;
  evidencias:any=[];
  foto:any;
  video:any;
  urlVideo:any;
  //@ViewChild("myvideo", {static: false} ) private myVideo: ElementRef;

  constructor(
    private activatedRoute: ActivatedRoute,
    private camera: Camera,
    private mediaCapture: MediaCapture,
    private firebaseService: FirebaseService,
    private file: File
  ) {
    if (this.firebaseService.modelo["casoEntity"]){
      this.doc=this.firebaseService.modelo["casoEntity"];
    } 
    if (this.firebaseService.modelo["evidencias"]){
      this.evidencias=this.firebaseService.modelo["evidencias"];
    }
  }

  ngOnInit() {
    let medio = this.activatedRoute.snapshot.params["medio"];
    console.log("Medio",medio)
    if (medio=="camara") {
      this.tomarFoto();          
    } else 
    if (medio=="video") {
      this.tomarVideo();
    }
  }

  tomarFoto() {
    const options: CameraOptions = {
      destinationType: this.camera.DestinationType.DATA_URL
    }
    this.camera.getPicture(options).then((imageData) => {
      this.foto = 'data:image/jpeg;base64,' + imageData;
      //this.firebaseService.fileUpload(imageData);
      let fileName=this.doc.id+"/image"+this.evidencias.length;
      this.firebaseService.imageUpload(fileName,imageData,".jpg")
      .then(snap=>{
        let evidencia={urlPhoto:snap.url,tipo:"imagen"};
        this.evidencias.push(evidencia);
      })
    }, (err) => {
      alert("Err in camera");
    });
  }

  tomarVideo(){
    //let options: CaptureImageOptions = { limit: 3 }
    const options: CaptureVideoOptions = { quality: 1 };
    this.mediaCapture.captureVideo(options)
    .then((mediaFile: MediaFile[]) => {
      this.video=mediaFile[0];
      //alert(this.video.fullPath);      
      let fileName = this.video.name;
      let adir = this.video['localURL'].split('/');
      adir.pop();
      let dir=adir.join('/');
      //alert(dir);
//      this.urlVideo=this.video['localURL'];
/*
      let url = this.video.fullPath.replace(/^file:\/\//, '');
      let videoPlayer = this.myVideo.nativeElement;
      videoPlayer.src = url;
      videoPlayer.play();
      alert("End Player")
*/
      this.file.readAsDataURL(dir, fileName)
        .then(imageData => {
          //alert("success");
          //let header=imageData.substring(0,21);
          //alert(header);
          let videoName=this.doc.id+"/video"+this.evidencias.length;
          this.firebaseService.imageUpload(videoName,imageData,".mp4")
          .then(snap=>{
          // .then(fileInfo=> urlVideo=fileInfo.url);  
            let evidencia={urlPhoto:snap.url,tipo:"video"};
            this.evidencias.push(evidencia);
          })    
          this.urlVideo=imageData;
        } , (err: CaptureError) => alert("err FileReader") );        

      }, (err: CaptureError) => alert("err Capture Video") );
  }
  
}

/*
//this.urlVideo = this.video.fullPath.replace(/^file:\/\//, '');
//
//let dir = this.video['localURL'].split('/').pop().join('/');
let toDirectory = this.file.dataDirectory;
let filepath;   
this.file.copyFile(fromDirectory, fileName, toDirectory, fileName).then((res) => {
  filepath=toDirectory+"/"+fileName;          
}, )
alert(capturedFile.fullPath+"|"+filepath);
//
//this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.video.fullPath);
/*    
let fileReader = new FileReader();
fileReader.onload = (e) => {
  console.log(fileReader.result);
}
fileReader.readAsText(file);
this.firebaseService.imageUpload("video",blob,".mp4");

this.file.checkFile(dir, fileName)
  .then( res=> {
    alert(res)
  }, err=>alert(err.code));
//    
this.file.readAsDataURL(dir, fileName)
  .then(imageData => {
    alert("success");
    //let blob = new Blob([success], {type: "video/mp4"});
    this.firebaseService.imageUpload("file",imageData,".jpg");  
  } , (err: CaptureError) => alert("err") )
*/
