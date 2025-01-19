import { Injectable, inject } from '@angular/core'
import { 
  Firestore,
  DocumentData,
  QueryDocumentSnapshot,
  SnapshotOptions,
  addDoc
} from '@angular/fire/firestore'
import { collection } from 'firebase/firestore';
import { GPSLocation, Payload } from '../types'

export const payloadConverter = {
  toFirestore(payload: Payload): DocumentData {
    const firestorePayload: Partial<Payload> = {
      position: payload.position,
    }
    if (payload.description) firestorePayload.description = payload.description
    if (payload.photo) firestorePayload.photo = payload.photo
    if (payload.audio) firestorePayload.audio = payload.audio

    return firestorePayload;
  },

  fromFirestore(
    snapshot: QueryDocumentSnapshot<Payload>,
    options: SnapshotOptions
  ): Payload {
    const data = snapshot.data(options)!;
    return {
      position: data['position'],
      description: data['description'],
      photo: data['photo'],
      audio: data['audio']
    }
  }
};

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  firestore: Firestore = inject(Firestore)

  constructor() {}

  uploadPosition = (payload: Payload) => 
    addDoc<Payload>(collection(this.firestore, "positions").withConverter(payloadConverter), payload)
}
