import { Component,  ElementRef, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  recording: boolean = false;
  mediaRecorder!: MediaRecorder;
  chunks: Blob[] = [];
  @ViewChild('videoPlayer') videoPlayer!: ElementRef;

  constructor(private toastr: ToastrService) { }

  startRecording() {
    this.recording = true;
    this.chunks = [];

    navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
      .then(stream => {
        this.mediaRecorder = new MediaRecorder(stream);
        this.mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            this.chunks.push(event.data);
          }
        };
        this.mediaRecorder.onstop = () => {
          const blob = new Blob(this.chunks, { type: 'video/webm' });
          this.chunks = [];
          this.recording = false;

          // Show a success toast
          this.toastr.success('Recording saved!');

          // Set the recorded video as the source for the video player
          const videoUrl = URL.createObjectURL(blob);
          this.videoPlayer.nativeElement.src = videoUrl;
        };

        this.mediaRecorder.start();
      })
      .catch(error => {
        this.toastr.error('Error accessing screen recording: ' + error);
        this.recording = false;
      });
  }

  stopRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
  }

  captureScreen() {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const videoPlayer = this.videoPlayer.nativeElement;
    canvas.width = videoPlayer.videoWidth;
    canvas.height = videoPlayer.videoHeight;
    context!.drawImage(videoPlayer, 0, 0, canvas.width, canvas.height);
    const imageUrl = canvas.toDataURL('image/png');
    console.log('Captured screen:', imageUrl);
  }
}
