import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit  {
  WIDTH = 640;
  HEIGHT = 480;
  imageUrl!: string;
  faceDetected!: boolean;
  detectedFaces!: any[];

  @ViewChild("video")
  public video!: ElementRef;

  @ViewChild("canvas")
  public canvas!: ElementRef;
  image:any
  error: any;
  isCaptured!: boolean;

  async ngAfterViewInit() {
    await this.setupDevices();
  }

  async setupDevices() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true
        });
        if (stream) {
          this.video.nativeElement.srcObject = stream;
          this.video.nativeElement.play();
          this.error = null;
        } else {
          this.error = "You have no output video device";
        }
      } catch (e) {
        this.error = e;
      }
    }
  }

  capture() {
    this.drawImageToCanvas(this.video.nativeElement);
    this.image=this.canvas.nativeElement.toDataURL("image/png")
    this.isCaptured = true;
  }

  drawImageToCanvas(image: any) {
    this.canvas.nativeElement
      .getContext("2d")
      .drawImage(image, 0, 0, this.WIDTH, this.HEIGHT)
  }

  detectFaces(): void {
    const video = this.video.nativeElement;
    const canvas = this.canvas.nativeElement;
    const context = canvas.getContext("2d");
  
    // Set the canvas dimensions to match the video frame size
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
  
    // Draw the current video frame onto the canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
  
    // Get the pixel data from the canvas
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
  
    // Create an empty array to store the detected faces
    const detectedFaces = [];
  
    // Iterate over the pixels and look for potential face regions
    for (let i = 0; i < data.length; i += 4) {
      // Extract the red, green, and blue color components of the current pixel
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
  
      // Perform a basic color thresholding to identify potential skin-colored regions
      if (r > 60 && r < 240 && g > 40 && g < 220 && b > 20 && b < 200) {
        // Calculate the coordinates of the current pixel
        const x = (i / 4) % this.WIDTH;
        const y = Math.floor(i / 4 / this.HEIGHT);
  
        // Perform additional checks to determine if the region is a face
        // You can implement more sophisticated techniques here
  
        // Add the detected face region to the array
        detectedFaces.push({ x, y, width: 1, height: 1 });
      }
    }
  
    // Update the component properties with the detected faces
    this.detectedFaces = detectedFaces;
    
    this.faceDetected = detectedFaces.length > 0;
  }
  

  getFaceBoxStyle(face: any): object {
    return {
      position: 'absolute',
      top: `${face.y}px`,
      left: `${face.x}px`,
      width: `${face.width}px`,
      height: `${face.height}px`,
      border: '2px solid red',
    };
  }
}