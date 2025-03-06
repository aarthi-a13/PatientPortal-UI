import { Component } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { WebcamImage } from 'ngx-webcam';
import { WebcamUtil, WebcamInitError } from 'ngx-webcam';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public availableCameras: MediaDeviceInfo[] = [];
  // Subject to trigger snapshots
  private trigger: Subject<void> = new Subject<void>();

  // Captured image
  public webcamImage: WebcamImage | null = null;

  // Function to trigger snapshot
  public triggerSnapshot(): void {
    this.trigger.next();
  }

  // Function to handle captured image
  public handleImage(image: WebcamImage): void {
    this.webcamImage = image;
  }

  // Observable to send trigger event
  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }


  public showNextWebcam(event: any): void {
    console.log(event);
    this.nextWebcam.next(event.target?.value);
  }
  
  private nextWebcam: Subject<string | boolean> = new Subject<string | boolean>();
  
  public get nextWebcamObservable(): Observable<string | boolean> {
    return this.nextWebcam.asObservable();
  }

  ngOnInit(): void {
    WebcamUtil.getAvailableVideoInputs().then((devices) => {
      this.availableCameras = devices;
    });
  }
}
