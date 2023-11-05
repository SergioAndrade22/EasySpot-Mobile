import { Injectable, inject } from '@angular/core'
import { 
  Firestore,
  DocumentData,
  QueryDocumentSnapshot,
  SnapshotOptions,
  addDoc
} from '@angular/fire/firestore'
import { collection } from 'firebase/firestore';
import { GPSLocation } from '../types'

export const positionConverter = {
  toFirestore(position: GPSLocation): DocumentData {
    return { 
      latitude: position.latitude,
      longitude: position.longitude,
      timestamp: position.timestamp
    };
  },

  fromFirestore(
    snapshot: QueryDocumentSnapshot<GPSLocation>,
    options: SnapshotOptions
  ): GPSLocation {
    const data = snapshot.data(options)!;
    return { 
      latitude: data['latitude'],
      longitude: data['longitude'],
      timestamp: data['timestamp']
    }
  }
};

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  firestore: Firestore = inject(Firestore)

  constructor() {}

  uploadPosition = (position: GPSLocation) => 
    addDoc<GPSLocation>(collection(this.firestore, "positions").withConverter(positionConverter), position)
}
