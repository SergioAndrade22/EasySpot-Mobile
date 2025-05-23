import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { Geolocation, Position } from '@capacitor/geolocation';
import { ConnectivityService } from '../services/connectivity.service';
import { GPSLocation, Payload } from '../types';
import { FirebaseService } from '../services/firebase.service';
import { ModalComponent } from '../components/modal/modal.component';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule],
  providers: [ConnectivityService, FirebaseService],
})
export class HomePage implements OnInit {
  STORE_KEY = 'positions'
  positions: Payload[] = []
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
    this.loadPositions()

    setInterval(() => {
      if (this.connectivity.networkStatus) {
        while (this.positions.length > 0) {
          this.firebase.uploadPosition(this.positions.pop()!)
          this.saveLocal()
        }
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

    this.sendPosition(payload)
  };

  enableButton = () => this.disableSend = false

  private sendPosition = async (payload: Payload) => {
    if (this.connectivity.networkStatus) {
      this.firebase.uploadPosition(payload)
    } else {
      this.positions.push(payload)
      this.saveLocal()
    }
  }

  private loadPositions = async () => {
    const { value } = await Preferences.get({ key: this.STORE_KEY })
    if (value)
      this.positions = JSON.parse(value)
  }

  private saveLocal = async () => {
    Preferences.set({
      key: this.STORE_KEY,
      value: JSON.stringify(this.positions)
    })
  }

  private toObject = (coordinates: Position): GPSLocation => {
    return {
      latitude: coordinates.coords.latitude,
      longitude: coordinates.coords.longitude,
      timestamp: coordinates.timestamp,
    };
  }
}
