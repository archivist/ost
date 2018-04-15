import { Component, SplitPane } from 'substance'
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
    this._loadPersonsStats()
    this._loadData(true)
  }

  getInitialState() {
    return {
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
    let Spinner = this.getComponent('spinner')

    el.append($$(Header))

    if(this.state.total) {
      let total = $$('div').addClass('se-total').append(this.getLabel('mentioned-person') + ' (' + this.state.totalPersons + ')')
      if(!this.state.letter) {
        total.addClass('sm-active')
      } else {
        total.on('click', this._setLetterFilter.bind(this, undefined))
      }
      el.append(
        $$(SplitPane, {splitType: 'horizontal'}).addClass('se-persons-pane').append(
          $$('div').addClass('se-person-filters').append(
            total,
            this.renderLetterFilter($$)
          ),
          this.renderList($$)
        )
      )
    } else {
      el.append($$(Spinner, {message: 'spinner-loading'}))
    }

    return el
  }

  renderList($$) {
    let Grid = this.getComponent('grid')

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

  renderLetterFilter($$) {
    let stats = this.state.stats
    let el = $$('div').addClass('se-letter-filter')

    if(stats) {
      let sorted = stats.sort(function(a, b){
        if(a.letter < b.letter) return -1
        if(a.letter > b.letter) return 1
        return 0
      })

      sorted.forEach((item, i) => {
        let letterEl = $$('div')
          .addClass('se-letter-item')
          .append(
            item.letter
            //$$('span').addClass('se-letter-counter').append('(' + item.cnt + ')')
          )
          .ref('letter_' + i)
          .on('click', this._setLetterFilter.bind(this, item.letter))

        if(this.state.letter === item.letter) letterEl.addClass('sm-active')

        el.append(letterEl)
      })
    }

    return el
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

  _loadData(init) {
    let resourceClient = this.context.resourceClient
    let letter = this.state.letter
    let pagination = this.state.pagination
    let perPage = this.state.perPage
    let options = {
      order: this.state.order + ' ' + this.state.direction,
      limit: perPage,
      offset: pagination ? this.state.items.length : 0
    }
    let items = []

    resourceClient.getPersonsList(letter, options, (err, persons) => {
      if(err) {
        console.error(err)
        return
      }

      if(pagination) {
        items = concat(this.state.items, persons.records)
      } else {
        items = persons.records
      }

      let state = {
        items: items,
        total: parseInt(persons.total, 10),
      }

      if(init) state.totalPersons = state.total

      this.extendState(state)
    })
  }

  _loadPersonsStats() {
    let resourceClient = this.context.resourceClient
    resourceClient.getPersonsStats((err, stats) => {
      if(err) {
        console.error(err)
        return
      }

      this.extendState({
        stats: stats
      })
    })
  }

  _loadResourceDocuments(resourceId, index) {
    let documentClient = this.context.documentClient

    documentClient.getResourceDocuments(resourceId, (err, docs) => {
      if(err) {
        console.error(err)
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

  _setLetterFilter(letter) {
    if(this.state.letter === letter) letter = undefined
    this.extendState({letter: letter, pagination: false})
    this._loadData()
  }
}

export default PersonIndex
