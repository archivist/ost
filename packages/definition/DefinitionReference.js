import { Fragmenter, PropertyAnnotation} from 'substance'

class DefinitionReference extends PropertyAnnotation {
  /**
    If this annotation is a Resource Reference.
    Resource References are annotations with a reference property.
    @returns {Boolean}
  */
  isResourceReference() {
    return true
  }

  /**
    If this annotation is a Resource Multiple Reference.
    Resource Multiple References are annotations with an array reference property.
    @returns {Boolean}
  */
  isResourceMultipleReference() {
    return false
  }
}

DefinitionReference.define({
  type: "definition",
  reference: { type: 'string', optional: true }
})

// a hint that makes in case of overlapping annotations that this
// annotation gets fragmented more often
DefinitionReference.fragmentation = Fragmenter.SHOULD_NOT_SPLIT

export default DefinitionReference