## Настройка приложений

```
# 1. устанавливаем зависимости
yarn install

# 2. создать .env файл

# 3. запускаем приложение
yarn start
```

## .env файл (пример .env.example)

```sh
YA_OAUTH_TOKEN=<ya-passport-token> # Details -> https://yandex.cloud/en/docs/iam/operations/iam-token/create
FOLDER_ID=<folder-id> # https://yandex.cloud/en/docs/resource-manager/operations/folder/get-id#console_1

SYSTEM_ROLE_TEXT=<Промт для YandexGPT> # https://yandex.cloud/ru/docs/foundation-models/prompts/yandexgpt/
SYSTEM_VOICE=<Голос> # https://yandex.cloud/en/docs/speechkit/tts/voices
SYSTEM_EMOTION=<Эмоция голоса> # https://yandex.cloud/en/docs/speechkit/tts/voices

ELEVENLABS_API_KEY=<API ключ elevenlabs> # https://elevenlabs.io/app/speech-synthesis
VOICE_ID=<ID голоса elevenlabs> # https://elevenlabs.io/docs/voices/premade-voices

# 'yandex' | 'elevenlabs'
VOICE_SERVICE=<выбор сервиса для озвучивания>
```

## Дока Яндекса

[Как начать работать с YandexGPT API](https://yandex.cloud/ru/docs/foundation-models/quickstart/yandexgpt)

[Модели YandexGPT API](https://yandex.cloud/ru/docs/yandexgpt/concepts/models#yandexgpt-generation)

[Распознавание речи через Yandex Speech Kit](https://cloud.yandex.ru/docs/speechkit/quickstart)

[Список голосов](https://yandex.cloud/en/docs/speechkit/tts/voices)

[Библиотека промтов YandexGPT API](https://yandex.cloud/ru/docs/foundation-models/prompts/yandexgpt/)
