import cron  from 'node-cron'
import { MatchingService } from './matching-service';

export class CronJobs {

    matchingService = new MatchingService();
    startCronJobs() {
        cron.schedule('*/5 * * * * *', async () => {
            console.log('Running cron job to update open auctions');
            try {
                await this.matchingService.updateOpenAuctions();
                await this.matchingService.determineWinner();
            } catch (error) {
                console.error(error);
            }
        });
    }
}
