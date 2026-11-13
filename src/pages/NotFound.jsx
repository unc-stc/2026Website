import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="wrap quiet">
      <div className="brick-stack" aria-hidden="true">
        <span className="mini-brick short" />
      </div>
      <h1>Still in the huddle</h1>
      <p className="lede">That page isn’t on the court.</p>
      <nav className="page-links">
        <Link to="/">Back home</Link>
      </nav>
    </div>
  );
}
