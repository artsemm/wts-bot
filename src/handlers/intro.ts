import Context from '@/models/Context'

export async function handleIntro(ctx: Context) {
  await ctx.api.sendMessage(ctx.dbuser.id, 'Интро')
}
 