const { getAccessToken, fetchJobsAndVisits } = require('./jobber');
const { findContactByEmail, createContact, addTagToContact } = require('./ghl');

async function syncData() {
  try {
    const token = await getAccessToken();
    const jobs = await fetchJobsAndVisits(token);

    // Mapping Jobber statuses to client stages
    const jobStageTagMap = {
      'Requires Action': 'New Request',
      'Upcoming': 'Job Scheduled',
      'Completed': 'Job Completed',
      'On Hold': 'Job On Hold',
      'Cancelled': 'Job Cancelled'
    };

    const visitStageTagMap = {
      'Scheduled': 'Technician Assigned',
      'Completed': 'Job In Progress',
      'Cancelled': 'Visit Cancelled',
      'Missed': 'Visit Missed',
      'Rescheduled': 'Visit Rescheduled'
    };

    for (const job of jobs) {
      const name = job.client?.displayName || 'Unknown';
      const email = job.client?.email;
      if (!email) continue;

      let contact = await findContactByEmail(email);
      if (!contact) {
        contact = await createContact({ name, email });
      }

      // Add mapped job status tag
      const jobTag = jobStageTagMap[job.status];
      if (jobTag) {
        await addTagToContact(contact.id, jobTag);
      }

      // Add mapped visit status tags
      for (const visit of job.visits.nodes) {
        const visitTag = visitStageTagMap[visit.status];
        if (visitTag) {
          await addTagToContact(contact.id, visitTag);
        }
      }
    }

    console.log('✅ Sync completed');
  } catch (err) {
    console.error('❌ Sync failed:', err.response?.data || err.message);
  }
}

syncData();
