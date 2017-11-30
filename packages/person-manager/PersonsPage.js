import { AbstractEntityPage } from 'archivist-js'

class PersonsPage extends AbstractEntityPage {}

PersonsPage.entityType = 'person'
PersonsPage.pageName = 'persons'

export default PersonsPage
