import { Discord, On, ArgsOf } from '@typeit/discord';
import { MessageAttachment } from 'discord.js';

import { getVideoMeta, Result } from 'tiktok-scraper';
import fetch from 'node-fetch';
import { config, debug } from 'core/config';

const linkify = require('linkifyjs');

@Discord('!')
class NewMessageHandler extends Object {
    @On('message')
    private async onNewMessage(
        [message]: ArgsOf<'message'>, // client: Client, // guardPayload: any,
    ) {
        // check if the message contains a tiktok link
        const re = /http[s]?:\/\/.*?tiktok\.com\//;

        const { content } = message;
        if (!re.test(content)) {
            // message did not contain any tiktok link
            // exit...
            return;
        }
        debug('---\nmessage contains a tiktok link');

        // find the urls in the message, matching the first one
        const found = linkify.find(content);
        const urls = found.filter(f => f.type === 'url');
        if (urls.length === 0) {
            debug("didn't find a url in the message");
            return;
        }
        debug('found url in the message');

        let { value: tiktokUrl }: { value: string } = urls[0];

        // check if the url contains `vm.tiktok.com`
        // if so, we need to do a special step
        // so we can resolve the public tiktok link
        // instead of the private, members only vm link
        if (tiktokUrl.indexOf('vm.tiktok.com') > -1) {
            debug('url is from vm.tiktok.com');
            // send a request to the url, and see where we finally land
            // then get the result's url, and feed that into the scraper
            const resp = await fetch(tiktokUrl, {
                headers: {
                    'sec-ch-ua-platform': 'macOS',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua': '" Not;A Brand";v="99", "Microsoft Edge";v="97", "Chromium";v="97"',
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36 Edg/97.0.1072.55'
                }
            });
            debug('finished request to vm.tiktok.com');
            tiktokUrl = resp.url;
        }

        let meta: Result;
        try {
            // fetch the meta of the url
            // setup proxy if applicable
            const opts: { proxy?: string[] } = {};

            if (config.PROXY_URI && config.PROXY_URI !== '') {
                opts.proxy = [config.PROXY_URI];
                debug('using proxy for request');
            }

            debug(`getting video metadata from url: ${tiktokUrl}`);
            meta = await getVideoMeta(tiktokUrl, opts);
            if (meta.collector.length === 0) {
                debug('got no metadata');
                return;
            }
        } catch (e) {
            debug(`got an error ${e}`);
            return;
        }

        // with a successful match, get the download url from the link
        const { collector } = meta;
        const { videoUrl, text, id } = collector[0];
        debug(`got video url: ${videoUrl}`);

        // download the url and get a buffer from it
        // then send it to discord as an attachment!
        const resp = await fetch(videoUrl, { headers: { ...meta.headers } });
        const buffer = await resp.buffer();
        const attachment = new MessageAttachment(buffer, `${id}.mp4`);
        const reply = await message.channel.send(text, attachment);
        debug(`sent message with id: ${reply.id}`);
    }
}

export { NewMessageHandler }
