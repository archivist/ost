import { DocumentNode } from 'substance'

/*
  Entities Prison node.
  Holds Prison entity.

  Attributes
    - name Prison name
    - nearestLocality Nearest location to prisom
    - prisonType Type of prison
    - synonyms List of prison synonyms
    - country Country of prison
    - point Geographical point coordinates (Long, Lat)
    - description Prison description
*/
class Prison extends DocumentNode {
  
  // Get entity name
  getName() {
    return this.name
  }

  // Get entity description
  getDescription() {
    return this.description
  }

  // Get entity synonyms
  getSynonyms() {
    let synonyms = this.synonyms

    let name = this.getName()
    if(synonyms.indexOf(name) < 0) {
      synonyms.push(name)
    }

    let locality = this.nearestLocality
    if(synonyms.indexOf(locality) < 0) {
      synonyms.push(locality)
    }

    return synonyms
  }

}

Prison.type = 'prison'

Prison.define({
  point: { type: ['number'], default: [], field: { type: "map", dataType: "point", placeholder: "Place prison location on map" }},
  name: { type: 'string', default: 'Untitled prison', field: { type: "geocoded", dataType: "text", placeholder: "Enter prison's name" }},
  nearestLocality: { type: 'string', default: '', field: { type: "geocoded", dataType: "text", placeholder: "Enter nearest locality name" }},
  prisonType: {type: ['string'], default: [], field: { type: "multiple", options: ['рабочий лагерь', 'пересыльный лагерь', 'штрафлагерь', 'проверочно-фильтрационный лагерь НКВД', 'тюрьма', 'лагерь военнопленных', 'концлагерь', 'ГУЛаг', 'ферма', 'учебный лагерь', 'лагерь для перемещенных лиц', 'распределительный лагерь', 'лагерь внешней команды концлагеря', 'частный дом', 'неизвестно'], placeholder: "Select type of prison" }},
  synonyms: {type: ['string'], default: [], field: { type: "tags", placeholder: "Enter synonyms of prison" }},
  country: { type: 'string', default: '', field: { type: "text", dataType: "text", placeholder: "Enter tprison's country" }},
  description: { type: 'string', default: '', field: { type: "prose", placeholder: "Enter prison's description" }}
})

export default Prison
