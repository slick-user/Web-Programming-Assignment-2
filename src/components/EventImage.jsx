import { useEffect, useState } from 'react';
import styles from './EventImage.module.css';

// Falls back to the shared placeholder when an event has no image or the file fails.
export default function EventImage({ event, className = '' }) {
  const [src, setSrc] = useState(event.image || event.imageFallback);

  useEffect(() => {
    setSrc(event.image || event.imageFallback);
  }, [event.image, event.imageFallback]);

  return (
    <img
      className={`${styles.image} ${className}`.trim()}
      src={src}
      alt={`Illustration for ${event.title}`}
      onError={() => setSrc(event.imageFallback)}
    />
  );
}
