import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'

@modelOptions({ schemaOptions: { timestamps: true } })
export class User {
  @prop({ required: true, index: true, unique: true })
  id!: number
  @prop({ required: true, default: 'ru' })
  language!: string
  @prop({ required: true, default: null })
  tgUser!: object
  @prop({ required: true, default: 'intro' })   
  funnelStep!: string
  @prop({ required: true, default: 'user' })
  role!: string
}

const UserModel = getModelForClass(User)

export function findOrCreateUser(id: number) {
  return UserModel.findOneAndUpdate(
    { id },
    {},
    {
      upsert: true,
      new: true,
    }
  )
}

export function setTgUser(id:number, tgUser: object) {
  return UserModel.updateOne(
    { id },
    {tgUser: tgUser}
  )
}
