// server/models/table.js


let knex;
const Utils = require('codemaster').utils;
const ChinchayError = require('./chinchayError');

class Table {

  constructor(tableName, givenKnex) {
    this.table_name = tableName;
    this.knex = givenKnex || knex;
    if (!this.knex) throw new Error('Knex param missing.');
    this.INSERT_LIMIT_ARRAY = 10000;
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

  count(search, options) {
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
    const query = this.countQuery(search, options);
    if (Table.returnAsQuery(options)) return query;
    return f(query, groupBy);
  }

  countQuery(search, options) {
    return this.buildQuery('count', search, 'all', options);
  }

  // // TODO: USE ADD WHERE AND ADD ADVANCE TO DO THIS QUERY
  countGroupBy(groupBy, search, columns, options) {
    options = options || {};
    options.groupBy = groupBy;
    return this.count(search, columns, options);
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
  // SUM
  // ################################################

  sum(column, search, options) {
    const query = this.sumQuery(column, search, options);
    if (Table.returnAsQuery(options)) return query;
    return Table.parseSumResult(query);
  }

  static async parseSumResult(query) {
    const result = await Table.fetchQuery(query);
    const nonGroupedBy = result.length === 1 && Object.keys(result[0]).length === 1;
    if (nonGroupedBy) {
      const key = Object.keys(result[0])[0];
      return parseInt(result[0][key] || 0, 10);
    }
    return result;
  }

  sumQuery(column, search, options) {
    return this.buildQuery('sum', search, column, options);
  }

  // ################################################
  // DELETE
  // ################################################
  delete(input, options) {
    if (typeof input !== 'object') return this.deleteById(input, options);
    const search = input;
    const query = this.deleteWhere(search, options);
    if (Table.returnAsQuery(options)) return query;
    return Table.fetchQuery(query);
  }


  deleteWhere(search, options) {
    const query = this.deleteQuery(search, options);
    return query;
  }

  deleteById(id, options) {
    const search = { id };
    const query = this.delete(search, options);
    if (Table.returnAsQuery(options)) return query;
    return new Promise((resolve, reject) => {
      query.then((results) => { resolve(results[0]); }).catch((err) => { reject(err); });
    });
  }

  deleteQuery(search, options) {
    return this.buildQuery('delete', search, 'all', options);
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

  // save(originalEntry) {
  //   const errorString = 'Something went wrong';
  //   const f = async () => {
  //     const entry = Utils.cloneJSON(originalEntry);
  //     const isSave = true;
  //     const parsed = await this.parseAttributesForUpsert(entry, isSave);
  //     const query = this.saveQuery(parsed);
  //     const saved = await Table.fetchQuery(query);
  //     if (!saved || saved.length === 0) throw new Error(errorString);
  //     return saved[0];
  //   };
  //   return f();
  // }

  async save(input) {
    const copy = Utils.cloneJSON(input);
    if (Array.isArray(copy)) return this.saveBunch(copy);
    const parsed = Table.parseForSave(copy);
    const query = this.saveQuery(parsed);
    const [saved] = await Table.fetchQuery(query);
    return saved;
  }

  static parseForSaveArray(array) {
    array = array || [];
    const parsed = [];
    for (let i = 0; i < array.length; i++) {
      const element = array[i];
      parsed.push(Table.parseForSave(element));
    }
    return parsed;
  }

  // getSubArray(i, array) {
  //   const copy = [...array];
  //   const initial = this.INSERT_LIMIT_ARRAY * i;
  //   // const final = i < iterations - 1 ? initial + this.INSERT_LIMIT_ARRAY : array.length;
  //   const final = Math.min(initial + this.INSERT_LIMIT_ARRAY, copy.length);
  //   const result = copy.splice(initial, final);
  //   return result;
  // }

  getSubArray(i, iterations, array) {
    const initial = this.INSERT_LIMIT_ARRAY * i;
    const final = i < iterations - 1 ? initial + this.INSERT_LIMIT_ARRAY : array.length;
    const result = array.slice(initial, final);
    return result;
  }

  saveBunch(array) {
    const parsed = Table.parseForSaveArray(array);
    const promises = [];
    const iterations = parsed.length / this.INSERT_LIMIT_ARRAY;
    for (let i = 0; i < iterations; i++) {
      const subArray = this.getSubArray(i, iterations, parsed);
      const query = this.saveQuery(subArray);
      promises.push(Table.fetchQuery(query));
    }
    return Utils.Promise.doAll(promises);
  }

  saveQuery(entry) {
    return this.table().insert(entry).returning('*');
  }

  // ################################################
  // UDATE
  // ################################################

  update(input, newValues, options) {
    if (typeof input !== 'object') return this.updateById(input, newValues, options);
    const search = input;
    const query = this.updateWhere(search, newValues, options);
    if (Table.returnAsQuery(options)) return query;
    return this.fetchUpdateQuery(query, newValues, search);
  }

  updateById(id, newValues, options) {
    const search = { id };
    const query = this.update(search, newValues, options);
    if (Table.returnAsQuery(options)) return query;
    return new Promise((resolve, reject) => {
      query.then((results) => { resolve(results[0]); }).catch((err) => { reject(err); });
    });
  }

  updateQuery(search, values, options) {
    let query = this.table();
    query = Table.addUpdate(query, values);
    query = Table.addWhere(query, search, options);
    query = Table.addAdvancedOptions(query, options);
    return query;
  }

  updateWhere(search, newValues, options) {
    const values = Utils.cloneJSON(newValues);
    const query = this.updateQuery(search, values, options);
    return query;
  }

  fetchUpdateQuery(query, newValues, search) {
    return new Promise((resolve, reject) => {
      const idsDefined = search.id && newValues && newValues.id;
      const idsDiffer = idsDefined && search.id !== newValues.id;
      if (idsDiffer) return reject(Table.IdDifferError());
      const getUpdatables = this.find(search);
      const filterColumns = this.parseAttributesForUpsert(newValues);
      return Promise.all([getUpdatables, filterColumns]).then(() => {
        return resolve(Table.fetchQuery(query));
      }).catch((err) => {
        err.code = 'empty_update';
        err = Table.makeError(err);
        reject(err);
      });
    });
  }

  static IdDifferError() {
    return new ChinchayError(new Error('Given ID differ'), 'given_id_differ');
  }


  // ################################################
  // Find (R from CRUD)
  // ################################################
  all(columns, options) {
    return this.find({}, columns, options);
  }

  find(search, columns, options) {
    if (!options && Utils.isJSON(columns)) {
      options = columns;
      columns = 'all';
    }
    const query = this.findQuery(search, columns, options);
    if (Table.returnAsQuery(options)) return query;
    return Table.fetchQuery(query);
  }

  findQuery(search, columns, options) {
    return this.buildQuery('find', search, columns, options);
  }

  findById(id, columns, options) {
    const search = {};
    search.id = id;
    return new Promise((resolve, reject) => {
      this.find(search, columns, options).then((entries) => {
        if (entries.length === 0) {
          const error = new Error('Id solicitado no existe');
          error.code = 'unexistantID';
          return reject(Table.makeError(error));
        }
        return resolve(entries[0]);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  async arrayOfIds(search, options) {
    const result = await this.find(search, ['id'], options);
    const array = [];
    for (let i = 0; i < result.length; i++) {
      const element = result[i];
      array.push(element.id);
    }
    return array;
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
      case 'sum':
        return Table.addSumSelect(query, columns, options);
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

  static addSumSelect(query, column, options) {
    options = options || {};
    if (options.rawSelect) {
      query = Table.addRawSelect(query, options.rawSelect);
    }
    if (!column) throw new Error('A column should be given to sum over');
    return query.sum(column);
  }

  static addDelete(query) {
    return query.del().returning('*');
  }

  static addWhere(query, search, options) {
    options = options || {};
    if ((typeof search) !== 'object' || search === null) search = {};
    const especialQuery = Table.filterSpecialQuery(search);
    query.where(search);
    for (let i = 0; i < especialQuery.length; i++) {
      query.andWhere(especialQuery[i][0], especialQuery[i][1], especialQuery[i][2]);
    }
    if (options.rawWhere) {
      query = Table.addRawWhere(query, options.rawWhere);
    }
    return query;
  }

  buildQuery(selectType, search, columns, options) {
    let query = this.table();
    query = Table.makeQuery(query, selectType, search, columns, options);
    return query;
  }

  columnsNamesQuery() {
    const query = { table_name: this.table_name };
    return this.knex('information_schema.columns').select('column_name').where(query);
  }

  static filterSpecialQuery(search) {
    const keys = Object.keys(search);
    const especialQuery = [];
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const elem = search[key];
      if (Array.isArray(elem)) {
        if (elem.length >= 2) especialQuery.push([key, elem[0], elem[1]]);
        delete search[key];
      }
    }
    return especialQuery;
  }

  static makeQuery(query, selectType, search, columns, options) {
    Table.addSelect(selectType, query, columns, options);
    query = Table.addWhere(query, search, options);
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
  async getFirstDate(search, options) {
    options = options || {};
    options.limit = 1;
    options.orderBy = ['created_at', 'asc'];
    options.returnAsQuery = true;
    const result = await this.find(search, ['created_at'], options);
    return result[0] ? result[0].created_at : undefined;
  }

  filterAttributes(attributes) {
    const f = async () => {
      if (!Utils.isJSON(attributes)) throw new Error('Parameter should be a json');
      const columnsNames = await this.columnsNames();
      if (Table.containsUnexistingProperties(columnsNames, attributes)) throw new Error('Intentando agregar columna inexistente');
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
    console.log('warning:', 'prefer extractSeach. extractQuery is deprecated and will be removed in future versions.');
    return Table.extractSearch(query);
  }

  static extractSearch(query) {
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
        reject(Table.makeError(err));
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
      if (Utils.isEmptyJSON(attributes)) throw new Error('Parameter should not be empty');
      Table.addTimestamps(attributes, isNew);
      return attributes;
    };
    return f();
  }

  static parseForSave(entry) {
    Table.removeUnSetableAttributes(entry);
    Table.addTimestamps(entry, true);
    return entry;
  }

  static makeError(err) { // Support for previous versions
    err = err || new Error('Unknown error');
    if (err.chinchayCode) return err;
    const message = Table.getMessage(err);
    err = message ? Table.error400(err, message) : Table.error500(err);
    return err;
  }

  static error400(err, message) {
    Table.setCode(err, 400);
    err.message = message;
    err.fullMessage = Table.cloneError(err);
    return err;
  }

  static error500(err) {
    Table.setCode(err, 500);
    err.message = 'Internal Error';
    err.fullMessage = Table.cloneError(err);
    return err;
  }

  static cloneError(error) {
    let { stack } = error;
    stack = stack.replace('error: error:', 'error:');
    let clone = new Error(stack);
    clone = Object.assign(clone, error);
    return clone;
  }

  // this method redefine de error code in several ways to support previous versions
  static setCode(err, code) {
    err.postgresCode = err.code;
    err.chinchayCode = err.code;
    err.code = code;
    err.suggestedHTTPCode = code;
  }

  static getMessage(err) {
    if (!err) return null;
    return ERROR_400_BY_CODE[err.code] || ERROR_400[err.routine];
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

const ERROR_400_BY_CODE = {
  42703: 'Intentando de agregar columna inexistent',

};

const OPTIONS_KEYS = ['startDate', 'endDate', 'groupBy', 'orderBy', 'limit', 'offset', 'rawSelect', 'clearSelect', 'rawWhere', 'countDistinct'];


module.exports = Table;
