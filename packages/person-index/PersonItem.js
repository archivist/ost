import { Component, Grid } from 'substance'

class PersonItem extends Component {

  render($$) {
    let item = this.props.item
    let index = this.props.index

    let el = $$('div').addClass('sc-person-item se-row').append(
      $$('div').addClass('se-name').append(item.name),
      $$('div').addClass('se-description').setInnerHTML(item.description),
      $$('div').addClass('se-stats').append(
        this.getLabel('map-documents') + ': ' + item.count + ', ' + this.getLabel('map-mentions') + ': ' + item.fragments
      )
    ).on('click', this._loadReferences.bind(this, item.entityId, index))

    if(this.props.active && item.docs) {
      let DocumentItem = this.getComponent('document-item')
      el.addClass('sm-expanded')
      let refsEl = $$('div').addClass('se-documents sc-grid')
      item.docs.forEach(doc => {
        refsEl.append(
          $$(DocumentItem, {item: doc, resource: item.entityId}).ref(doc.documentId)
        )
      })
      el.append(refsEl)
    }
    
    return el;
  }

  _loadReferences(resourceId, index) {
    this.send('loadDocuments', resourceId, index)
  }
}

export default PersonItem
