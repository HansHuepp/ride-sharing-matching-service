import cron  from 'node-cron'
import { MatchingService } from './matching-service';

export class CronJobs {

    matchingService = new MatchingService();
    startCronJobs() {
        cron.schedule('*/10 * * * * *', async () => {
            try {
                await this.matchingService.updateOpenAuctions();
                console.log('Updated open auctions.');
            } catch (error) {
                console.error(error);
            }
        });
        cron.schedule('*/11 * * * * *', async () => {
            try {
                await this.matchingService.determineWinner();
                console.log('Find winner.');
            } catch (error) {
                console.error(error);
            }
        });
    }
}
