import { GrammyError, NextFunction } from 'grammy'
import bot from '@/helpers/bot'
import * as cron from 'node-cron'

export async function checkBlock() {
    const sendActionPromise = bot.api.sendChatAction(56753392, 'typing');
    const timeoutPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('Timeout exceeded'))
      }, 5000)
    });

    try {
      const result = await Promise.race([sendActionPromise, timeoutPromise]);
      console.log(result); 
    } catch (error) {
        if (error instanceof GrammyError) {
            console.log(error.error_code)
        }
        else {
      console.error(error)
        }
    }
}