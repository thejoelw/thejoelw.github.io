import { extract } from '$std/front_matter/any.ts';
import { join } from '$std/path/mod.ts';
import removeMarkdown from 'remove-markdown';

const notPublicError = new Error(`Not public!`);

export interface Post {
  slug: string;
  title: string;
  publishedAt: Date;
  content: string;
  snippet: string;
  public: boolean;
  listed: boolean;
  flags: {
    allowIframes: boolean;
    allowMath: boolean;
    disableHtmlSanitization: boolean;
  };
}

const makeSnippet = (snippet: unknown, body: string) => {
  if (snippet !== undefined) {
    if (typeof snippet !== 'string') {
      throw new Error(`Invalid snippet!`);
    }
    return snippet;
  } else {
    const snippet = body.split('\n\n')[0];
    return removeMarkdown(snippet.replace('\n', ' '));
  }
};

export const getPost = async (slug: string): Promise<Post> => {
  const text = await Deno.readTextFile(join('./posts', `${slug}.md`));
  const { attrs, body } = extract(text);

  if (!attrs.public) {
    throw notPublicError;
  }
  if (typeof attrs.title !== 'string') {
    throw new Error(`Invalid title!`);
  }
  if (!(attrs.publish_date instanceof Date)) {
    throw new Error(`Invalid publish_date!`);
  }

  return {
    slug,
    title: attrs.title,
    publishedAt: attrs.publish_date,
    content: body,
    snippet: makeSnippet(attrs.snippet, body),
    public: !!attrs.public,
    listed: !attrs.unlisted,
    flags: {
      allowIframes: !!attrs.allow_iframes,
      allowMath: !!attrs.allow_math,
      disableHtmlSanitization: !!attrs.allow_html,
    },
  };
};

export const getPosts = async () => {
  const files = Deno.readDir('./posts');
  const promises = [];
  for await (const file of files) {
    if (file.name.endsWith('.md')) {
      const slug = file.name.slice(0, -3);
      promises.push(
        getPost(slug).catch((err) => {
          if (err !== notPublicError) {
            console.error(err);
          }
        }),
      );
    }
  }
  return (await Promise.all(promises))
    .flatMap((post) => post && post.listed ? [post] : [])
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
};
