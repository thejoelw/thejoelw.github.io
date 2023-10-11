import { Head } from '$fresh/runtime.ts';

export default function Error404() {
  return (
    <div style={{ textAlign: 'center' }}>
      <Head>
        <title>404 - Page not found</title>
      </Head>
      <h2>404</h2>
      <a href='/'>Go back home</a>
    </div>
  );
}
