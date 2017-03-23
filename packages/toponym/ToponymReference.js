import { Fragmenter, PropertyAnnotation } from 'substance'

class ToponymReference extends PropertyAnnotation {
  /**
    If this annotation is a Resource Reference.
    Resource References are annotations with a reference property.
    @returns {Boolean}
  */
  isResourceReference() {
    return true
  }
}

ToponymReference.define({
  type: "toponym",
  reference: { type: 'string', optional: true }
})

// a hint that makes in case of overlapping annotations that this
// annotation gets fragmented more often
ToponymReference.fragmentation = Fragmenter.SHOULD_NOT_SPLIT

export default ToponymReference