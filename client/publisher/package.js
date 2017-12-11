import { ProseEditorPackage } from 'substance'
import { ArchivistPackage, ArchivistSubConfigurator, CommentsPackage, IndentationPackage, MetadataEditorPackage, ResourcesPackage, TimecodeAnnotatorPackage, UsersPackage, WhitespacePackage } from 'archivist-js'
import InterviewPackage from '../../packages/interview/package'
import FormsPackage from '../../packages/forms/package'
import DocumentsPackage from '../../packages/documents/package'
import DefinitionManagerPackage from '../../packages/definition-manager/package'
import PersonManagerPackage from '../../packages/person-manager/package'
import PrisonManagerPackage from '../../packages/prison-manager/package'
import OstPublisherPackage from '../../packages/ost-publisher/package'
import ToponymManagerPackage from '../../packages/toponym-manager/package'
import SubjectManagerPackage from '../../packages/subject-manager/package'
import SubjectsContextPackage from '../../packages/subjects-editor-context/package'
import AuthenticationClient from './AuthenticationClient'
import DocumentClient from './DocumentClient'
import FileClient from './FileClient'
import ResourceClient from './ResourceClient'

// Entities definitions
import Definition from '../../packages/definition/Definition'
import Person from '../../packages/person/Person'
import Prison from '../../packages/prison/Prison'
import Subject from '../../packages/subjects/Subject'
import Subjects from '../../packages/subjects/package'
import Toponym from '../../packages/toponym/Toponym'

const { ProseArticle } = ProseEditorPackage

let appConfig = 'ARCHIVISTCONFIG'
appConfig = JSON.parse(appConfig)

export default {
  name: 'archivist-publisher',
  configure: function(config) {
    // Use the default Archivist package
    config.setDefaultLanguage(appConfig.defaultLanguage)
    config.import(ArchivistPackage)
    config.import(DocumentsPackage)
    // Override Archivist form package
    config.import(FormsPackage)
    // Manage person entity type
    config.import(PersonManagerPackage)
    // Manage prison entity type
    config.import(PrisonManagerPackage)
    // Manage toponym entity type
    config.import(ToponymManagerPackage)
    // Manage definition entity type
    config.import(DefinitionManagerPackage)
    // Manage subjects
    config.import(SubjectManagerPackage)
    // Manage users
    config.import(UsersPackage)

    // Add subconfigurators
    let EditorConfigurator = new ArchivistSubConfigurator()
    EditorConfigurator.import(OstPublisherPackage)
    EditorConfigurator.import(SubjectsContextPackage)
    EditorConfigurator.import(ResourcesPackage)
    EditorConfigurator.import(CommentsPackage)
    EditorConfigurator.import(MetadataEditorPackage)
    EditorConfigurator.import(InterviewPackage)
    EditorConfigurator.import(IndentationPackage)
    EditorConfigurator.import(WhitespacePackage)
    EditorConfigurator.import(TimecodeAnnotatorPackage)
    EditorConfigurator.setContextMapping({
      'subject': 'subjects',
      'definition': 'resources',
      'person': 'resources',
      'prison': 'resources',
      'toponym': 'resources',
      'comment': 'comments'
    })
    EditorConfigurator.setDefaultLanguage(appConfig.defaultLanguage)
    config.addConfigurator('archivist-interview-editor', EditorConfigurator, true)

    // Entities subconfigurator
    let EntitiesConfigurator = new ArchivistSubConfigurator()
    EntitiesConfigurator.defineSchema({
      name: 'archivist-entities',
      version: '1.0.0',
      DocumentClass: ProseArticle
    })
    EntitiesConfigurator.addNode(Definition)
    EntitiesConfigurator.addNode(Person)
    EntitiesConfigurator.addNode(Prison)
    EntitiesConfigurator.addNode(Toponym)
    EntitiesConfigurator.addNode(Subject)
    config.addConfigurator('archivist-entities', EntitiesConfigurator)

    // Subjects subconfigurator
    config.addConfigurator('archivist-subjects', new ArchivistSubConfigurator().import(Subjects))

    // Add app's root style
    //config.addStyle(__dirname, 'app.scss');

    config.setAppConfig({
      protocol: appConfig.protocol,
      host: appConfig.host,
      port: appConfig.port
    })

    // Define Authentication Client
    config.setAuthenticationServerUrl(appConfig.protocol + '://'+appConfig.host+':'+appConfig.port+'/api/auth/')
    config.setAuthenticationClient(AuthenticationClient)
    // Define Document Client
    config.setDocumentServerUrl(appConfig.protocol + '://'+appConfig.host+':'+appConfig.port+'/api/documents/')
    config.setDocumentClient(DocumentClient)
    // Define File Client
    config.setFileServerUrl(appConfig.protocol + '://'+appConfig.host+':'+appConfig.port+'/api/files/')
    config.setFileClient(FileClient)
    // Define Resource Client
    config.setResourceServerUrl(appConfig.protocol + '://'+appConfig.host+':'+appConfig.port+'/api/entities/')
    config.setResourceClient(ResourceClient)

    config.setMenuItems([
      {icon: 'fa-file-text', label: 'documents', action: 'archive'},
      {icon: 'fa-tags', label: 'subjects', action: 'subjects'},
      {icon: 'fa-users', label: 'persons', action: 'persons'},
      {icon: 'fa-th', label: 'prisons', action: 'prisons'},
      {icon: 'fa-globe', label: 'toponyms', action: 'toponyms'},
      {icon: 'fa-book', label: 'definitions', action: 'definitions'},
      {icon: 'fa-id-badge', label: 'users', action: 'users'}
    ])

    config.setDefaultResourceTypes(['definition', 'person', 'prison', 'toponym'])
  }
}
