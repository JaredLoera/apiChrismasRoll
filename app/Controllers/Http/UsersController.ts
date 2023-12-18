import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { DateTime } from 'luxon'


import User from 'App/Models/User'
import Codigo from 'App/Models/Codigo'

const axios = require('axios')


export default class UsersController {
    public async verifyCode({ request, response, auth }: HttpContextContract) {
        const validationSchema = schema.create({
            codigo: schema.string({}, [
                rules.required(),
            ])
        })
        try {
            const validatedData = await request.validate({
                schema: validationSchema,
                messages: {
                    'codigo.required': 'El codigo es requerido',
                }
            })

            const codigo = validatedData.codigo
            const user = await auth.use('api').authenticate()
            const codigoUser = await Codigo.query().where('user_id', user.id).where('codigo', codigo).first()
            if (codigoUser) {
                const fechaCreacion = DateTime.fromISO(String(codigoUser.createdAt))
                const fechaExpiracion = fechaCreacion.plus({ minutes: 30 })
                const fechaActual = DateTime.now()
                if (fechaActual > fechaExpiracion) {
                    return response.status(500).json(
                        {
                            "status": "error",
                            "message": "El codigo expiro"
                        }
                    )
                }
                user.isActive = true
                await user.save()
                return response.status(200).json(
                    {
                        "status": "success",
                        "message": "Codigo correcto se activo el usuario"
                    }
                )
            } else {
                return response.status(500).json(
                    {
                        "status": "error",
                        "message": "Codigo invalido"
                    }
                )
            }
        } catch (error) {
            return response.status(500).json(
                {
                    "status": "error",
                    "message": error.messages
                }
            )
        }
    }
    public async sendCodeVeryfy({ auth, response }: HttpContextContract) {
        try {
            const user = await auth.use('api').authenticate()
            const codigo = new Codigo()
            codigo.user_id = user.id
            codigo.codigo = Math.floor(100000 + Math.random() * 900000).toString()
            const url = 'https://api.twilio.com/2010-04-01/Accounts/AC06fa385aeccb624eab49ef77e40471e7/Messages.json';
            const data = {
                To: '+52'+user.cellphone,
                From: '+12815281668',
                Body: 'Tu codigo de verificacion es: ' + codigo.codigo,
            };
    
            const headers = {
                Authorization: `Basic ${Buffer.from(`AC06fa385aeccb624eab49ef77e40471e7:${process.env.AUTH_TOKEN}`).toString('base64')}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            };

            const responseSendMessage = await axios.post(url, data, { headers });

            if (responseSendMessage.status === 201) {
                await codigo.save()
                return response.status(201).json(
                    {
                        "status": "success",
                        "data": codigo
                    }
                )
            } else {
                response.status(500).json({
                    "status": "error",
                    "message": "Error al enviar el mensaje"
                })
            }

           
        } catch (error) {
            return response.status(500).json(
                {
                    "status": "error",
                    "message": error.messages
                }
            )
        }
    }
    public async savePhoneUser({ request, response, auth }: HttpContextContract) {
        const validationSchema = schema.create({
            cellphone: schema.string({}, [
                rules.required(),
            ])
        })
        try {
            const validatedData = await request.validate({
                schema: validationSchema,
                messages: {
                    'cellphone.required': 'El telefono es requerido',
                }
            })
            const cellphone = validatedData.cellphone
            const user = await auth.use('api').authenticate()
            user.cellphone = cellphone
            await user.save()
            return response.status(201).json(
                {
                    "status": "success",
                    "data": user
                }
            )
        } catch (error) {
            return response.status(500).json(
                {
                    "status": "error",
                    "message": error.messages
                }
            )
        }
    }
    public async loginOut({ auth, response }: HttpContextContract) {
        try {
            await auth.use('api').revoke()
            return response.status(200).json(
                {
                    "status": "success",
                    "message": "Sesion cerrada"
                }
            )
        } catch (error) {
            return response.status(500).json(
                {
                    "status": "error",
                    "message": error.message
                }
            )
        }
    }
    public async login({ auth, request, response }: HttpContextContract) {
        const validationCredentials = schema.create({
            email: schema.string({}, [
                rules.email(),
            ]),
            password: schema.string({}, [
                rules.required(),
            ])
        })
        try {
            const validatedData = await request.validate({
                schema: validationCredentials,
                messages: {
                    'email.required': 'El correo es requerido',
                    'email.email': 'El correo es invalido',
                    'password.required': 'la contraseña es requerida',
                }
            })
            const email = validatedData.email
            const password = validatedData.password

            const token = await auth.use('api').attempt(email, password, { expiresIn: '10mins' })
            return token
        } catch (error) {
            return response.unauthorized({
                status: 'error',
                message: 'Credenciales invalidas'
            })
        }
    }
    public async createUser({ request, response }: HttpContextContract) {
        const validationSchema = schema.create({
            email: schema.string({}, [
                rules.email(),
                rules.unique({ table: 'users', column: 'email' }),
            ]),
            password: schema.string({}, [
                rules.confirmed(),
            ])
        })
        try {
            const validatedData = await request.validate({
                schema: validationSchema,
                messages: {
                    'email.required': 'El correo es requerido',
                    'email.email': 'El correo es invalido',
                    'email.unique': 'El correo ya existe',
                    'password.required': 'la contraseña es requerida',
                    'password.confirmed': 'Las contraseñas no coinciden',
                },
            })
            const email = validatedData.email
            const password = validatedData.password
            const user = new User();
            user.email = email
            user.password = password
            await user.save()
            return response.status(201).json(
                {
                    "status": "success",
                    "data": user
                }
            )
        } catch (error) {
            return response.status(500).json(
                {
                    "status": "error",
                    "message": error.messages
                }
            )
        }
    }
    public async allUsers({ response }: HttpContextContract) {
        try {
            const users = await User.all()
            return response.status(200).json(
                {
                    "status": "success",
                    "data": users
                }
            )
        } catch (error) {
            return response.status(500).json(
                {
                    "status": "error",
                    "message": error.message
                }
            )
        }
    }
}