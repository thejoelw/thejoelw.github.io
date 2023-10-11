import { Handlers, PageProps } from '$fresh/server.ts';
import { PostHeader } from '../components/PostHeader.tsx';
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
      <PostHeader
        title={
          <a href={`/${post.slug}`}>
            <h3>{post.title}</h3>
          </a>
        }
        date={post.publishedAt}
      />
      <div style={{ color: '#4b5563' }}>{post.snippet}</div>
    </div>
  );
}

export default function BlogIndexPage(props: PageProps<Post[]>) {
  return props.data.map((post) => <PostCard post={post} />);
}
