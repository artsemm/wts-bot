import { NextFunction } from 'grammy'
import { findOrCreateUser, setTgUsername } from '@/models/User'
import Context from '@/models/Context'

export default async function attachUser(ctx: Context, next: NextFunction) {
  if (!ctx.from) {
    throw new Error('No from field found')
  }
  const user = await findOrCreateUser(ctx.from.id)
  if (!user) {
    throw new Error('User not found')
  }
  ctx.dbuser = user
  if (ctx.from.username) {
    await setTgUsername(ctx.from.id, ctx.from.username)
  }
  return next()
}
