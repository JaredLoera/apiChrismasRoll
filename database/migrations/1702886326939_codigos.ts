import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'codigos'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.string('codigo').notNullable()
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
     
      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
