import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Sala extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public codigo_acceso: string

  @column()
  public nombre: string

  @column()
  public descripcion: string|null

  @column.date()
  public fecha_evento: DateTime

  @column.date()
  public fecha_maxima_union_grupo: DateTime

  @column()
  public password: string|null

  @column()
  public user_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
    sala: DateTime<boolean>


}
