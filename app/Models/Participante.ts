import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Participante extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public sala_id: number

  @column()
  public user_id: number

  @column()
  public is_admin: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
