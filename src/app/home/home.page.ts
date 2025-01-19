import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { Geolocation, Position } from '@capacitor/geolocation';
import { ConnectivityService } from '../services/connectivity.service';
import { GPSLocation, Payload } from '../types';
import { FirebaseService } from '../services/firebase.service';
import { PictureService } from '../services/picture.service';
import { ModalComponent } from '../components/modal/modal.component';
import { Photo } from '@capacitor/camera';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule],
  providers: [ConnectivityService, FirebaseService],
})
export class HomePage implements OnInit {
  toSend: Payload[] = []
  disableSend: boolean = false
  description?: string
  photo?: string
  audio?: string

  constructor(
    private connectivity: ConnectivityService,
    private firebase: FirebaseService,
    private modalCtrl: ModalController,
  ) {}

  ngOnInit(): void {
    setInterval(() => {
      if (this.connectivity.networkStatus) {
        while (this.toSend.length > 0) 
          this.firebase.uploadPosition(this.toSend.pop()!)
      }
    }, 5000)
  }

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: ModalComponent,
      cssClass: 'custom-modal',
    });
    modal.present()

    const { data, role } = await modal.onWillDismiss()

    if (role === 'confirm') {
      this.description = data.description
      this.photo = data.photo
      this.audio = data.audio
    }
  }

  registerCurrentPosition = async () => {
    this.disableSend = true
    const positionOptions = {
      enableHighAccuracy: true,
    }
    const position: GPSLocation = this.toObject(await Geolocation.getCurrentPosition(positionOptions));
    const payload: Payload = {
      position,
      description: this.description,
      photo: this.photo,
      audio: this.audio,
    }
    this.toSend.push(payload)
  };

  enableButton = () => this.disableSend = false

  private toObject = (coordinates: Position): GPSLocation => {
    return {
      latitude: coordinates.coords.latitude,
      longitude: coordinates.coords.longitude,
      timestamp: coordinates.timestamp,
    };
  }
}
