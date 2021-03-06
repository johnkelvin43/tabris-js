export default class ClientMock {

  constructor(defaults) {
    this.$calls = [];
    this.$objects = {};
    this.$defaults = defaults || {};
  }

  create() {
    const [id, type, properties] = arguments;
    this.$calls.push({op: 'create', id, type, properties});
    this.$objects[id] = {type, properties};
    if (type in this.$defaults) {
      Object.assign(this.$objects[id].properties, this.$defaults[type]);
    }
  }

  get() {
    const [id, property] = arguments;
    this.$calls.push({op: 'get', id, property});
    return id in this.$objects ? this.$objects[id].properties[property] : undefined;
  }

  set() {
    const [id, properties] = arguments;
    this.$calls.push({op: 'set', id, properties});
    if (!(id in this.$objects)) {
      this.$objects[id] = {properties: {}};
    }
    Object.assign(this.$objects[id].properties, properties);
  }

  call() {
    const [id, method, parameters] = arguments;
    this.$calls.push({op: 'call', id, method, parameters});
  }

  listen() {
    const [id, event, listen] = arguments;
    this.$calls.push({op: 'listen', id, event, listen});
  }

  destroy() {
    const [id] = arguments;
    this.$calls.push({op: 'destroy', id});
    delete this.$objects[id];
  }

  load() {
    return null;
  }

  loadAndExecute() {
    return {
      executeResult: {}
    };
  }

  calls(filterProperties) {
    tabris._nativeBridge.flush();
    return select.call(this.$calls, filterProperties);
  }

  resetCalls() {
    tabris._nativeBridge.flush();
    this.$calls = [];
  }

  properties(id) {
    tabris._nativeBridge.flush();
    if (!(id in this.$objects)) {
      throw new Error('No object with id ' + id);
    }
    return this.$objects[id].properties;
  }

}

function select(filterProperties) {
  return this.filter((call) => {
    for (const key in filterProperties) {
      if (filterProperties[key] !== call[key]) {
        return false;
      }
    }
    return true;
  });
}
