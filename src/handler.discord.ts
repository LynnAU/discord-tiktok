import {
  Discord,
  On,
  ArgsOf,
  Client
} from '@typeit/discord';
import { MessageAttachment } from 'discord.js';

import { getVideoMeta } from 'tiktok-scraper';
import fetch from 'node-fetch';

const linkify = require('linkifyjs');

@Discord('!')
default class extends Object {
  @On('message')
  private async onNewMessage(
    [message]: ArgsOf<'message'>,
    client: Client,
    guardPayload: any
  ) {
    // check if the message contains a tiktok link
    const re = /http[s]?:\/\/.*?tiktok\.com\//;

    const { content } = message;
    if (!re.test(content)) {
      // message did not contain any tiktok link
      // exit...
      return;
    }

    // find the urls in the message, matching the first one
    const found = linkify.find(content);
    const urls = found.filter(f => f.type === 'url');
    if (urls.length === 0) {
      return;
    }

    const { value } = urls[0];
    
    let meta;
    try {
      // fetch the meta of the url
      meta = await getVideoMeta(value);
      if (meta.collector.length === 0) {
        return;
      }
    } catch(e) {
      console.error(e);
      return;
    }

    // with a successful match, get the download url from the link
    const { collector } = meta;
    const { videoUrl } = collector[0];

    // download the url and get a buffer from it
    // then send it to discord as an attachment!
    const resp = await fetch(videoUrl, { headers: meta.headers });
    const buffer = await resp.buffer();
    const attachment = new MessageAttachment(buffer, 'tiktok.webm');
    message.channel.send('', attachment);
  }
}
