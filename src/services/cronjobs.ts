import cron  from 'node-cron'
import { MatchingService } from './matching-service';

export class CronJobs {

    matchingService = new MatchingService();
    startCronJobs() {
        cron.schedule('*/20 * * * * *', async () => {
            try {
                await this.matchingService.updateOpenAuctions();
            } catch (error) {
                console.error(error);
            }
        });
        cron.schedule('*/22 * * * * *', async () => {
            try {
                await this.matchingService.determineWinner();
            } catch (error) {
                console.error(error);
            }
        });
    }
}
