import { Component, Grid } from 'substance'

class ResourceReference extends Component {
  
  didMount() {
    this._loadResourceData()
    this._loadResourceDocuments()
  }

  render($$) {
    let el = $$('div').addClass('sc-resources')
    el.append(
      this.renderResource($$),
      this.renderDocumentList($$)
    )

    return el
  }

  renderResource($$) {
    let el = $$('div').addClass('se-resource')
    let resource = this.state.resource

    if(resource) {
      let title = resource.name

      if(resource.entityType === 'toponym') {
        title = resource.name.toLowerCase() === 'неизвестно' ? this.getLabel('unknown-name') : resource.name
        let location = resource.data.country
        if(resource.name !== resource.data.currentName && resource.data.currentName) {
          location += ", " + resource.data.currentName
        }
        el.append(
          $$('a').addClass('se-location')
            .attr({
              target: '_blank',
              href: '/maps/' + this.props.resource
            })
            .append(
              location,
              this.context.iconProvider.renderIcon($$, 'location')
            )
        )
      } else if (resource.entityType === 'prison') {
        let location = resource.data.country
        if(resource.data.nearestLocality) {
          location += ", " + resource.data.nearestLocality
        }

        let prisonType = resource.data.prisonType ? resource.data.prisonType.join(', ') : ''

        el.append(
          $$('div').addClass('se-prison-type').append(prisonType),
          $$('a').addClass('se-location')
            .attr({
              target: '_blank',
              href: '/maps/' + this.props.resource
            })
            .append(
              location,
              this.context.iconProvider.renderIcon($$, 'location')
            )
        )
      }

      el.append(
        $$('div').addClass('se-title').setInnerHTML(title),
        $$('div').addClass('se-description').setInnerHTML(resource.description)
      )
    }

    return el
  }

  renderDocumentList($$) {
    let items = this.state.documents
    let DocumentItem = this.getComponent('document-item')
    let grid = $$(Grid)

    if(items) {
      items.forEach((item, index) => {
        let active = this.state.details === index
        grid.append(
          $$(DocumentItem, {item: item, index: index, active: active, resource: this.props.resource})
            .ref(item.documentId)
        )
      })
      this.send('setTotal', items.length)
    }

    return grid
  }

  _loadResourceData() {
    let resourceId = this.props.resource
    let resourceClient = this.context.resourceClient

    resourceClient.getEntity(resourceId, (err, resource) => {
      if(err) {
        console.log(err)
        return
      }
      this.extendState({
        resource: resource
      })
    })
  }

  _loadResourceDocuments() {
    let resourceId = this.props.resource
    let documentClient = this.context.documentClient

    documentClient.getResourceDocuments(resourceId, (err, docs) => {
      if(err) {
        console.err(err)
        return
      }

      this.extendState({
        documents: docs
      })
    })
  }
}

export default ResourceReference