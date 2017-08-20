import PrisonsPage from './PrisonsPage'

export default {
  name: 'prison-manager',
  configure: function(config) {
    config.addPage(PrisonsPage.pageName, PrisonsPage)
    config.addLabel('Prisons', {
      en: 'Prisons',
      ru: 'Места заключения'
    })
  }
}