// server/models/table.js


let knex;
const Utils = require('codemaster').utils;
const Message = require('codemaster').message;


class Table {

  constructor(tableName, givenKnex) {
    this.table_name = tableName;
    this.knex = givenKnex || knex;
    if (!this.knex) throw new Error('Knex param missing.');
  }

  toString() {
    return this.table_name;
  }

  table() {
    return this.knex(this.table_name);
  }

  setKnex(elem) {
    this.knex = elem;
  }

  getKnex() {
    return this.knex;
  }


  // ################################################
  // COUNT
  // ################################################

  count(whereQuery, options) {
    const f = async (query, groupBy) => {
      const results = await Table.fetchQuery(query);
      if (!groupBy) {
        return Object.keys(results[0]).length === 1 ? results[0].count : results[0];
      }
      for (let i = 0; i < results.length; i++) {
        if (results[i].count) {
          results[i].count = parseInt(results[i].count, 10);
        }
      }
      return results;
    };
    options = options || {};
    const { groupBy } = options;
    const query = this.countQuery(whereQuery, options);
    if (Table.returnAsQuery(options)) return query;
    return f(query, groupBy);
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
    else {
      query[target] = validOptions;
    }
    return this.count(query, options);
  }


  // ################################################
  // DELETE
  // ################################################
  delete(input, options) {
    const whereQuery = typeof input === 'object' ? input : { id: input };
    return this.deleteWhere(whereQuery, options);
  }


  deleteWhere(whereQuery, options) {
    const query = this.deleteQuery(whereQuery, options);
    if (Table.returnAsQuery(options)) return query;
    return Table.fetchQuery(query);
  }

  deleteQuery(whereQuery, options) {
    return this.buildQuery('delete', whereQuery, 'all', options);
  }


  // ################################################
  // NEW
  // ################################################

  new() {
    const f = async () => {
      const columns = await this.columnsNames();
      const noColumns = !columns || columns.length === 0;
      if (noColumns) throw new Error('Hubo un error creando un nuevo Objeto');
      return Table.buildEntryFromColumns(columns);
    };
    return f();
  }

  // ################################################
  // SAVE
  // ################################################

  save(originalEntry) {
    const errorString = 'Something went wrong';
    const f = async () => {
      const entry = Utils.cloneJSON(originalEntry);
      const isSave = true;
      const parsed = await this.parseAttributesForUpsert(entry, isSave);
      const query = this.saveQuery(parsed);
      const saved = await Table.fetchQuery(query);
      if (!saved || saved.length === 0) throw new Error(errorString);
      return saved[0];
    };
    return f();
  }

  saveQuery(entry) {
    return this.table().insert(entry).returning('*');
  }

  // ################################################
  // UDATE
  // ################################################

  update(input, newValues, options) {
    const whereQuery = typeof input === 'object' ? input : { id: input };
    return this.updateWhere(whereQuery, newValues, options);
  }

  updateQuery(whereQuery, values, options) {
    let query = this.table();
    query = Table.addUpdate(query, values);
    query = Table.addWhere(query, whereQuery, options);
    query = Table.addAdvancedOptions(query, options);
    return query;
  }

  updateWhere(whereQuery, newValues, options) {
    const values = Utils.cloneJSON(newValues);
    const query = this.updateQuery(whereQuery, values, options);
    if (Table.returnAsQuery(options)) return query;
    return this.fetchUpdateQuery(query, newValues, whereQuery);
  }

  fetchUpdateQuery(query, newValues, whereQuery) {
    return new Promise((resolve, reject) => {
      const idsDefined = whereQuery.id && newValues && newValues.id;
      const idsDiffer = idsDefined && whereQuery.id !== newValues.id;
      if (idsDiffer) return reject(Message.new(400, 'Given Id differ', 'Given Id differ'));
      const getUpdatables = this.find(whereQuery);
      const filterColumns = this.parseAttributesForUpsert(newValues);
      return Promise.all([getUpdatables, filterColumns]).then(() => {
        return resolve(Table.fetchQuery(query));
      }).catch(() => {
        reject(Message.new(400, 'Error: Nothing to update or unexistant column', 'Error: Nothing to update or unexistant column'));
      });
    });
  }


  // ################################################
  // Find (R from CRUD)
  // ################################################
  all(columns, options) {
    return this.find({}, columns, options);
  }

  find(whereQuery, columns, options) {
    if (!options && Utils.isJSON(columns)) {
      options = columns;
      columns = 'all';
    }
    const query = this.findQuery(whereQuery, columns, options);
    if (Table.returnAsQuery(options)) return query;
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
    else {
      query[target] = validOptions;
    }
    return this.find(query, columns, options);
  }


  // ################################################
  // BUILD QUERY
  // ################################################

  static addAdvancedOptions(query, options) {
    if ((typeof options) !== 'object') return query;
    if (options.groupBy) {
      query = Table.addGroupBy(query, options.groupBy);
    }
    query = Table.addOrderByArray(query, options.orderBy);
    if (options.limit) {
      query = Table.addLimit(query, options.limit);
    }
    if (options.offset) {
      query = Table.addOffset(query, options.offset);
    }
    query = Table.addTimeInterval(query, options.startDate, options.endDate);
    return query;
  }

  static addSelect(type, query, columns, options) {
    switch (type) {
      case 'find':
        return Table.addFindSelect(query, columns, options);
      case 'count':
        return Table.addCountSelect(query, options);
      case 'delete':
        return Table.addDelete(query, options);
      default:
        return Table.addFindSelect(query, columns, options);
    }
  }

  static addFindSelect(query, columns, options) {
    options = options || {};
    if (options.rawSelect) {
      query = Table.addRawSelect(query, options.rawSelect);
    }
    if (options.clearSelect || (!Array.isArray(columns) && columns !== 'all')) return query;
    if (!Array.isArray(columns)) columns = '*';
    return query.select(columns);
  }

  static addCountSelect(query, options) {
    options = options || {};
    if (options.rawSelect) {
      query = Table.addRawSelect(query, options.rawSelect);
    }
    if (options.countDistinct) {
      return query.countDistinct(options.countDistinct);
    }
    return query.count();
  }

  static addDelete(query) {
    return query.del().returning('*');
  }

  static addWhere(query, whereQuery, options) {
    options = options || {};
    if ((typeof whereQuery) !== 'object' || whereQuery === null) whereQuery = {};
    const especialQuery = Table.filterSpecialQuery(whereQuery);
    query.where(whereQuery);
    for (let i = 0; i < especialQuery.length; i++) {
      query.andWhere(especialQuery[i][0], especialQuery[i][1], especialQuery[i][2]);
    }
    if (options.rawWhere) {
      query = Table.addRawWhere(query, options.rawWhere);
    }
    return query;
  }

  buildQuery(selectType, whereQuery, columns, options) {
    let query = this.table();
    query = Table.makeQuery(query, selectType, whereQuery, columns, options);
    return query;
  }

  columnsNamesQuery() {
    const query = { table_name: this.table_name };
    return this.knex('information_schema.columns').select('column_name').where(query);
  }

  static filterSpecialQuery(whereQuery) {
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

  static makeQuery(query, selectType, whereQuery, columns, options) {
    Table.addSelect(selectType, query, columns, options);
    query = Table.addWhere(query, whereQuery, options);
    query = Table.addAdvancedOptions(query, options);
    return query;
  }

  // ################################################
  // MISCELANEOUS
  // ################################################

  columnsNames() {
    const f = async () => {
      const query = this.columnsNamesQuery();
      const results = await Table.fetchQuery(query);
      if (!results || results.length === 0) throw new Error(`Hubo un error creando un nuevo objeto: ${this.table_name}`);
      return Table.columnsNamesToArray(results);
    };
    return f();
  }

  getAttributesNames() {
    console.log('WARNING: The method getAttributesNames is deprecated. prefer columnsNames'); // eslint-disable-line no-console
    return this.columnsNames();
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

  filterAttributes(attributes) {
    const f = async () => {
      if (!Utils.isJSON(attributes)) throw new Error(Message.new(400, 'Parameter should be a json', 'Parameter should be a json'));
      const columnsNames = await this.columnsNames();
      if (Table.containsUnexistingProperties(columnsNames, attributes)) throw new Error(Message.new(400, 'Intentando agregar columna inexistente', 'Intentando agregar columna inexistente'));
      return attributes;
    };
    return f();
  }

  filterColumns(columns) {
    const f = async () => {
      if (!Array.isArray(columns)) return [];
      const validColumns = await this.columnsNames();
      return Table.removeUnexistingColumns(validColumns, columns);
    };
    return f();
  }

  parseToSend(entry) { // eslint-disable-line
    return new Promise((resolve) => {
      resolve(entry);
    });
  }


  // ################################################
  // 'Private' methods (static)
  // ################################################


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

  static addTimestamps(attr, isNew) {
    if (!attr) return;
    if (isNew) {
      attr.created_at = new Date();
    }
    attr.updated_at = new Date();
  }

  static addUpdate(query, values) {
    if (!query || !values || !query.update) return query;
    const isNew = false;
    Table.removeUnSetableAttributes(values);
    Table.addTimestamps(values, isNew);
    query.update(values, '*');
    return query;
  }

  static addRawWhere(query, where) {
    if (where) {
      if (Array.isArray(where)) {
        query.where(knex.raw(where[0], where[1]));
      } else {
        query.where(knex.raw(where));
      }
    }
    return query;
  }

  static buildEntryFromColumns(columns) {
    if (!columns) return {};
    const entry = {};
    for (let i = 0; i < columns.length; i++) {
      entry[columns[i]] = null;
    }
    return entry;
  }

  static columnsNamesToArray(input) {
    input = input || [];
    const array = [];
    for (let i = 0; i < input.length; i++) {
      array.push(input[i].column_name);
    }
    return array;
  }

  static containsUnexistingProperties(validProperties, obj) {
    if (!Array.isArray(validProperties) || !Utils.isJSON(obj)) return false;
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      if (validProperties.indexOf(keys[i]) === -1) return true;
    }
    return false;
  }


  static extractColumns(query) {
    if (query.columns) {
      let col = query.columns;
      if (Table.isStringArray(col)) {
        col = JSON.parse(col);
      } else if (typeof col === 'string') {
        col = [col];
      }
      delete query.columns;
      return col;
    }
    return 'all';
  }

  static extractQuery(query) {
    const keys = Object.keys(query);
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      const elem = query[k];
      if (typeof elem === 'string' && (elem.startsWith('[') || elem.startsWith('{'))) {
        query[k] = JSON.parse(elem);
      }
    }
    return query;
  }

  static extractOptions(query, securityMode) {
    const options = {};
    const queryKeys = Object.keys(query);
    for (let i = 0; i < OPTIONS_KEYS.length; i++) {
      const key = OPTIONS_KEYS[i];
      if (queryKeys.indexOf(key) > -1) {
        let elem = query[key];
        if (Table.isStringArray(elem)) {
          elem = JSON.parse(elem);
        }
        options[key] = elem;
        delete query[key];
      }
    }
    if (securityMode) Table.removeRawOptions(options);
    return options;
  }

  static getDefaultKnex() {
    return knex;
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

  static setDefaultKnex(elem) {
    knex = elem;
  }

  static addOrderByArray(query, array) {
    if (!array) return query;
    if (!Array.isArray(array)) { return Table.addOrderBy(query, array); }
    for (let i = 0; i < array.length; i++) {
      const column = array[i];
      if (Array.isArray(column)) Table.addOrderByArray(query, column);
      else {
        const isFinal = i === array.length;
        const hasOrderBy = !isFinal && !Array.isArray(array[i + 1]);
        const order = hasOrderBy ? array[i + 1] : null;
        if (hasOrderBy) i += 1;
        Table.addOrderBy(query, column, order);
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


  static returnAsQuery(options) {
    options = options || {};
    return options.returnAsQuery;
  }


  static removeUnSetableAttributes(attributes) {
    if (!attributes) return;
    delete attributes.id;
    delete attributes.created_at;
    delete attributes.updated_at;
  }

  parseAttributesForUpsert(attributes, isNew) {
    const f = async () => {
      Table.removeUnSetableAttributes(attributes);
      attributes = await this.filterAttributes(attributes);
      if (Utils.isEmptyJSON(attributes)) throw new Error(Message.new(400, 'Parameter should not be empty'));
      Table.addTimestamps(attributes, isNew);
      return attributes;
    };
    return f();
  }

  static makeError(err) {
    const keys400 = Object.keys(ERROR_400);
    if (keys400.indexOf(err) > -1) {
      return Message.new(400, ERROR_400[err], err);
    }
    return Message.new(500, 'Internal error', err);
  }

  static isStringArray(elem) {
    return typeof elem === 'string' && (elem.startsWith('[') || elem.startsWith('{'));
  }


  static mergeRawSelect(rawSelect, input) {
    const q = knex.queryBuilder();
    Table.addRawSelect(q, rawSelect);
    let string = q.toString();
    Table.addRawSelect(q, input);
    string = q.toString();
    string = string.substring(7, string.length);
    return string;
  }

  static removeRawOptions(options) {
    options = options || {};
    for (let i = 0; i < OPTIONS_KEYS.length; i++) {
      if (OPTIONS_KEYS[i].includes('raw')) {
        delete options[OPTIONS_KEYS[i]];
      }
    }
    return options;
  }

  static removeUnexistingColumns(validColumns, array) {
    if (!Array.isArray(validColumns) || !Array.isArray(array)) return [];
    const filtered = [];
    for (let i = 0; i < array.length; i++) {
      const column = array[i];
      if (validColumns.indexOf(column) > -1) {
        filtered.push(column);
      }
    }
    return filtered;
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

const OPTIONS_KEYS = ['startDate', 'endDate', 'groupBy', 'orderBy', 'limit', 'offset', 'rawSelect', 'clearSelect', 'rawWhere'];


module.exports = Table;
