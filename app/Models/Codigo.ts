import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column,BelongsTo, afterCreate } from '@ioc:Adonis/Lucid/Orm'
import User from './User'

export default class Codigo extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public codigo: string

  @column()
  public user_id: number

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @afterCreate()
  public static async deleteOldCodes(codigo: Codigo) {
    await Codigo.query().where('user_id', codigo.user_id).where('id', '<>', codigo.id).delete()
  }
}
