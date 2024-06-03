import axios from 'axios'
import FormData from 'form-data'
import {
  IPropsRecognizeVoiceResponse,
  IPropsTextCompletion,
  ITextCompletionResponse,
  IVocalizeText,
} from './yandex.types'
import { logger } from '../../index.js'

export const getTextCompletion = async (
  props: IPropsTextCompletion
): Promise<ITextCompletionResponse> => {
  try {
    const response = await axios.post(
      'https://llm.api.cloud.yandex.net/foundationModels/v1/completion',
      {
        modelUri: `gpt://${props.folder_id}/${props.model}`,
        completionOptions: {
          stream: false,
          temperature: 0.2,
          maxTokens: '8000',
        },
        messages: [
          {
            role: 'system',
            text: props.system_text,
          },
          ...props.messages,
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${props.iam_token}`,
          'x-folder-id': props.folder_id,
        },
      }
    )
    logger.info(
      {
        result: response.data.result.alternatives[0].message.text,
      },
      'response: '
    )
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      logger.error(error.message, 'Ошибка получения текста: ')
      throw new Error('Ошибка получения текста: ' + error.message)
    } else {
      logger.error(error, 'Неизвестная ошибка:')
      throw new Error('Неизвестная ошибка: ' + error)
    }
  }
}

export const recognizeVoice = async (
  props: IPropsRecognizeVoiceResponse
): Promise<string> => {
  try {
    const response = await axios.post(
      `https://stt.api.cloud.yandex.net/speech/v1/stt:recognize?folderId=${props.folder_id}&lang=${props.lang}`,
      props.buffer,
      {
        headers: {
          'Content-Type': 'application/octet-stream',
          Authorization: `Bearer ${props.iam_token}`,
        },
      }
    )
    logger.info(
      {
        result: response.data.result,
      },
      'response: '
    )
    return response.data.result
  } catch (error) {
    if (axios.isAxiosError(error)) {
      logger.error(error.message, 'Ошибка распознавания голоса: ')
      throw new Error('Ошибка распознавания голоса: ' + error.message)
    } else {
      logger.error(error, 'Неизвестная ошибка:')
      throw new Error('Неизвестная ошибка: ' + error)
    }
  }
}

export const vocalizeText = async (props: IVocalizeText) => {
  const formData = new FormData()

  formData.append('emotion', props.emotion)
  formData.append('text', props.text)
  formData.append('lang', props.lang)
  formData.append('voice', props.voice)
  formData.append('format', 'mp3')
  formData.append('folderId', props.folder_id)
  const headers = {
    Authorization: `Bearer ${props.token}`,
    ...formData.getHeaders(),
  }
  try {
    const response = await axios.post(
      'https://tts.api.cloud.yandex.net/speech/v1/tts:synthesize',
      formData,
      {
        headers,
        responseType: 'arraybuffer',
      }
    )
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      logger.error(error.message, 'Ошибка синтезирования голоса: ')
    } else {
      logger.error(error, 'Неизвестная ошибка:')
    }
  }
}
