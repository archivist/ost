import { AbstractEntityPage } from 'archivist'

class PersonsPage extends AbstractEntityPage {}

PersonsPage.entityType = 'person'
PersonsPage.pageName = 'persons'

export default PersonsPage
