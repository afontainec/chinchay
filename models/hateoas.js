
class HATEOAS {
  constructor() {
    this.uris = {};
  }

  addLink(name, uri, type) {
    this.uris[name] = {
      uri,
      type,
    };
  }

  removeLink(name) {
    delete this.uris[name];
  }

  get(values) {
    values = values || {};
    const links = [];
    const keys = Object.keys(this.uris);
    for (let i = 0; i < keys.length; i++) {
      const elem = this.buildElem(keys[i], values);
      links.push(elem);
    }
    return links;
  }

  buildElem(key, values) {
    const URI = this.uris[key];
    const href = this.compileUri(URI.uri, values);
    return {
      rel: key,
      href,
      type: URI.type || 'GET',
    };
  }

  compileUri(uri, values) {
    values = values || {};
    console.log(uri);
    const index = uri.indexOf(':');
    if (index === -1) return uri;
    const first = uri.substring(0, index);
    const second = uri.substring(index + 1, uri.length);
    console.log(first, '-sep-', second);
  }


}

module.exports = HATEOAS;
