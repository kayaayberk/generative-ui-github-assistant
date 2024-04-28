import { GithubLogo } from '@phosphor-icons/react/dist/ssr'

export function OgImage({ title, description, url, image }: any) {
  return (
    <>
      <div
        style={{
          backgroundColor: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            height: '100%',
            width: '100%',
            backgroundImage: 'linear-gradient(to top right, #0D0D0D, #242424)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            bottom: 0,
            left: 75,
            fontSize: '1.75rem',
            lineHeight: 1,
            background: '#ffffff',
            color: '#0D0D0D',
            padding: '1rem 1.75rem',
            borderRadius: 15,
          }}
        >
          {`githubassistant.vercel.app`}
        </div>
        <div
          style={{
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            top: 85,
            right: 75,
          }}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='64'
            height='64'
            fill='#FFFFFF'
            viewBox='0 0 256 256'
          >
            <path d='M197.58,129.06,146,110l-19-51.62a15.92,15.92,0,0,0-29.88,0L78,110l-51.62,19a15.92,15.92,0,0,0,0,29.88L78,178l19,51.62a15.92,15.92,0,0,0,29.88,0L146,178l51.62-19a15.92,15.92,0,0,0,0-29.88ZM137,164.22a8,8,0,0,0-4.74,4.74L112,223.85,91.78,169A8,8,0,0,0,87,164.22L32.15,144,87,123.78A8,8,0,0,0,91.78,119L112,64.15,132.22,119a8,8,0,0,0,4.74,4.74L191.85,144ZM144,40a8,8,0,0,1,8-8h16V16a8,8,0,0,1,16,0V32h16a8,8,0,0,1,0,16H184V64a8,8,0,0,1-16,0V48H152A8,8,0,0,1,144,40ZM248,88a8,8,0,0,1-8,8h-8v8a8,8,0,0,1-16,0V96h-8a8,8,0,0,1,0-16h8V72a8,8,0,0,1,16,0v8h8A8,8,0,0,1,248,88Z'></path>
          </svg>
        </div>
        <span
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            width: '80%',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: '1rem',
              marginBottom: '1rem',
              position: 'absolute',
              top: '325',
              left: '75',
            }}
          >
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '5.25rem',
                lineHeight: 1,
                fontWeight: 600,
                color: 'white',
              }}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='78'
                height='78'
                fill='#FFFFFF'
                viewBox='0 0 256 256'
              >
                <path d='M208.31,75.68A59.78,59.78,0,0,0,202.93,28,8,8,0,0,0,196,24a59.75,59.75,0,0,0-48,24H124A59.75,59.75,0,0,0,76,24a8,8,0,0,0-6.93,4,59.78,59.78,0,0,0-5.38,47.68A58.14,58.14,0,0,0,56,104v8a56.06,56.06,0,0,0,48.44,55.47A39.8,39.8,0,0,0,96,192v8H72a24,24,0,0,1-24-24A40,40,0,0,0,8,136a8,8,0,0,0,0,16,24,24,0,0,1,24,24,40,40,0,0,0,40,40H96v16a8,8,0,0,0,16,0V192a24,24,0,0,1,48,0v40a8,8,0,0,0,16,0V192a39.8,39.8,0,0,0-8.44-24.53A56.06,56.06,0,0,0,216,112v-8A58.14,58.14,0,0,0,208.31,75.68ZM200,112a40,40,0,0,1-40,40H112a40,40,0,0,1-40-40v-8a41.74,41.74,0,0,1,6.9-22.48A8,8,0,0,0,80,73.83a43.81,43.81,0,0,1,.79-33.58,43.88,43.88,0,0,1,32.32,20.06A8,8,0,0,0,119.82,64h32.35a8,8,0,0,0,6.74-3.69,43.87,43.87,0,0,1,32.32-20.06A43.81,43.81,0,0,1,192,73.83a8.09,8.09,0,0,0,1,7.65A41.72,41.72,0,0,1,200,104Z'></path>
              </svg>
              {title}
            </span>
          </div>
          {description && (
            <span
              style={{
                fontSize: '2.25rem',
                lineHeight: '2.75rem',
                color: 'white',
                top: '425',
                left: '75',
              }}
            >
              {description}
            </span>
          )}
        </span>
      </div>
    </>
  )
}
