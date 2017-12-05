import { DocumentNode } from 'substance'

/**
  Interview metadata container, holds interview metadata
*/

class MetaNode extends DocumentNode {}

MetaNode.define({
  type: 'meta',
  short_summary: { type: 'string', default: '', field: { editor: "multitext", description: "Enter short summary", collapse: 'Russian', group: 'Short summary'}},
  short_summary_translation: { type: 'string', default: '', field: { editor: "multitext", description: "Enter short summary in English", collapse: 'English', group: 'Short summary'}},
  abstract: { type: 'string', default: '', field: { editor: "multitext", description: "Enter abstract", collapse: 'Russian', group: 'Abstract'}},
  abstract_translation: { type: 'string', default: '', field: { editor: "multitext", description: "Enter short summary in English", collapse: 'English', group: 'Abstract'}},
  abstract_translation_second: { type: 'string', default: '', field: { editor: "multitext", description: "Enter short summary in German", collapse: 'German', group: 'Abstract'}},

  // Interviewee data
  title: { type: 'string', default: 'Untitled Interview', field: { editor: "text", description: "Person name", group: 'Person details'}},
  interviewee_bio: { type: 'string', default: '', field: { editor: "multitext", description: "Enter person biography", collapse: 'Russian bio', group: 'Person details'}},
  interviewee_bio_translation: { type: 'string', default: '', field: { editor: "multitext", description: "Enter person biography in English", collapse: 'English bio', group: 'Person details'}},
  interviewee_bio_translation_second: { type: 'string', default: '', field: { editor: "multitext", description: "Enter person biography in German", collapse: 'German bio', group: 'Person details'}},
  interviewee_category: { type: 'string', default: ''},
  interviewee_detention_place_type: { type: 'array', default: [], field: { editor: "checkbox", description: "Detention place type", options: ['рабочий лагерь', 'штрафной лагерь', 'концентрационный лагерь, лагерь смерти', 'тюрьма', 'частное хозяйство (ферма)', 'частный дом (город)'], group: 'Person details'}},
  interviewee_forced_labor_type: { type: 'array', default: [], field: { editor: "checkbox", description: "Forced labor type", options: [{id: 'Промышленность и строительство', label: 'Промышленность и строительство'}, {id: 'Производство и хранение оружия', label: '→→ Производство и хранение оружия'}, {id: 'Добыча ископаемых', label: '→→ Добыча ископаемых'}, {id: 'Железная дорога, транспорт', label: '→→ Железная дорога, транспорт'}, {id: 'Металлургия', label: '→→ Металлургия'}, {id: 'Строительство', label: '→→ Строительство'}, {id: 'Землеустроительные работы', label: '→→ Землеустроительные работы'}, {id: 'Судоверфи', label: '→→ Судоверфи'}, {id: 'Авиационная промышленность', label: '→→ Авиационная промышленность'}, {id: 'Станкостроение и приборостроение', label: '→→ Станкостроение и приборостроение'}, {id: 'Текстильная промышленность', label: '→→ Текстильная промышленность'}, {id: 'Пищевая промышленность', label: '→→ Пищевая промышленность'}, {id: 'Лесная промышленность', label: '→→ Лесная промышленность'}, {id: 'Химический завод', label: '→→ Химический завод'}, {id: 'Сельское хозяйство', label: 'Сельское хозяйство'}, {id: 'Частный сектор и сфера услуг', label: 'Частный сектор и сфера услуг'}], group: 'Person details'}},
  interviewee_state: { type: 'string', default: '', field: { editor: "select", description: "Person state", options: ['военнопленный', 'ост'], group: 'Person details'}},
  interviewee_military_service: { type: 'boolean', default: false, field: { editor: "logical", description: "Check if person was in Soviet army", label: "Military service", group: 'Person details'}},
  interviewee_sex: { type: 'string', default: '', field: { editor: "select", description: "Person gender", options: ['мужчина', 'женщина'], group: 'Person details'}},
  interviewee_place_of_birth: { type: 'string', default: '', field: { editor: "text", description: "Person place of birth", group: 'Person details'}},
  interviewee_year_of_birth: { type: 'string', default: '', field: { editor: "input", dataType: "text", description: "Person year of birth", group: 'Person details'}},
  interviewee_enslaving_year: { type: 'string', default: '', field: { editor: "input", dataType: "text", description: "Person enslaving year", group: 'Person details'}},
  interviewee_homecoming_year: { type: 'string', default: '', field: { editor: "input", dataType: "text", description: "Person homecoming year", group: 'Person details'}},
  interviewee_photo: { type: 'string', default: '', field: { editor: "text", description: "Path to photo file", group: 'Person details'}},
  // TODO: waypoint editor
  interviewee_waypoints: { type: ['waypoint'], default: [] },

  // Project data
  project: { type: 'string', default: '', field: { editor: "select", description: "Project", options: ['Международный проект документации рабского и принудительного труда', 'Выжившие в Маутхаузене', 'Коллекция №1'], group: 'Project details'}},
  project_name: { type: 'string', default: '', field: { editor: "text", description: "Enter project name", group: 'Project details'}},
  // TODO: location entity reference
  project_location: { type: 'string', default: ''},
  interview_location: { type: 'string', default: '', field: { editor: "text", description: "Interview location", group: 'Project details'}},
  interview_date: { type: 'string', default: '', field: { editor: "input", dataType: "date", description: "Interview date (yyyy-MM-dd)", group: 'Project details'}},
  persons_present: { type: 'string', default: '', field: { editor: "text", description: "Persons present", group: 'Project details'}},
  conductor: { type: 'string', default: '', field: { editor: "text", description: "Inerviewer", group: 'Project details'}},
  operator: { type: 'string', default: '', field: { editor: "text", description: "Operator", group: 'Project details'}},
  sound_operator: { type: 'string', default: '', field: { editor: "text", description: "Sound operator", group: 'Project details'}},
  record_type: { type: 'string', default: '', field: { editor: "select", description: "Interview type", options: ['audio', 'video'], group: 'Project details'}},
  interview_duration: { type: 'number', default: 0, field: { editor: "input", dataType: "number", description: "Duration (in minutes)", group: 'Project details'}},
  media_id: { type: 'string', default: '', field: { editor: "text", description: "Media identifier", group: 'Project details'}},

  // Document data
  published_on: { type: 'string', default: '', field: { editor: "input", dataType: "date", description: "Published date (yyyy-MM-dd)", group: 'Document details'}},
  // states: transcripted, verified, finished, published
  state: { type: 'string', default: '', field: { editor: "select", description: "Document state", options: ['transcripted', 'verified', 'finished', 'published'], group: 'Document details'}}
})

export default MetaNode
