import { DefaultDOMElement } from 'substance'
import { Forms } from 'archivist'
import GeocodedField from './geocoded-field/GeocodedField'
import MapField from './map-field/MapField'

export default class OstForms extends Forms {
  addGeocodedField(fieldId, el, config) {
    config = config || {}
    el = DefaultDOMElement.wrapNativeElement(el)
    let field = GeocodedField.mount({
      fieldId,
      config
    }, el)
    field.on('commit', this._onCommit, this)
    field.on('geocode', this._onGeocode, this)
    this._editables[fieldId] = field
    return field
  }

  addMap(fieldId, el, config) {
    config = config || {}
    el = DefaultDOMElement.wrapNativeElement(el)
    let field = MapField.mount({
      fieldId,
      config
    }, el)
    field.on('commit', this._onCommit, this)
    field.on('map:point', this._onSetPoint, this)
    this._editables[fieldId] = field
    return field
  }

  _onGeocode(name, value) {
    this.emit('geocode', name, value)
  }

  _onSetPoint(name, value) {
    this.emit('map:point', name, value)
  }
}
