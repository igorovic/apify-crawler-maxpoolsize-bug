import {
  CheerioCrawler,
  Log,
  LogLevel,
  RequestQueue,
  Session,
  sleep,
  createCheerioRouter,
} from "crawlee";

// For more information, see https://sdk.apify.com/
import { Actor } from "apify";

await Actor.init();
const log = new Log({ level: LogLevel.DEBUG });
const crawlQ = await RequestQueue.open("crawl-q");

const router = createCheerioRouter();
router.addHandler("extract-item", async (context) => {
  context.log.info(`DO SOME WORK on body length: ${context.body.length}`);
});

const crawler = new CheerioCrawler({
  log,
  requestQueue: crawlQ,
  requestHandler: router,
  sessionPoolOptions: {
    maxPoolSize: 1,
    async createSessionFunction(sessionPool, options = {}) {
      const { sessionOptions = {} } = options;
      const session = new Session({
        ...this.sessionOptions,
        ...sessionOptions,
        sessionPool,
      });
      try {
        log.debug(`DO some Authentication`);
        /**
         * The sleep method simulates a network call to an authentication endpoint
         * e.g: https://some-site.com/login
         */
        await sleep(500);
      } finally {
        return session;
      }
    },
  },
  useSessionPool: true,
  persistCookiesPerSession: true,
});

await crawler.run();
await Actor.exit();
