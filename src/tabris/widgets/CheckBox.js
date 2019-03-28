import NativeObject from '../NativeObject';
import Widget from '../Widget';
import {JSX} from '../JsxProcessor';

export default class CheckBox extends Widget {

  get _nativeType() {
    return 'tabris.CheckBox';
  }

  _getXMLAttributes() {
    return super._getXMLAttributes().concat([
      ['text', this.text],
      ['checked', this.checked]
    ]);
  }

  /** @this {import("../JsxProcessor").default} */
  [JSX.jsxFactory](Type, attributes) {
    const children = this.getChildren(attributes);
    const normalAttributes = this.withoutChildren(attributes);
    return super[JSX.jsxFactory](Type, this.withContentText(
      normalAttributes,
      children,
      'text'
    ));
  }

}

NativeObject.defineProperties(CheckBox.prototype, {
  text: {type: 'string', default: ''},
  checked: {type: 'boolean', nocache: true},
  textColor: {type: 'ColorValue'},
  tintColor: {type: 'ColorValue'},
  checkedTintColor: {type: 'ColorValue'},
  font: {
    type: 'FontValue',
    set(name, value) {
      this._nativeSet(name, value);
      this._storeProperty(name, value);
    },
    default: null
  }
});

NativeObject.defineEvents(CheckBox.prototype, {
  select: {native: true, changes: 'checked'},
});
