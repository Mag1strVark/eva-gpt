import { logger } from '../../../logger/index.js'
import { vocalizeText } from '../../../api/yandex/index.js'
import { iamRepository } from '../../../repository/index.js'
import fs from 'fs'
import { emotion, folder_id, voice, voice_id, voiceElevenLabs } from '../../../index.js'

export const convertResponseToAudio = async (text: string, type: string) => {
  const fileName = `${Date.now()}.mp3`
  logger.info('Преобразование ответа в звук...')
  if (type === 'yandex') {
    logger.info('Выбран Yandex...')
    const audioStream = await vocalizeText({
      text: text,
      folder_id: folder_id ?? '',
      lang: 'ru-RU',
      token: iamRepository.value ?? '',
      voice: voice ?? '',
      emotion: emotion ?? '',
    })
    fs.writeFileSync(`./audio/${fileName}`, Buffer.from(audioStream))
    logger.info(
      {
        path: `./audio/${fileName}`,
      },
      'Преобразование звука завершено...'
    )
    return `./audio/${fileName}`
  } else if (type === 'elevenlabs') {
    logger.info('Выбран ElevenLabs...')
    const audioStream = await voiceElevenLabs.textToSpeechStream({
      textInput: text,
      voiceId: voice_id,
      modelId: 'eleven_multilingual_v2',
    })
    const fileWriteStream = fs.createWriteStream('./audio/' + fileName)
    audioStream.pipe(fileWriteStream)
    return new Promise((resolve, reject) => {
      fileWriteStream.on('finish', () => {
        logger.info(
          {
            path: `./audio/${fileName}`,
          },
          'Преобразование звука завершено...'
        )
        resolve(`./audio/${fileName}`)
      })
      audioStream.on('error', reject)
    })
  }
}
