import { NextFunction } from 'grammy'
import Context from '@/models/Context'
import * as cron from 'node-cron'
import { isUserAvailable } from './checkUser'
import { sendPairs } from './pairing'
import bot from '@/helpers/bot'

export function setScheduler() {

  cron.schedule('0 8 1 * *', () => { // 8:00 UTC
    sendPairs(bot)
})

//   cron.schedule('* * * * * *', async () => {
//   console.log(await isUserAvailable(56753392))
// })
}