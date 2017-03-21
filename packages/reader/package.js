import { BracketsPackage, TabbedContextPackage } from 'archivist'
import ReaderLayout from './ReaderLayout'

export default {
  name: 'archivist-reader',
  configure: function(config) {
    config.import(BracketsPackage)
    config.import(TabbedContextPackage)
    config.addComponent('reader', ReaderLayout)
    config.addToolGroup('references')
  }
}