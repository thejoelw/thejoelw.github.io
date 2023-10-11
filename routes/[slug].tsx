import { Handlers, PageProps } from '$fresh/server.ts';
import { getPost, Post } from '../utils/posts.ts';
import { CSS, render } from '$gfm';
import { Head } from '$fresh/runtime.ts';
import { PostHeader } from '../components/PostHeader.tsx';

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
        <PostHeader title={<h1>{post.title}</h1>} date={post.publishedAt} />
        <div
          class='markdown-body'
          dangerouslySetInnerHTML={{ __html: render(post.content, post.flags) }}
        />
      </article>
    </>
  );
}
