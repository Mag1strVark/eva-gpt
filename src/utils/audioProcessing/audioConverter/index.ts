import ffmpeg from 'fluent-ffmpeg'
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg'
import { Readable } from 'node:stream'
import { logger } from '../../../logger/index.js'
import { Writable } from 'stream'

ffmpeg.setFfmpegPath(ffmpegInstaller.path)

export const convertWavToOgg = async (wavBuffer: Buffer) => {
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
