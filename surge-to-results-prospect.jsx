import { useState } from "react";

const ACCENT = "#E85D2A";
const ACCENT_LIGHT = "rgba(232, 93, 42, 0.12)";
const ACCENT_BORDER = "rgba(232, 93, 42, 0.3)";
const BG = "#FDFAF6";
const BG_CARD = "#FFFFFF";
const TEXT = "#1A1A1A";
const TEXT_MED = "#4A4A4A";
const TEXT_LIGHT = "#7A7A7A";
const BORDER = "#E8E2D9";
const GREEN = "#2D8F5E";
const GREEN_LIGHT = "rgba(45, 143, 94, 0.1)";

function LeverSlider() {
  const [guests, setGuests] = useState(50);
  const avgCheck = 45;
  const visitsPerYear = 3.2;
  const ltv = avgCheck * visitsPerYear;
  const cpa = 12;
  const monthlyRevenue = guests * avgCheck;
  const yearlyRevenue = guests * ltv;
  const adSpend = guests * cpa;
  const roi = ((monthlyRevenue - adSpend) / adSpend * 100).toFixed(0);

  return (
    <div style={{ background: BG_CARD, borderRadius: 16, padding: "32px 28px", border: `1px solid ${BORDER}`, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${ACCENT}, ${GREEN})` }} />
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: TEXT_LIGHT, textTransform: "uppercase", letterSpacing: 2, marginBottom: 8, fontFamily: "system-ui, sans-serif" }}>Try the lever</div>
        <div style={{ fontSize: 15, color: TEXT_MED, lineHeight: 1.6, fontFamily: "system-ui, sans-serif" }}>
          Drag to see what happens when you know your numbers
        </div>
      </div>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 56, fontWeight: 800, color: ACCENT, lineHeight: 1, fontFamily: "system-ui, sans-serif" }}>{guests}</div>
        <div style={{ fontSize: 13, color: TEXT_LIGHT, marginTop: 4, fontFamily: "system-ui, sans-serif" }}>new guests this month</div>
      </div>
      <input
        type="range" min={10} max={200} value={guests}
        onChange={(e) => setGuests(Number(e.target.value))}
        style={{ width: "100%", marginBottom: 28, accentColor: ACCENT, cursor: "pointer" }}
      />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {[
          { label: "Ad spend", value: `$${adSpend.toLocaleString()}`, sub: `at $${cpa}/guest` },
          { label: "This month's revenue", value: `$${monthlyRevenue.toLocaleString()}`, sub: `${guests} × $${avgCheck} avg check` },
          { label: "12-month value", value: `$${yearlyRevenue.toLocaleString()}`, sub: `${visitsPerYear} return visits avg`, highlight: true },
          { label: "First-month ROI", value: `${roi}%`, sub: "before they ever come back", highlight: true },
        ].map((item, i) => (
          <div key={i} style={{ background: item.highlight ? GREEN_LIGHT : "#F8F6F2", borderRadius: 10, padding: "14px 16px", border: `1px solid ${item.highlight ? "rgba(45,143,94,0.2)" : BORDER}` }}>
            <div style={{ fontSize: 11, color: TEXT_LIGHT, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4, fontFamily: "system-ui, sans-serif" }}>{item.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: item.highlight ? GREEN : TEXT, fontFamily: "system-ui, sans-serif" }}>{item.value}</div>
            <div style={{ fontSize: 11, color: TEXT_LIGHT, marginTop: 2, fontFamily: "system-ui, sans-serif" }}>{item.sub}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16, padding: "12px 16px", background: ACCENT_LIGHT, borderRadius: 8, border: `1px solid ${ACCENT_BORDER}` }}>
        <p style={{ fontSize: 13, color: ACCENT, margin: 0, fontWeight: 600, textAlign: "center", fontFamily: "system-ui, sans-serif" }}>
          Need more covers? Turn it up. Restaurant full? Turn it down. That's the lever.
        </p>
      </div>
    </div>
  );
}

const timeline = [
  {
    week: "Week 1–2",
    emoji: "🔧",
    label: "Your foundation goes live",
    detail: "A brand new website that actually turns visitors into reservations. No more missed calls turning into missed covers — they get answered and booked automatically. Reviews start getting requested after every visit without you lifting a finger.",
    color: ACCENT,
  },
  {
    week: "Week 3",
    emoji: "📣",
    label: "People start finding you",
    detail: "Ads go live targeting people in your area who are actively looking for somewhere to eat. Every reservation and call gets tracked back to where it came from — so you'll know exactly which dollars brought in which guests.",
    color: ACCENT,
  },
  {
    week: "Week 4",
    emoji: "📊",
    label: "Your first real numbers",
    detail: "How many new guests came in. What each one cost to bring in. Which channels actually worked. Meanwhile, guests who came in once start getting brought back automatically through email and text — no effort from you.",
    color: "#3B7DD8",
  },
  {
    week: "Week 5",
    emoji: "🔄",
    label: "The system gets smarter",
    detail: "We cut what's not working and put more behind what is. Your review count is climbing. Guests are starting to come back for second and third visits. The whole thing is tightening up.",
    color: "#3B7DD8",
  },
  {
    week: "Week 6",
    emoji: "🎯",
    label: "Your lever is built",
    detail: "You get your Guest Lever Scorecard: the exact cost to put a new guest in a seat, what each guest is worth over time, and what happens when you spend more. From here, we keep optimizing monthly. The lever is yours.",
    color: GREEN,
  },
];

const outcomes = [
  "No more missed calls becoming missed reservations",
  "Guests finding you on Google and in their social feeds",
  "Every marketing dollar tracked to actual covers",
  "New reviews showing up consistently without you asking",
  "Past guests coming back automatically via email and text",
  "A clear number: what it costs to put someone in a seat",
];

const objections = [
  {
    q: "I've been burned by marketing people before.",
    a: "Yeah. Most restaurant owners have. Someone promised results, took the money, sent some reports full of numbers that didn't connect to actual guests, and eventually the whole thing fizzled. We get it — that experience makes you not want to trust anyone with this again. That's exactly why we built this around one number you can verify yourself: did new guests show up, and what did each one cost? If the answer isn't clear within 45 days, something's wrong and you'll be able to see it.",
  },
  {
    q: "I don't have time for another marketing project.",
    a: "You won't need time. We build everything — the website, the campaigns, the email sequences, all of it. Your involvement is one kickoff conversation and quick weekly check-ins. Think of it less like a project and more like hiring a kitchen team member who just shows up and does the work.",
  },
  {
    q: "What if it doesn't work for my restaurant?",
    a: "Then you'll know that, too — with data, not a hunch. And you'll still walk away with a brand new website, automated review system, retention sequences, and total clarity on your numbers. That infrastructure changes how you operate regardless.",
  },
  {
    q: "I'm already doing some marketing. Why change?",
    a: "You might not need to change what you're doing — you might just need to measure it. A lot of restaurant marketing actually works. The problem is you can't tell which parts. Once you can see what's driving guests and what isn't, you might keep doing exactly what you're doing, just with the waste cut out.",
  },
  {
    q: "Can't I just hire someone to do social media?",
    a: "Social media is one piece. But posts don't automatically turn into reservations. This connects the whole chain — someone sees you online, visits your site, books a table, gets a follow-up that brings them back. A social media person handles one step. This is the whole system.",
  },
];

export default function SurgeToResults() {
  const [openFaq, setOpenFaq] = useState(null);
  const [activeWeek, setActiveWeek] = useState(0);

  const sf = "system-ui, -apple-system, sans-serif";

  return (
    <div style={{ fontFamily: "'Georgia', 'Times New Roman', serif", background: BG, color: TEXT, minHeight: "100vh" }}>

      {/* HERO */}
      <div style={{ padding: "56px 24px 48px", textAlign: "center" }}>
        <div style={{ maxWidth: 620, margin: "0 auto" }}>
          <div style={{
            display: "inline-block", fontSize: 11, fontWeight: 700, letterSpacing: 3,
            color: ACCENT, textTransform: "uppercase", fontFamily: sf, marginBottom: 20,
            padding: "6px 14px", border: `1.5px solid ${ACCENT_BORDER}`, borderRadius: 20, background: ACCENT_LIGHT,
          }}>Guest Getter</div>

          <h1 style={{ fontSize: 42, fontWeight: 400, margin: "0 0 12px", lineHeight: 1.15, letterSpacing: -0.5 }}>
            Surge To Results
          </h1>
          <p style={{ fontSize: 17, color: TEXT_LIGHT, margin: "0 0 32px", fontFamily: sf }}>
            The Restaurant Growth System
          </p>

          <div style={{ maxWidth: 500, margin: "0 auto", padding: "24px 28px", background: BG_CARD, border: `1px solid ${BORDER}`, borderRadius: 12 }}>
            <p style={{ fontSize: 19, color: TEXT, margin: 0, lineHeight: 1.6, fontStyle: "italic" }}>
              What if you knew — to the dollar — what it costs to put a new guest in a seat?
            </p>
            <p style={{ fontSize: 15, color: TEXT_MED, margin: "12px 0 0", fontFamily: sf, lineHeight: 1.6 }}>
              And what if you could turn that number up when you need more covers, and down when you're full?
            </p>
          </div>
        </div>
      </div>

      {/* THE PROBLEM — THEIR EXPERIENCE */}
      <div style={{ maxWidth: 620, margin: "0 auto", padding: "0 24px 48px" }}>
        <h2 style={{ fontSize: 28, fontWeight: 400, marginBottom: 16 }}>Sound familiar?</h2>
        <div style={{ fontFamily: sf, fontSize: 15, lineHeight: 1.8, color: TEXT_MED }}>
          <p style={{ margin: "0 0 16px" }}>
            Tuesday night's dead again. You spent $800 on that influencer last month and you're pretty sure... maybe three people came in? You've got a stack of half-finished marketing ideas, a social media page you post to when you remember, and a website that hasn't been touched since 2021.
          </p>
          <p style={{ margin: "0 0 16px" }}>
            Meanwhile, your food costs just went up. Rent isn't going down. And every month, money goes out the door on marketing that might be working. Or might not. <strong style={{ color: TEXT }}>You genuinely can't tell</strong>.
          </p>
          <p style={{ margin: 0 }}>
            That's the real problem. Not that your marketing doesn't work — some of it probably does. The problem is you <strong style={{ color: TEXT }}>can't see which part</strong>. So you can't do more of what's working or stop what isn't. You're stuck on a hamster wheel.
          </p>
        </div>
      </div>

      {/* THE REFRAME */}
      <div style={{ background: BG_CARD, borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, padding: "48px 24px" }}>
        <div style={{ maxWidth: 620, margin: "0 auto" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: ACCENT, textTransform: "uppercase", fontFamily: sf, marginBottom: 12 }}>The shift</div>
          <h2 style={{ fontSize: 28, fontWeight: 400, marginBottom: 16 }}>One number changes everything</h2>
          <div style={{ fontFamily: sf, fontSize: 15, lineHeight: 1.8, color: TEXT_MED }}>
            <p style={{ margin: "0 0 16px" }}>
              Your <strong style={{ color: ACCENT }}>cost to acquire a guest</strong>. That's it. Once you know it — really know it, backed by actual tracking — marketing stops being a mystery and starts being a dial you control.
            </p>
            <p style={{ margin: "0 0 16px" }}>
              Need 30 more covers on a slow night? You know what that costs. Slammed all weekend and don't need more traffic? Dial it back. Opening a second location? Dial it way up.
            </p>
            <p style={{ margin: 0 }}>
              We call it <strong style={{ color: ACCENT }}>The Guest Lever</strong>. Not a marketing plan you hope works. A system you can see, measure, and control — like any other part of your restaurant.
            </p>
          </div>
        </div>
      </div>

      {/* INTERACTIVE LEVER */}
      <div style={{ maxWidth: 620, margin: "0 auto", padding: "48px 24px" }}>
        <LeverSlider />
      </div>

      {/* SOCIAL PROOF */}
      <div style={{ background: BG_CARD, borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, padding: "40px 24px" }}>
        <div style={{ maxWidth: 620, margin: "0 auto" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: ACCENT, textTransform: "uppercase", fontFamily: sf, marginBottom: 16, textAlign: "center" }}>Real restaurants. Real numbers.</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { name: "HEAL Wellness", stat: "$0.30/guest", detail: "1,700+ guests across 4 locations", color: ACCENT },
              { name: "Piping Kettle Soup Co", stat: "1,300+ guests", detail: "Seasonal campaigns in 4 months", color: "#3B7DD8" },
              { name: "Via Cibo", stat: "990 new guests", detail: "From Meta ads alone", color: GREEN },
              { name: "In Good Spirits", stat: "Worst → best month", detail: "April 2024 to April 2025", color: "#8B5CF6" },
            ].map((item, i) => (
              <div key={i} style={{ padding: "16px 18px", background: "#F8F6F2", borderRadius: 10, border: `1px solid ${BORDER}` }}>
                <div style={{ fontSize: 11, color: TEXT_LIGHT, fontFamily: sf, marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>{item.name}</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: item.color, fontFamily: sf }}>{item.stat}</div>
                <div style={{ fontSize: 12, color: TEXT_MED, marginTop: 2, fontFamily: sf }}>{item.detail}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 16, display: "flex", justifyContent: "center", gap: 32, fontFamily: sf }}>
            <div>
              <div style={{ fontSize: 28, fontWeight: 800, color: TEXT }}> 97%</div>
              <div style={{ fontSize: 11, color: TEXT_LIGHT, marginTop: 2 }}>owner retention rate</div>
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 800, color: TEXT }}>100+</div>
              <div style={{ fontSize: 11, color: TEXT_LIGHT, marginTop: 2 }}>restaurant owners served</div>
            </div>
          </div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div style={{ maxWidth: 620, margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: ACCENT, textTransform: "uppercase", fontFamily: sf, marginBottom: 12 }}>How it works</div>
        <h2 style={{ fontSize: 28, fontWeight: 400, marginBottom: 8 }}>We build it. We run it. You watch it work.</h2>
        <p style={{ fontFamily: sf, fontSize: 15, color: TEXT_MED, marginBottom: 32, lineHeight: 1.7 }}>
          The first 45 days, we build your whole system from scratch. After that, we manage and improve it every month. Here's what you'll actually see:
        </p>

        <div style={{ display: "flex", gap: 6, marginBottom: 20, overflowX: "auto", paddingBottom: 4 }}>
          {timeline.map((t, i) => (
            <button key={i} onClick={() => setActiveWeek(i)}
              style={{
                padding: "10px 14px", background: activeWeek === i ? t.color : "transparent",
                border: `1.5px solid ${t.color}`, borderRadius: 8, cursor: "pointer",
                whiteSpace: "nowrap", transition: "all 0.2s", fontFamily: sf,
              }}>
              <div style={{ fontSize: 16, marginBottom: 2 }}>{t.emoji}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: activeWeek === i ? "#fff" : t.color }}>{t.week}</div>
            </button>
          ))}
        </div>

        <div style={{ padding: "24px", background: "#F8F6F2", borderRadius: 12, border: `1px solid ${BORDER}`, minHeight: 100 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: timeline[activeWeek].color, marginBottom: 6, fontFamily: sf }}>
            {timeline[activeWeek].label}
          </div>
          <p style={{ fontSize: 15, color: TEXT_MED, margin: 0, lineHeight: 1.7, fontFamily: sf }}>
            {timeline[activeWeek].detail}
          </p>
        </div>

        <div style={{ marginTop: 24, padding: "16px 20px", background: BG_CARD, borderRadius: 10, border: `1px solid ${BORDER}` }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: GREEN, marginBottom: 8, fontFamily: sf }}>After 45 days, the system runs monthly:</div>
          <div style={{ fontFamily: sf, fontSize: 14, color: TEXT_MED, lineHeight: 1.8 }}>
            Campaigns managed and optimized. Monthly reporting with real numbers. Local search visibility climbing. Retention sequences bringing guests back automatically. Strategy adjustments for slow nights, seasonal shifts, and whatever you need.
          </div>
        </div>
      </div>

      {/* WHAT YOU WALK AWAY WITH */}
      <div style={{ background: BG_CARD, borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, padding: "48px 24px" }}>
        <div style={{ maxWidth: 620, margin: "0 auto" }}>
          <h2 style={{ fontSize: 28, fontWeight: 400, marginBottom: 8 }}>What changes for you</h2>
          <p style={{ fontFamily: sf, fontSize: 15, color: TEXT_MED, lineHeight: 1.7, marginBottom: 24 }}>
            These aren't marketing deliverables. These are things that actually change how your restaurant operates:
          </p>
          <div style={{ display: "grid", gap: 12 }}>
            {outcomes.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", background: "#F8F6F2", borderRadius: 10, padding: "16px 20px", border: `1px solid ${BORDER}` }}>
                <span style={{ color: GREEN, fontWeight: 800, fontSize: 16, flexShrink: 0 }}>✓</span>
                <span style={{ fontSize: 15, color: TEXT, fontFamily: sf }}>{item}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, padding: "14px 20px", background: GREEN_LIGHT, borderRadius: 10, border: "1px solid rgba(45,143,94,0.2)" }}>
            <p style={{ fontSize: 14, color: GREEN, margin: 0, fontWeight: 600, textAlign: "center", fontFamily: sf }}>
              Everything we build is yours. The website, the data, the system — all of it, no matter what.
            </p>
          </div>
        </div>
      </div>

      {/* WHO WE ARE — ANTI-GURU */}
      <div style={{ maxWidth: 620, margin: "0 auto", padding: "48px 24px" }}>
        <h2 style={{ fontSize: 28, fontWeight: 400, marginBottom: 16 }}>A note about us</h2>
        <div style={{ fontFamily: sf, fontSize: 15, lineHeight: 1.8, color: TEXT_MED }}>
          <p style={{ margin: "0 0 16px" }}>
            We're not going to tell you we have some secret sauce or proprietary algorithm. We don't have a formula that "guarantees" results. Anyone who tells you that is selling you something.
          </p>
          <p style={{ margin: "0 0 16px" }}>
            What we do have is a system that tracks everything. We set up the infrastructure, run the campaigns, measure what happens, and show you the numbers. If something works, we do more of it. If it doesn't, we stop.
          </p>
          <p style={{ margin: 0 }}>
            That's it. No smoke. No jargon. Just a dashboard you can read and a number you can trust.
          </p>
        </div>
      </div>

      {/* INVESTMENT */}
      <div style={{ background: BG_CARD, borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, padding: "48px 24px" }}>
        <div style={{ maxWidth: 620, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: ACCENT, textTransform: "uppercase", fontFamily: sf, marginBottom: 12 }}>Investment</div>
          <h2 style={{ fontSize: 28, fontWeight: 400, marginBottom: 24 }}>Everything. $1,000 a month.</h2>

          <div style={{ fontSize: 46, fontWeight: 800, color: ACCENT, fontFamily: sf }}>$1,000</div>
          <div style={{ fontSize: 15, color: TEXT_LIGHT, marginTop: 4, fontFamily: sf }}>per month</div>

          <div style={{ display: "flex", justifyContent: "center", gap: 28, marginTop: 24, fontFamily: sf }}>
            {[
              { icon: "🌐", text: "Website built for you" },
              { icon: "📊", text: "Campaigns managed" },
              { icon: "🎯", text: "Everything tracked" },
            ].map((item, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 22, marginBottom: 4 }}>{item.icon}</div>
                <div style={{ fontSize: 12, color: TEXT_MED, fontWeight: 500 }}>{item.text}</div>
              </div>
            ))}
          </div>

          <div style={{ maxWidth: 460, margin: "28px auto 0" }}>
            <div style={{ padding: "20px", background: "#F8F6F2", borderRadius: 12, border: `1px solid ${BORDER}` }}>
              <p style={{ fontSize: 14, color: TEXT_MED, margin: "0 0 10px", lineHeight: 1.7, fontFamily: sf }}>
                Most restaurant owners already spend more than this on marketing they can't measure. A dedicated in-house hire starts at $60K/year.
              </p>
              <p style={{ fontSize: 14, color: TEXT, margin: 0, lineHeight: 1.7, fontFamily: sf, fontWeight: 600 }}>
                This gets you the whole system — website, ads, SEO, retention, reporting — fully managed. And you can actually see what it's doing.
              </p>
            </div>
            <p style={{ fontSize: 12, color: TEXT_LIGHT, margin: "12px 0 0", fontFamily: sf }}>
              + recommended ad budget of $500–$1,500/month (paid directly to the platforms, not to us)
            </p>
          </div>
        </div>
      </div>

      {/* OBJECTIONS */}
      <div style={{ maxWidth: 620, margin: "0 auto", padding: "48px 24px" }}>
        <h2 style={{ fontSize: 28, fontWeight: 400, marginBottom: 8 }}>Reasonable concerns</h2>
        <p style={{ fontFamily: sf, fontSize: 14, color: TEXT_LIGHT, marginBottom: 24 }}>
          You'd be crazy not to have questions.
        </p>
        {objections.map((o, i) => (
          <div key={i} style={{ marginBottom: 8 }}>
            <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
              style={{
                width: "100%", background: BG_CARD, border: `1px solid ${BORDER}`,
                borderRadius: openFaq === i ? "10px 10px 0 0" : 10, padding: "16px 20px",
                cursor: "pointer", textAlign: "left", display: "flex",
                justifyContent: "space-between", alignItems: "center", fontFamily: sf,
              }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: TEXT, fontStyle: "italic", flex: 1, paddingRight: 12 }}>"{o.q}"</span>
              <span style={{ fontSize: 18, color: TEXT_LIGHT, flexShrink: 0 }}>{openFaq === i ? "−" : "+"}</span>
            </button>
            {openFaq === i && (
              <div style={{ background: BG_CARD, borderRadius: "0 0 10px 10px", padding: "16px 20px", border: `1px solid ${BORDER}`, borderTop: "none" }}>
                <p style={{ fontSize: 14, color: TEXT_MED, margin: 0, lineHeight: 1.7, fontFamily: sf }}>{o.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* CLOSER */}
      <div style={{ maxWidth: 620, margin: "0 auto", padding: "0 24px 64px", textAlign: "center" }}>
        <div style={{ padding: "40px 32px", background: BG_CARD, borderRadius: 16, border: `1px solid ${BORDER}`, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${ACCENT}, ${GREEN})` }} />
          <h2 style={{ fontSize: 26, fontWeight: 400, margin: "0 0 16px" }}>
            Stop guessing. Start knowing.
          </h2>
          <p style={{ fontSize: 15, color: TEXT_MED, margin: "0 0 4px", fontFamily: sf, lineHeight: 1.7 }}>
            We build the system. We run the campaigns. We show you the numbers.<br />
            You decide what to do with them.
          </p>
          <p style={{ fontSize: 17, fontWeight: 700, color: ACCENT, margin: "16px 0 0", fontFamily: sf }}>
            You'll know what it costs to fill a seat.<br />
            And you'll have the lever to do it whenever you want.
          </p>
        </div>
      </div>
    </div>
  );
}
