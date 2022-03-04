declare module 'super-simple-tiktok-scraper' {
  interface Result {
    title: string;
    userName: string;
    userMention: string;
    description: string;
    keywords: string;
    urlMeta: string;
    videoId: string;
    videoInformation: {
      likes: string;
      comments: string;
    };
    videoUrl: string;
  }

  function getVideoMeta(url: string): Result;

  export { getVideoMeta };
  export type { Result };
}
