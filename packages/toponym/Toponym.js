import { DocumentNode } from 'substance'

/*
  Entities Toponym node.
  Holds Toponym entity.

  Attributes
    - name Toponym name
    - currentName Current name of toponym
    - synonyms List of toponym synonyms
    - country Country of toponym
    - point Geographical point coordinates (Long, Lat)
    - description Toponym description
*/
class Toponym extends DocumentNode {
  
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

    let locality = this.currentName
    if(synonyms.indexOf(locality) < 0) {
      synonyms.push(locality)
    }

    return synonyms
  }

}

Toponym.type = 'toponym'

Toponym.define({
  point: { type: ['number'], default: [], field: { type: "map", dataType: "point", placeholder: "Place toponym location on map" }},
  name: { type: 'string', default: 'Unknown toponym', field: { type: "geocoded", dataType: "text", placeholder: "Enter toponym's name" }},
  currentName: { type: 'string', default: '', field: { type: "geocoded", dataType: "text", placeholder: "Enter current name of toponym" }},
  synonyms: {type: ['string'], default: [], field: { type: "tags", placeholder: "Enter synonyms of toponym" }},
  country: { type: 'string', default: '', field: { type: "text", dataType: "text", placeholder: "Enter toponym's country" }},
  description: { type: 'string', default: '', field: { type: "prose", placeholder: "Enter toponym's description" }}
})

export default Toponym
