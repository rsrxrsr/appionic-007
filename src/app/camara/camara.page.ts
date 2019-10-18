import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { MediaCapture, MediaFile, CaptureError, CaptureVideoOptions } from '@ionic-native/media-capture/ngx';
import { File } from '@ionic-native/file/ngx';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
 
import {FirebaseService} from '../services/firebase.service';

@Component({
  selector: 'app-camara',
  templateUrl: './camara.page.html',
  styleUrls: ['./camara.page.scss'],
})
export class CamaraPage implements OnInit {
  foto:any;
  video:any;
  safeUrl:any;

  constructor(
    private camera: Camera,
    private mediaCapture: MediaCapture,
    private firebaseService: FirebaseService,
    private file: File,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
  }

  tomarFoto() {
    const options: CameraOptions = {
      destinationType: this.camera.DestinationType.DATA_URL
    }
    this.camera.getPicture(options).then((imageData) => {
      this.foto = 'data:image/jpeg;base64,' + imageData;
      //this.firebaseService.fileUpload(imageData);
      this.firebaseService.imageUpload("file",imageData,".jpg");
    }, (err) => {
      console.log(err);
    });
  }

  tomarVideo(){
    //let options: CaptureImageOptions = { limit: 3 }
    const options: CaptureVideoOptions = { quality: 1 };
    this.mediaCapture.captureVideo(options)
    .then(
      (mediaFile: MediaFile[]) => {
        this.safeUrl=mediaFile[0].fullPath; 
        this.video=mediaFile[0];
        //
        let capturedFile = mediaFile[0];
        let fileName = capturedFile.name;
        let dir = capturedFile['localURL'].split('/');
        dir.pop();
        let fromDirectory = dir.join('/');
        /*
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
        */
      alert(fromDirectory);      
      this.file.checkFile(fromDirectory, fileName)
          .then( res=> {
            alert(res)
          }, err=>alert(JSON.stringify(err)));
      this.file.readAsDataURL(fromDirectory, fileName)
          .then(success => {
            alert(this.safeUrl);
            //let blob = new Blob([success], {type: "video/mp4"});
            this.firebaseService.fileUpload(success);  
          } , (err: CaptureError) => alert(err) )
      }, (err: CaptureError) => alert(err)
    );  
  }
  
}
