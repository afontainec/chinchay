// server/models/table.js
'use strict';

const knex = require('../../../db/knex');
const utils = require('../../utils');
const Message = require('../../message');


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
    const entry = utils.cloneJSON(originalEntry);
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
    const attr = utils.cloneJSON(originalAttributes);
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
  all(columns) {
    return this.find({}, columns);
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
    let query = this.table();
    this.addSelect(query, columns, options);
    query = this.addWhere(query, whereQuery);
    query = this.addAdvancedOptions(query, options);
    return query;
  }

  addSelect(query, columns, options) {
    options = options || {};
    if (options.rawSelect) {
      query = Table.addRawSelect(query, options.rawSelect);
    }
    if (options.clearSelect || (!Array.isArray(columns) && columns !== 'all')) return query;
    if (!Array.isArray(columns)) columns = '*';
    return query.select(columns);
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

    // // TODO: USE FIND TO MAKE THIS QUERY
  findIdIn(ids, columns, query) {
    query = query || {};
    const that = this;
    return new Promise((resolve, reject) => {
      that.filterColumns(columns).then((filteredColumns) => {
        resolve(that.table().select(filteredColumns)
            .whereIn('id', ids).andWhere(query)
            .orderBy('id', 'asc'));
      }).catch((err) => {
        reject(err);
      });
    });
  }

    // // TODO: USE FIND TO MAKE THIS QUERY
  findIn(target, validOptions, searchAttr, columns, options) {
    options = options || {};
    const that = this;
    return new Promise((resolve, reject) => {
      that.filterColumns(columns).then((filteredColumns) => {
        const query = that.table().select(filteredColumns)
            .whereIn(target, validOptions).andWhere(searchAttr);
        if (options.groupBy) {
          Table.addGroupBy(query, options.groupBy);
        }
        if (options.rawSelect) {
          Table.addRawSelect(query, options.rawSelect);
        }
        resolve(query);
      }).catch((err) => {
        reject(err);
      });
    });
  }


    // ################################################
    // Miscelaneous
    // ################################################

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

    // // TODO: USE ADD WHERE AND ADD ADVANCE TO DO THIS QUERY
  count(attr) {
    if (!attr) {
      attr = {};
    }
    return new Promise((resolve, reject) => {
      this.table().count('*').where(attr)
          .then((results) => {
            if (results[0].count) {
              return resolve(results[0].count);
            }
            reject('No se encontró una respuesta válida');
          })
          .catch((error) => {
            reject(error);
          });
    });
  }

    // // TODO: USE ADD WHERE AND ADD ADVANCE TO DO THIS QUERY
  countGroupBy(groupBy, attr) {
    if (!attr) {
      attr = {};
    }
    if (!groupBy || (typeof groupBy) !== 'string') { // if no groupBy is given
      return this.count(attr);
    }
    const f = async (groupBy, attr) => {
      const result = await this.table().select(groupBy, knex.raw('count(*)')).where(attr).groupBy(groupBy);
      return result;
    };
    return f(groupBy, attr);
  }

    // // TODO: USE ADD WHERE AND ADD ADVANCE TO DO THIS QUERY
  countIn(target, validOptions, searchAttr, options) {
    options = options || {};
    const that = this;
    return new Promise((resolve) => {
      const query = that.table().count('*')
          .whereIn(target, validOptions).andWhere(searchAttr);
      if (options.rawSelect) {
        Table.addRawSelect(query, options.rawSelect);
      }
      if (options.groupBy) {
        Table.addGroupBy(query, options.groupBy);
      }
      resolve(query);
    });
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

  static hasColumnInSelect(query, column) {
    const str = query.toString();
    const i = str.indexOf('select');
    const j = str.indexOf('from');
    const selectStr = str.substring(i + 6, j);
    return selectStr.indexOf(` ${column} `) > -1 || selectStr.indexOf(` ${column},`) > -1 || selectStr.indexOf(`,${column} `) > -1;
  }

  static addGroupBy(query, groupby) {
    if (groupby) {
      if (!Table.hasColumnInSelect(query, groupby)) {
        query.select(groupby);
      }
      query.groupBy(groupby);
    }
    return query;
  }

  static addRawSelect(query, select) {
    if (select) {
      query.select(knex.raw(select));
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
      if (!utils.isJSON(attributes)) {
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

        if (utils.isEmptyJSON(filteredAttributes)) {
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


module.exports = Table;
