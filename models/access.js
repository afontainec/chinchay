const codemaster = require('codemaster');

let TheWall;
let UNRESTRICTED_ROLES;
let RESTRICTED_ROLES;


const ADMIN = 'admin';

const bootstrap = (config, thewall) => {
  TheWall = thewall;
  ({ UNRESTRICTED_ROLES, RESTRICTED_ROLES } = config);
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
  if (array.includes(search[key])) return search;
  search[key] = ['in', []];
  return search;
};


module.exports = {
  isAdmin,
  bootstrap,
  hasAccessToAll,
  accessiblesIds,
  find,
  addAccessibleToSearch,
};
