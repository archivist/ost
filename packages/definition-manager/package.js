import DefinitionsPage from './DefinitionsPage'

export default {
  name: 'definition-manager',
  configure: function(config) {
    config.addPage(DefinitionsPage.pageName, DefinitionsPage)
    config.addLabel('definitions', {
      en: 'Definitions',
      ru: 'Дефиниции'
    })
    config.addLabel('add-definition', {
      en: '+ Add Definition',
      ru: '+ Добавить дефиницию'
    })
  }
}