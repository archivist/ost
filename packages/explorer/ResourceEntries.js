import { Component } from 'substance'
import { forEach } from 'lodash-es'

class ResourceEntries extends Component {
  render($$) {
    let el = $$('div').addClass('sc-resource-entries se-panel')
    let entries = this.props.entries

    if(entries) {
      el.append($$('div').addClass('se-title').append(this.getLabel('resource-suggestions')))
      forEach(entries, entry => {
        el.append($$('span').addClass('se-entry').append(entry.name))
      })
    }

    return el
  }
}

export default ResourceEntries