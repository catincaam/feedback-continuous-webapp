import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import feedbackService from "../services/feedbackService";
import activityService from "../services/activityService";

function timeAgo(ts) {
  const d = new Date(ts);
  const sec = Math.max(1, Math.floor((Date.now() - d.getTime()) / 1000));
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const h = Math.floor(min / 60);
  return `${h}h ago`;
}

const EMOJI = {
  happy: "😄",
  surprised: "😮",
  confused: "🤔",
  sad: "😣",
};

function getTs(f) {
  const raw = f.Timestamp || f.timestamp || f.createdAt || f.created_at;
  const t = new Date(raw).getTime();
  return Number.isFinite(t) ? t : 0;
}

function getKey(f) {
  const id = f.Id || f.id;
  if (id != null) return `id:${id}`;
  return `t:${getTs(f)}|e:${(f.Emotion || f.emotion || "").toLowerCase()}`;
}

function fmtTime(ts) {
  if (!ts) return "—";
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function clamp01(x) {
  return Math.max(0, Math.min(1, x));
}

export default function ActivityInfo() {
  const nav = useNavigate();
  const { id } = useParams();
  const cacheKey = `classpulse_feedback_activity_${id}`;

  const [activity, setActivity] = useState(null);
  const [feedback, setFeedback] = useState(() => {
    try {
      const raw = localStorage.getItem(cacheKey);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [error, setError] = useState("");

  useEffect(() => {
    let stop = false;

    async function loadActivity() {
      try {
        const a = await activityService.getActivityById(id);
        if (!stop) setActivity(a);
      } catch {}
    }

    function saveCache(list) {
      try {
        localStorage.setItem(cacheKey, JSON.stringify(list));
      } catch {}
    }

    function mergeDedup(prev, next) {
      const map = new Map();
      for (const f of prev) map.set(getKey(f), f);
      for (const f of next) map.set(getKey(f), f);
      return Array.from(map.values()).sort((a, b) => getTs(b) - getTs(a));
    }

    async function pollFeedback() {
      try {
        const list = await feedbackService.getFeedbacksByActivity(id);
        if (stop) return;
        if (Array.isArray(list)) {
          setFeedback((prev) => {
            const merged = mergeDedup(prev, list);
            saveCache(merged);
            return merged;
          });
          setError("");
        } else {
          setError("");
        }
      } catch {
        if (!stop) setError("Cannot load feedback (showing last known results).");
      }
    }

    loadActivity();
    pollFeedback();
    const t = setInterval(pollFeedback, 2000);
    return () => {
      stop = true;
      clearInterval(t);
    };
  }, [id]);

  // ---- Session status (live/ended) ----
  const startTs = useMemo(() => {
    const raw = activity?.StartTime ?? activity?.startTime ?? activity?.start_time;
    const t = raw ? new Date(raw).getTime() : 0;
    return Number.isFinite(t) ? t : 0;
  }, [activity]);

  const endTs = useMemo(() => {
    const raw = activity?.EndTime ?? activity?.endTime ?? activity?.end_time;
    const t = raw ? new Date(raw).getTime() : 0;
    return Number.isFinite(t) ? t : 0;
  }, [activity]);

  const ended = useMemo(() => {
    if (!endTs) return false;
    return Date.now() >= endTs;
  }, [endTs]);

  // ---- Stats: live = last 15 min, ended = whole session ----
  const stats = useMemo(() => {
    const now = Date.now();

    const relevant = ended
      ? feedback // ALL
      : feedback.filter((f) => now - getTs(f) <= 15 * 60 * 1000); // last 15 min

    const counts = { happy: 0, confused: 0, surprised: 0, sad: 0 };
    for (const f of relevant) {
      const e = (f.Emotion || f.emotion || "").toLowerCase();
      if (counts[e] !== undefined) counts[e]++;
    }

    const total = relevant.length;
    if (total === 0) {
      return { total: 0, happy: 0, confused: 0, surprised: 0, sad: 0 };
    }

    const pct = (x) => Math.round((x * 100) / total);
    return {
      total,
      happy: pct(counts.happy),
      confused: pct(counts.confused),
      surprised: pct(counts.surprised),
      sad: pct(counts.sad),
    };
  }, [feedback, ended]);

  // ---- Feed: always latest reactions (doesn't depend on ended/live) ----
  const feed = useMemo(() => {
    return [...feedback].sort((a, b) => getTs(b) - getTs(a)).slice(0, 8);
  }, [feedback]);

  // ---- Timeline buckets ----
  // live -> last 15 minutes (15 buckets)
  // ended -> full session (N buckets)
  const series = useMemo(() => {
    const now = Date.now();

    if (!ended) {
      const buckets = Array.from({ length: 15 }, () => ({
        happy: 0,
        confused: 0,
        surprised: 0,
        sad: 0,
        total: 0,
      }));

      for (const f of feedback) {
        const ts = getTs(f);
        const diffMin = Math.floor((now - ts) / 60000);
        if (diffMin < 0 || diffMin > 14) continue;
        const idx = 14 - diffMin;
        const e = (f.Emotion || f.emotion || "").toLowerCase();
        if (buckets[idx] && buckets[idx][e] !== undefined) buckets[idx][e]++;
        buckets[idx].total++;
      }

      return buckets.map((b) => {
        const t = b.total;
        if (!t) return { happy: 0, surprised: 0, confused: 0, sad: 0 };
        return {
          happy: b.happy / t,
          surprised: b.surprised / t,
          confused: b.confused / t,
          sad: b.sad / t,
        };
      });
    }

    // ENDED: across entire session
    // Choose bucket count based on session length (min 12, max 30)
    const s0 = startTs || Math.min(...feedback.map(getTs), Date.now());
    const s1 = endTs || Math.max(...feedback.map(getTs), Date.now());
    const duration = Math.max(1, s1 - s0);

    const ideal = Math.round(duration / (5 * 60 * 1000)); // ~5min per bucket
    const N = Math.max(12, Math.min(30, ideal));

    const buckets = Array.from({ length: N }, () => ({
      happy: 0,
      confused: 0,
      surprised: 0,
      sad: 0,
      total: 0,
    }));

    for (const f of feedback) {
      const ts = getTs(f);
      if (ts < s0 || ts > s1) continue;
      const pos = (ts - s0) / duration; // 0..1
      const idx = Math.min(N - 1, Math.max(0, Math.floor(pos * N)));
      const e = (f.Emotion || f.emotion || "").toLowerCase();
      if (buckets[idx] && buckets[idx][e] !== undefined) buckets[idx][e]++;
      buckets[idx].total++;
    }

    return buckets.map((b) => {
      const t = b.total;
      if (!t) return { happy: 0, surprised: 0, confused: 0, sad: 0 };
      return {
        happy: b.happy / t,
        surprised: b.surprised / t,
        confused: b.confused / t,
        sad: b.sad / t,
      };
    });
  }, [feedback, ended, startTs, endTs]);

  // Axis labels
  const axis = useMemo(() => {
    if (!ended) {
      // last 15 minutes axis (simple)
      return ["-15m", "-10m", "-5m", "NOW"];
    }
    return ["START", "", "", "END"];
  }, [ended]);

  const title = activity?.Title ?? activity?.title ?? "Activity";
  const code = activity?.AccessCode ?? activity?.access_code ?? "";

  return (
    <div className="aWrap">
      <aside className="aSide">
        <div className="aBrand">
          <div className="aLogo">🎓</div>
          <b>ClassPulse</b>
        </div>
        <button className="aNewBtn" onClick={() => nav("/professor/dashboard")}>
          ＋ Create New Session
        </button>
      </aside>

      <main className="aMain">
        <div className="aHeader">
          <div>
            <h1 className="aTitle">{title}</h1>
            <div className="aMeta">
              <span>
                🔑 Code: <b>{code || "—"}</b>
              </span>
              {ended && (
                <span style={{ marginLeft: 12, opacity: 0.7 }}>
                  • Ended ({fmtTime(startTs)}–{fmtTime(endTs)})
                </span>
              )}
            </div>
          </div>
        </div>

        {error && <div className="errorBox">{error}</div>}

        <div className="aStatGrid">
          <div className="aStatCard blue">
            <div className="aStatTop">
              <span className="aStatLabel">UNDERSTANDING</span>
              <span className="aMiniEmoji">😄</span>
            </div>
            <div className="aStatValue">{stats.happy}%</div>
          </div>

          <div className="aStatCard purple">
            <div className="aStatTop">
              <span className="aStatLabel">CONFUSED</span>
              <span className="aMiniEmoji">🤔</span>
            </div>
            <div className="aStatValue">{stats.confused}%</div>
          </div>

          <div className="aStatCard yellow">
            <div className="aStatTop">
              <span className="aStatLabel">SURPRISED</span>
              <span className="aMiniEmoji">😮</span>
            </div>
            <div className="aStatValue">{stats.surprised}%</div>
          </div>

          <div className="aStatCard red">
            <div className="aStatTop">
              <span className="aStatLabel">LOST</span>
              <span className="aMiniEmoji">😣</span>
            </div>
            <div className="aStatValue">{stats.sad}%</div>
          </div>
        </div>

        <div className="aBottomGrid">
          <section className="aCard">
            <div className="aCardTitle">
              {ended ? "Sentiment Timeline (Session)" : "Live Sentiment Timeline"}
            </div>
            <div className="mutedSmall">
              {ended
                ? "Reactions across the entire session"
                : "Real-time student reactions over the last 15 minutes"}
            </div>

            <div className="aLegend">
              <span>
                <i className="legDot blueDot" /> Happy
              </span>
              <span>
                <i className="legDot yellowDot" /> Surprised
              </span>
              <span>
                <i className="legDot purpleDot" /> Confused
              </span>
              <span>
                <i className="legDot redDot" /> Lost
              </span>
            </div>

            <div className="aChart">
              {series.map((p, idx) => {
                const h1 = Math.round(clamp01(p.happy) * 100);
                const h2 = Math.round(clamp01(p.surprised) * 100);
                const h3 = Math.round(clamp01(p.confused) * 100);
                const h4 = Math.round(clamp01(p.sad) * 100);

                const max = Math.max(h1, h2, h3, h4);
                let cls = "blueBar";
                if (max === h2) cls = "yellowBar";
                else if (max === h3) cls = "purpleBar";
                else if (max === h4) cls = "redBar";

                return (
                  <div className="aCol" key={idx} title={`bucket ${idx + 1}`}>
                    <div className={`aBar ${cls}`} style={{ height: `${max}%` }} />
                  </div>
                );
              })}
            </div>

            <div className="aChartAxis">
              <span>{axis[0]}</span>
              <span>{axis[1]}</span>
              <span>{axis[2]}</span>
              <span>{axis[3]}</span>
            </div>
          </section>

          <section className="aCard">
            <div className="aFeedTop">
              <div>
                <div className="aCardTitle">{ended ? "Session Feed" : "Live Feed"}</div>
                <div className="mutedSmall">Latest reactions</div>
              </div>
              <span className="aGreenDot" />
            </div>

            <div className="aFeedList">
              {feed.map((f, i) => {
                const emo = (f.Emotion || f.emotion || "happy").toLowerCase();
                const ts = f.Timestamp || f.timestamp || f.createdAt || f.created_at;
                return (
                  <div className="aFeedRow" key={getKey(f) ?? i}>
                    <div className="aFeedEmoji">{EMOJI[emo] || "🙂"}</div>
                    <div className="aFeedText">
                      <div className="aFeedTitle">Anonymous Student</div>
                      <div className="aFeedSub">
                        Reacted <b>"{emo}"</b>
                      </div>
                    </div>
                    <div className="aFeedTime">{timeAgo(ts)}</div>
                  </div>
                );
              })}

              {feed.length === 0 && (
                <div className="mutedSmall" style={{ padding: 12, opacity: 0.7 }}>
                  No reactions yet.
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
