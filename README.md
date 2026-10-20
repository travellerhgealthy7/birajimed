# Clinic Pharmacy — Website

Static, dependency-free website for **Clinic Pharmacy**: clinical pharmacy, travel medicine,
vaccination, medical documentation and home healthcare in Nepal.

No build step, no framework, no npm install. Open `index.html` in a browser, or deploy the
folder to any static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages, cPanel, S3).

---

## Structure

```
index.html                      Home
pharmacy-support.html           Pharmacy & Prescription Support
controlled-medication.html      Controlled Medication Travel Guidance
vaccinations.html               Vaccination & Preventive Healthcare
medicine-kits.html              Customised International Medicine Kits
medical-certificates.html       Fit-to-Fly, Fitness Assessments & Medical Certificates
diagnostics.html                Diagnostic Services
home-care.html                  Premium Clinical Home-Care Services
international-patients.html     International Patient & Medical Travel Support
contact.html                    Contact, Appointments, Privacy, Terms, Complaints
404.html                        Not found

assets/css/styles.css           Design system + all page styles
assets/js/main.js               Nav, tabs, accordion, reveal, appointment form
assets/img/*.svg                Illustrations, logo mark, favicon

robots.txt  sitemap.xml         SEO
```

## Deploying

1. Upload the whole folder to the web root of your host.
2. Point the domain at it.
3. Set `404.html` as the custom 404 page (Netlify/Vercel/Cloudflare detect it automatically).
4. Update `SITE` URLs: the `canonical`, `og:url` tags in each HTML file and `sitemap.xml`.

### Local preview

```bash
python -m http.server 8099
# open http://127.0.0.1:8099
```

---

## Before you publish — replace the placeholders

Search and replace these values across the HTML files (`Ctrl+H` in an editor, or `sed`):

| Placeholder | Where | Replace with |
|---|---|---|
| `+977 000 000 000` | header bar, footer, contact page, floating button | Real clinic phone number |
| `info@birajimedicine.com.np` | header bar, footer, contact page | Real monitored email address |
| `https://wa.me/977000000000` | footer, floating WhatsApp button | Real WhatsApp number (country code, no `+` or spaces) |
| `Clinic Pharmacy, Kathmandu, Nepal` | footer, contact page | Full street address |
| `https://facebook.com/` / `https://instagram.com/` | footer social links | Real profile URLs |
| `900 AM – 7:00 PM` | header bar, footer, contact page | Real opening hours |

The phone/WhatsApp/email appear in **every** page — a single find-and-replace across the
folder is enough.

### Confirm the service claims

The copy deliberately describes services as *documentation and compliance guidance* rather
than guarantees. Before publishing, verify and adjust:

- [ ] Which of the six service pillars the clinic **actually** delivers today.
- [ ] Which **vaccines are currently in stock** (site claims HPV/Gardasil 9, hepatitis B,
      influenza, pneumococcal and rabies, plus tetanus, MMR, hepatitis A, typhoid and
      Japanese encephalitis *by indication and availability*).
- [ ] The **professional qualifications and licensing** of the clinicians named or implied.
- [ ] The **geographic coverage** for home care (site states: subject to clinical
      suitability, staffing, service availability and coverage).
- [ ] Whether **import permit assistance** is genuinely offered for controlled medicines.
- [ ] **Fees** — the site asks for written estimates rather than publishing prices.

### Appointment form

`contact.html` uses a static form that composes an email to `info@birajimedicine.com.np`.
To use a hosted form service instead (Formspree, Netlify Forms, Web3Forms), replace the
`<form data-appointment-form …>` element and remove the `data-appointment-form` attribute
so `assets/js/main.js` does not intercept the submit.

### Other optional upgrades

- Replace `assets/img/illustration-*.svg` with photography of the real clinic, team and
  facilities (keep the same filenames to avoid editing markup).
- Add `og-image.jpg` (1200×630) and reference it in each page's `og:image` tag.
- Add Google Analytics / Search Console verification.
- Add a `Content-Security-Policy` header at the host level if required.

---

## Design system

| Token | Value |
|---|---|
| Primary (clinical teal) | `--teal-600 #0D7A6D` → `--teal-900 #04302E` |
| Accent (warm amber) | `--amber-500 #E2951F` |
| Display font | Plus Jakarta Sans |
| Body font | Inter |
| Container | 1280 px |
| Radius | 14 / 22 / 30 px |

Everything is driven by CSS custom properties at the top of `assets/css/styles.css`.

## Accessibility & quality

- Skip link, semantic landmarks, one `<h1>` per page, labelled form controls.
- Visible focus states, `prefers-reduced-motion` support, keyboard-operable tabs and menus.
- ARIA roles on the tab widget and mobile drawer.
- Internal links, anchors and assets verified to resolve; no horizontal overflow at
  390 px, 820 px or 1440 px.

## Legal note

The footer of every page carries a disclaimer covering: no medical advice, prescriptions
and certificates issued only by authorised professionals, vaccine availability confirmed
before booking, controlled medicines handled under Nepalese law and destination-country
rules with no assurance that any medicine may cross a border, and the limits of home care.
Keep it.
