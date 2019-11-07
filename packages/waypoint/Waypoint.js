import { DocumentNode } from 'substance'

/*
  Waypoint meta node.
  Holds waypoint reference data.

  Attributes
    - entityId ID of referenced entity
    - density Density of waypoint

*/
class Waypoint extends DocumentNode {}

Waypoint.type = 'waypoint'

Waypoint.define({
  entityId: { type: 'string', default: ''},
  density: { type: 'string', default: '0'}
})

export default Waypoint
