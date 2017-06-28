import OstPublisherLayout from './OstPublisherLayout'
import { BracketsPackage, TabbedContextPackage } from 'archivist'

export default {
  name: 'ost-publisher',
  configure: function(config) {
    config.import(BracketsPackage)
    config.import(TabbedContextPackage)
    config.addComponent('editor', OstPublisherLayout)
    config.addToolGroup('references')
    config.addToolGroup('utils')
  }
}