import React, { useState } from 'react';

const GrafanaPanel = ({ src, title }) => {
  const [loaded, setLoaded] = useState(false);

  const handleLoad = () => {
    setLoaded(true);
  };

  return (
    <iframe
      title={title}
      src={src}
      frameBorder="0"
      onLoad={handleLoad}
      style={{ display: loaded ? 'block' : 'none' }}
    ></iframe>
  );
};

export default GrafanaPanel;
