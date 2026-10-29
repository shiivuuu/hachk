const app = require('../src/app');

async function run() {
  const server = app.listen(5000, async () => {
    console.log('✅ Temporary test server listening on http://localhost:5000');
    try {
      console.log('\n======================================================');
      console.log('1. RUNNING CUSTOM PROFILE TEST');
      console.log('======================================================');
      const uniqueEmail = `creator_${Date.now()}@innovation.org`;
      const regRes = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Shivam Sharma',
          email: uniqueEmail,
          role: 'student',
          institution: 'Indian Institute of Technology',
          department: 'Robotics & Advanced Fabrication',
          phone: '+91 98765 43210',
          bio: 'Building autonomous aerial robotics and custom carbon fiber frames.',
          credits: 1500,
          trust_score: 95
        })
      });
      const regData = await regRes.json();
      if (!regData.success) throw new Error('Registration failed: ' + regData.error);
      console.log('✅ Custom profile registered:', regData.user.name, regData.user.id);

      console.log('\n======================================================');
      console.log('2. RUNNING INCIDENT DAMAGE FLOW TEST');
      console.log('======================================================');
      const bookRes = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': 'usr_creator' },
        body: JSON.stringify({
          resource_id: 'res_markforged_metal',
          start_time: '2026-11-10T14:00:00Z',
          end_time: '2026-11-10T18:00:00Z',
          purpose: 'Exploratory Prototyping',
          project_title: 'Damage Simulator Test Run',
          supervisor_name: 'Shop Tech Josh'
        })
      });
      const bookData = await bookRes.json();
      if (!bookData.success) throw new Error('Booking failed: ' + bookData.error);
      const booking = bookData.booking;

      await fetch(`http://localhost:5000/api/bookings/${booking.id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': 'usr_manager' },
        body: JSON.stringify({ approval_notes: 'Approved' })
      });

      await fetch(`http://localhost:5000/api/bookings/${booking.id}/checkin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': 'usr_creator' },
        body: JSON.stringify({
          initial_condition_status: 'pristine',
          initial_notes: 'Pristine bed, no issues',
          checklist_answers: { clean: true }
        })
      });

      const retRes = await fetch(`http://localhost:5000/api/bookings/${booking.id}/return`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': 'usr_creator' },
        body: JSON.stringify({
          final_condition_status: 'damaged',
          final_notes: 'Extruder nozzle cracked the ceramic heating block and shattered print surface.',
          cleanliness_rating: 1
        })
      });
      const retData = await retRes.json();
      if (retData.bookingStatus !== 'incident_reported' || retData.depositRefundStatus !== 'held_for_review') {
        throw new Error('Damage detection failed: ' + JSON.stringify(retData));
      }
      console.log('✅ AI Damage Discrepancy successfully held deposit and flagged incident!');

      console.log('\n======================================================');
      console.log('3. RUNNING LIFECYCLE E2E TEST (10 STAGES)');
      console.log('======================================================');
      // Step 1: Owner lists resource
      const createRes = await fetch('http://localhost:5000/api/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': 'usr_manager' },
        body: JSON.stringify({
          title: 'Kuka KR CYBERTECH 6-Axis Industrial Robot',
          description: 'Industrial robotic arm for heavy payload composite handling.',
          category: 'testing_rig',
          type: 'Industrial Robot Arm',
          location: 'Robotics Bay 4',
          hourly_rate: 40,
          deposit: 200,
          min_hours: 1,
          max_hours: 4,
          required_certifications: ['5-Axis CNC Mill Certified Operator'],
          specs: { 'Payload': '16 kg', 'Reach': '2013 mm' }
        })
      });
      const createResData = await createRes.json();
      if (!createResData.success) throw new Error('Step 1 Failed: ' + createResData.error);
      const resId = createResData.resourceId;
      console.log('✅ Step 1: Resource listed ID:', resId);

      // Step 2: Check pre-flight eligibility
      const eligRes = await fetch(`http://localhost:5000/api/resources/${resId}/eligibility?userId=usr_researcher`);
      const eligData = await eligRes.json();
      if (!eligData.success || !eligData.isEligible) throw new Error('Step 2 Failed: Expected eligible');
      console.log('✅ Step 2: Pre-flight eligibility verified.');

      // Step 3 & 4: Submit request & Fair Allocation
      const book2Res = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': 'usr_researcher' },
        body: JSON.stringify({
          resource_id: resId,
          start_time: '2026-11-05T10:00:00Z',
          end_time: '2026-11-05T13:00:00Z',
          purpose: 'Academic Thesis / Core Research',
          project_title: 'Bio-Robotic Arm Actuation Evaluation',
          supervisor_name: 'Prof. Henrik Christensen'
        })
      });
      const book2Data = await book2Res.json();
      if (!book2Data.success) throw new Error('Step 3/4 Failed: ' + book2Data.error);
      const bkId = book2Data.booking.id;
      console.log('✅ Steps 3 & 4: Booking submitted, Fair score:', book2Data.booking.fairnessScore);

      // Step 5 & 6: Manager Approval & Pass
      const appRes = await fetch(`http://localhost:5000/api/bookings/${bkId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': 'usr_manager' },
        body: JSON.stringify({ approval_notes: 'Safety cert verified. Pass issued.' })
      });
      const appData = await appRes.json();
      if (!appData.success || appData.status !== 'approved') throw new Error('Step 5/6 Failed: ' + appData.error);
      console.log('✅ Steps 5 & 6: Approved successfully with status:', appData.status);

      // Step 7: Check-In Baseline
      const chkRes = await fetch(`http://localhost:5000/api/bookings/${bkId}/checkin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': 'usr_researcher' },
        body: JSON.stringify({
          initial_condition_status: 'pristine',
          initial_notes: 'Station spotless. E-stop tested.',
          checklist_answers: { eStopTested: true, ppeEquipped: true },
          supervisor_signature: 'Prof. Henrik Christensen'
        })
      });
      const chkData = await chkRes.json();
      if (!chkData.success) throw new Error('Step 7 Failed: ' + chkData.error);
      console.log('✅ Step 7: Check-In baseline verified.');

      // Step 8: Return Handover
      const ret2Res = await fetch(`http://localhost:5000/api/bookings/${bkId}/return`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': 'usr_researcher' },
        body: JSON.stringify({
          final_condition_status: 'pristine',
          final_notes: 'Experiment concluded smoothly. Workcell cleaned.',
          cleanliness_rating: 5,
          consumables_used: { operational_hours: 3 }
        })
      });
      const ret2Data = await ret2Res.json();
      if (!ret2Data.success || ret2Data.bookingStatus !== 'completed') throw new Error('Step 8 Failed: ' + ret2Data.error);
      console.log('✅ Step 8: Clean Return, Deposit status:', ret2Data.depositRefundStatus);

      // Step 10: Audit Log Verification
      const audRes = await fetch(`http://localhost:5000/api/audit?entityId=${bkId}`);
      const audData = await audRes.json();
      if (!audData.success || audData.auditLogs.length < 3) throw new Error('Step 10 Failed: Expected audit trail');
      console.log('✅ Step 10: Immutable Audit Ledger verified with', audData.auditLogs.length, 'chronological events.');

      console.log('\n======================================================');
      console.log('🎉 ALL BACKEND END-TO-END TESTS COMPLETED SUCCESSFULLY!');
      console.log('======================================================\n');
      server.close();
      process.exit(0);
    } catch (err) {
      console.error('❌ Test failed:', err);
      server.close();
      process.exit(1);
    }
  });
}

run();
