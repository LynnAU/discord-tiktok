import { sign } from './tiktok-sign';
import { debug } from 'core/config';

function main() {
  // if (process.argv.length !== 1) {
  //     debug('no arguments specified. require url');
  //     return;
  // }

  const userAgent =
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36 Edg/97.0.1072.55';
  const url = process.argv[0] ?? '';

  debug(sign(url, userAgent));
}

main();
