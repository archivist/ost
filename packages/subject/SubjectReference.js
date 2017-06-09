import { ContainerAnnotation } from 'substance'

/**
  SubjectReference Node.
  Used for highlighting subject references inside documents.
*/

class SubjectReference extends ContainerAnnotation {
  /**
    If this annotation is a Bracket Reference.
    Bracket References will be rendered as bracket right to the content.
    @returns {Boolean}
  */
  isBracketReference() {
    return true
  }

  /**
    If this annotation is a Resource Multiple Reference.
    Resource Multiple References are annotations with an array reference property.
    @returns {Boolean}
  */
  isResourceMultipleReference() {
    return true
  }

  /**
    If this annotation is a Resource Reference.
    Resource References are annotations with a reference property.
    @returns {Boolean}
  */
  isResourceReference() {
    return false
  }
}

SubjectReference.define({
  type: 'subject',
  reference: {type: ["string"], default: []}
})

export default SubjectReference
