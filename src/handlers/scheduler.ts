import { NextFunction } from 'grammy'
import Context from '@/models/Context'
import * as cron from 'node-cron'

export function setScheduler() {

  cron.schedule('* * * * * *', () => {
  console.log('running a task every second');
});
}