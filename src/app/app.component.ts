import { Component,  ElementRef, ViewChild, NgZone } from '@angular/core';
import { NgxCaptureService } from 'ngx-capture';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  name = 'Angular';
  img = '';

  body = document.body;

  @ViewChild('screen', { static: true }) screen: any;

  constructor(private captureService: NgxCaptureService) {}

  ngOnInit() {}
  divCapture() {
    this.captureService
      .getImage(this.screen.nativeElement, true)
      .pipe(
        tap((img: string) => {
          this.img = img;
          console.log(img);
        })
      )
      .subscribe();
  }
  fullCapture() {
    this.captureService
      .getImage(this.body, true)
      .pipe(
        tap((img: string) => {
          this.img = img;
          console.log(img);
        })
      )
      .subscribe();
  }

  fullCaptureWithDownload() {
    this.captureService
      .getImage(this.body, true)
      .pipe(
        tap((img: string) => {
          this.img = img;
          console.log(img);
        }),
        tap((img) => this.captureService.downloadImage(img))
      )
      .subscribe();
  }
}