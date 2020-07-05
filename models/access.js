const codemaster = require('codemaster');
const accessToken = require('./middleware/accessToken');

let TheWall;
let UNRESTRICTED_ROLES;
let RESTRICTED_ROLES;


const ADMIN = 'admin';

const bootstrap = (config, thewall) => {
  TheWall = thewall;
  ({ UNRESTRICTED_ROLES, RESTRICTED_ROLES } = config);
  accessToken.bootstrap(thewall);
};

const isAdmin = (user) => {
  if (!user) return false;
  if (user.is_admin) return true;
  if (!user.access) return false;
  for (let i = 0; i < user.access.length; i++) {
    if (user.access[i].role === ADMIN) return true;
  }
  return false;
};

const hasAccessToAll = (user, to) => {
  if (isAdmin(user)) return true;
  if (!user) return false;
  if (user.is_admin) return true;
  if (!user.access) return false;
  const roles = UNRESTRICTED_ROLES[to];
  for (let i = 0; i < user.access.length; i++) {
    if (codemaster.utils.Array.contains(roles, user.access[i].role)) return true;
  }
  return false;
};

const accessiblesIds = (access, to) => {
  if (!access || !to) return [];
  const ids = [];
  const roles = RESTRICTED_ROLES[to];
  for (let i = 0; i < access.length; i++) {
    if (codemaster.utils.Array.contains(roles, access[i].role)) ids.push(access[i].filter);
  }
  return ids;
};

const find = (access) => {
  return TheWall.findAccess(access);
};


const addAccessibleToSearch = (search, access, tableName, key) => {
  if (hasAccessToAll({ access }, tableName)) return search;
  const array = accessiblesIds(access, tableName);
  search = search || {};
  if (!search[key]) {
    search[key] = ['in', array];
    return search;
  }
  if (searchingInArray(search[key])) {
    search[key] = filterEveryElement(search, key, array);
    return search;
  }
  if (array.includes(search[key])) return search;
  search[key] = ['in', []];
  return search;
};

const searchingInArray = (input) => {
  return Array.isArray(input) && input[0] === 'in';
};


const filterEveryElement = (search, key, validIds) => {
  if (!search || !search[key] || !Array.isArray(search[key][1])) return ['in', []];
  validIds = validIds || [];
  const [, array] = search[key];
  const result = [];
  for (let i = 0; i < array.length; i++) {
    const element = array[i];
    if (validIds.includes(element.toString())) result.push(element);
  }
  return ['in', result];
};

const hasAccessTo = (user, to, filterId) => {
  if (!user || !user.access || !to) return false;
  const { access } = user;
  if (hasAccessToAll(user, to)) return true;
  const roles = RESTRICTED_ROLES[to];
  for (let i = 0; i < access.length; i++) {
    if (codemaster.utils.Array.contains(roles, access[i].role)) {
      if (access[i].filter.toString() === filterId.toString()) return true;
    }
  }
  return false;
};

const generateToken = (user) => {
  return accessToken.generate(user);
};


const PUBLIC_METHODS = {
  isAdmin,
  bootstrap,
  hasAccessToAll,
  accessiblesIds,
  find,
  addAccessibleToSearch,
  hasAccessTo,
  generateToken,
};

if (process.env.NODE_ENV === 'test') {
  PUBLIC_METHODS.searchingInArray = searchingInArray;
  PUBLIC_METHODS.filterEveryElement = filterEveryElement;
}


module.exports = PUBLIC_METHODS;
