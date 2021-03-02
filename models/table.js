// server/models/table.js


let knex;
const Utils = require('codemaster').utils;
const ChinchayError = require('./chinchayError');

class Table {

  constructor(tableName, givenKnex) {
    this.table_name = tableName;
    this.knex = givenKnex || knex;
    if (!this.knex) throw new Error('Knex param missing.');
    this.INSERT_LIMIT_ARRAY = 1000;
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

  countGroupBy(groupBy, search, options) {
    options = options || {};
    options.groupBy = groupBy;
    return this.count(search, options);
  }

  countIn(target, validOptions, query, options) {
    query = query || {};
    if (Array.isArray(validOptions)) query[target] = ['in', validOptions];
    else {
      query[target] = validOptions;
    }
    return this.count(query, options);
  }

  // ################################################
  // AGGREGATION FUNCTIONS
  // ################################################

  sum(column, search, options) {
    return this.aggregateQuery('sum', column, search, options);
  }

  min(column, search, options) {
    return this.aggregateQuery('min', column, search, options);
  }

  max(column, search, options) {
    return this.aggregateQuery('max', column, search, options);
  }

  static async parseAggregationResult(query) {
    const result = await Table.fetchQuery(query);
    const nonGroupedBy = result.length === 1 && Object.keys(result[0]).length === 1;
    if (nonGroupedBy) {
      const key = Object.keys(result[0])[0];
      return parseInt(result[0][key] || 0, 10);
    }
    return result;
  }

  aggregateQuery(aggregation, column, search, options) {
    options = options || {};
    options.aggregation = aggregation;
    const query = this.buildQuery('aggregate', search, column, options);
    if (Table.returnAsQuery(options)) return query;
    return Table.parseAggregationResult(query);
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
    if (!id) {
      const err = new ChinchayError(new Error('Provide an id to delete'), 'delete_by_id_no_id', 'Method delete by Id needs an id as input');
      if (options && options.returnAsQuery) throw err;
      return Promise.reject(err);
    }
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

  async save(input, batchSize) {
    const copy = Utils.cloneJSON(input);
    if (Array.isArray(copy)) return this.saveBunch(copy, batchSize);
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


  getSubArray(array, i, batchSize = this.INSERT_LIMIT_ARRAY) {
    const initial = batchSize * i;
    const final = Math.min(array.length, (i + 1) * batchSize);
    const result = array.slice(initial, final);
    return result;
  }

  async saveBunch(array, batchSize = this.INSERT_LIMIT_ARRAY) {
    const parsed = Table.parseForSaveArray(array);
    const promises = [];
    const iterations = parsed.length / batchSize;
    for (let i = 0; i < iterations; i++) {
      const subArray = this.getSubArray(parsed, i, batchSize);
      const query = this.saveQuery(subArray);
      promises.push(Table.fetchQuery(query));
    }
    const results = await Promise.all(promises);
    let concatenated = [];
    for (let i = 0; i < results.length; i++) {
      concatenated = concatenated.concat(results[i]);
    }
    return concatenated;

  }

  saveQuery(entry) {
    return this.table().insert(entry).returning('*');
  }

  // ################################################
  // UPDATE
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
        if (entries.length === 0) return reject(new ChinchayError('id solicitado no existe', 'no_entry_for_id'));
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
      query = this.addGroupBy(query, options.groupBy);
    }
    query = this.addOrderByArray(query, options.orderBy);
    if (options.limit) {
      query = this.addLimit(query, options.limit);
    }
    if (options.offset) {
      query = this.addOffset(query, options.offset);
    }
    query = this.addTimeInterval(query, options);
    return query;
  }

  static addSelect(type, query, columns, options) {
    switch (type) {
      case 'find':
        return Table.addFindSelect(query, columns, options);
      case 'count':
        return Table.addCountSelect(query, options);
      case 'aggregate':
        return Table.addAggregateSelect(query, columns, options);
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

  static addAggregateSelect(query, column, options) {
    options = options || {};
    if (options.rawSelect) {
      query = Table.addRawSelect(query, options.rawSelect);
    }
    if (!column) throw new Error('A column should be given to aggregate over');
    if (!options.aggregation) throw new Error('Aggregation option missing');
    return query[options.aggregation](column);
  }

  static addDelete(query) {
    return query.del().returning('*');
  }

  static addWhere(query, search, options) {
    options = options || {};
    if ((typeof search) !== 'object' || search === null) search = {};
    const keys = Object.keys(search);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const value = search[key];
      Table.insertWhere(query, key, value);
    }
    if (options.rawWhere) {
      query = Table.addRawWhere(query, options.rawWhere);
    }
    return query;
  }

  buildQuery(selectType, search, columns, options) {
    let query = this.table();
    query = this.constructor.makeQuery(query, selectType, search, columns, options);
    return query;
  }

  columnsNamesQuery() {
    const query = { table_name: this.table_name };
    return this.knex('information_schema.columns').select('column_name').where(query);
  }

  static insertWhere(query, key, value, operator) {
    if (Table.isComposed(value)) Table.insertComposed(query, key, value);
    else {
      if (value === null) value = ['is', null];
      else if (!Array.isArray(value)) value = ['=', value];
      if (Table.isSpecial(value)) Table.insertSpecial(query, key, value, operator);
    }
  }

  static isComposed(value) {
    const composingOptions = ['and', 'or'];
    return Array.isArray(value) && value.length === 3 && composingOptions.includes(value[1]);
  }

  static isSpecial(value) {
    return Array.isArray(value) && value.length >= 2;
  }

  static insertSpecial(query, key, value, operator) {
    if (operator === 'or') query.orWhere(key, value[0], value[1]);
    else query.andWhere(key, value[0], value[1]);
  }

  static insertComposed(query, key, value) {
    const [first, operator, second] = value;
    const firstSearch = {};
    firstSearch[key] = first;
    const secondSearch = {};
    secondSearch[key] = second;
    query.andWhere(function addComposeSearch() {
      Table.insertWhere(this, key, first);
      Table.insertWhere(this, key, second, operator);
    });
  }

  static makeQuery(query, selectType, search, columns, options) {
    this.addSelect(selectType, query, columns, options);
    query = this.addWhere(query, search, options);
    query = this.addAdvancedOptions(query, options);
    return query;
  }

  // ################################################
  // MISCELLANEOUS
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

  static extractOptions(query, configuration) {
    const options = {};
    const securityMode = Table.getSecurityMode(configuration);
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

  static getSecurityMode(configuration = {}) {
    if (configuration.securityMode === false) return false;
    return true;
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

  static addTimeInterval(query, options, endDate) {
    options = options || {};
    const startDate = typeof options === 'object' && !(options instanceof Date) ? options.startDate : options;
    endDate = options && options.endDate ? options.endDate : endDate;
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
