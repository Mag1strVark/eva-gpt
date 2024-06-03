import fs from 'fs'
import { logger } from './logger/index.js'
import { iamRepository } from './repository/index.js'
import { startRecordingProcess } from './utils/audioProcessing/audioRecorder/index.js'
import dotenv from 'dotenv'
import ElevenLabs from 'elevenlabs-node'

dotenv.config({ path: './.env' })

// yandex gpt
export const oauth_token = process.env.YA_OAUTH_TOKEN
export const folder_id = process.env.FOLDER_ID
export const system_role_text = process.env.SYSTEM_ROLE_TEXT
// yandex speech
export const voice = process.env.SYSTEM_VOICE
export const emotion = process.env.SYSTEM_EMOTION
// elven labs speech
export const eleven_labs_api_key = process.env.ELEVENLABS_API_KEY
export const voice_id = process.env.VOICE_ID
// voice service
export const voice_service = process.env.VOICE_SERVICE ?? 'yandex'

export const voiceElevenLabs = new ElevenLabs({
  apiKey: eleven_labs_api_key,
  voiceId: voice_id,
})

const init =
  voice_service === 'yandex'
    ? {
        oauth_token: oauth_token,
        folder_id: folder_id,
        system_role_text: system_role_text,
        voice: voice,
        emotion: emotion,
      }
    : {
        oauth_token: oauth_token,
        folder_id: folder_id,
        system_role_text: system_role_text,
        eleven_labs_api_key: eleven_labs_api_key,
        voice_id: voice_id,
      }

async function main() {
  logger.info(init, 'начальная конфигурация .env')
  logger.info('Выполнение программы...')
  try {
    await fs.promises.access('audio')
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      await fs.promises.mkdir('audio')
      logger.info('Создана папка с аудиофайлами')
    }
  }
  await iamRepository.init(oauth_token)
  startRecordingProcess()
}

main()
