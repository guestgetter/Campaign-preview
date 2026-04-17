const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, PageBreak, PageNumber, LevelFormat
} = require("docx");

// Brand colors
const NAVY = "013349";
const GOLD = "D4A574";
const GOLD_LIGHT = "E8C9A8";
const CREAM = "F5F0E8";
const WARM_WHITE = "FAF8F5";
const SLATE = "5A6E7A";
const GREEN = "2D8A5E";
const WHITE = "FFFFFF";
const LIGHT_GRAY = "F0F0F0";

// Borders
const noBorder = { style: BorderStyle.NONE, size: 0 };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };
const thinBorder = { style: BorderStyle.SINGLE, size: 1, color: "D5D5D5" };
const thinBorders = { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder };
const goldLeftBorder = { top: noBorder, bottom: noBorder, right: noBorder, left: { style: BorderStyle.SINGLE, size: 12, color: GOLD } };

// Cell padding
const cellPad = { top: 100, bottom: 100, left: 140, right: 140 };
const cellPadWide = { top: 140, bottom: 140, left: 180, right: 180 };

// Page dimensions (US Letter)
const PAGE_W = 12240;
const PAGE_H = 15840;
const MARGIN = 1440;
const CONTENT_W = PAGE_W - 2 * MARGIN; // 9360

// Helper: simple paragraph
function p(text, opts = {}) {
  const runOpts = { font: "Inter", size: opts.size || 22, color: opts.color || "1A2A35" };
  if (opts.bold) runOpts.bold = true;
  if (opts.italics) runOpts.italics = true;
  const pOpts = { spacing: { after: opts.after !== undefined ? opts.after : 120 } };
  if (opts.alignment) pOpts.alignment = opts.alignment;
  if (opts.heading) pOpts.heading = opts.heading;
  if (opts.spacing) pOpts.spacing = { ...pOpts.spacing, ...opts.spacing };
  if (opts.indent) pOpts.indent = opts.indent;
  if (opts.border) pOpts.border = opts.border;
  pOpts.children = [new TextRun({ text, ...runOpts })];
  return new Paragraph(pOpts);
}

// Helper: multi-run paragraph
function multiP(runs, opts = {}) {
  const pOpts = { spacing: { after: opts.after !== undefined ? opts.after : 120 } };
  if (opts.alignment) pOpts.alignment = opts.alignment;
  if (opts.indent) pOpts.indent = opts.indent;
  if (opts.border) pOpts.border = opts.border;
  if (opts.shading) pOpts.shading = opts.shading;
  pOpts.children = runs.map(r => {
    const ro = { font: "Inter", size: r.size || 22, color: r.color || "1A2A35" };
    if (r.bold) ro.bold = true;
    if (r.italics) ro.italics = true;
    if (r.break) ro.break = r.break;
    return new TextRun({ text: r.text, ...ro });
  });
  return new Paragraph(pOpts);
}

// Helper: section heading (Playfair)
function sectionHead(label, title) {
  return [
    new Paragraph({
      spacing: { before: 360, after: 60 },
      children: [new TextRun({ text: label.toUpperCase(), font: "Inter", size: 16, color: GOLD, bold: true, characterSpacing: 80 })]
    }),
    new Paragraph({
      spacing: { after: 200 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: GOLD, space: 8 } },
      children: [new TextRun({ text: title, font: "Playfair Display", size: 40, color: NAVY, bold: true })]
    })
  ];
}

// Helper: email card
function emailCard(step, stepColor, title, timing, subject, bodyParagraphs, rationale) {
  const rows = [];
  // Header row
  rows.push(new TableRow({
    children: [new TableCell({
      borders: { top: thinBorder, left: thinBorder, right: thinBorder, bottom: { style: BorderStyle.SINGLE, size: 1, color: "E0E0E0" } },
      shading: { fill: CREAM, type: ShadingType.CLEAR },
      margins: cellPad,
      width: { size: CONTENT_W, type: WidthType.DXA },
      columnSpan: 1,
      children: [
        multiP([
          { text: step, bold: true, color: stepColor, size: 20 },
          { text: `  ${title}`, bold: true, color: NAVY, size: 22 },
        ], { after: 40 }),
        new Paragraph({ spacing: { after: 0 }, children: [new TextRun({ text: timing, font: "Inter", size: 18, color: SLATE, italics: true })] })
      ]
    })]
  }));
  // Subject row
  const bodyChildren = [
    multiP([
      { text: "SUBJECT: ", bold: true, color: SLATE, size: 16 },
      { text: subject, italics: true, color: NAVY, size: 22 },
    ], { after: 200 }),
  ];
  // Body paragraphs
  bodyParagraphs.forEach(bp => {
    if (bp.type === "menu") {
      bodyChildren.push(new Table({
        width: { size: CONTENT_W - 600, type: WidthType.DXA },
        columnWidths: [CONTENT_W - 600],
        rows: [new TableRow({
          children: [new TableCell({
            borders: noBorders,
            shading: { fill: CREAM, type: ShadingType.CLEAR },
            margins: cellPadWide,
            width: { size: CONTENT_W - 600, type: WidthType.DXA },
            children: bp.lines.map(l => multiP(l, { after: 60 }))
          })]
        })]
      }));
      bodyChildren.push(p("", { after: 80 }));
    } else if (bp.type === "quote") {
      bodyChildren.push(new Paragraph({
        spacing: { after: 160 },
        indent: { left: 360 },
        border: { left: { style: BorderStyle.SINGLE, size: 8, color: GOLD, space: 8 } },
        children: [new TextRun({ text: bp.text, font: "Inter", size: 21, color: NAVY, italics: true })]
      }));
    } else if (bp.type === "sms") {
      bodyChildren.push(new Table({
        width: { size: CONTENT_W - 400, type: WidthType.DXA },
        columnWidths: [CONTENT_W - 400],
        rows: [new TableRow({
          children: [new TableCell({
            borders: noBorders,
            shading: { fill: NAVY, type: ShadingType.CLEAR },
            margins: cellPadWide,
            width: { size: CONTENT_W - 400, type: WidthType.DXA },
            children: [new Paragraph({ spacing: { after: 0 }, children: [new TextRun({ text: bp.text, font: "Inter", size: 21, color: WHITE })] })]
          })]
        })]
      }));
      bodyChildren.push(p("", { after: 80 }));
    } else {
      bodyChildren.push(p(bp.text, { size: 21, after: 140, color: bp.color || "1A2A35", italics: bp.italics, bold: bp.bold }));
    }
  });
  // Rationale
  if (rationale) {
    bodyChildren.push(new Table({
      width: { size: CONTENT_W - 400, type: WidthType.DXA },
      columnWidths: [CONTENT_W - 400],
      rows: [new TableRow({
        children: [new TableCell({
          borders: noBorders,
          shading: { fill: "EDF7F0", type: ShadingType.CLEAR },
          margins: cellPad,
          width: { size: CONTENT_W - 400, type: WidthType.DXA },
          children: [multiP([
            { text: "Why this works: ", bold: true, color: GREEN, size: 19 },
            { text: rationale, color: GREEN, size: 19 },
          ], { after: 0 })]
        })]
      })]
    }));
  }

  rows.push(new TableRow({
    children: [new TableCell({
      borders: { top: noBorder, left: thinBorder, right: thinBorder, bottom: thinBorder },
      margins: cellPadWide,
      width: { size: CONTENT_W, type: WidthType.DXA },
      children: bodyChildren
    })]
  }));

  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [CONTENT_W],
    rows
  });
}

// Helper: phase label
function phaseLabel(text) {
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [CONTENT_W],
    rows: [new TableRow({
      children: [new TableCell({
        borders: noBorders,
        shading: { fill: GOLD_LIGHT, type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 160, right: 160 },
        width: { size: CONTENT_W, type: WidthType.DXA },
        children: [new Paragraph({ spacing: { after: 0 }, children: [new TextRun({ text: text.toUpperCase(), font: "Inter", size: 18, bold: true, color: NAVY, characterSpacing: 60 })] })]
      })]
    })]
  });
}

// Helper: callout box
function callout(boldText, bodyText, bgColor = CREAM) {
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [CONTENT_W],
    rows: [new TableRow({
      children: [new TableCell({
        borders: { top: noBorder, bottom: noBorder, right: noBorder, left: { style: BorderStyle.SINGLE, size: 12, color: GOLD, space: 0 } },
        shading: { fill: bgColor, type: ShadingType.CLEAR },
        margins: cellPadWide,
        width: { size: CONTENT_W, type: WidthType.DXA },
        children: [multiP([
          { text: boldText, bold: true, color: NAVY, size: 21 },
          { text: " " + bodyText, color: "1A2A35", size: 21 },
        ], { after: 0 })]
      })]
    })]
  });
}

// Helper: segment divider
function segDivider(title, subtitle) {
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [CONTENT_W],
    rows: [new TableRow({
      children: [new TableCell({
        borders: noBorders,
        shading: { fill: NAVY, type: ShadingType.CLEAR },
        margins: { top: 200, bottom: 200, left: 280, right: 280 },
        width: { size: CONTENT_W, type: WidthType.DXA },
        children: [
          new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: title, font: "Playfair Display", size: 30, bold: true, color: WHITE })] }),
          new Paragraph({ spacing: { after: 0 }, children: [new TextRun({ text: subtitle, font: "Inter", size: 19, color: GOLD_LIGHT })] })
        ]
      })]
    })]
  });
}

// Helper: spacer
function spacer(h = 200) {
  return p("", { after: h });
}

// ═══════════════════════════════════════
//  BUILD DOCUMENT
// ═══════════════════════════════════════

const children = [];

// ── TITLE PAGE ──
children.push(p("", { after: 3000 }));
children.push(new Paragraph({
  spacing: { after: 60 },
  alignment: AlignmentType.CENTER,
  children: [new TextRun({ text: "GUEST GETTER", font: "Inter", size: 16, color: GOLD, bold: true, characterSpacing: 200 })]
}));
children.push(new Paragraph({
  spacing: { after: 200 },
  alignment: AlignmentType.CENTER,
  border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: GOLD, space: 16 } },
  children: [new TextRun({ text: "Restaurant Lucie", font: "Playfair Display", size: 72, color: NAVY, bold: true })]
}));
children.push(new Paragraph({
  spacing: { after: 400 },
  alignment: AlignmentType.CENTER,
  children: [new TextRun({ text: "Private Event Lead Reactivation Sequence", font: "Playfair Display", size: 32, color: SLATE, italics: true })]
}));
children.push(new Paragraph({
  spacing: { after: 80 },
  alignment: AlignmentType.CENTER,
  children: [new TextRun({ text: "April 14, 2026", font: "Inter", size: 22, color: SLATE })]
}));
children.push(new Paragraph({
  spacing: { after: 80 },
  alignment: AlignmentType.CENTER,
  children: [new TextRun({ text: "Informed by Apr 9 call with Maggie Bain & Fred Dallot", font: "Inter", size: 20, color: SLATE, italics: true })]
}));

children.push(new Paragraph({ children: [new PageBreak()] }));

// ── SECTION 1: EXECUTIVE SUMMARY ──
children.push(...sectionHead("Section 1", "Executive Summary"));
children.push(p("A three-segment, multi-touch sequence designed to convert Restaurant Lucie\u2019s 315 Perfect Venue contacts and unconverted ad leads into booked private events.", { size: 21, color: SLATE, after: 280 }));

// Hero stats 2x2
const statW = Math.floor(CONTENT_W / 2);
function statCell(label, value, sub, highlight = false) {
  return new TableCell({
    borders: thinBorders,
    shading: { fill: highlight ? "FBF6F0" : WHITE, type: ShadingType.CLEAR },
    margins: cellPadWide,
    width: { size: statW, type: WidthType.DXA },
    children: [
      new Paragraph({ spacing: { after: 20 }, children: [new TextRun({ text: label.toUpperCase(), font: "Inter", size: 15, color: SLATE, bold: true, characterSpacing: 60 })] }),
      new Paragraph({ spacing: { after: 20 }, children: [new TextRun({ text: value, font: "Playfair Display", size: 40, color: NAVY, bold: true })] }),
      new Paragraph({ spacing: { after: 0 }, children: [new TextRun({ text: sub, font: "Inter", size: 18, color: SLATE })] })
    ]
  });
}

children.push(new Table({
  width: { size: CONTENT_W, type: WidthType.DXA },
  columnWidths: [statW, statW],
  rows: [
    new TableRow({ children: [
      statCell("Perfect Venue Contacts", "315", "Since Dec 2025"),
      statCell("Meta Ad Leads", "1,709", "Avg $4.52/lead"),
    ]}),
    new TableRow({ children: [
      statCell("Avg Event Revenue", "$618", "Completed visit average", true),
      statCell("Projected Recovery", "$71,790+", "Conservative estimate", true),
    ]}),
  ]
}));

children.push(new Paragraph({ children: [new PageBreak()] }));

// ── SECTION 2: VENUE INTELLIGENCE ──
children.push(...sectionHead("Section 2", "Venue Intelligence"));
children.push(p("Key insights from the April 9 call with Maggie Bain (Ma\u00eetre d\u2019) and Fred Dallot.", { size: 21, color: SLATE, after: 280 }));

const viW1 = 2800;
const viW2 = CONTENT_W - viW1;
function viRow(label, content) {
  return new TableRow({
    children: [
      new TableCell({
        borders: thinBorders,
        shading: { fill: CREAM, type: ShadingType.CLEAR },
        margins: cellPad,
        width: { size: viW1, type: WidthType.DXA },
        verticalAlign: "top",
        children: [new Paragraph({ spacing: { after: 0 }, children: [new TextRun({ text: label.toUpperCase(), font: "Inter", size: 16, bold: true, color: GOLD, characterSpacing: 40 })] })]
      }),
      new TableCell({
        borders: thinBorders,
        margins: cellPad,
        width: { size: viW2, type: WidthType.DXA },
        verticalAlign: "top",
        children: content.map(c => p(c, { size: 20, after: 80, color: "1A2A35" }))
      })
    ]
  });
}

children.push(new Table({
  width: { size: CONTENT_W, type: WidthType.DXA },
  columnWidths: [viW1, viW2],
  rows: [
    viRow("Event Mix", [
      "80% corporate \u2014 lawyers, doctors, high-net-worth in the Financial District.",
      "Wedding inquiries picking up (only 2 hosted so far).",
      "Groups 8+ qualify as private events."
    ]),
    viRow("Differentiators", [
      "Fully customized experience, arrival to departure.",
      "Custom tasting menu by the Chef for every group.",
      "Interactive wine & cheese experiences (educational).",
      "Sommelier is a trained teacher \u2014 runs icebreakers for corporate.",
      "Intimate space allows extraordinary creative flexibility."
    ]),
    viRow("Approved Offer", [
      "Glass of Cr\u00e9mant upon arrival via the champagne trolley.",
      "Surprise canap\u00e9s on departure (already happens \u2014 not on the menu, framed as \u201cthank you for coming\u201d)."
    ]),
    viRow("Operations", [
      "Perfect Venue is the private events CRM (since Dec 2025).",
      "Table Voice (AI phone, Yannick investor) can send texts \u2014 explore integration.",
      "Current PV auto-response: \u201cthank you, we\u2019ll respond shortly\u201d + events package.",
      "Feedback/testimonial form being built with Jeremy (Carbon Bar)."
    ]),
  ]
}));

children.push(new Paragraph({ children: [new PageBreak()] }));

// ── SECTION 3: SEQUENCE ARCHITECTURE ──
children.push(...sectionHead("Section 3", "Sequence Architecture"));
children.push(p("Each lead segment receives a distinct cadence calibrated to its intent level and deal value. Segment A runs for months. Segments B and C are tighter but still convert the long tail.", { size: 21, color: SLATE, after: 280 }));

const archCols = [600, 2600, 2200, 1200, 1000, 1360];
function archHeaderCell(text, w) {
  return new TableCell({
    borders: thinBorders,
    shading: { fill: NAVY, type: ShadingType.CLEAR },
    margins: cellPad,
    width: { size: w, type: WidthType.DXA },
    children: [new Paragraph({ spacing: { after: 0 }, children: [new TextRun({ text: text.toUpperCase(), font: "Inter", size: 15, bold: true, color: WHITE, characterSpacing: 40 })] })]
  });
}
function archCell(text, w, bold = false) {
  return new TableCell({
    borders: thinBorders,
    margins: cellPad,
    width: { size: w, type: WidthType.DXA },
    children: [new Paragraph({ spacing: { after: 0 }, children: [new TextRun({ text, font: "Inter", size: 19, color: "1A2A35", bold })] })]
  });
}

children.push(new Table({
  width: { size: CONTENT_W, type: WidthType.DXA },
  columnWidths: archCols,
  rows: [
    new TableRow({ children: archCols.map((w, i) => archHeaderCell(["", "Segment", "Definition", "Volume", "Touches", "Duration"][i], w)) }),
    new TableRow({ children: [
      archCell("A", archCols[0], true), archCell("Private Event Inquiries", archCols[1], true),
      archCell("PV contacts, groups 8+, corporate, buyouts", archCols[2]),
      archCell("~315", archCols[3]), archCell("8+", archCols[4]), archCell("90 days+", archCols[5])
    ]}),
    new TableRow({ children: [
      archCell("B", archCols[0], true), archCell("Celebration Leads", archCols[1], true),
      archCell("Birthday, Anniversary, Special Occasion, Wedding", archCols[2]),
      archCell("500\u2013700", archCols[3]), archCell("5", archCols[4]), archCell("21 days", archCols[5])
    ]}),
    new TableRow({ children: [
      archCell("C", archCols[0], true), archCell("Experience Campaign Leads", archCols[1], true),
      archCell("Carte Blanche, A French Winter, Before The Next Chapter", archCols[2]),
      archCell("1,000+", archCols[3]), archCell("4", archCols[4]), archCell("14 days", archCols[5])
    ]}),
  ]
}));

children.push(new Paragraph({ children: [new PageBreak()] }));

// ── SECTION 4: SEGMENT A ──
children.push(...sectionHead("Section 4", "Segment A \u2014 Private Event Inquiries"));

children.push(segDivider("Segment A \u2014 Private Event Inquiries", "315 Perfect Venue contacts \u00B7 8+ touches over 90 days \u00B7 Runs until they book, unsubscribe, or tell us to get lost"));
children.push(spacer(200));

children.push(callout("Maggie\u2019s current gap:", "Perfect Venue sends one auto-reply (\u201cthank you, we\u2019ll respond shortly\u201d + events package). After that, the only follow-up is Maggie personally responding. This sequence fills the space between that first auto-reply and conversion \u2014 systematically, over months."));
children.push(spacer(280));

// Phase 1
children.push(phaseLabel("Phase 1 \u2014 Warm Outreach \u00B7 Days 0\u20137"));
children.push(spacer(200));

// SMS Day 0
children.push(emailCard(
  "SMS", GOLD, "Instant Text on Inquiry", "Day 0 \u00B7 Fires within 2 minutes of form submission",
  "N/A \u2014 SMS",
  [{ type: "sms", text: "Hi [First Name], it\u2019s Maggie from Restaurant Lucie. Thank you for your event inquiry \u2014 I\u2019m looking forward to learning more about what you\u2019re planning. I\u2019ll follow up by email shortly, but feel free to text me here in the meantime. \u2014 Maggie" }],
  "Text gets 98% open rate vs. 20% for email. Sets a personal, responsive tone from the first second."
));
children.push(spacer(200));

// A1
children.push(emailCard(
  "A1", NAVY, "The Personal Reconnection + Cr\u00e9mant Offer", "Day 1 \u00B7 Sent from Maggie\u2019s email",
  "Your event at Lucie \u2014 a few thoughts",
  [
    { text: "Hi [First Name]," },
    { text: "Thank you for reaching out about hosting [your corporate dinner / your celebration / your event] at Restaurant Lucie. I\u2019ve been looking forward to learning more about what you have in mind." },
    { text: "I wanted to share a bit about what makes a private event at Lucie different. The Chef designs a fully customized tasting menu for every group \u2014 built around your preferences, dietary needs, and the season. No fixed packages, no generic set menus. From the moment your guests arrive to the moment they leave, every detail is tailored." },
    { text: "We can also incorporate interactive experiences: guided wine pairings with our sommelier (who is also a trained educator and wonderful at breaking the ice for corporate groups), interactive cheese courses, cocktail or mocktail pairings \u2014 whatever complements your evening." },
    { text: "And as a thank you for considering Lucie, we\u2019d love to welcome your group with a complimentary glass of Cr\u00e9mant on arrival, served from our champagne trolley.", bold: true },
    { text: "Would you have 10 minutes this week to chat through your vision? I\u2019m happy to work around your schedule." },
    { text: "Warmly, Maggie Bain \u00B7 Ma\u00eetre d\u2019 \u00B7 Restaurant Lucie", italics: true, color: SLATE },
  ],
  "Leads with genuine differentiators, then lands the Cr\u00e9mant offer as a \u2018thank you,\u2019 not a bribe. The champagne trolley is a signature moment."
));
children.push(spacer(200));

// A2
children.push(emailCard(
  "A2", NAVY, "The Visual Spark", "Day 4 \u00B7 Email with 2\u20133 curated photos",
  "What your evening could feel like",
  [
    { text: "[First Name]," },
    { text: "I pulled together a few images from recent private evenings here \u2014 thought they might help you picture what we could create for your group." },
    { type: "menu", lines: [
      [{ text: "[Image 1]", bold: true, color: GOLD }, { text: " \u2014 The dining room set for a corporate group of twelve, candlelit" }],
      [{ text: "[Image 2]", bold: true, color: GOLD }, { text: " \u2014 A plated course from a recent custom tasting menu" }],
      [{ text: "[Image 3]", bold: true, color: GOLD }, { text: " \u2014 The champagne trolley in action, Cr\u00e9mant being poured on arrival" }],
    ]},
    { text: "Because our space is intimate, we have extraordinary flexibility \u2014 the room transforms around your event, not the other way around. The Chef, our sommelier, and I work together to design something that feels completely yours." },
    { text: "Worth a quick call this week? Maggie", italics: true, color: SLATE },
  ],
  "Sells the feeling, not the features. Turns the intimate scale into an advantage, not a limitation."
));

children.push(new Paragraph({ children: [new PageBreak()] }));

// Phase 2
children.push(phaseLabel("Phase 2 \u2014 Nurture \u00B7 Days 7\u201330"));
children.push(spacer(200));

// A3
children.push(emailCard(
  "A3", NAVY, "The Social Proof Drop", "Day 9 \u00B7 Testimonial-driven",
  "\u201CThe best team dinner we\u2019ve ever had\u201D",
  [
    { text: "[First Name]," },
    { text: "I\u2019ll keep this short. A note from a recent corporate host:" },
    { type: "quote", text: "\u201CWe booked Lucie for a team dinner of ten \u2014 mostly lawyers who\u2019ve seen every restaurant in the Financial District. From the custom tasting menu to the interactive wine experience with the sommelier, every person at the table was genuinely impressed. Maggie handled all the planning and we didn\u2019t have to think about a single detail. Multiple people told me afterwards it was the best team dinner we\u2019ve ever done.\u201D" },
    { text: "If you\u2019re still exploring options for your event, I\u2019d love to make it this effortless for you. \u2014 Maggie", italics: true, color: SLATE },
  ],
  "Directly addresses the 80% corporate audience. Mentions \u201clawyers\u201d and \u201cFinancial District\u201d for peer relevance. Note: Yannick approved crafting testimonials until the feedback form is live \u2014 replace with real ones ASAP."
));
children.push(spacer(200));

// A4
children.push(emailCard(
  "A4", NAVY, "The Custom Menu Email", "Day 14 \u00B7 Menu-forward, educational",
  "Here\u2019s what the Chef built for a recent group",
  [
    { text: "[First Name]," },
    { text: "I thought you might like to see what a fully customized private event menu looks like at Lucie. Here\u2019s one the Chef designed for a recent corporate dinner of twelve:" },
    { type: "menu", lines: [
      [{ text: "On Arrival", bold: true, color: GOLD }, { text: " \u2014 Cr\u00e9mant service from the champagne trolley" }],
      [{ text: "Amuse-bouche", bold: true, color: GOLD }, { text: " \u2014 Pea velout\u00e9, cr\u00e8me fra\u00eeche, chive oil" }],
      [{ text: "First", bold: true, color: GOLD }, { text: " \u2014 Hand-dived scallop, cauliflower, brown butter, hazelnut" }],
      [{ text: "Second", bold: true, color: GOLD }, { text: " \u2014 Duck foie gras torchon, Sauternes gel\u00e9e, brioche" }],
      [{ text: "Intermezzo", bold: true, color: GOLD }, { text: " \u2014 Sommelier-led wine moment (the icebreaker)" }],
      [{ text: "Third", bold: true, color: GOLD }, { text: " \u2014 Pan-roasted halibut, leek fondue, champagne beurre blanc" }],
      [{ text: "Fourth", bold: true, color: GOLD }, { text: " \u2014 Elysian Fields lamb rack, spring vegetables, jus" }],
      [{ text: "Cheese", bold: true, color: GOLD }, { text: " \u2014 Interactive cheese course with guided tasting" }],
      [{ text: "Dessert", bold: true, color: GOLD }, { text: " \u2014 Valrhona chocolate souffl\u00e9, cr\u00e8me anglaise" }],
      [{ text: "On Departure", bold: true, color: GOLD }, { text: " \u2014 Chef\u2019s canap\u00e9s \u2014 a parting gesture from the kitchen" }],
    ]},
    { text: "Every menu is built from scratch. Dietary accommodations, preferences, and seasonal inspiration all shape what arrives at the table. Wine, cocktail, or mocktail pairings available for each course.", italics: true, color: SLATE },
    { text: "This is what $180 per person looks like at Lucie. Shall I start sketching something for your group? \u2014 Maggie" },
  ],
  "Shows the full arc from Cr\u00e9mant on arrival through surprise canap\u00e9s on departure. Anchors the $180pp price."
));
children.push(spacer(200));

// SMS Day 18
children.push(emailCard(
  "SMS", GOLD, "Gentle Check-In Text", "Day 18 \u00B7 Quick, casual",
  "N/A \u2014 SMS",
  [{ type: "sms", text: "Hi [First Name], just checking in \u2014 are you still thinking about your event? Happy to hop on a quick call if it\u2019s helpful. No pressure either way. \u2014 Maggie" }],
  "Catches people who opened emails but didn\u2019t reply. SMS feels more personal and immediate."
));
children.push(spacer(200));

// A5
children.push(emailCard(
  "A5", NAVY, "The Gentle Constraint", "Day 21 \u00B7 Availability-based",
  "Quick note on spring & summer availability",
  [
    { text: "Hi [First Name]," },
    { text: "Just a heads-up \u2014 our private dining calendar for the spring and summer is starting to fill in. Because we only host one private event at a time (the entire restaurant becomes yours), availability is genuinely limited." },
    { text: "If your plans are still taking shape, no rush at all. But if timing matters, it\u2019s worth locking in a date now \u2014 even tentatively \u2014 so we can hold the space for you." },
    { text: "Happy to jump on a quick call whenever works. \u2014 Maggie", italics: true, color: SLATE },
  ],
  "Real scarcity \u2014 an intimate restaurant that does full buyouts genuinely can only host one event at a time."
));

children.push(new Paragraph({ children: [new PageBreak()] }));

// Phase 3
children.push(phaseLabel("Phase 3 \u2014 Long Game \u00B7 Days 30\u201390+"));
children.push(spacer(200));

children.push(callout("Per Kyle (Apr 9 call):", "\u201CThis sequence should go for months basically until they unsubscribe or they tell us to get lost or they book in. It\u2019s a game of persistence.\u201D These emails shift to monthly cadence and keep Lucie top-of-mind."));
children.push(spacer(280));

// A6
children.push(emailCard(
  "A6", NAVY, "The Seasonal Update", "Day 35, then every 30 days with fresh content",
  "What\u2019s inspiring the Chef this season",
  [
    { text: "Hi [First Name]," },
    { text: "A quick note from the kitchen \u2014 the Chef is working with some extraordinary ingredients right now: [2\u20133 seasonal specifics, e.g. \u201cwild leeks foraged from Quebec, asparagus from the first local harvest, spring lamb from Elysian Fields\u201d]." },
    { text: "If you\u2019ve been thinking about hosting an event, this is a particularly beautiful time to do it. The spring menu is some of the most exciting cooking we\u2019ve done." },
    { text: "Would love to sketch a tasting menu for your group if you\u2019re interested. \u2014 Maggie", italics: true, color: SLATE },
  ],
  "Monthly seasonal updates keep the sequence fresh without repeating the same pitch. The menu changes \u2014 so the email changes."
));
children.push(spacer(200));

// A7
children.push(emailCard(
  "A7", NAVY, "The \u201CWe Just Hosted...\u201D Story", "Day 60 \u00B7 Narrative social proof",
  "A recent evening that came together beautifully",
  [
    { text: "[First Name]," },
    { text: "I wanted to share a recent event that captures what Lucie does best." },
    { text: "A partner at [type of firm] booked a dinner for 10 to celebrate the close of a major deal. The Chef built a seven-course menu around the group\u2019s preferences (two pescatarians, one nut allergy \u2014 every plate was different where it needed to be). Our sommelier ran a blind tasting between courses that had the table in stitches. And on the way out, the kitchen sent everyone off with a surprise canap\u00e9 \u2014 a little parting gift that wasn\u2019t on any menu." },
    { text: "The host called the next day to book their holiday dinner.", bold: true },
    { text: "That\u2019s the kind of evening I\u2019d love to create for you. Still interested? \u2014 Maggie", italics: true, color: SLATE },
  ],
  "Narrative proof. Weaves in the surprise canap\u00e9, sommelier icebreaker, and dietary flexibility. The \u201cbooked their holiday dinner\u201d ending signals repeat value."
));
children.push(spacer(200));

// A8
children.push(emailCard(
  "A8", NAVY, "The Graceful Close", "Day 90 \u00B7 Then loops back to A6 with fresh seasonal content",
  "Still here whenever you\u2019re ready",
  [
    { text: "Hi [First Name]," },
    { text: "I\u2019ve reached out a few times and I don\u2019t want to be a bother. Plans change, timing shifts \u2014 I completely understand." },
    { text: "I\u2019ll continue to send the occasional note about what\u2019s happening at Lucie (new seasonal menus, availability updates), but if you\u2019d ever like to revisit the conversation about your event, my line is always open." },
    { text: "Lucie isn\u2019t going anywhere. And neither am I." },
    { text: "All the best, Maggie", italics: true, color: SLATE },
  ],
  "Explicitly says \u201cI\u2019ll keep sending occasional updates\u201d to set expectations for the monthly loop. The \u201cI\u2019m stepping back\u201d email consistently gets the highest reply rate."
));

children.push(new Paragraph({ children: [new PageBreak()] }));

// ── SECTION 5: SEGMENT B ──
children.push(...sectionHead("Section 5", "Segment B \u2014 Celebration Leads"));
children.push(segDivider("Segment B \u2014 Celebration Leads", "Birthday, Anniversary, Special Occasion, Weddings \u00B7 5 touches over 21 days \u00B7 ~$618 avg value"));
children.push(spacer(200));

// B-SMS
children.push(emailCard(
  "SMS", GOLD, "Instant Text on Inquiry", "Day 0 \u00B7 Fires within 2 minutes",
  "N/A \u2014 SMS",
  [{ type: "sms", text: "Hi [First Name], it\u2019s the team at Restaurant Lucie. Thank you for thinking of us for your [birthday / anniversary / celebration]! We\u2019ll be in touch shortly with details. In the meantime, feel free to reply here with any questions." }],
  null
));
children.push(spacer(200));

// B1
children.push(emailCard(
  "B1", GOLD, "The Occasion Callback + Cr\u00e9mant Offer", "Day 1 \u00B7 Subject varies by occasion tag",
  "Still planning something special?",
  [
    { text: "Hi [First Name]," },
    { text: "You were recently looking into celebrating [a birthday / your anniversary / a special occasion] at Restaurant Lucie \u2014 and we\u2019d love to help make it happen." },
    { text: "Here\u2019s what makes a celebration at Lucie different: the Chef builds the experience around you. A personalized tasting menu. Wine pairings selected for your table. A handwritten note on the menu if you\u2019d like. No generic \u201cbirthday package\u201d \u2014 just an evening designed with care." },
    { text: "For groups of 8 or more, we offer full private dining \u2014 the entire restaurant becomes yours for the evening, with a complimentary glass of Cr\u00e9mant on arrival served from our champagne trolley.", bold: true },
    { text: "Our tasting experience starts at $180 per person. Shall I hold a table for you? Just reply with your preferred date and party size." },
    { text: "Warmly, The Lucie Team", italics: true, color: SLATE },
  ],
  "Calls back the emotional reason they first reached out. Introduces the Cr\u00e9mant offer naturally as part of the 8+ private dining upsell."
));
children.push(spacer(200));

// B2
children.push(emailCard(
  "B2", GOLD, "The \u201CWhat You\u2019ll Experience\u201D Email", "Day 6 \u00B7 Menu-forward",
  "A taste of what\u2019s to come",
  [
    { text: "[First Name]," },
    { text: "Here\u2019s a glimpse of a recent spring tasting menu at Lucie:" },
    { type: "menu", lines: [
      [{ text: "Amuse-bouche", bold: true, color: GOLD }, { text: " \u2014 Pea velout\u00e9, cr\u00e8me fra\u00eeche, chive oil" }],
      [{ text: "First", bold: true, color: GOLD }, { text: " \u2014 Hand-dived scallop, cauliflower, brown butter, hazelnut" }],
      [{ text: "Dessert", bold: true, color: GOLD }, { text: " \u2014 Valrhona chocolate souffl\u00e9, cr\u00e8me anglaise" }],
      [{ text: "", italics: true }, { text: "And on the way out \u2014 a surprise from the kitchen. But we\u2019ll let that be a surprise.", italics: true, color: SLATE }],
    ]},
    { text: "Every menu is seasonal and designed by the Chef. Dietary accommodations are always welcome.", italics: true, color: SLATE },
    { text: "Ready to book? Reply or call us at [phone]." },
  ],
  "Makes the intangible tangible. The teased \u201csurprise from the kitchen\u201d adds intrigue."
));
children.push(spacer(200));

// B3
children.push(emailCard(
  "B3", GOLD, "The Time-Sensitive Nudge", "Day 12 \u00B7 Brief, factual",
  "Weekend tables are going fast",
  [
    { text: "Hi [First Name]," },
    { text: "Quick note \u2014 our Friday and Saturday evenings through the spring are filling up, especially for groups." },
    { text: "If your [birthday / anniversary / celebration] is coming up, now\u2019s the time to lock in your preferred date." },
    { text: "Book directly: [reservation link]  |  Or reply here and we\u2019ll take care of everything." },
  ],
  null
));
children.push(spacer(200));

// B4
children.push(emailCard(
  "B4", GOLD, "Soft Exit + Gift Card Offer", "Day 21 \u00B7 Alternative conversion path",
  "A little something, whenever you\u2019re ready",
  [
    { text: "[First Name]," },
    { text: "Plans change \u2014 we get it. If the timing isn\u2019t right for your celebration just yet, we wanted you to know about our gift cards." },
    { text: "A Lucie gift card makes a beautiful gift for someone you love (or a future treat for yourself). Available in any amount \u2014 delivered digitally or as a physical card." },
    { text: "Browse gift cards: [gift card link]", bold: true },
    { text: "And whenever you\u2019re ready to celebrate, we\u2019ll be here. \u2014 Restaurant Lucie", italics: true, color: SLATE },
  ],
  "Converts the unconverted into a different revenue path. A $200\u2013$500 gift card still captures value."
));

children.push(new Paragraph({ children: [new PageBreak()] }));

// ── SECTION 6: SEGMENT C ──
children.push(...sectionHead("Section 6", "Segment C \u2014 Experience Campaign Leads"));
children.push(segDivider("Segment C \u2014 Experience Campaign Leads", "Carte Blanche, A French Winter, Before The Next Chapter \u00B7 4 touches over 14 days"));
children.push(spacer(200));

// C1
children.push(emailCard(
  "C1", "3D7A7A", "The \u201CYou\u2019re In\u201D Welcome", "Day 0 \u00B7 Re-engagement opener",
  "You\u2019re on the list \u2014 here\u2019s what\u2019s next",
  [
    { text: "Hi [First Name]," },
    { text: "Thank you for your interest in [Carte Blanche / the French Winter experience / Before The Next Chapter] at Restaurant Lucie." },
    { text: "We wanted to make sure you didn\u2019t miss what\u2019s coming: a new seasonal tasting menu celebrating the best of Quebec spring, available now through June. Tables are limited." },
    { text: "Book your table \u2192 [reservation link]", bold: true },
  ],
  "Treats the lead like an insider. \u201CYou\u2019re on the list\u201D creates belonging before asking for action."
));
children.push(spacer(200));

// C2
children.push(emailCard(
  "C2", "3D7A7A", "The Behind-the-Scenes Story", "Day 5 \u00B7 Narrative-driven",
  "The story behind the menu",
  [
    { text: "[First Name]," },
    { text: "Every dish at Lucie starts with a conversation \u2014 between the Chef, the season, and the producers he trusts." },
    { text: "This spring, that means: lamb from Elysian Fields, the same farm that supplies the best tables in New York. Wild leeks foraged from Quebec forests, available for just a few weeks each year. Dairy from a single producer in the Eastern Townships.", italics: true },
    { text: "This is food with a story. And we\u2019d love you to taste it." },
    { text: "Reserve your evening \u2192 [link]", bold: true },
  ],
  "Provenance storytelling elevates the offer beyond \u201ccome eat at our restaurant.\u201D Gives the lead something to care about."
));
children.push(spacer(200));

// C3
children.push(emailCard(
  "C3", "3D7A7A", "The Private Event Upsell", "Day 9 \u00B7 Cross-sell into Segment A",
  "Planning something for a group?",
  [
    { text: "[First Name]," },
    { text: "Many of our guests first discover Lucie through a tasting experience \u2014 and then come back with their team, their family, or their friends for a private evening." },
    { text: "If you\u2019re ever planning a dinner for 8 or more \u2014 a corporate event, a milestone birthday, an anniversary \u2014 we offer fully private dining with a custom menu, interactive wine experiences, and a complimentary glass of Cr\u00e9mant on arrival." },
    { text: "Just something to keep in the back of your mind. And in the meantime \u2014 we\u2019d still love to host you for dinner." },
    { text: "Book a table \u2192 [link]  |  Inquire about a private event \u2192 [link]", bold: true },
  ],
  "Plants the private events seed with 1,700+ leads. Even at 1% upsell, that\u2019s 17 private event inquiries from a warm pool."
));
children.push(spacer(200));

// C4
children.push(emailCard(
  "C4", "3D7A7A", "The Final Nudge", "Day 14 \u00B7 Last call",
  "Last call \u2014 the spring menu evolves soon",
  [
    { text: "[First Name]," },
    { text: "Our spring menu evolves with the season \u2014 and the current iteration won\u2019t last much longer." },
    { text: "If you\u2019ve been meaning to visit, this is your nudge." },
    { text: "Book now \u2192 [link]", bold: true },
    { text: "Restaurant Lucie \u00B7 [address] \u00B7 [phone]", italics: true, color: SLATE },
  ],
  "Short, direct, zero fluff. By touch four, brevity signals respect for their time."
));

children.push(new Paragraph({ children: [new PageBreak()] }));

// ── SECTION 7: DEPLOYMENT PLAYBOOK ──
children.push(...sectionHead("Section 7", "Deployment Playbook"));
children.push(p("Built from the Apr 9 call with Maggie and Fred. The tactical details that make the difference.", { size: 21, color: SLATE, after: 280 }));

const dpW1 = 2400;
const dpW2 = CONTENT_W - dpW1;
function dpRow(label, text) {
  return new TableRow({
    children: [
      new TableCell({
        borders: thinBorders,
        shading: { fill: CREAM, type: ShadingType.CLEAR },
        margins: cellPad,
        width: { size: dpW1, type: WidthType.DXA },
        verticalAlign: "top",
        children: [new Paragraph({ spacing: { after: 0 }, children: [new TextRun({ text: label, font: "Inter", size: 19, bold: true, color: NAVY })] })]
      }),
      new TableCell({
        borders: thinBorders,
        margins: cellPad,
        width: { size: dpW2, type: WidthType.DXA },
        verticalAlign: "top",
        children: [new Paragraph({ spacing: { after: 0 }, children: [new TextRun({ text, font: "Inter", size: 19, color: "1A2A35" })] })]
      })
    ]
  });
}

children.push(new Table({
  width: { size: CONTENT_W, type: WidthType.DXA },
  columnWidths: [dpW1, dpW2],
  rows: [
    dpRow("Automation Platform", "HighLevel for all email & SMS automation. Maggie is already familiar from the French Winter campaign. Segment A emails from Maggie\u2019s personal address."),
    dpRow("SMS Channel", "Explore Table Voice integration first (Yannick\u2019s investment, already handles texts). Fallback: provision a HighLevel number ($2/mo). Maggie to connect Kyle with Pascal."),
    dpRow("Lead Source", "Perfect Venue export (315 contacts) + Meta leads from HighLevel. Deduplicate by email before importing. Remove @restaurantlucie.com addresses."),
    dpRow("Sender Names", "Segment A: Maggie Bain (personal). Segments B & C: \u201CRestaurant Lucie\u201D or \u201CThe Lucie Team.\u201D"),
    dpRow("Optimal Send Times", "Tuesday\u2013Thursday, 10:30 AM or 6:00 PM ET. SMS: 11 AM ET. Avoid Monday morning and Friday afternoon."),
    dpRow("Reply Handling", "Segment A: same-day personal response from Maggie, always. B & C: templated reply with booking link within 4 hours."),
    dpRow("Suppression", "Immediately suppress on book (sync with PV + OpenTable), unsubscribe, or \u201Cnot interested.\u201D Do not duplicate PV\u2019s initial auto-response."),
    dpRow("Testimonials", "Crafted per Yannick approval until post-event feedback form is live. Maggie building with Jeremy (Carbon Bar). HighLevel survey builder also available. Replace with real ones ASAP."),
  ]
}));

children.push(spacer(200));
children.push(callout("Private event threshold: groups of 8+", "(per Maggie). Smaller celebration groups (2\u20137) get Segment B. Groups 8+ get Segment A with full buyout pitch, Cr\u00e9mant offer, and interactive experience positioning."));

children.push(new Paragraph({ children: [new PageBreak()] }));

// ── SECTION 8: REVENUE PROJECTION ──
children.push(...sectionHead("Section 8", "Revenue Projection"));
children.push(p("Based on Lucie\u2019s $618 avg completed visit revenue, $180pp private event pricing, and conservative conversion assumptions over a 90-day window.", { size: 21, color: SLATE, after: 280 }));

const revCols = [2200, 1100, 1100, 1200, 1400, 2360];
function revHeaderCell(text, w) {
  return new TableCell({
    borders: thinBorders,
    shading: { fill: NAVY, type: ShadingType.CLEAR },
    margins: cellPad,
    width: { size: w, type: WidthType.DXA },
    children: [new Paragraph({ spacing: { after: 0 }, alignment: text === "Segment" ? undefined : AlignmentType.RIGHT, children: [new TextRun({ text, font: "Inter", size: 16, bold: true, color: WHITE, characterSpacing: 30 })] })]
  });
}
function revCell(text, w, bold = false, align = AlignmentType.RIGHT) {
  return new TableCell({
    borders: thinBorders,
    margins: cellPad,
    width: { size: w, type: WidthType.DXA },
    children: [new Paragraph({ spacing: { after: 0 }, alignment: w === revCols[0] ? undefined : align, children: [new TextRun({ text, font: "Inter", size: 20, color: "1A2A35", bold })] })]
  });
}

children.push(new Table({
  width: { size: CONTENT_W, type: WidthType.DXA },
  columnWidths: revCols,
  rows: [
    new TableRow({ children: ["Segment", "Leads", "Conv. Rate", "Bookings", "Avg Value", "Revenue"].map((t, i) => revHeaderCell(t, revCols[i])) }),
    new TableRow({ children: [
      revCell("A \u2014 Private Events", revCols[0], true),
      revCell("315", revCols[1]), revCell("5%", revCols[2]), revCell("16", revCols[3]),
      revCell("$2,400", revCols[4]), revCell("$38,400", revCols[5], true),
    ]}),
    new TableRow({ children: [
      revCell("B \u2014 Celebrations", revCols[0], true),
      revCell("600", revCols[1]), revCell("5%", revCols[2]), revCell("30", revCols[3]),
      revCell("$618", revCols[4]), revCell("$18,540", revCols[5], true),
    ]}),
    new TableRow({ children: [
      revCell("C \u2014 Experience Leads", revCols[0], true),
      revCell("1,100", revCols[1]), revCell("3%", revCols[2]), revCell("33", revCols[3]),
      revCell("$450", revCols[4]), revCell("$14,850", revCols[5], true),
    ]}),
    new TableRow({ children: [
      new TableCell({ borders: thinBorders, shading: { fill: CREAM, type: ShadingType.CLEAR }, margins: cellPad, width: { size: revCols[0], type: WidthType.DXA }, columnSpan: 5,
        children: [new Paragraph({ spacing: { after: 0 }, children: [new TextRun({ text: "TOTAL PROJECTED REVENUE", font: "Inter", size: 20, bold: true, color: NAVY })] })] }),
      new TableCell({ borders: thinBorders, shading: { fill: CREAM, type: ShadingType.CLEAR }, margins: cellPad, width: { size: revCols[5], type: WidthType.DXA },
        children: [new Paragraph({ spacing: { after: 0 }, alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "$71,790", font: "Playfair Display", size: 30, bold: true, color: NAVY })] })] }),
    ]}),
  ]
}));

children.push(spacer(200));

children.push(new Table({
  width: { size: CONTENT_W, type: WidthType.DXA },
  columnWidths: [CONTENT_W],
  rows: [new TableRow({
    children: [new TableCell({
      borders: noBorders,
      shading: { fill: "EDF7F0", type: ShadingType.CLEAR },
      margins: cellPadWide,
      width: { size: CONTENT_W, type: WidthType.DXA },
      children: [
        multiP([{ text: "5x return on $14,296 ad spend", bold: true, color: GREEN, size: 24 }], { after: 60 }),
        p("These leads are already paid for \u2014 the sequence just activates the value sitting dormant. And with a 90-day Segment A sequence that loops monthly, the tail is long. One converted corporate buyout at $180pp \u00D7 20 guests = $3,600 from a single email.", { size: 19, color: GREEN, after: 0 }),
      ]
    })]
  })]
}));

children.push(new Paragraph({ children: [new PageBreak()] }));

// ── SECTION 9: NEXT STEPS ──
children.push(...sectionHead("Section 9", "Next Steps"));

const steps = [
  "Maggie forwards the Perfect Venue CSV export (315 contacts)",
  "Kyle deduplicates and imports into HighLevel",
  "Connect with Pascal re: Table Voice SMS integration",
  "Review sequence copy on Tuesday call",
  "Launch Segment A first (highest value), then B & C in the same week",
];

const doc = new Document({
  styles: {
    default: {
      document: { run: { font: "Inter", size: 22 } }
    },
  },
  numbering: {
    config: [{
      reference: "steps",
      levels: [{
        level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } }, run: { bold: true, color: NAVY } }
      }]
    }]
  },
  sections: [{
    properties: {
      page: {
        size: { width: PAGE_W, height: PAGE_H },
        margin: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN }
      }
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          spacing: { after: 0 },
          border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: GOLD, space: 6 } },
          children: [
            new TextRun({ text: "Restaurant Lucie", font: "Playfair Display", size: 18, color: NAVY, bold: true }),
            new TextRun({ text: "  \u00B7  Private Event Sales Sequence  \u00B7  Guest Getter", font: "Inter", size: 16, color: SLATE }),
          ]
        })]
      })
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          spacing: { after: 0 },
          alignment: AlignmentType.CENTER,
          border: { top: { style: BorderStyle.SINGLE, size: 1, color: "E0E0E0", space: 6 } },
          children: [
            new TextRun({ text: "Generated April 14, 2026  \u00B7  Page ", font: "Inter", size: 16, color: SLATE }),
            new TextRun({ children: [PageNumber.CURRENT], font: "Inter", size: 16, color: SLATE }),
          ]
        })]
      })
    },
    children: [
      ...children,
      ...steps.map(s => new Paragraph({
        numbering: { reference: "steps", level: 0 },
        spacing: { after: 160 },
        children: [new TextRun({ text: s, font: "Inter", size: 22, color: "1A2A35" })]
      })),
      spacer(400),
      new Table({
        width: { size: CONTENT_W, type: WidthType.DXA },
        columnWidths: [CONTENT_W],
        rows: [new TableRow({
          children: [new TableCell({
            borders: noBorders,
            shading: { fill: NAVY, type: ShadingType.CLEAR },
            margins: { top: 300, bottom: 300, left: 400, right: 400 },
            width: { size: CONTENT_W, type: WidthType.DXA },
            children: [
              new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: "Ready to deploy?", font: "Playfair Display", size: 32, bold: true, color: WHITE })] }),
              p("Segment the lead lists from Perfect Venue and Meta, load into HighLevel, and schedule the first touches for Tuesday or Wednesday morning.", { size: 20, color: GOLD_LIGHT, after: 0 }),
            ]
          })]
        })]
      }),
    ]
  }]
});

const OUTPUT = "/Users/kyleguilfoyle/Campaign-preview/lucie-private-event-sales-sequence.docx";
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(OUTPUT, buffer);
  console.log(`Written to ${OUTPUT} (${(buffer.length / 1024).toFixed(0)} KB)`);
}).catch(err => {
  console.error("Error:", err.message);
  process.exit(1);
});
