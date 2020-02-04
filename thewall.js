const config = require('./config/thewall');
// eslint-disable-next-line import/order
const Thewall = require('thewall')(config);

const UNRESTRICTED_ROLES = {
  places: [ADMIN, 'placesAdmin', 'allPlacesReader'],
};

const RESTRICTED_ROLES = {
  places: ['venueOwner'],
  leads: ['sponsorOwner'],
  sponsorship: ['sponsorOwner'],
  impressions: ['sponsorOwner'],
  interactions: ['sponsorOwner'],
  person_info: ['sponsorOwner'],
};

module.exports = {
  Thewall,
  UNRESTRICTED_ROLES,
  RESTRICTED_ROLES,
};
