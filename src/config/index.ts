import { Config } from 'types/core/config';
import makeDebug from 'debug';

const config: Config = {
    BOT_TOKEN: process.env.BOT_TOKEN,
    PROXY_URI: process.env.PROXY_URI,
};

const debug = makeDebug('discord-tiktok');

export { config, debug };
