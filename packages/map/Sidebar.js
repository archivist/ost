import { Component } from 'substance'
import { each, filter, find, isEmpty, sortBy } from 'lodash-es'
import moment from 'moment'

class Sidebar extends Component {

  willReceiveProps(props) {
    if(props.location && props.location !== this.props.location) {
      this._loadLocationData(props.location, props.locations)
    }
  }

  render($$) {
    let details = this.props.location ? true : false
    let el = $$('div').addClass('sc-map-sidebar')

    el.append(this.renderHeader($$))

    if(details) {
      el.append(this.renderDetails($$))
    } else {
      el.append(this.renderList($$))
    }

    el.append(this.renderFilters($$))

    return el
  }

  renderHeader($$) {
    let details = this.props.location ? true : false

    let header = $$('div').addClass('se-sidebar-header')
    let mode = details ? 'sidebar-back' : 'sidebar-click'
    
    header.append(
      this.context.iconProvider.renderIcon($$, mode),
      this.getLabel(mode)
    )

    if(details) {
      header.on('click', this._showLocationsList)
    }

    return header
  }

  renderList($$) {
    let el = $$('div').addClass('se-locations-list')
    let locations = this.props.locations
    if(!isEmpty(locations)) {
      let filters = []
      each(this.props.filters, (f, id) => {
        if(f.state === true) filters.push(id)
      })
      let features = filter(locations.features, function(f) { return filters.indexOf(f.properties.entityType) > -1 })
      features = sortBy(features, function(f) { return f.properties.title })
      features.forEach(f => {
        let item = $$('div').addClass('se-location-item').append(
          $$('div').attr({class: 'se-title'}).append(f.properties.title),
          $$('div').attr({class: 'se-stats'}).append(f.properties.stats)
        ).on('click', this._showLocation.bind(this, f.properties.entityId))
        el.append(item)
      })
    }

    return el
  }

  renderDetails($$) {
    let location = this.state.location
    let urlHelper = this.context.urlHelper
    let el = $$('div').addClass('se-location-details')

    if(location) {
      if(location.properties.entityType === 'toponym') {
        el.append(this.renderToponym($$))
      } else if(location.properties.entityType === 'prison') {
        el.append(this.renderPrison($$))
      }

      let references = $$('div').addClass('se-references')
      each(location.docs, doc => {
        let meta = doc.meta
        let refItem = $$('a').addClass('se-doc-reference')
          .attr({
            href: urlHelper.openDocument(doc.documentId, this.props.location),
            target: '_blank'
          })
        let metaInfo = $$('div').addClass('se-doc-meta')
        if(meta.state !== 'published') refItem.addClass('sm-unpublished')
        if(meta.interview_duration) {
          metaInfo.append($$('div').addClass('se-record-duration').append(meta.interview_duration + ' ' + this.getLabel('min-duration')))
        }
        if(meta.interview_date) {
          metaInfo.append($$('div').addClass('se-record-date').append(moment(meta.interview_date).format('DD.MM.YYYY')))
        }
        if(meta.record_type) {
          metaInfo.append($$('div').addClass('se-record-type').append(this.context.iconProvider.renderIcon($$, meta.record_type)))
        }
        if(doc.count) {
          metaInfo.append($$('div').addClass('se-fragments-count').append(doc.count + ' ' + this.getLabel('fragment-count')))
        }

        refItem.append(
          metaInfo,
          $$('div').addClass('se-doc-title').append(meta.title)
        )

        references.append(refItem)
      })
      el.append(references)
    }

    return el
  }

  renderToponym($$) {
    let el = $$('div').addClass('se-location-meta se-toponym')
    let loc = this.state.location
    let node = loc.properties

    let location = node.country
    if(node.name !== node.currentName && node.currentName) {
      location += ", " + node.currentName
    }

    el.append(
      $$('div').addClass('se-location').append(location),
      $$('div').addClass('se-title').append(node.name.toLowerCase() === 'неизвестно' ? this.getLabel('unknown-name') : node.name),
      $$('div').attr({class: 'se-stats'}).append(
        this.context.iconProvider.renderIcon($$, 'sidebar-stats'),
        node.stats
      ),
      $$('div').addClass('se-description').setInnerHTML(node.description)
    )

    return el
  }

  renderPrison($$) {
    let el = $$('div').addClass('se-location-meta se-prison')
    let loc = this.state.location
    let node = loc.properties

    let location = node.country
    if(node.nearestLocality) {
      location += ", " + node.nearestLocality
    }

    let prisonType = node.prisonType ? node.prisonType.join(', ') : ''

    el.append(
      $$('div').addClass('se-prison-type').append(prisonType),
      $$('div').addClass('se-title').append(node.name),
      $$('div').addClass('se-location').append(location),
      $$('div').attr({class: 'se-stats'}).append(
        this.context.iconProvider.renderIcon($$, 'sidebar-stats'),
        node.stats
      ),
      $$('div').addClass('se-description').setInnerHTML(node.description)
    )

    return el
  }

  renderFilters($$) {
    let el = $$('div').addClass('se-filters')
    let filters = this.props.filters

    each(filters, (f, id) => {
      let filterEl = $$('div').addClass('se-filter-item se-filter-' + id).append(
        this.context.iconProvider.renderIcon($$, id + '-symbol').addClass('se-symbol'),
        this.getLabel(id + '-filter') + ' (' + f.counter + ')'
      ).on('click', this.send.bind(this, 'filterLocations', id, !f.state))

      if(f.state) {
        filterEl.append(this.context.iconProvider.renderIcon($$, 'filter-visible').addClass('se-visibility'))
        filterEl.addClass('sm-active')
      } else {
        filterEl.append(this.context.iconProvider.renderIcon($$, 'filter-hidden').addClass('se-visibility'))
      }

      el.append(filterEl)
    })

    return el
  }

  _showLocation(id) {
    this.send('showLocation', id)
  }

  _showLocationsList() {
    this.send('showLocations')
  }

  _loadLocationData(resourceId, locations) {
    let documentClient = this.context.documentClient
    locations = locations || this.props.locations
    let location = find(locations.features, f => {
      return f.properties.entityId === resourceId
    })

    documentClient.getResourceDocuments(resourceId, (err, docs) => {
      if(err) {
        console.err(err)
        return
      }
      location.docs = docs
      this.extendState({
        location: location
      })
    })
  }
}

export default Sidebar
