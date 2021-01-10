declare type found = {
  type: 'url' | 'email' | 'hashtag' | 'mention';
  value: string;
  href: string;
}

declare module 'linkifyjs' {
  export default class Linkify {

    static find(str: string[] | string): found[];
  }
}
