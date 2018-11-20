const DEFAULT_URIS = {};

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

  get() {
    const links = [];
    const keys = Object.keys(this.uris);
    for (let i = 0; i < keys.length; i++) {
      const elem = this.buildElem(keys[i]);
      links.push(elem);
    }
    return links;
  }

  buildElem(key) {
    const URI = this.uris[key];
    return {
      rel: key,
      href: URI.uri,
      type: URI.type || 'GET',
    };
  }


}

module.exports = HATEOAS;
