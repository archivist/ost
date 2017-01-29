import { Component, Grid, Layout } from 'substance'
import { concat } from 'lodash-es'

class PersonIndex extends Component {
  constructor(...args) {
    super(...args)

    this.handleActions({
      'loadMore': this._loadMore,
      'loadDocuments': this._loadResourceDocuments
    })
  }

  didMount() {
    this._loadData()
  }

  getInitialState() {
    return {
      filters: {'"entityType"': 'person', "data->>'global'": "false"},
      perPage: 30,
      order: "name",
      direction: 'asc',
      pagination: false,
      items: []
    }
  }

  render($$) {
    let el = $$('div').addClass('sc-persons-index')
    let Header = this.getComponent('header')

    el.append($$(Header))

    let layout = $$(Layout, {
      width: 'large',
      textAlign: 'left'
    }).addClass('se-persons-layout')

    if(this.state.total) {
      layout.append(
        $$('div').addClass('se-total').append(this.getLabel('mentioned-person') + ': ' + this.state.total),
        this.renderList($$)
      )
    } else {
      layout.append(
        $$('div').addClass('se-loader').append(
          $$('div').addClass('se-spinner').append(
            $$('div').addClass('se-rect1'),
            $$('div').addClass('se-rect2'),
            $$('div').addClass('se-rect3'),
            $$('div').addClass('se-rect4'),
            $$('div').addClass('se-rect5')
          ),
          $$('h2').html(
            'Loading...'
          )
        )
      )
    }

    el.append(layout)

    return el
  }

  renderList($$) {
    let items = this.state.items
    let total = this.state.total
    let PersonItem = this.getComponent('person-item')
    let Pager = this.getComponent('pager')
    let grid = $$(Grid)

    if(items) {
      items.forEach((item, index) => {
        let active = this.state.details === index
        grid.append(
          $$(PersonItem, {item: item, index: index, active: active}).ref(item.entityId)
        )
      })
    }

    if(total > this.state.perPage) {
      grid.append(
        $$(Pager, {
          total: total,
          loaded: items.length
        })
      )
    }

    return grid
  }

  /*
    Load more data
  */
  _loadMore() {
    this.extendState({
      pagination: true
    })
    this._loadData()
  }

  _loadData() {
    let resourceClient = this.context.resourceClient
    let pagination = this.state.pagination
    let perPage = this.state.perPage
    let options = {
      order: this.state.order + ' ' + this.state.direction,
      limit: perPage, 
      offset: pagination ? this.state.items.length : 0
    }
    let items = []

    resourceClient.getPersonsList(options, (err, persons) => {
      if(err) {
        console.log(err)
        return
      }

      if(pagination) {
        items = concat(this.state.items, persons.records)
      } else {
        items = persons.records
      }

      this.extendState({
        items: items,
        total: parseInt(persons.total, 10)
      })
    })
  }

  _loadResourceDocuments(resourceId, index) {
    let documentClient = this.context.documentClient

    documentClient.getResourceDocuments(resourceId, (err, docs) => {
      if(err) {
        console.err(err)
        return
      }

      let items = this.state.items
      items[index].docs = docs

      this.extendState({
        items: items,
        details: index
      })
    })
  }
}

export default PersonIndex