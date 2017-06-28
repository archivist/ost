import { platform } from 'substance'
import EntityReferenceTool from './EntityReferenceTool'
import EntityReferenceCommand from './EntityReferenceCommand'

export default {
  name: 'entity-reference',
  configure: function(config) {
    config.addTool('entity-reference', EntityReferenceTool, {toolGroup: 'references'})
    config.addCommand('entity-reference', EntityReferenceCommand, { nodeType: 'entity-reference' })
    config.addIcon('entity-reference', {'fontawesome': 'fa-book'})

    if (platform.isMac) {
      config.addKeyboardShortcut('cmd+e', { command: 'entity-reference' })
    } else {
      config.addKeyboardShortcut('ctrl+e', { command: 'entity-reference' })
    }
  }
}