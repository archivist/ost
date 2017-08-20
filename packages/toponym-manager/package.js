import ToponymsPage from './ToponymsPage'

export default {
  name: 'toponym-manager',
  configure: function(config) {
    config.addPage(ToponymsPage.pageName, ToponymsPage)
    config.addLabel('toponyms', {
      en: 'Toponyms',
      ru: 'Топонимы'
    })
  }
}