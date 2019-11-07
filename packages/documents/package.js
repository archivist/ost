import DocumentsPage from './DocumentsPage'

export default {
  name: 'archivist-documents',
  configure: function(config) {
    config.addPage('archive', DocumentsPage)
    config.addLabel('archive', {
      en: 'Documents',
      ru: 'Документы'
    })
    config.addLabel('documents', {
      en: 'Documents',
      ru: 'Документы'
    })
    config.addLabel('add-document', {
      en: '+ New Document',
      ru: '+ Добавить документ'
    })
    config.addLabel('select-document-state', {
      en: 'Select state',
      ru: 'Статус документа'
    })
    config.addLabel('sort-updated', {
      en: 'Sort by date',
      ru: 'По дате'
    })
    config.addLabel('sort-alphabet', {
      en: 'Sort by title',
      ru: 'По названию'
    })
  }
}
