import { Component,  ElementRef, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  recording: boolean = false;
  mediaStream!: MediaStream;
  mediaRecorder!: MediaRecorder;
  chunks: Blob[] = [];
  @ViewChild('videoPlayer') videoPlayer!: ElementRef;

  constructor(private toastr: ToastrService) { }

  async startRecording() {
    this.recording = true;
    this.chunks = [];

    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const screenDevice = devices.find(device => device.kind === 'videoinput');

      if (!screenDevice) {
        this.toastr.error('Screen capture device not found');
        this.recording = false;
        return;
      }

      const constraints: MediaStreamConstraints = {
        video: {
          deviceId: screenDevice.deviceId,
          width: { ideal: window.innerWidth },
          height: { ideal: window.innerHeight }
        },
        audio: true
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.mediaStream = stream;
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

        // Stop the media tracks
        this.stopMediaTracks();
      };

      // Show a notification to the user
      this.toastr.info('Screen is being captured.');

      this.mediaRecorder.start();
    } catch (error) {
      this.toastr.error('Error accessing screen recording: ' + error);
      this.recording = false;
    }
  }

  stopRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
  }

  stopMediaTracks() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => {
        track.stop();
      });
    }
  }
}