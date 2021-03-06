import { DocumentNode } from 'substance'

/**
  Interview metadata container, holds interview metadata
*/

class MetaNode extends DocumentNode {}

MetaNode.define({
  type: 'meta',
  title: { type: 'string', default: 'Untitled Interview'},
  short_summary: { type: 'string', default: '' },
  short_summary_translation: { type: 'string', default: '' },
  abstract: { type: 'string', default: '' },
  abstract_translation: { type: 'string', default: '' },
  abstract_translation_second: { type: 'string', default: '' },
  published_on: { type: 'string', default: '' },
  // states: transcripted, verified, finished, published
  state: { type: 'string', default: '' },

  // Project data
  project: { type: 'string', default: '' },
  project_name: { type: 'string', default: '' },
  project_location: { type: 'string', default: '' },
  conductor: { type: 'string', default: '' },
  operator: { type: 'string', default: '' },
  sound_operator: { type: 'string', default: '' },
  record_type: { type: 'string', default: '' },
  media_id: { type: 'string', default: '' },
  interview_location: { type: 'string', default: '' },
  interview_date: { type: 'string', default: '' },
  persons_present: { type: 'string', default: '' },
  interview_duration: { type: 'number', default: 0 },

  // Interviewee data
  interviewee_bio: { type: 'string', default: '' },
  interviewee_bio_translation: { type: 'string', default: '' },
  interviewee_bio_translation_second: { type: 'string', default: '' },
  interviewee_category: { type: 'string', default: '' },
  interviewee_photo: { type: 'string', default: '' },
  interviewee_detention_place_type: { type: 'array', default: [] },
  interviewee_forced_labor_type: { type: 'array', default: [] },
  interviewee_state: { type: 'string', default: '' },
  interviewee_military_service: { type: 'boolean', default: false },
  interviewee_sex: { type: 'string', default: '' },
  interviewee_place_of_birth: { type: 'string', default: '' },
  interviewee_year_of_birth: { type: 'string', default: '' },
  interviewee_enslaving_year: { type: 'string', default: '' },
  interviewee_homecoming_year: { type: 'string', default: '' }

  // TODO: waypoints
  //interviewee_waypoints: { type: ['waypoint'], default: [] }
})

export default MetaNode