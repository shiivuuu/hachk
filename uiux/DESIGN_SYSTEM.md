# 🎨 NexusEquip Design System & UX Specification

## 1. Design Philosophy
Sharing institutional hardware—such as 4-axis CNC mills, confocal fluorescence microscopes, and Class 5 cleanrooms—requires a level of psychological trust and rigorous accountability far beyond ordinary meeting room reservations.

Our visual language, **"Dark Laboratory & Precision Trust"**, communicates:
- **Scientific Rigor & Authority:** Deep navy canvas (`#030712`) with laser cyan and indigo illumination.
- **Safety Transparency:** Pre-flight eligibility badges immediately signal qualified vs. missing training certificates before reservation.
- **Clarity of Accountability:** Step-by-step progress tracking across all 10 stages of the equipment sharing lifecycle.

---

## 2. Color Palette & Hierarchy
| Token | Hex / Value | Semantic Role |
|---|---|---|
| `bg-canvas` | `#030712` | Root dark space background |
| `surface-card` | `#0f172a` (80% opacity) | Glassmorphic card surfaces |
| `accent-primary` | `#6366f1` (Indigo-500) | Primary actions, CTA buttons |
| `accent-cyan` | `#06b6d4` (Cyan-500) | AI capabilities, telemetry, active states |
| `semantic-success` | `#10b981` (Emerald-500) | Verified certificates, clean returns |
| `semantic-warning` | `#f59e0b` (Amber-500) | Step 7 Check-in active, quota warnings |
| `semantic-danger` | `#f43f5e` (Rose-500) | Step 9 Damage flags, missing prerequisites |

---

## 3. The 10-Step Lifecycle Component Paradigm
Every action in NexusEquip maps to an auditable step:
1. **Listing Created:** Owner sets specs, hourly rate, deposit, and required training badges.
2. **Eligibility Checked:** Automated verification of operator certifications.
3. **Request Submitted:** Purpose-weighted access request.
4. **Fair Allocation Scored:** Transparent anti-monopoly scoring algorithm.
5. **Manager Oversight:** Human-in-the-loop review.
6. **Pass Authorized:** Passcode and digital signature generated.
7. **Check-In Studio:** Baseline condition photo upload & safety checklists.
8. **Return Studio:** Handover condition inspection & consumables logging.
9. **Dispute & Damage Resolution:** AI vision discrepancy detection & deposit adjudication.
10. **Immutable Ledger:** Tamper-evident transaction timeline.

---

## 4. Accessibility & Inclusive Design (WCAG 2.1 AA)
- High contrast text (`#f8fafc` text on `#030712` canvas = 18.2:1 contrast ratio, far exceeding AA standards).
- Visual status indicators paired with explicit textual labels (never color alone).
- Full keyboard focus rings (`focus:ring-2 focus:ring-indigo-500`).
