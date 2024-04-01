import Context from '@/models/Context'
import sendOptions from '@/helpers/sendOptions'
import { setTgUser } from '@/models/User'

export default function handleHelp(ctx: Context) {
  if (ctx.message?.from) {
    setTgUser(ctx.dbuser.id, ctx.message?.from)
  }
  return 
}
