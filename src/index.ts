import { Client } from '@typeit/discord';

import { config } from 'core/config';

const discord = async () => {
    const client = new Client({
        classes: [
            // `${__dirname}/*.discord.ts`,
            // `${__dirname}/*.discord.js`,
            `${__dirname}/handlers/*.handler.ts`,
            `${__dirname}/handlers/*.handler.js`,
        ],
        silent: false,
        variablesChar: ':',
    });

    try {
        await client.login(config.BOT_TOKEN);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

discord();
