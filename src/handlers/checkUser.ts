import { GrammyError } from 'grammy';
import bot from '@/helpers/bot';

export async function isUserAvailable(user_id: number): Promise<boolean> {
    try {
        const sendActionPromise = bot.api.sendChatAction(user_id, 'typing');
        const timeoutPromise = new Promise((resolve, reject) => {
            setTimeout(() => {
                reject(new Error('Timeout exceeded'));
            }, 5000);
        });

        const result = await Promise.race([sendActionPromise, timeoutPromise]);
        
        // If sendChatAction was successful, user is available
        return true;
    } catch (error) {
        // If there's a GrammyError with error code 403, user is not available
        if (error instanceof GrammyError && error.error_code === 403) {
            return false;
        } else {
            // Handle other errors
            console.error(error);
            return false; // User availability unknown due to error
        }
    }
}