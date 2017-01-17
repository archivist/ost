import { BasePackage } from 'substance'
import { BracketsPackage, TabbedContextPackage } from 'archivist'
import ReaderLayout from './ReaderLayout'

export default {
  name: 'archivist-reader',
  configure: function(config) {
    config.import(BasePackage)
    config.import(BracketsPackage)
    config.import(TabbedContextPackage)
    config.addComponent('reader', ReaderLayout)
  }
}