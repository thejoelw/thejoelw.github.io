import { ComponentChildren } from 'preact';

const useHr = false;

export function PostHeader(
  { title, date }: { title: ComponentChildren; date: Date },
) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '1rem',
      }}
    >
      {title}
      {useHr
        ? (
          <hr
            style={{
              flex: '1',
              border: 'none',
              borderBottom: '1px solid #ccc',
            }}
          />
        )
        : <span style={{ flex: 1 }} />}
      <time>
        {new Date(date).toLocaleDateString('en-us', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })}
      </time>
    </div>
  );
}
