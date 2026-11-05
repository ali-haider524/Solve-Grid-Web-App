"use client";

import { useState } from "react";
import styles from "./VideoExplainer.module.css";

type VideoExplainerProps = {
  id: string;
  title: string;
  description: string;
  uploadDate: string;
  duration: string;
  pageUrl: string;
};

// Lightweight YouTube embed: shows the thumbnail and only loads the player after a click,
// so the page stays fast. Includes VideoObject structured data for the video.
export default function VideoExplainer({ id, title, description, uploadDate, duration, pageUrl }: VideoExplainerProps) {
  const [playing, setPlaying] = useState(false);
  const thumb = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: title,
    description,
    thumbnailUrl: [thumb, `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`],
    uploadDate,
    duration,
    contentUrl: `https://www.youtube.com/watch?v=${id}`,
    embedUrl: `https://www.youtube.com/embed/${id}`,
    publisher: { "@id": "https://solvegrid.online/#organization" },
    mainEntityOfPage: pageUrl,
  };
  return (
    <section className={styles.wrap} aria-labelledby={`video-${id}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className={styles.copy}>
        <p className={styles.eyebrow}>VIDEO EXPLAINER</p>
        <h2 id={`video-${id}`}>{title}</h2>
        <p>{description}</p>
      </div>
      <div className={styles.frame}>
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button className={styles.play} onClick={() => setPlaying(true)} type="button" aria-label={`Play video: ${title}`}>
            <img src={thumb} alt={`Video thumbnail: ${title}`} width={480} height={360} loading="lazy" decoding="async" />
            <span aria-hidden="true">▶</span>
          </button>
        )}
      </div>
    </section>
  );
}
