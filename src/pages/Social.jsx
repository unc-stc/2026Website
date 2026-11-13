import { useState } from "react";
import { committees, instagram } from "../content.js";

function Post({ src, title }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <article className="post-card">
      {!loaded && <div className="embed-wait">Opening Instagram…</div>}
      <iframe src={src} title={title} loading="lazy" onLoad={() => setLoaded(true)} />
    </article>
  );
}

export default function Social() {
  const committee = committees.find((item) => item.slug === "social");

  return (
    <div className="wrap narrow social-page">
      <h1>{committee.name}</h1>
      <p className="lede">{committee.body}</p>

      <div className="platform-bar post-account">
        <span className="ig-mark" aria-hidden="true">
          IG
        </span>
        <div>
          <a className="handle" href={instagram.url} target="_blank" rel="noreferrer">
            @{instagram.handle}
          </a>
          <p>UNC Student Technology Council · {instagram.followers} followers</p>
        </div>
        <a className="open-ig" href={instagram.url} target="_blank" rel="noreferrer">
          Open Instagram
        </a>
      </div>

      <section className="post-list" aria-label="Instagram posts from @unc_stc">
        {instagram.posts.map((post) => (
          <Post key={post.src} src={post.src} title={post.title} />
        ))}
      </section>
    </div>
  );
}
