import { committees } from "../content.js";

export default function Construction({ slug }) {
  const committee = committees.find((item) => item.slug === slug);

  return (
    <div className="wrap quiet">
      <p className="eyebrow">{committee.short}</p>
      <div className="brick-stack" aria-hidden="true">
        <span className="mini-brick gold" />
        <span className="mini-brick" />
        <span className="mini-brick short" />
        <span className="mini-brick drop" />
      </div>
      <h1>Under construction</h1>
      <p className="lede">{committee.body}</p>
    </div>
  );
}
