import { CommonModule } from '@angular/common'
import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import { IonicModule } from '@ionic/angular'
import { VoiceRecorder, VoiceRecorderPlugin, RecordingData, GenericResponse, CurrentRecordingStatus } from 'capacitor-voice-recorder'

@Component({
  selector: 'app-voice-recorder',
  templateUrl: './voice-recorder.component.html',
  styleUrls: ['./voice-recorder.component.scss'],
  imports: [ CommonModule, IonicModule],
  standalone: true,
})
export class VoiceRecorderComponent  implements OnInit {
  isRecording: boolean = false
  recordData?: string
  @Output('audioNote') audioNoteEmitter = new EventEmitter<string>()
  
  constructor() { }

  ngOnInit() {
    VoiceRecorder.hasAudioRecordingPermission().then(result => {
      if (!result.value) {
        VoiceRecorder.requestAudioRecordingPermission()
      }
    })
  }

  record() {
    if (this.isRecording) {
      return
    }
    this.isRecording = true
    console.log('start recording')
    VoiceRecorder.startRecording() 
  }
  
  stop() {
    if (!this.isRecording) {
      return
    }
    this.isRecording = false
    console.log('stop recording')
    VoiceRecorder.stopRecording().then(result => {
      console.log(result)
      if (result.value) {
        this.recordData = result.value.recordDataBase64
        this.audioNoteEmitter.emit(this.recordData)
      } 
    })
  }
  
  play() {
    const mime = 'audio/aac'
    const audio = new Audio(`data:${mime};base64,${this.recordData}`)
    audio.oncanplaythrough = () => audio.play()
    audio.load()
  }
}
