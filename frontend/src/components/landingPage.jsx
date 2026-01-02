import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function LandingPage() {
  const nav = useNavigate();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  function joinAsStudent() {
    const cleaned = code.replace(/\s+/g, "").toUpperCase();

  // exact 6 caractere alfanumerice
  const regex = /^[A-Z0-9]{6}$/;

  if (!regex.test(cleaned)) {
    setError("Access code must be exactly 6 letters or digits.");
    return;
  }

  setError("");
  nav(`/student/${cleaned}`);
  }

  return (
    <div className="lp">
      <header className="lpNav">
        <div className="lpBrand">
          <div className="lpLogo" aria-hidden="true">🎓</div>
          <span>Continuous Feedback</span>
        </div>

      </header>

      <main className="lpMain">
        <div className="lpHero">
          <h1>Classroom Feedback<br />Simplified</h1>
          <p>
            Choose your path to get started. Students can join instantly with anonymity
            guaranteed.
          </p>
        </div>

        <section className="lpCards">
          {/* STUDENT */}
          <div className="card studentCard">
            <div className="cardTop">
              <div className="iconBox" aria-hidden="true">🧑‍🎓</div>
              <span className="pill">ANONYMOUS</span>
            </div>

            <h2>Student</h2>
            <p className="muted">
              Join your class session directly. No registration, no login—your feedback is
              completely private.
            </p>

            <div className="divider" />

            <div className="labelSmall">ENTER 6-DIGIT ACTIVITY CODE</div>

            <div className="joinRow">
              <div className="inputWrap">
                <span className="inputIcon" aria-hidden="true">🔢</span>
                <input
                    className="input"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="000000"
                    maxLength={6}
                />
                {error && (
                <div style={{ color: "crimson", fontSize: 13, marginTop: 8 }}>
                    {error}
                </div>
                )}
              </div>

              <button className="btn btnPrimary" onClick={joinAsStudent}>
                Join <span aria-hidden="true">→</span>
              </button>
            </div>

            <div className="hint">
              🔒 Your identity is not shared with the professor.
            </div>
          </div>

          {/* PROFESSOR */}
          <div className="card">
            <div className="cardTop">
              <div className="iconBox" aria-hidden="true">🧑‍🏫</div>
              <span className="mutedSmall">Administration</span>
            </div>

            <h2>Professor</h2>
            <p className="muted">
              Log in to create new activities, manage your courses, and view live analytics
              from your students.
            </p>

            <div className="profActions">
              <button className="btn btnOutline" onClick={() => nav("/professor/login")}> 
                Professor Login <span aria-hidden="true">→</span>
              </button>
              <button className="btn btnPrimary" style={{marginLeft:8}} onClick={() => nav("/professor/register")}> 
                Creează profesorul <span aria-hidden="true">+</span>
              </button>
            </div>
          </div>
        </section>

        <footer className="lpFooter">
          © 2025 Continuous Feedback Platform. All rights reserved.
        </footer>
      </main>
    </div>
  );
}
