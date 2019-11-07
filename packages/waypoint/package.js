import Waypoint from './Waypoint'

export default {
  name: 'waypoint',
  configure: function(config) {
    config.addNode(Waypoint)
  }
}
