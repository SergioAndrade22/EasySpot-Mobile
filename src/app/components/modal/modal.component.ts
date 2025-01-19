import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Photo } from '@capacitor/camera';
import { IonicModule, ModalController } from '@ionic/angular';
import { PictureService } from 'src/app/services/picture.service';
import { VoiceRecorderComponent } from "../voice-recorder/voice-recorder.component";


@Component({
  selector: 'app-modal',
  templateUrl: 'modal.component.html',
  imports: [FormsModule, IonicModule, VoiceRecorderComponent],
  providers: [PictureService],
  standalone: true,
})
export class ModalComponent {
  description!: string;
  photo?: Photo
  audio?: string

  constructor(
    private modalCtrl: ModalController,
    private picture: PictureService,
  ) {}

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  async confirm() {
    return this.modalCtrl.dismiss({
      description: this.description,
      photo: this.photo ? (await this.readAsBase64(this.photo)).valueOf() : undefined,
      audio: this.audio
    }, 'confirm');
  }

  captureAudio(audio: string) {
    this.audio = audio
  }

  async captureImage() {
    this.photo = await this.picture.capture();
  }

  private async readAsBase64(photo: Photo) {
    // Fetch the photo, read as a blob, then convert to base64 format
    const response = await fetch(photo.webPath!);
    const blob = await response.blob();
  
    return await this.convertBlobToBase64(blob) as string;
  }
  
  private convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
        resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });
}