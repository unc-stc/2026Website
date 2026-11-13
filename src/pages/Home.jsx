import { Link } from "react-router-dom";
import { committees } from "../content.js";

export default function Home() {
  return (
    <div className="wrap">
      <section className="hero">
        <p className="eyebrow">Who is STC?</p>
        <h1>
          <span>Students shaping</span> <span>campus technology.</span>
        </h1>
        <p className="lede">
          The Student Technology Council (STC) is a student-led organization that represents
          student perspectives and helps influence technology at UNC. Tap a
          committee to show what they’re working on.
        </p>
      </section>

      <section className="committee-grid" aria-label="Committees">
        {committees.map((committee, index) => (
          <Link
            key={committee.slug}
            className="card"
            to={committee.href}
            style={{ animationDelay: `${0.15 + index * 0.08}s` }}
          >
            <span className="argyle-edge" aria-hidden="true" />
            <span className="card-kicker">{committee.short}</span>
            <h2>{committee.name}</h2>
            <p>{committee.line}</p>
            <span className="chip live">Learn More</span>
          </Link>
        ))}
      </section>
    </div>
  );
}
