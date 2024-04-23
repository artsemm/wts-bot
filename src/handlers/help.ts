import Context from '@/models/Context'
import sendOptions from '@/helpers/sendOptions'
import { getFunnelStep, setTgUser, FunnelStep, resetFunnelStep, moveFunnelStep } from '@/models/User'
import { getGreetingsText } from './intro'

export async function handleHelp(ctx: Context) {
  const funnelStep = await getFunnelStep(ctx.dbuser.id)
  if (funnelStep === FunnelStep.Greetings) {
      ctx.api.sendMessage(ctx.dbuser.id, getGreetingsText(), {parse_mode: 'HTML'})
  } else {
    ctx.api.sendMessage(ctx.dbuser.id, `Если вы хотите изменить информацию о себе, воспользуйтесь командой /reset`, {parse_mode: 'HTML'})
  }
}

export async function handleReset(ctx: Context) {
  await resetFunnelStep(ctx.dbuser.id)
  await ctx.api.sendMessage(ctx.dbuser.id, getGreetingsText(), {parse_mode: 'HTML'})
  await moveFunnelStep(ctx.dbuser.id)
}