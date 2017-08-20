import Interview from './Interview'
import MetaNode from './MetaNode'
import InterviewSeed from './InterviewSeed'

import { BasePackage, ParagraphPackage, PersistencePackage, HeadingPackage, BlockquotePackage, LinkPackage, EmphasisPackage, StrongPackage} from 'substance'
import { CommentPackage, TimecodePackage } from 'archivist'
import SubjectPackage from '../subject/package'
import DefinitionPackage from '../definition/package'
import PersonPackage from '../person/package'
import PrisonPackage from '../prison/package'
import ToponymPackage from '../toponym/package'
import EntityReferencePackage from '../entity-reference/package'

export default {
  name: 'archivist-interview',
  configure: function(config) {
    config.defineSchema({
      name: 'archivist-interview',
      version: '1.0.0',
      DocumentClass: Interview,
      defaultTextType: 'paragraph'
    })
    config.addNode(MetaNode)
    config.addSeed(InterviewSeed)

    // Import Substance Core packages
    config.import(BasePackage)
    config.import(ParagraphPackage)
    config.import(HeadingPackage)
    config.import(BlockquotePackage)
    config.import(EmphasisPackage)
    config.import(StrongPackage)
    config.import(LinkPackage)

    // Import archivist specific packages
    config.import(CommentPackage)
    config.import(TimecodePackage)
    config.import(SubjectPackage)
    config.import(DefinitionPackage)
    config.import(PersonPackage)
    config.import(PrisonPackage)
    config.import(ToponymPackage)
    config.import(EntityReferencePackage)

    config.addLabel('undo', {
      en: 'undo',
      ru: 'отмена'
    })
    config.addLabel('redo', {
      en: 'redo',
      ru: 'вернуть'
    })
    config.addLabel('strong', {
      en: 'strong',
      ru: 'жирный'
    })
    config.addLabel('emphasis', {
      en: 'emphasis',
      ru: 'наклонный'
    })
    config.addLabel('link', {
      en: 'link',
      ru: 'ссылка'
    })
  }
}