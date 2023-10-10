/** @jsx h */

import blog, { ga, h, redirects } from 'blog';
import { updateDns } from './updateDns.ts';

const getEnvVar = (key: string) => {
  const val = Deno.env.get(key);
  if (!val) {
    throw new Error(`Must specify a ${key} env var`);
  }
  return val;
};

if (Deno.env.has('DYNDNS_USERNAME') || Deno.env.has('DYNDNS_PASSWORD')) {
  await updateDns({
    username: getEnvVar('DYNDNS_USERNAME'),
    password: getEnvVar('DYNDNS_PASSWORD'),
  });
  console.log('Updated dynamic dns!');
}

const lines = [
  `What I regret most: Pursuing what was in front of me and not what was inside`,
  `What I regret most: Pursuing what was in front of me and not what was on the horizon`,
  `Everyone wants to die nobly for a cause, but few want to live humbly for one`,
  `Turn off autopilot`,
  `Don't be afraid of anything. Anything.`,
  `Maximize potential, not outcome`,
  // `Don't ever look down on something. Pride goes before a fall.`,
  `If you find yourself looking down on everything, you're probably too high`,
  `Seeds will never bloom until they die`,
  `Though he slay me, I will hope in him; yet I will argue my ways to his face.`,
  `It's all just tremor and wake`,
  `Create meaning by attention and intention`,
  `If you're predictable, who are you?`,
  `Every single person has something to teach you`,
  `If no one thinks you're crazy you're a chicken`,
];

blog({
  title: 'My Blog',
  description: 'This is my new blog.',
  // header: <header>About / Blog / Muse / Scaffold</header>,
  // section: (post: Post) => <section>Your custom section with access to Post props.</section>,
  // footer: <footer>Your custom footer</footer>,
  avatar: 'https://deno-avatar.deno.dev/avatar/blog.svg',
  avatarClass: 'rounded-full',
  author: 'Joel Walker',

  links: [
    { title: 'Email', url: 'mailto:joelwalker1995@gmail.com' },
    { title: 'GitHub', url: 'https://github.com/JWalker1995' },
    // { title: 'Twitter', url: 'https://twitter.com/denobot' },
  ],
  lang: 'en',
  // localised format based on https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
  dateFormat: (date) =>
    new Intl.DateTimeFormat('en-GB', { dateStyle: 'long' }).format(date),
  middlewares: [
    ga('UA-XXXXXXXX-X'),
    redirects({
      '/foo': '/my_post',
      // you can skip leading slashes too
      'bar': 'my_post2',
    }),
    async (req, ctx) => {
      const { search } = new URL(req.url);
      if (search !== '?id=317') {
        // return new Response(`Not authorized`, { status: 401 });
      }

      try {
        return await ctx.next();
      } catch (e) {
        console.error(e);
        return new Response(`Internal server error: ${e.message}`, {
          status: 500,
        });
      }
    },
  ],
  // unocss: unocss_opts, // check https://github.com/unocss/unocss
  favicon: 'favicon.ico',
});
