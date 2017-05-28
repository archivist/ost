import { ContainerAnnotation } from 'substance'

/**
  SubjectReference Node.
  Used for highlighting subject references inside documents.
*/

class SubjectReference extends ContainerAnnotation {}

SubjectReference.define({
  type: 'subject',
  reference: {type: ["string"], default: []}
})

SubjectReference.prototype.isBracketReference = true

export default SubjectReference
