import { Handlers, PageProps } from '$fresh/server.ts';
import { getPosts, Post } from '../utils/posts.ts';

export const handler: Handlers<Post[]> = {
  async GET(_req, ctx) {
    const posts = await getPosts();
    return ctx.render(posts);
  },
};

function PostCard(props: { post: Post }) {
  const { post } = props;
  return (
    <div style={{ marginBottom: '2rem' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <a href={`/${post.slug}`}>
          <h3>{post.title}</h3>
        </a>
        <hr
          style={{ flex: '1', border: 'none', borderBottom: '1px solid #ccc' }}
        >
        </hr>
        <time>
          {new Date(post.publishedAt).toLocaleDateString('en-us', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </time>
      </div>
      <div style={{ color: '#4b5563' }}>{post.snippet}</div>
    </div>
  );
}

export default function BlogIndexPage(props: PageProps<Post[]>) {
  return props.data.map((post) => <PostCard post={post} />);
}
