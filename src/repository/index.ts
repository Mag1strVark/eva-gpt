import axios from 'axios'
import { IamRepository, IamToken } from './repository.types'

const getIamToken = async (token: string | undefined): Promise<IamToken> => {
  try {
    const response = await axios.post(
      `https://iam.api.cloud.yandex.net/iam/v1/tokens`,
      {
        yandexPassportOauthToken: token,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error('Ошибка получения IAM токена: ' + error.message)
    } else {
      throw new Error('Неизвестная ошибка: ' + error)
    }
  }
}

export const iamRepository: IamRepository = {
  value: null,
  async init(token: string | undefined) {
    const setIamToken = async () => {
      const { iamToken } = await getIamToken(token)
      this.value = iamToken
    }
    await setIamToken()
  },
}
