// `attendee` is { age, prerequisiteConfirmed }. Age 18 passes an 18+ event; 17 does not.
export function checkEligibility(attendee, event) {
  const age = Number(attendee.age);

  if (!Number.isFinite(age) || age <= 0) {
    return { valid: false, reason: 'age_required', message: 'Enter your age as a number.' };
  }

  if (event.minAge > 0 && age < event.minAge) {
    return {
      valid: false,
      reason: 'under_age',
      message: `You must be ${event.minAge} or older to attend “${event.title}”.`,
    };
  }

  if (event.prerequisite && !attendee.prerequisiteConfirmed) {
    return {
      valid: false,
      reason: 'prerequisite_required',
      message: `Please confirm you have completed: ${event.prerequisite}.`,
    };
  }

  return { valid: true, reason: null, message: '' };
}

// Stops at the first failed event so the form can show one specific message.
export function checkEligibilityForSelection(attendee, events) {
  for (const event of events) {
    const result = checkEligibility(attendee, event);
    if (!result.valid) return { ...result, event };
  }
  return { valid: true, reason: null, message: '', event: null };
}
