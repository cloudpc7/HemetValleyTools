const fs = require("fs");
const path = require("path");
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  Header,
  Footer,
  AlignmentType,
  LevelFormat,
  HeadingLevel,
  BorderStyle,
  WidthType,
  ShadingType,
  PageBreak,
  TableOfContents,
  ExternalHyperlink,
  PageNumber,
} = require("docx");

const CONTENT_WIDTH = 9360;
const ACCENT = "B45309";
const MUTED = "6B7280";
const HEADER_FILL = "F3F4F6";
const border = { style: BorderStyle.SINGLE, size: 1, color: "D1D5DB" };
const borders = { top: border, bottom: border, left: border, right: border };

const spacer = (after = 120) =>
  new Paragraph({ spacing: { after }, children: [new TextRun("")] });

const body = (text, options = {}) =>
  new Paragraph({
    spacing: { after: options.after ?? 160, line: 276 },
    children: [
      new TextRun({
        text,
        size: options.size ?? 22,
        bold: options.bold,
        color: options.color,
        italics: options.italics,
      }),
    ],
  });

const label = (text) =>
  new Paragraph({
    spacing: { after: 60 },
    children: [new TextRun({ text: text.toUpperCase(), size: 18, color: MUTED, bold: true })],
  });

const bullet = (reference, text) =>
  new Paragraph({
    numbering: { reference, level: 0 },
    spacing: { after: 100, line: 276 },
    children: [new TextRun({ text, size: 22 })],
  });

const featureTable = (rows) =>
  new Table({
    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
    columnWidths: [2800, 6560],
    rows: [
      new TableRow({
        children: [
          cell("Capability", true, HEADER_FILL, 2800),
          cell("Description", true, HEADER_FILL, 6560),
        ],
      }),
      ...rows.map(([capability, description]) =>
        new TableRow({
          children: [cell(capability, false, "FFFFFF", 2800), cell(description, false, "FFFFFF", 6560)],
        })
      ),
    ],
  });

function cell(text, header = false, fill = "FFFFFF", width = 2800) {
  return new TableCell({
    borders,
    width: { size: width, type: WidthType.DXA },
    shading: { fill, type: ShadingType.CLEAR },
    margins: { top: 100, bottom: 100, left: 140, right: 140 },
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text,
            bold: header,
            size: header ? 20 : 22,
            color: header ? "111827" : "374151",
          }),
        ],
      }),
    ],
  });
}

const doc = new Document({
  styles: {
    default: {
      document: { run: { font: "Arial", size: 22, color: "374151" } },
    },
    paragraphStyles: [
      {
        id: "Heading1",
        name: "Heading 1",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 34, bold: true, font: "Arial", color: "111827" },
        paragraph: { spacing: { before: 280, after: 200 }, outlineLevel: 0 },
      },
      {
        id: "Heading2",
        name: "Heading 2",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: ACCENT },
        paragraph: { spacing: { before: 220, after: 140 }, outlineLevel: 1 },
      },
    ],
  },
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [
          {
            level: 0,
            format: LevelFormat.BULLET,
            text: "\u2022",
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } },
          },
        ],
      },
    ],
  },
  sections: [
    {
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        },
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: ACCENT, space: 4 } },
              spacing: { after: 120 },
              children: [
                new TextRun({ text: "Hemet Valley Tools", bold: true, size: 20, color: "111827" }),
                new TextRun({ text: "   |   Website Documentation", size: 20, color: MUTED }),
              ],
            }),
          ],
        }),
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: "Prepared by Cloud Drop Designs LLC", size: 18, color: MUTED }),
                new TextRun({ text: "    |    Page ", size: 18, color: MUTED }),
                new TextRun({ children: [PageNumber.CURRENT], size: 18, color: MUTED }),
              ],
            }),
          ],
        }),
      },
      children: [
        // Cover
        spacer(800),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 120 },
          children: [
            new TextRun({
              text: "HEMET VALLEY TOOL & SUPPLY",
              bold: true,
              size: 44,
              color: "111827",
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 240 },
          children: [
            new TextRun({ text: "Website Platform Documentation", size: 28, color: ACCENT }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 80 },
          children: [
            new ExternalHyperlink({
              link: "https://hemetvalleytools.web.app",
              children: [
                new TextRun({
                  text: "https://hemetvalleytools.web.app",
                  size: 24,
                  color: "2563EB",
                  underline: {},
                }),
              ],
            }),
          ],
        }),
        spacer(400),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          children: [
            new TextRun({
              text:
                "A modern web platform for tool sales, equipment rentals, workshop repairs, and commercial contractor account management — built to support in-store operations and online customer engagement across the Inland Empire.",
              size: 22,
              color: "4B5563",
              italics: true,
            }),
          ],
        }),
        spacer(600),
        label("Document date"),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          children: [new TextRun({ text: "June 20, 2026", size: 24, bold: true })],
        }),
        label("Developed by"),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "Cloud Drop Designs LLC", size: 24, bold: true, color: "111827" }),
          ],
        }),
        new Paragraph({ children: [new PageBreak()] }),

        // TOC
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun("Table of Contents")],
        }),
        new TableOfContents("Table of Contents", { hyperlink: true, headingStyleRange: "1-2" }),
        new Paragraph({ children: [new PageBreak()] }),

        // 1 Overview
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun("1. Website Overview")],
        }),
        body(
          "The Hemet Valley Tools website is a customer-facing digital storefront and operations platform. It allows visitors to explore products and rental equipment, reserve tools, request repairs and specialty services, complete checkout staging, and apply for commercial B2B accounts. A separate staff-only Pro Portal gives the internal team visibility into transactions, bookings, and lead activity."
        ),
        body(
          "The site is optimized for contractors, landscapers, and trade professionals who need reliable access to inventory, scheduling, and account services — while presenting a polished, brand-consistent experience aligned with Hemet Valley Tool & Supply’s reputation in San Jacinto and the surrounding Inland Empire market."
        ),

        // 2 Main Features
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun("2. Main Features")],
        }),
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun("Customer Storefront")],
        }),
        featureTable([
          ["Product Catalog", "Browse professional-grade tools with pricing, specifications, and availability."],
          ["Equipment Rentals", "View rental fleet, compare duration rates, and stage reservations."],
          ["Staging Cart & Checkout", "Combine purchases and rentals, apply B2B discounts, and submit dispatch requests."],
          ["Instant Reserve", "Book equipment time slots directly from the home page scheduler."],
          ["Repair Intake", "Submit tools for workshop diagnostics with ticket tracking."],
          ["Service Quotes", "Request specialty commercial services and sourcing support."],
        ]),
        spacer(200),
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun("Pro B2B — Commercial Accounts")],
        }),
        featureTable([
          ["Account Applications", "Contractors apply for commercial accounts with company and trade details."],
          ["Net-30 Underwriting Flow", "Structured onboarding for credit review and account approval."],
          ["Blueprint Upload", "Submit project plans and bid specifications for tailored supply pricing."],
        ]),
        spacer(200),
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun("Pro Portal — Staff Operations")],
        }),
        featureTable([
          ["Secure Staff Login", "Authenticated access for authorized HVT team members only."],
          ["Transaction Management", "View checkout records, adjust pricing, and process refunds or cancellations."],
          ["Booking Management", "Edit reservation dates, times, and pricing; cancel with inventory restoration."],
          ["Lead Dashboard", "Monitor B2B applications, service requests, and repair tickets in one console."],
          ["Unified CRM View", "Consolidated customer contact history across all inbound channels."],
        ]),

        new Paragraph({ children: [new PageBreak()] }),

        // 3 Benefits
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun("3. Business Benefits")],
        }),
        body(
          "The platform is designed to reduce phone and counter friction while keeping Hemet Valley Tools in control of inventory, scheduling, and customer relationships."
        ),
        bullet("bullets", "Increase lead capture through online rental, repair, service, and B2B application forms."),
        bullet("bullets", "Present a professional brand experience that reflects in-store expertise and product quality."),
        bullet("bullets", "Give contractors a clear path to open commercial accounts without mixing staff tools into the public site."),
        bullet("bullets", "Enable staff to review transactions and bookings in real time instead of relying on disconnected records."),
        bullet("bullets", "Support faster response times with organized lead queues and customer contact history."),
        bullet("bullets", "Scale digital operations through automated builds and deployments without manual file uploads."),

        // 4 SEO
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun("4. SEO & Online Presence")],
        }),
        body(
          "Each major section of the website includes purpose-built page titles, meta descriptions, and keyword targeting aligned to local search intent — including tool rental, repair, and contractor account services in the Hemet Valley and Inland Empire region."
        ),
        featureTable([
          ["Page-Level SEO", "Dedicated metadata for Home, Products, Rentals, Repairs, Services, and B2B pages."],
          ["Local Intent", "Content and keywords oriented toward San Jacinto, Hemet Valley, and Inland Empire contractors."],
          ["Structured Messaging", "Clear service categories that help search engines and visitors understand offerings quickly."],
          ["Mobile-Ready Layout", "Responsive design supports discovery and conversion on phones and tablets used in the field."],
          ["Fast Hosting", "Firebase Hosting delivers the site over a secure, globally distributed CDN."],
        ]),

        // 5 Platform summary (brief, business tone)
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun("5. Platform & Reliability")],
        }),
        body(
          "The website is built on a modern, maintainable technology stack and hosted on Google Firebase. Customer submissions are processed through secure cloud functions, and staff operations are protected by role-based authentication and locked database access rules."
        ),
        featureTable([
          ["Hosting", "Firebase Hosting with automatic SPA routing."],
          ["Database", "Cloud Firestore for operational records and lead data."],
          ["Automation", "GitHub Actions for build verification and production deployment."],
          ["Security", "Staff-only portal access with admin-controlled permissions."],
        ]),

        // 6 Contact / business info
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun("6. Business Contact")],
        }),
        featureTable([
          ["Business Name", "Hemet Valley Tool & Supply"],
          ["Address", "777 W Esplanade Ave, San Jacinto, CA 92582"],
          ["Phone", "951-654-1034"],
          ["Live Website", "https://hemetvalleytools.web.app"],
          ["Source Repository", "https://github.com/cloudpc7/HemetValleyTools"],
        ]),
        spacer(300),
        new Paragraph({
          border: { top: { style: BorderStyle.SINGLE, size: 6, color: ACCENT, space: 8 } },
          spacing: { before: 200 },
          children: [
            new TextRun({
              text: "This document summarizes the delivered website platform as of the creation date above. For technical maintenance, hosting access, or future enhancements, contact Cloud Drop Designs LLC.",
              size: 20,
              color: MUTED,
              italics: true,
            }),
          ],
        }),
      ],
    },
  ],
});

const outputPath = path.join(
  __dirname,
  "..",
  "Hemet_Valley_Tools_Website_Documentation.docx"
);

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(outputPath, buffer);
  console.log(`Created: ${outputPath}`);
});