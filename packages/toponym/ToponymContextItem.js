import { Component } from 'substance'

class ToponymContextItem extends Component {

  render($$) {
    let isEditor = this.context.readerContext === undefined
    if(isEditor) {
      return this.renderEditorItem($$)
    } else {
      return this.renderReaderItem($$)
    }
  }

  renderEditorItem($$) {
    let node = this.props.data

    let el = $$('div')
      .attr("data-id", this.props.entityId)
      .addClass('sc-entity-entry se-toponym')
      .on('click', this.handleEditorClick)

    if(this.props.focus) {
      el.addClass('se-focused')
    }
    
    el.append(
      $$('div').addClass('se-type').append(this.getLabel('toponym')),
      $$('div').addClass('se-title').append(node.name),
      $$('div').addClass('se-description').setInnerHTML(node.description),
      $$('div').addClass('se-edit-entity').append(this.context.iconProvider.renderIcon($$, 'editEntity'))
        .on('click', this.editEntity)
    )

    return el
  }

  renderReaderItem($$) {
    let urlHelper = this.context.urlHelper
    let node = this.props.data

    let el = $$('div')
      .attr("data-id", this.props.entityId)
      .addClass('sc-entity-entry se-toponym')
      .on('click', this.handleClick)

    let location = node.country
    if(node.name !== node.currentName && node.currentName) {
      location += ", " + node.currentName
    }

    let resourceLink = $$('a')
      .addClass('se-resource-external-link se-resource-link')
      .attr({
        href: urlHelper.openResource(this.props.entityId),
        target: '_blank',
        title: this.getLabel('resource-link')
      })
      .append(this.context.iconProvider.renderIcon($$, 'resources'))

    let mapLink = $$('a')
      .addClass('se-resource-external-link se-map-link')
      .attr({
        href: urlHelper.openMap(this.props.entityId),
        target: '_blank',
        title: this.getLabel('map-link')
      })
      .append(this.context.iconProvider.renderIcon($$, 'map-link'))

    el.append(
      $$('div').addClass('se-title').append(node.name),
      $$('div').addClass('se-location').append(location),
      resourceLink,
      mapLink,
      $$('div').addClass('se-description').setInnerHTML(node.description)
    )

    return el
  }

  editEntity() {
    this.send('editEntity', this.props.entityId)
  }

  handleEditorClick() {
    this.send('focusEntity', this.props.entityId)
    this.send('showReferences', this.props.entityId)
  }

  handleClick() {
    this.send('switchActive', this.props.entityType, this.props.entityId)
    this.send('showReferences', this.props.entityId)
  }

}

export default ToponymContextItem