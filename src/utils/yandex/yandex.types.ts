interface IAlternative {
  message: {
    role: string
    text: string
  }
  status: string
}

export interface ITextCompletionResponse {
  result: {
    alternatives: IAlternative[]
  }
}

export interface IMessages {
  role: 'user'
  text: string
}

export interface IPropsTextCompletion {
  iam_token: string | null
  folder_id: string | undefined
  system_text: string | undefined
  model: 'yandexgpt/latest' | 'yandexgpt-lite/latest'
  messages: IMessages[]
}

export interface IPropsRecognizeVoiceResponse {
  iam_token: string | null
  folder_id: string | undefined
  lang: 'ru-RU' | 'en-EN'
  buffer: any
}

export interface IVocalizeText {
  text: string
  token: string
  lang: 'ru-RU' | 'en-EN'
  voice: string
  emotion: string
  folder_id: string
}
