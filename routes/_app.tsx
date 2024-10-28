import { AppProps } from '$fresh/server.ts';
import { title } from '../util/config.ts';

export default function App({ Component }: AppProps) {
  return (
    <html>
      <head>
        <meta charset='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <title>{title}</title>
        <script
          async
          src='https://analytics.eu.umami.is/script.js'
          data-website-id='6487702e-f40a-40b5-884f-723fb3745661'
        >
        </script>
        <link rel='stylesheet' href='/global.css' />
      </head>
      <body>
        <header
          style={{
            position: 'fixed',
            top: 0,
            left: 8,
            right: 8,
            backgroundColor: '#fff',
          }}
        >
          <div
            style={{
              margin: '0 auto',
              maxWidth: '65rem',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '1em',
              borderBottom: '1px solid #ccc',
            }}
          >
            <h1 style={{ fontSize: '1.25rem' }}>
              <a href='/'>{title}</a>
            </h1>
            <span style={{ flex: '1' }}></span>
            <a href='https://github.com/thejoelw'>Github</a>
          </div>
        </header>
        <main
          style={{ maxWidth: '50rem', margin: '0 auto', paddingTop: '4rem' }}
        >
          <Component />
        </main>
      </body>
    </html>
  );
}
