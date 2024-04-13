import { NextFunction } from 'grammy'
import Context from '@/models/Context'
import * as cron from 'node-cron'
import { isUserAvailable } from './checkUser'

export function setScheduler() {

//   cron.schedule('* * * * * *', () => {
//   console.log('running a task every second');
// })

  cron.schedule('* * * * * *', async () => {
  console.log(await isUserAvailable(56753392))
})
}