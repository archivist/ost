import PrisonsPage from './PrisonsPage'

export default {
  name: 'prison-manager',
  configure: function(config) {
    config.addPage(PrisonsPage.pageName, PrisonsPage)
    config.addLabel('Prisons', {
      en: 'Prisons',
      ru: 'Места заключения'
    })
    config.addLabel('add-prison', {
      en: '+ Add Prison',
      ru: '+ Добавить место заключения'
    })
  }
}