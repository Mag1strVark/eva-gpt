import { logger } from '../../../logger/index.js'
import { recognizeVoice } from '../../../api/yandex/index.js'
import { iamRepository } from '../../../repository/index.js'
import { folder_id } from '../../../index.js'

export const transcribeAudio = async (oggBuffer: unknown) => {
  logger.info('Расшифровка аудиозаписи...')
  return await recognizeVoice({
    buffer: oggBuffer,
    iam_token: iamRepository.value,
    lang: 'ru-RU',
    folder_id: folder_id,
  })
}
