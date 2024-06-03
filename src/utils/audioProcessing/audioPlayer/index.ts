import player from 'play-sound'
import { logger } from '../../../logger/index.js'

const audioPlayer = player()

export const playMp3 = async (filePath: any) => {
  logger.info('Воспроизведение аудиозаписи...')
  await audioPlayer.play(filePath, function (err: any) {
    if (err) {
      logger.warn(err, 'Возникла ошибка при воспроизведении файла:')
    } else {
      logger.info('Воспроизведение завершено успешно.')
    }
  })
}
