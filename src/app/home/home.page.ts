import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Geolocation, Position } from '@capacitor/geolocation';
import { ConnectivityService } from '../services/connectivity.service';
import { GPSLocation } from '../types';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule],
  providers: [ConnectivityService, FirebaseService],
})
export class HomePage implements OnInit {
  toSend: GPSLocation[] = []
  disableSend: boolean = false

  constructor(
    private connectivity: ConnectivityService,
    private firebase: FirebaseService
  ) {}

  ngOnInit(): void {
    setInterval(() => {
      if (this.connectivity.networkStatus) {
        while (this.toSend.length > 0) 
          this.firebase.uploadPosition(this.toSend.pop()!)
      }
    }, 5000)
  }

  registerCurrentPosition = async () => {
    this.disableSend = true
    const positionOptions = {
      enableHighAccuracy: true,
    }
    const coordinates = await Geolocation.getCurrentPosition(positionOptions);
    this.toSend.push(this.toObject(coordinates))
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
