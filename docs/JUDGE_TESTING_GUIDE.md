# 🧪 Nexora: Judge Testing & Evaluation Guide

Welcome, Judges! This guide walks you through verifying the complete **10-step equipment sharing lifecycle** in under 3 minutes.

---

## ⚡ Quick-Switch Personas (1-Click Evaluation)
Use the **Persona Switcher** in the top-right corner of the application to switch roles instantly without logging out, or click **`+ Create Profile`** to register your own custom persona:

| Persona | Role | Key Attribute | Test Scenario |
|---|---|---|---|
| 🎓 **Dr. Sarah Chen** | Lab Manager & Safety Officer | Full Approval & Dispute Authority | Authorize requests (Step 6), Adjudicate damage reports (Step 9) |
| 🔬 **Alex Rivera** | PhD Researcher (Stanford) | Fully Certified (5-Axis CNC, Laser L2) | Eligible for all advanced equipment; Request Haas CNC Mill |
| 💡 **Maya Lin** | Undergraduate Student (CMU) | Basic Safety Certified | Missing 5-Axis CNC cert (Step 2 Ineligibility demonstration) |
| 🛠️ **Marcus Vance** | Community Hardware Maker | MakerSpace Certified | Test Step 9 Damage incident scenario |
| 🛡️ **Dean Arthur Vance** | Consortium Safety Auditor | Compliance & Ledger Oversight | Inspect complete immutable audit trail (Step 10) |

---

## 🚀 3-Minute Walkthrough of the Complete 10-Step Lifecycle

### Step 1: Owner Lists a Resource & Defines Conditions
1. Switch to persona **Dr. Sarah Chen (Lab Manager)**.
2. Click **"+ List Resource"** in the top navigation bar.
3. Fill in:
   - Resource Name: `Stratasys F370 Industrial 3D Printer`
   - Category: `Fabrication & CNC`
   - Required Certification: `3D Additive Sintering Operator`
   - Hourly Rate: `$25`, Deposit: `$100`
4. Click **"Publish Listing (Step 1)"**. The resource is instantly published to the catalog and logged to the audit ledger.

---

### Step 2: User Discovers Resource & Checks Eligibility
1. Switch to persona **Maya Lin (Student)**.
2. On the Catalog page, click **"Request Access"** on the **Haas VF-2 4-Axis CNC Milling Center**.
3. **Observe Step 2 Pre-flight Check:** A red banner appears alerting that Maya Lin lacks the mandatory *"5-Axis CNC Mill Certified Operator"* badge.
4. Now switch to persona **Alex Rivera (Researcher)** and click **"Request Access"** on the same machine.
5. **Observe:** The banner turns green! *"Pre-Flight Eligibility Verified: Alex Rivera holds all required certifications."*

---

### Step 3 & 4: Submit Booking Request & Fair Allocation Scoring
1. While still on the Haas VF-2 modal as **Alex Rivera**:
   - Purpose: Select `Academic Thesis / Core Research (+40 pts)`
   - Project Title: `Soft-Robotic Gripper Machining`
   - Duration: `3 hours`
2. **Observe Step 4 Fair Allocation Preview:** The system dynamically computes the Priority Score (~`80+ pts`), incorporating thesis weight and rolling 7-day usage limits.
3. Click **"Submit Request (Step 3)"**. Confetti celebrates the submission, and the request moves to the Manager Review queue.

---

### Step 5 & 6: Lab Manager Reviews & Authorizes Access Pass
1. Switch to persona **Dr. Sarah Chen (Lab Manager)**.
2. Click the **"Lab Control"** tab in the navigation bar.
3. In the **Requests Queue**, locate Alex Rivera's pending request.
4. Review the applicant's 94% trust score and fairness score breakdown.
5. Click **"Authorize Access Pass (Step 6)"**. An immutable audit record is logged and access pass `NX-PASS-XXXX` is issued.

---

### Step 7: Station Check-In & Initial Condition Baseline
1. Switch back to persona **Alex Rivera (Researcher)**.
2. Click the **"My Lifecycle (1-10)"** tab in the navbar.
3. On the newly approved booking, click the amber button: **"Check In (Step 7)"**.
4. Review the station checklist (Emergency stop tested, PPE donned).
5. Document any baseline wear notes (e.g., *"Tooling clean, bed tram checked"*).
6. Click **"Complete Check-In (Step 7)"**. Station access pass is activated and baseline condition is recorded.

---

### Step 8 & 9: Return, AI Condition Diff & Dispute Handling
1. On the same booking card (now in active use), click the teal button: **"Return & Inspection (Step 8)"**.
2. **Clean Return Path:**
   - Condition: `Good`
   - Cleanliness: `5 Stars`
   - Click **"Submit Return & Audit (Step 8)"**.
   - **Observe:** AI Vision Diff compares Step 7 baseline vs Step 8 handover, clears deposit refund, and automatically closes booking.
3. **Damage / Discrepancy Path (Step 9):**
   - Click the **"Lab Control"** tab -> **"Incidents"** subtab.
   - Review pre-seeded incident `inc_1` on the Markforged Metal 3D Printer where an extruder nozzle collision was detected.
   - Click **"Adjudicate Incident (Step 9)"** -> choose *"Partial Repair Deduction"* -> click **"Sign Off & Close Incident"**.

---

### Step 10: Immutable Consortium Audit Ledger
1. Click the **"Audit Trail"** tab in the navbar.
2. View the chronological ledger recording every state transition, actor role, timestamp, and payload.
3. Click **"Inspect Payload"** on any record to view the JSON diff proof.
4. Click **"Export Compliance JSON"** to download the auditable transcript.

---

### Bonus: AI Studio & Natural Language Matcher
1. Go to the **Catalog** tab.
2. In the AI prompt bar, type:
   `"I need a 4-axis machine to cut titanium aerospace parts on Friday"`
3. Click **"AI Match"**. Observe the natural language matcher rank the Haas CNC Mill at 100% synergy, parse technical keywords, and verify certification prerequisites.
4. Go to the **"AI & Fairness"** tab to inspect the real-time **Condition Vision Diff Sandbox** and the **Anti-Monopoly Utilization Dashboard**.

---

*Thank you for evaluating Nexora! All features are fully functional end-to-end.*
