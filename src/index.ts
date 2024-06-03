import dotenv from 'dotenv'
import mic from 'mic'
import ffmpeg from 'fluent-ffmpeg'
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg'
import { Writable } from 'stream'
import fs from 'fs'
import pino from 'pino'
import player from 'play-sound'
import { Readable } from 'node:stream'
import { iamRepository } from './utils/Iam/index.js'
import { getTextCompletion, recognizeVoice, vocalizeText } from './utils/yandex/index.js'

export const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: { colorize: true },
  },
})

const audioPlayer = player()

dotenv.config({
  path: './.env',
})

const oauth_token = process.env.YA_OAUTH_TOKEN
const folder_id = process.env.FOLDER_ID
const system_role_text = process.env.SYSTEM_ROLE_TEXT
const voice = process.env.SYSTEM_VOICE
const emotion = process.env.SYSTEM_EMOTION

ffmpeg.setFfmpegPath(ffmpegInstaller.path)

let micInstance = mic({ rate: '16000', channels: '1', debug: false, exitOnSilence: 6 })
let audioBuffer = Buffer.from([])
let isRecording = false

const startRecordingProcess = () => {
  logger.info('Начало процесса прослушивания...')
  micInstance.stop()
  micInstance = mic({ rate: '16000', channels: '1', debug: false, exitOnSilence: 10 })
  audioBuffer = Buffer.from([])
  isRecording = true
  micInstance.getAudioStream().on('data', (chunk: any) => {
    if (!isRecording) return
    audioBuffer = Buffer.concat([audioBuffer, chunk])
  })
  micInstance.getAudioStream().on('silence', handleSilence)
  micInstance.start()
}

const handleSilence = async () => {
  logger.info('Обнаружена тишина...')
  if (!isRecording) return
  isRecording = false
  micInstance.stop()
  const oggBuffer = await convertWavToOgg(audioBuffer)
  const message = await transcribeAudio(oggBuffer)
  if (message) {
    const responseText = await getYandexGptResponse(message)
    const saveAudio = await convertResponseToAudio(responseText)
    await playMp3(saveAudio)
  }
}

const convertWavToOgg = async (wavBuffer: Buffer) => {
  logger.info('Преобразование в OGG...')
  return new Promise((resolve, reject) => {
    let oggBuffer = Buffer.alloc(0)
    const readable = new Readable()
    readable._read = () => {}
    readable.push(Buffer.from(wavBuffer))
    readable.push(null)
    ffmpeg(readable)
      .outputFormat('ogg')
      .on('end', function () {
        resolve(oggBuffer)
      })
      .on('error', reject)
      .pipe(
        new Writable({
          write(chunk, _, callback) {
            if (chunk instanceof ArrayBuffer) {
              chunk = Buffer.from(chunk)
            }
            oggBuffer = Buffer.concat([oggBuffer, chunk])
            callback()
          },
        })
      )
  })
}

const transcribeAudio = async (oggBuffer: unknown) => {
  logger.info('Расшифровка аудиозаписи...')
  return await recognizeVoice({
    buffer: oggBuffer,
    iam_token: iamRepository.value,
    lang: 'ru-RU',
    folder_id: folder_id,
  })
}

const getYandexGptResponse = async (message: string) => {
  logger.info('Связь с YandexGpt...')
  const response = await getTextCompletion({
    model: 'yandexgpt/latest',
    system_text: system_role_text,
    folder_id: folder_id,
    iam_token: iamRepository.value,
    messages: [
      {
        role: 'user',
        text: message,
      },
    ],
  })
  return response.result.alternatives[0].message.text
}

const convertResponseToAudio = async (text: string) => {
  const fileName = `${Date.now()}.mp3`
  logger.info('Преобразование ответа в звук...')
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
}

const playMp3 = async (filePath: string) => {
  logger.info('Воспроизведение аудиозаписи...')
  await audioPlayer.play(filePath, function (err: any) {
    if (err) {
      logger.warn(err, 'Возникла ошибка при воспроизведении файла:')
    } else {
      logger.info('Воспроизведение завершено успешно.')
    }
  })
}

async function main() {
  logger.info(
    {
      oauth_token: oauth_token,
      folder_id: folder_id,
      system_role_text: system_role_text,
      voice: voice,
      emotion: emotion,
    },
    'начальная конфигурация .env'
  )
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
