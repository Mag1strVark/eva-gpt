import { logger } from '../../../logger/index.js'
import { convertWavToOgg } from '../audioConverter/index.js'
import { playMp3 } from '../audioPlayer/index.js'
import { transcribeAudio } from '../transcribeAudio/index.js'
import { getYandexGptResponse } from '../../../api/yandex/index.js'
import { convertResponseToAudio } from '../convertResponseToAudio/index.js'
import { voice_service } from '../../../index.js'

interface IHandleSilence {
  audioBuffer: Buffer
  isRecording: boolean
  micInstance: any
}

export const handleSilence = async (props: IHandleSilence) => {
  logger.info('Обнаружена тишина...')
  if (!props.isRecording) return
  props.isRecording = false
  props.micInstance.stop()
  const oggBuffer = await convertWavToOgg(props.audioBuffer)
  const message = await transcribeAudio(oggBuffer)
  if (message) {
    const responseText = await getYandexGptResponse(message)
    const saveAudio = await convertResponseToAudio(responseText, voice_service)
    await playMp3(saveAudio)
  }
}
