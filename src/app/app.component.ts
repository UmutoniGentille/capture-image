import { Component,  ElementRef, ViewChild, NgZone } from '@angular/core';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  name = 'Angular';
  img = '';

  @ViewChild('screen', { static: true }) screen!: ElementRef;

  constructor() {}

  divCapture() {
    const element = this.screen.nativeElement;
    html2canvas(element).then((canvas:any) => {
      const imgData = canvas.toDataURL('image/png');
      this.img = imgData;
      console.log(imgData);
    });
  }

  fullCapture() {
    const element = document.body;
    html2canvas(element).then((canvas:any) => {
      const imgData = canvas.toDataURL('image/png');
      this.img = imgData;
      console.log(imgData);
    });
  }

  fullCaptureWithDownload() {
    const element = document.body;
    html2canvas(element).then((canvas:any) => {
      const imgData = canvas.toDataURL('image/png');
      this.img = imgData;
      console.log(imgData);
      this.downloadImage(imgData);
    });
  }

  downloadImage(imgData: string) {
    const link = document.createElement('a');
    link.href = imgData;
    link.download = 'screenshot.png';
    link.click();
  }
}