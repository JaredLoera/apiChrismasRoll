import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CheckUserActive {
  public async handle({auth,response}: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    const user = await auth.use('api').authenticate()
    if(!user.isActive){
        return response.status(500).json(
            {
                "status": "error",
                "message": "El usuario no esta activo"
            }
        )
    }
    await next()
  }
}
