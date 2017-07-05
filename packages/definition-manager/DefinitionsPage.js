import { FontAwesomeIcon as Icon, Input } from 'substance'
import { AbstractEntityPage } from 'archivist'

const definitionTypes = [
  'общий комментарий',
  'лагерная реалия',
  'сокращение',
  'языковой комментарий'
]

class DefinitionsPage extends AbstractEntityPage {
  renderFilters($$) {
    let filters = []
    let search = $$('div').addClass('se-search').append(
      $$(Icon, {icon: 'fa-search'})
    )
    let searchInput = $$(Input, {type: 'search', placeholder: 'Search...'})
      .ref('searchInput')

    if(this.isSearchEventSupported) {
      searchInput.on('search', this._onSearch)
    } else {
      searchInput.on('keypress', this._onSearchKeyPress)
    }
    search.append(searchInput)

    filters.push(search)

    let typeFilter = $$('select').addClass('se-type-filter')
      .ref('typeFilter')
      .on('change', this._onSearch)
      .append($$('option').attr('value', 'all').append('select type'))

    definitionTypes.forEach(type => {
      let option = $$('option').attr('value', type).append(type)
      let definitionType = this.state.dataFilters.definitionType
      if(type === definitionType) option.attr('selected', 'selected')
      typeFilter.append(option)
    })

    filters.push($$('div').addClass('se-select').append(typeFilter))

    return filters
  }

  _onSearch() {
    let searchValue = this.refs['searchInput'].val()
    let definitionTypeValue = this.refs['typeFilter'].val()
    let dataFilters = {}
    dataFilters['definitionType'] = definitionTypeValue
    if(definitionTypeValue === 'all') delete dataFilters['definitionType']
    this.extendState({
      dataFilters: dataFilters,
      search: searchValue,
      pagination: false
    })
  }

}

DefinitionsPage.entityType = 'definition'
DefinitionsPage.pageName = 'definitions'

export default DefinitionsPage
