/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/users', 'UsersController.allUsers')
Route.get('/participantes', 'SalasController.participantesSala')

Route.post('/create', 'UsersController.createUser')
Route.post('/login', 'UsersController.login')

Route.group(() => {
  Route.post('/phone', 'UsersController.savePhoneUser')
  Route.post('/sendmessage', 'UsersController.sendCodeVeryfy')
  Route.post('/verifycode', 'UsersController.verifyCode')
  Route.post('/logout', 'UsersController.loginOut')
}).prefix('user').middleware('auth')

Route.group(() => {
  Route.post('/create', 'SalasController.creacionSala')
  Route.post('/join', 'SalasController.joinSala')
}).prefix('room').middleware(['auth', "active"])





