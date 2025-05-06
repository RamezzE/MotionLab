import React, { useState, useEffect, useRef } from 'react';

export default function AvatarCreatorComponent() {
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [error, setError] = useState(null);
  const iframeRef = useRef(null);

  const config = {
    frameApi: true,
    clearCache: true,
    quickStart: true,
    language: 'en',
    bodyType: 'fullbody',

    hideWatermark: true,
    hideMenu: true,
    hideExport: true,
    hideSwitchCamera: true,

    // Custom UI config (optional)
    uiConfig: JSON.stringify({
      displayMode: "fullscreen",
      enableHideUi: true,
      menuButtonsVisibility: false,
      navigationButtonsVisibility: false,
      closeButtonVisibility: false,
      fullBodyToggleVisibility: false,
      defaultToFullBody: true,
      privacyPolicyButtonVisibility: false,
    }),
  };

  const subdomain = 'motion-i2jrhr';
  const iframeSrc = `https://${subdomain}.readyplayer.me/avatar?${new URLSearchParams(config).toString()}`;

  useEffect(() => {
    const handleMessage = (event) => {
        if (!event.origin.includes("readyplayer.me")) return;
      
        try {
          let data = event.data;
          let url = null;
      
          // Try parsing JSON if it's a string and looks like an object
          if (typeof data === 'string') {
            if (data.startsWith('{')) {
              data = JSON.parse(data);
            } else if (data.startsWith('https://')) {
              url = data; // Direct URL string
            }
          }
      
          if (!url) {
            url = data?.url || data?.data?.url || data?.avatar?.url;
          }
      
          if (url) {
            console.log("Avatar URL detected:", url);
            setAvatarUrl(url);
      
            // Trigger .glb download
            const link = document.createElement('a');
            link.href = url;
            link.download = 'avatar.glb';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        } catch (err) {
          console.warn("Failed to parse message data", err);
        }
      };
      

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    const sendSubscription = () => {
      if (!iframeRef.current?.contentWindow) return;

      try {
        const message = {
          target: 'readyplayerme',
          type: 'subscribe',
          eventName: 'v1.**',
        };
        iframeRef.current.contentWindow.postMessage(message, '*');
        console.log("Subscription message sent to iframe");
      } catch (err) {
        console.error("Failed to send message to iframe:", err);
        setError("Unable to communicate with avatar iframe.");
      }
    };

    const intervalId = setInterval(() => {
      if (iframeRef.current?.contentWindow) {
        sendSubscription();
        clearInterval(intervalId);
      }
    }, 500);

    return () => clearInterval(intervalId);
  }, []);

  const containerStyle = {
    width: '100%',
    height: '600px',
    position: 'relative',
    borderRadius: '8px',
    overflow: 'hidden',
  };

  const successContainerStyle = {
    marginTop: '1rem',
    padding: '1rem',
    backgroundColor: '#f0f9ff',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const buttonStyle = {
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '500',
    textDecoration: 'none',
    display: 'inline-block',
    marginTop: '0.5rem',
  };

  return (
    <div>
      <div style={containerStyle}>
        {error && <p style={{ color: 'red', padding: '1rem' }}>{error}</p>}
        <iframe
          ref={iframeRef}
          title="Ready Player Me Avatar Creator"
          src={iframeSrc}
          style={{ width: '100%', height: '100%', border: 'none' }}
          allow="camera *; microphone *"
        />
      </div>

      {avatarUrl && (
        <div style={successContainerStyle}>
          <p style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Avatar created successfully!</p>
          <a 
            href={avatarUrl} 
            download="avatar.glb"
            style={buttonStyle}
          >
            Download Avatar (.glb)
          </a>
        </div>
      )}
    </div>
  );
}
