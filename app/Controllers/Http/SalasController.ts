import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Participante from 'App/Models/Participante';

import Sala from 'App/Models/Sala';

export default class SalasController {
    public async participantesSala({response}: HttpContextContract){
        const participantes = await Participante.all()
        return response.status(200).json({
            "status": "success",
            "data": participantes
        })
    }

    public async joinSala({ request , auth}: HttpContextContract) {
        const validation = schema.create({
            codigo: schema.string({}, [
                rules.required(),
            ])
        })
        const validatedData = await request.validate({
            schema: validation,
            messages: {
                'codigo.required': 'El codigo de acceso es requerido',
            }
        })
        const sala = await Sala.findBy('codigo_acceso', validatedData.codigo)
        if (sala) {
            const user = await auth.use('api').authenticate()
            const participante = await Participante.query().where('user_id', user.id).where('sala_id', sala.id).first()
            if (participante) {
                return {
                    "status": "error",
                    "message": "Ya eres parte de esta sala"
                }
            } else {
                await Participante.create({
                    user_id: user.id,
                    sala_id: sala.id,
                    is_admin: false
                })
                return {
                    "status": "success",
                    "message": "Te uniste a la sala correctamente"
                }
            }
        } else {
            return {
                "status": "error",
                "message": "Codigo de acceso invalido"
            }
        }
    }
    public async creacionSala({ request,response,auth }: HttpContextContract) {
        const validation = schema.create({
            nombre: schema.string({}, [
                rules.required(),
            ]),
          
            fecha_evento: schema.date({
                format: 'yyyy-mm-dd'
            }, [
                rules.required(),
            ]),
            fecha_maxima_union_grupo: schema.date({
                format: 'yyyy-mm-dd'
            }, [
                rules.required(),
            ]),
        })
        const validatedData = await request.validate({
            schema: validation,
            messages: {
                'nombre.required': 'El nombre es requerido',
                'fecha_evento.required': 'La fecha del evento es requerida',
                'fecha_maxima_union_grupo.required': 'La fecha maxima de union al grupo es requerida',
            }
        })
        try{
            const sala = new Sala()
            sala.password = request.input('password')
            sala.nombre = validatedData.nombre
            sala.descripcion = request.input('descripcion')
            sala.fecha_evento = validatedData.fecha_evento
            sala.fecha_maxima_union_grupo = validatedData.fecha_maxima_union_grupo
            sala.codigo_acceso
            const user = await auth.use('api').authenticate()
            sala.user_id = user.id
            const caracteres = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            let codigoUnico = '';
            let repetido = true;
            while (repetido) {
                for (let i = 0; i < 6; i++) {
                    const indice = Math.floor(Math.random() * caracteres.length);
                    codigoUnico += caracteres.charAt(indice);
                  } 
                const sala = await Sala.findBy('codigo_acceso', codigoUnico)
                if (!sala) {
                    repetido = false;
                }
            }
            sala.codigo_acceso = codigoUnico
            await sala.save()
            return response.status(200).json(
                {
                    "status": "success",
                    "message": "Sala creada correctamente",
                    "data": sala
                }
            )
        }catch(error){
            return response.status(500).json(
                {
                    "status": "error",
                    "message": error.message
                }
            )
        }     
    }
}
