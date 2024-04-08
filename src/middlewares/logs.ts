import { NextFunction } from 'grammy'
import { findOrCreateUser } from '@/models/User'
import Context from '@/models/Context'
import dayjs from 'dayjs'

export default async function showLog(ctx: Context, next: NextFunction) {
  if (!ctx.from) {
    throw new Error('No from field found')
  }
  const logMsg = `${dayjs().format('YYYY-MM-DD HH:MM:SS')}\t${ctx.message?.from.id}\t${ctx.message?.from.username}\t${ctx.message?.text}`
  console.log(logMsg)
  return next()
}