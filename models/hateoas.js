
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
    const parts = HATEOAS.divideUri(uri);
    if (!parts) return uri;
    const replacement = values[parts.middle] || `:${parts.middle}`;
    if (!replacement) throw new Error(`missing value ${parts.middle}`);
    return parts.first + replacement + this.compileUri(parts.second, values);
  }

  static divideUri(uri) {
    const parts = {};
    const index = uri.indexOf(':');
    if (index === -1) return null;
    parts.first = uri.substring(0, index);
    parts.second = uri.substring(index, uri.length);
    const lastIndex = parts.second.indexOf('/') === -1 ? parts.second.length : parts.second.indexOf('/');
    parts.middle = parts.second.substring(1, lastIndex);
    parts.second = parts.second.substring(lastIndex, parts.second.length);
    return parts;
  }


}

module.exports = HATEOAS;
