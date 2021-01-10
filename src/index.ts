import { Client } from "@typeit/discord";

import { config } from '@bot/config';

const discord = async() => {
  const client = new Client({
    classes: [
      `${__dirname}/*.discord.ts`,
      `${__dirname}/*.discord.js`
    ],
    silent: false,
    variablesChar: ":"
  });

  await client.login(config.BOT_TOKEN);
}

discord();
