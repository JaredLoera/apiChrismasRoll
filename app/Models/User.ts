import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, BaseModel, hasMany,HasMany } from '@ioc:Adonis/Lucid/Orm'

import Codigo from './Codigo'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public rememberMeToken: string | null

  @column()
  public cellphone: string | null

  @column()
  public isActive: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(()=>Codigo)
  public codigos: HasMany<typeof Codigo>

  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
