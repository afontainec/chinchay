// server/models/table.js
'use strict';

let knex;
const Utils = require('codemaster').utils;
const Message = require('codemaster').message;


class Table {

  constructor(table_name) {
    this.table_name = table_name;
  }

  toString() {
    return this.table_name;
  }

  table() {
    return knex(this.table_name);
  }

  static setKnex(elem) {
    knex = elem;
  }

  static getKnex() {
    return knex;
  }


  // ################################################
  // CUD FROM CRUD
  // ################################################

  new() {
    const table_name = this.table_name;
    return new Promise((resolve, reject) => {
      knex('information_schema.columns').select('column_name').where({
        table_name,
      }).then((attributes) => {
          // check if attributes is an array
        if (!attributes || attributes.length === 0) {
          return reject(`Hubo un error creando un nuevo objeto: ${table_name}`);
        }
        const entry = {};
        attributes.forEach((attribute) => {
          entry[attribute.column_name] = null;
        });
        resolve(entry);
      })
        .catch((err) => {
          reject(err);
        });
    });
  }

  save(originalEntry) {
    const errorString = 'Something went wrong';
    // make a clone so if we delete stuff from entry it does not modify the original one
    const entry = Utils.cloneJSON(originalEntry);
    return new Promise((resolve, reject) => {
      this.parseAttributesForUpsert(entry, true)
        .then((attributes) => {
          this.table().insert(attributes).returning('*').then((entry) => {
              // check if attributes is an array
            if (!entry || entry.length === 0) {
              return reject(errorString);
            }
            resolve(entry[0]);
          })
            .catch((err) => { //eslint-disable-line
              reject(errorString);
            });
        }).catch((err) => {
          reject(err);
        });
    });
  }

  update(id, originalAttributes) {
    const attr = Utils.cloneJSON(originalAttributes);
    const errorString = 'Something went wrong';
    return new Promise((resolve, reject) => {
      this.findById(id).then(() => {
        if (attr && attr.id && id !== attr.id) {
          return reject('Given IDs differ');
        }
        this.parseAttributesForUpsert(attr, false).then((attributes) => {
          this.table().where({
            id,
          }).update(attributes).returning('*')
            .then((entry) => {
              // check if attributes is an array
              if (!entry || entry.length === 0) {
                return reject(errorString);
              }
              resolve(entry[0]);
            })
            .catch(() => {
              reject(errorString);
            });
        }).catch((err) => {
          reject(err);
        });
      }).catch((err) => {
        reject(err);
      });
    });
  }

  delete(id) {
    return new Promise((resolve, reject) => {
      this.table().where({
        id,
      }).del().returning('*')
        .then((entry) => {
          // check if attributes is an array
          if (!entry || entry.length === 0) {
            return reject('Hubo un error eliminando la entrada');
          }
          resolve(entry[0]);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  deleteWhere(params) {
    return new Promise((resolve, reject) => {
      this.table().where(params).del().returning('*')
        .then((entry) => {
          // check if attributes is an array
          if (!entry || entry.length === 0) {
            return reject('Hubo un error eliminando la entrada');
          }
          resolve(entry[0]);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }


  // ################################################
  // Find (R from CRUD)
  // ################################################
  all(columns, options) {
    return this.find({}, columns, options);
  }

  parseToSend(entry) {
    return new Promise((resolve) => {
      resolve(entry);
    });
  }

  find(whereQuery, columns, options) {
    const query = this.findQuery(whereQuery, columns, options);
    return Table.fetchQuery(query);
  }

  findQuery(whereQuery, columns, options) {
    return this.buildQuery('find', whereQuery, columns, options);
  }

  findById(id, columns, options) {
    const whereQuery = {};
    whereQuery.id = id;
    return new Promise((resolve, reject) => {
      this.find(whereQuery, columns, options).then((entries) => {
        if (entries.length === 0) return reject(Table.makeError('unexistantID'));
        return resolve(entries[0]);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  findIdIn(ids, columns, query, options) {
    return this.findIn('id', ids, query, columns, options);
  }

  findIn(target, validOptions, query, columns, options) {
    query = query || {};
    if (Array.isArray(validOptions)) query[target] = ['in', validOptions];
    else { query[target] = validOptions; }
    return this.find(query, columns, options);
  }


  // ################################################
  // Miscelaneous
  // ################################################


  buildQuery(selectType, whereQuery, columns, options) {
    let query = this.table();
    query = this.makeQuery(query, selectType, whereQuery, columns, options);
    return query;
  }

  makeQuery(query, selectType, whereQuery, columns, options) {
    this.addSelect(selectType, query, columns, options);
    query = this.addWhere(query, whereQuery);
    query = this.addAdvancedOptions(query, options);
    return query;
  }

  addSelect(type, query, columns, options) {
    switch (type) {
    case 'find':
      return this.addFindSelect(query, columns, options);
    case 'count':
      return this.addCountSelect(query, options);
    default:
      return this.addFindSelect(query, columns, options);
    }
  }

  addFindSelect(query, columns, options) {
    options = options || {};
    if (options.rawSelect) {
      query = Table.addRawSelect(query, options.rawSelect);
    }
    if (options.clearSelect || (!Array.isArray(columns) && columns !== 'all')) return query;
    if (!Array.isArray(columns)) columns = '*';
    return query.select(columns);
  }

  addCountSelect(query, options) {
    options = options || {};
    if (options.rawSelect) {
      query = Table.addRawSelect(query, options.rawSelect);
    }
    if (options.countDistinct) {
      return query.countDistinct(options.countDistinct);
    }
    return query.count();
  }

  addWhere(query, whereQuery) {
    if ((typeof whereQuery) !== 'object') whereQuery = {};
    const especialQuery = this.filterEspecialQuery(whereQuery);
    query.where(whereQuery);
    for (let i = 0; i < especialQuery.length; i++) {
      query.andWhere(especialQuery[i][0], especialQuery[i][1], especialQuery[i][2]);
    }
    return query;
  }

  filterEspecialQuery(whereQuery) {
    const keys = Object.keys(whereQuery);
    const especialQuery = [];
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const elem = whereQuery[key];
      if (Array.isArray(elem)) {
        if (elem.length >= 2) especialQuery.push([key, elem[0], elem[1]]);
        delete whereQuery[key];
      }
    }
    return especialQuery;
  }

  addAdvancedOptions(query, options) {
    if ((typeof options) !== 'object') return query;
    if (options.groupBy) {
      query = Table.addGroupBy(query, options.groupBy);
    }
    if (options.orderBy) {
      if (Array.isArray(options.orderBy)) query = Table.addOrderBy(query, options.orderBy[0], options.orderBy[1]);
      else query = Table.addOrderBy(query, options.orderBy);
    }
    if (options.limit) {
      query = Table.addLimit(query, options.limit);
    }
    if (options.offset) {
      query = Table.addOffset(query, options.offset);
    }
    query = Table.addTimeInterval(query, options.startDate, options.endDate);
    return query;
  }

  // // TODO: USE FIND TO MAKE THIS QUERY
  getFirstDate(attr) {
    return new Promise((resolve, reject) => {
      this.table().select('created_at').where(attr).orderBy('created_at', 'asc').first() // eslint-disable-line newline-per-chained-call
        .then((results) => {
          if (results && results.created_at) {
            return resolve(results.created_at);
          }
          return resolve(undefined);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  getAttributesNames() {
    const table_name = this.table_name;
    return new Promise((resolve, reject) => {
      knex('information_schema.columns').select('column_name').where({
        table_name,
      }).then((results) => {
          // check if results is an array
        if (!results || results.length === 0) {
          return reject(`Hubo un error creando un nuevo objeto: ${table_name}`);
        }
        const attributes = [];
        results.forEach((attribute) => {
          attributes.push(attribute.column_name);
        });
        resolve(attributes);
      })
        .catch((err) => {
          reject(err);
        });
    });
  }

  filterColumns(columns) {
    return new Promise((resolve, reject) => {
      if (!Array.isArray(columns)) {
        resolve([]);
        return;
      }
      this.getAttributesNames().then((attributes) => {
        const thisTableColumns = [];
        for (let i = 0; i < attributes.length; i++) {
          if (columns.indexOf(attributes[i]) > -1) {
            thisTableColumns.push(attributes[i]);
          }
        }
        resolve(thisTableColumns);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  // COUNT

  count(whereQuery, options) {
    const f = async () => {
      const query = this.countQuery(whereQuery, options);
      console.log(query.toString());
      const results = await Table.fetchQuery(query);
      if (results.length === 1) {
        return Object.keys(results[0]).length === 1 ? results[0].count : results[0];
      }
      for (let i = 0; i < results.length; i++) {
        if (results[i].count) { results[i].count = parseInt(results[i].count, 10); }
      }
      return results;
    };
    return f();
  }

  countQuery(whereQuery, options) {
    return this.buildQuery('count', whereQuery, 'all', options);
  }

  // // TODO: USE ADD WHERE AND ADD ADVANCE TO DO THIS QUERY
  countGroupBy(groupBy, whereQuery, columns, options) {
    options = options || {};
    options.groupBy = groupBy;
    return this.count(whereQuery, columns, options);
  }

  // // TODO: USE ADD WHERE AND ADD ADVANCE TO DO THIS QUERY
  countIn(target, validOptions, query, options) {
    query = query || {};
    if (Array.isArray(validOptions)) query[target] = ['in', validOptions];
    else { query[target] = validOptions; }
    return this.count(query, options);
  }

  // ################################################
  // 'Private' methods (static)
  // ################################################

  // eslint-disable-next-line
  static addTimestamps(attr, isNew) {
    if (isNew) {
      attr.created_at = new Date();
    }
    attr.updated_at = new Date();
  }

  static getSelectString(query) {
    const str = query.toString();
    let withinParentesis = false;
    for (let i = 0; i < str.length; i++) {
      const s = str.substring(i);
      if (s[0] === '(') withinParentesis = true;
      if (s[0] === ')') withinParentesis = false;
      if (!withinParentesis && s.substring(0, 4) === 'from') {
        return str.substring(6, i);
      }
    }
    return 'Query badly parsed';
  }

  static hasColumnInSelect(query, column) {
    const selectStr = Table.getSelectString(query);
    return selectStr.indexOf(` ${column} `) > -1 || selectStr.indexOf(` ${column},`) > -1 || selectStr.indexOf(`,${column} `) > -1 || selectStr.indexOf(`"${column}"`) > -1;
  }

  static addColumn(query, column) {
    if (!Table.hasColumnInSelect(query, column)) {
      query.select(column);
    }
  }

  static addGroupByToSelect(query, groupby) {
    if (Array.isArray(groupby)) {
      for (let i = 0; i < groupby.length; i++) {
        Table.addColumn(query, groupby[i]);
      }
    } else {
      Table.addColumn(query, groupby);
    }
  }

  static addGroupBy(query, groupby) {
    if (groupby) {
      Table.addGroupByToSelect(query, groupby);
      query.groupBy(groupby);
    }
    return query;
  }

  static addRawSelect(query, select) {
    if (select) {
      if (Array.isArray(select)) {
        query.select(knex.raw(select[0], select[1]));
      } else {
        query.select(knex.raw(select));
      }
    }
    return query;
  }

  static addOrderBy(query, column, order) {
    if (column) {
      query.orderBy(column, order);
    }
    return query;
  }

  static addLimit(query, limit) {
    if (limit) {
      query.limit(limit);
    }
    return query;
  }

  static addOffset(query, offset) {
    if (offset) {
      query.offset(offset);
    }
    return query;
  }

  static addTimeInterval(query, startDate, endDate) {
    if (endDate) {
      query.andWhere('created_at', '<', endDate);
    }
    if (startDate) {
      query.andWhere('created_at', '>', startDate);
    }
    return query;
  }

  static fetchQuery(query) {
    return new Promise((resolve, reject) => {
      query.then((results) => {
        return resolve(results);
      }).catch((err) => {
        reject(Table.makeError(err.routine));
      });
    });
  }


  // Makes sure not to go searching for wierd stuff
  filterAttributes(attributes) {
    return new Promise((resolve, reject) => {
      if (!Utils.isJSON(attributes)) {
        return reject('Parameter should be a valid json');
      }

      this.getAttributesNames().then((attributeNames) => {
        const filteredAttributes = {};
        for (let i = 0; i < attributeNames.length; i++) {
          const attributeName = attributeNames[i];
          if (attributeName in attributes) {
            filteredAttributes[attributeName] = attributes[attributeName];
              // remove the key
            delete attributes[attributeName];
          }
        }
          // if there are still keys left its because there where attributes that do not correspond
        if (Object.keys(attributes).length !== 0) {
          let attr = '';
          for (let i = 0; i < Object.keys(attributes).length; i++) {
            attr += ` ${Object.keys(attributes)[i]}.`;
          }
          return reject(`Cannot add attribute: ${attr}`);
        }
        return resolve(filteredAttributes);
      })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  static removeUnSetableAttributes(attributes) {
    delete attributes.id;
    delete attributes.created_at;
    delete attributes.updated_at;
  }

  parseAttributesForUpsert(attributes, isNew) {
    return new Promise((resolve, reject) => {
      Table.removeUnSetableAttributes(attributes);
      this.filterAttributes(attributes).then((filteredAttributes) => {
        Table.removeUnSetableAttributes(filteredAttributes);

        if (Utils.isEmptyJSON(filteredAttributes)) {
          return reject('Paremeter should not be empty');
        }

        Table.addTimestamps(filteredAttributes, isNew);
        resolve(filteredAttributes);
      })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static makeError(err) {
    const keys400 = Object.keys(ERROR_400);
    if (keys400.indexOf(err) > -1) {
      return Message.new(400, ERROR_400[err], err);
    }
    return Message.new(500, 'Internal error', err);
  }

  static extractOptions(query) {
    const options = {};
    const queryKeys = Object.keys(query);
    for (let i = 0; i < OPTIONS_KEYS.length; i++) {
      const key = OPTIONS_KEYS[i];
      if (queryKeys.indexOf(key) > -1) {
        options[key] = query[key];
        delete query.key;
      }
    }
    return options;
  }

  static extractColumns(query) {
    if (query.columns) {
      const col = query.columns;
      delete query.columns;
      return col;
    }
    return 'all';
  }

}

const ERROR_400 = {
  errorMissingColumn: 'Consulta invalida. Columna solicitada no existe',
  check_ungrouped_columns_walker: 'Group by invalido.',
  recompute_limits: 'Limite es invalido',
  scanner_yyerror: 'Select invalido',
  DateTimeParseError: 'Fecha ingresada no es válida',
  unexistantID: 'Id solicitado no existe',
  pg_atoi: 'Problema en tipo de variable',

};

const OPTIONS_KEYS = ['startDate', 'endDate', 'groupBy', 'orderBy', 'limit', 'offset', 'rawSelect', 'clearSelect'];


module.exports = Table;
