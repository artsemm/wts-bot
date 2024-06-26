import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose'

export enum FunnelStep {
  Greetings = 1,
  Name,
  City,
  Books,
  Done
}

@modelOptions({ schemaOptions: { timestamps: true } })
export class User {
  @prop({ required: true, index: true, unique: true })
  id!: number
  @prop({ required: true, default: 'ru' })
  language!: string
  @prop({ required: true, default: null })
  username!: string
  @prop({ required: true, default: FunnelStep.Greetings })
  funnelStep!: FunnelStep
  @prop({ required: true, default: 'user' })
  role!: string
  @prop({ required: true, default: null })
  name!: string
  @prop({ required: true, default: null })
  city!: string
  @prop({ required: true, default: null })
  review!: string
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

export async function findUser(id: number) {
  return UserModel.findOne({id: id}).exec()
}

export async function getAllUserIds(){
      const allUsers = await UserModel.find({}).exec()
      const allUserIds = allUsers.map(user => user.id)
      return allUserIds
}

export async function setTgUsername(id:number, username: string) {
  return UserModel.updateOne(
    { id },
    {username: username}
  )
}

export function setName(id:number, name: string) {
  return UserModel.updateOne(
    { id },
    {name: name}
  )
}

export function setCity(id:number, city: string) {
  return UserModel.updateOne(
    { id },
    {city: city}
  )
}

export function setReview(id:number, review: string) {
  return UserModel.updateOne(
    { id },
    {review: review}
  )
}

export function getFunnelStep(id: number): Promise<FunnelStep | number | null> {
  return UserModel.findOne({ id }).select('funnelStep').exec()
    .then(user => {
      if (user) {
        return user.funnelStep;
      } else {
        return null;
      }
    })
    .catch(error => {
      console.error('Error retrieving funnelStep:', error);
      return null;
    });
}

export function getFirstName(id: number): Promise<string | null> {
  return UserModel.findOne({ id }).select('name').exec()
    .then(user => {
      if (user) {
        return user.name.trim().split(/\s+/)[0];
      } else {
        return null;
      }
    })
    .catch(error => {
      console.error('Error retrieving first name:', error)
      return null;
    });
}


export function moveFunnelStep(id: number) {
  return UserModel.findOneAndUpdate(
    { id },
    { $inc: { funnelStep: 1 } }, // Increment the funnelStep value by 1
    { new: true } // Return the updated document after the update operation
  );
}

export function resetFunnelStep(id: number) {
  return UserModel.updateOne(
    { id },
    { funnelStep: 1}
  )
}