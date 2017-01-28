import Explorer from './Explorer'
import SearchBar from './SearchBar'
import DocumentItem from './DocumentItem'
import ResourceEntries from './ResourceEntries'
import ResourceReference from './ResourceReference'
import Facets from './Facets'

export default {
  name: 'archivist-explorer',
  configure: function(config) {
    config.addPage('explorer', Explorer)
    config.addPage('resources', Explorer)
    config.addComponent('searchbar', SearchBar)
    config.addComponent('document-item', DocumentItem)
    config.addComponent('resource-entries', ResourceEntries)
    config.addComponent('resource-reference', ResourceReference)
    config.addComponent('facets', Facets)
    config.addIcon('searchbar-search', {'fontawesome': 'fa-search'})
    config.addIcon('fragment-badge', {'fontawesome': 'fa-comments-o'})
    config.addIcon('location', {'fontawesome': 'fa-map-marker'})
    config.addIcon('video', {'fontawesome': 'fa-video-camera'})
    config.addIcon('audio', {'fontawesome': 'fa-volume-up'})
    config.addIcon('collapsed', { 'fontawesome': 'fa-caret-right' })
    config.addIcon('expanded', { 'fontawesome': 'fa-caret-down' })
    config.addIcon('checked', { 'fontawesome': 'fa-check-square-o' })
    config.addIcon('unchecked', { 'fontawesome': 'fa-square-o' })
    config.addLabel('topic-facets', {
      en: 'Topics',
      ru: 'Темы'
    })
    config.addLabel('searchbar-placeholder', {
      en: 'Enter search query',
      ru: 'Введите поисковой запрос'
    })
    config.addLabel('searchbar-submit', {
      en: 'Search',
      ru: 'Поиск'
    })
    config.addLabel('total-results', {
      en: 'Found interviews',
      ru: 'Найдено интервью'
    })
    config.addLabel('resource-suggestions', {
      en: 'Resource suggestions',
      ru: 'Словарные статьи'
    })
    config.addLabel('no-results', {
      en: 'No results',
      ru: 'Нет результатов'
    })
    config.addLabel('no-results-info', {
      en: 'Sorry, no documents matches your query',
      ru: 'К сожалению, нам не удалось найти документов отвечающих данному запросу'
    })
    config.addLabel('min-duration', {
      en: 'min',
      ru: 'мин'
    })
    config.addLabel('fragment-count', {
      en: 'fragments',
      ru: 'фрагм.'
    })
  }
}