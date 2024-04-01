import Context from '@/models/Context'
import sendOptions from '@/helpers/sendOptions'
import { setTgUser } from '@/models/User'

export default async function handleHelp(ctx: Context) {
  if (ctx.message?.from) {
    await setTgUser(ctx.dbuser.id, ctx.message?.from)
  }
  return 
}
