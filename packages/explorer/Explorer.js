import { Component, Grid, Layout, SplitPane } from 'substance'
import { clone, concat, each, extend, findIndex, isEmpty, isEqual } from 'lodash-es'

// Sample data for debugging
// import DataSample from '../../data/docs'

class Explorer extends Component {
  constructor(...args) {
    super(...args)

    this.handleActions({
      'loadFragments': this._loadFragments,
      'loadMore': this._loadMore,
      'search': this._searchData
    })
  }

  didMount() {
    this._loadData()
    this._loadTopics()
  }

  // didUpdate(oldProps, oldState) {
  //   // if(oldState.search !== this.state.search) {
  //   //   this.searchData()
  //   // }
  // }

  willUpdateState(state) {
    let oldFilters = this.state.filters
    let newFilters = state.filters

    if(!isEqual(oldFilters, newFilters) || !isEqual(this.state.search, state.search)) {
      this.searchData(state)
      this._loadTopics(newFilters, state.search)
    }
  }

  getInitialState() {
    return {
      filters: {"meta->>'state'": "published", topics: []},
      search: '',
      perPage: 30,
      order: "meta->>'published_on'",
      direction: 'desc',
      pagination: false,
      items: []
    }
  }

  render($$) {
    let documentItems = this.state.items
    let el = $$('div').addClass('sc-explorer')

    if (!documentItems) {
      return el
    }

    let Header = this.getComponent('header')
    let SearchBar = this.getComponent('searchbar')

    el.append($$(Header))

    let layout = $$(Layout, {
      width: 'full',
      textAlign: 'left'
    }).addClass('se-explorer-layout')

    layout.append(
      $$(SplitPane, {splitType: 'horizontal'}).append(
        $$(SearchBar, {value: this.state.search}),
        $$(SplitPane, {splitType: 'vertical', sizeB: '30%'}).addClass('se-results-pane').append(
          this.renderMainSection($$),
          this.renderSidebarSection($$)
        )
      )
    )

    el.append(layout)

    return el
  }

  renderMainSection($$) {
    let documentItems = this.state.items
    if (documentItems.length > 0) {
      return this.renderFull($$)
    } else {
      return this.renderEmpty($$)
    }
  }

  renderSidebarSection($$) {
    let el = $$('div').addClass('se-sidebar')
    let Facets = this.getComponent('facets')
    
    if(this.state.topics) {
      el.append($$(Facets, {topics: this.state.topics}))
    }

    return el
  }

  renderEmpty($$) {
    let layout = $$(Layout, {
      width: 'medium',
      textAlign: 'center'
    })

    if(this.state.total === 0) {
      layout.append(
        $$('h1').append(this.getLabel('no-results')),
        $$('p').append(this.getLabel('no-results-info'))
      )
    } else {
      layout.append(
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
      );
    }

    return layout;
  }

  renderFull($$) {
    let items = this.state.items
    let total = this.state.total
    let DocumentItem = this.getComponent('document-item')
    let Pager = this.getComponent('pager')
    let grid = $$(Grid)

    if (items) {
      items.forEach((item, index) => {
        let active = this.state.details === index
        grid.append(
          $$(DocumentItem, {item: item, index: index, active: active}).ref(item.documentId)
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
    Search documents
  */
  searchData(newState) {
    let filters = newState.filters || this.state.filters
    let searchValue = newState.search || this.state.search

    if(isEmpty(searchValue)) {
      return this._loadData(filters)
    }

    let language = 'russian'
    let perPage = this.state.perPage
    let pagination = this.state.pagination
    let options = {
      limit: perPage, 
      offset: pagination ? this.state.items.length : 0
    }
    let items = []
    let documentClient = this.context.documentClient

    documentClient.searchDocuments(searchValue, language, filters, options, function(err, docs) {
      if (err) {
        console.error('Search results could not be loaded', err)
        return
      }

      let details = findIndex(docs.records, function(record) {
        return record.fragments
      })

      if(pagination) {
        items = concat(this.state.items, docs.records)
      } else {
        items = docs.records
      }

      this.extendState({
        items: items,
        total: parseInt(docs.total, 10),
        details: details
      })
    }.bind(this))
  }

  /*
    Load more data
  */
  _loadMore() {
    this.extendState({
      pagination: true
    })
    this.searchData()
  }

  /*
    Loads documents
  */
  _loadData(updatedFilters) {
    let filters = updatedFilters || this.state.filters
    let pagination = this.state.pagination
    let perPage = this.state.perPage
    let options = {
      order: this.state.order + ' ' + this.state.direction,
      limit: perPage, 
      offset: pagination ? this.state.items.length : 0
    }
    let items = []

    let documentClient = this.context.documentClient

    documentClient.listDocuments(filters, options, function(err, docs) {
      if (err) {
        console.error('Documents could not be loaded', err)
        return
      }

      if(pagination) {
        items = concat(this.state.items, docs.records)
      } else {
        items = docs.records
      }

      this.extendState({
        items: items,
        total: parseInt(docs.total, 10)
      })
    }.bind(this))
  }

  /*
    Loads fts found fragments
  */
  _loadFragments(documentId, index) {
    let searchValue = this.state.search

    if(isEmpty(searchValue)) {
      return
    }

    let language = 'russian'
    let filters = {}
    let options = {}
    let documentClient = this.context.documentClient
    let items = this.state.items

    if(!items[index].fragments) {
      documentClient.searchFragments(documentId, searchValue, language, filters, options, function(err, fragments) {
        if (err) {
          console.error('Search results could not be loaded', err)
          return
        }

        items[index].fragments = fragments

        this.extendState({
          items: items,
          details: index 
        })
      }.bind(this))
    } else {
      this.extendState({details: index})
    }
  }

  _loadTopics(newFilters, search) {
    let resourceClient = this.context.resourceClient
    let mainConfigurator = this.context.configurator
    let configurator = mainConfigurator.getConfigurator('archivist-subjects')
    let filters = newFilters || this.state.filters
    let facets = filters.topics
    let searchValue = search || this.state.search
    let language = 'russian'
    if(searchValue) {
      filters = clone(filters)
      filters.query = searchValue
      filters.language = language
    }

    resourceClient.getSubjectsFacets(filters, (err, res) => {
      if (err) {
        console.error('ERROR', err)
        return
      }

      let importer = configurator.createImporter('subjects')
      let topics = importer.importDocument(res, true, facets)
      topics.on('document:changed', this._onTopicsChanged, this)

      this.extendState({
        topics: topics
      })
    })
  }

  _searchData(value) {
    this.extendState({
      search: value,
      pagination: false
    })
  }

  /*
    Called when something is changed on subjects model.
    If some of subjects got active, then we will load
    subjects again with new facets.
  */
  _onTopicsChanged(change) {
    let facetChange = false
    each(change.updated, function(val, key){
      if(key.indexOf('active') > -1) {
        facetChange = true
      }
    })

    if(facetChange) this._applyFacets()
  }

  /*
    Called when facets changed.
    Will change filters and load new subjects facets again.
  */
  _applyFacets() {
    let topics = this.state.topics
    let filters = this.state.filters
    let facets = topics.getActive()
    topics.off(this)

    this.extendState({
      filters: extend({}, filters, {topics: facets}),
      pagination: false,
      documentItems: []
    })
  }
}

export default Explorer
