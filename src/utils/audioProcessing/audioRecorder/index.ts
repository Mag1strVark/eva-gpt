import mic from 'mic'
import { logger } from '../../../logger/index.js'
import { handleSilence } from '../silenceHandler/index.js'

let micInstance = mic({ rate: '16000', channels: '1', debug: false, exitOnSilence: 6 })
let audioBuffer = Buffer.from([])
let isRecording = false

export const startRecordingProcess = () => {
  logger.info('Начало процесса прослушивания...')
  micInstance.stop()
  micInstance = mic({ rate: '16000', channels: '1', debug: false, exitOnSilence: 10 })
  audioBuffer = Buffer.from([])
  isRecording = true
  micInstance.getAudioStream().on('data', (chunk: any) => {
    if (!isRecording) return
    audioBuffer = Buffer.concat([audioBuffer, chunk])
  })
  micInstance.getAudioStream().on('silence', () =>
    handleSilence({
      isRecording: isRecording,
      micInstance: micInstance,
      audioBuffer: audioBuffer,
    })
  )
  micInstance.start()
}
