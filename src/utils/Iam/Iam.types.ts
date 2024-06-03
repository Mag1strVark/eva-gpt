export interface IamToken {
  iamToken: string
  expiresAt: string
}

export interface IamRepository {
  value: string | null
  init(token: string | undefined): Promise<void>
}
