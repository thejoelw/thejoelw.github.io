import { Handlers, PageProps } from '$fresh/server.ts';
import { getPost, Post } from '../utils/posts.ts';
import { CSS, render } from '$gfm';
import { Head } from '$fresh/runtime.ts';

export const handler: Handlers<Post> = {
  async GET(_req, ctx) {
    let post: Post;
    try {
      post = await getPost(ctx.params.slug);
    } catch (err) {
      return ctx.renderNotFound();
    }
    return ctx.render(post);
  },
};

export default function PostPage(props: PageProps<Post>) {
  const post = props.data;
  return (
    <>
      <Head>
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
      </Head>
      <article>
        <h1>{post.title}</h1>
        <time>
          {new Date(post.publishedAt).toLocaleDateString('en-us', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </time>
        <div
          dangerouslySetInnerHTML={{ __html: render(post.content, post.flags) }}
        />
      </article>
    </>
  );
}
