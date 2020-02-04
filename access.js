const UNRESTRICTED_ROLES = {
  places: ['admin', 'placesAdmin', 'allPlacesReader'],
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
  UNRESTRICTED_ROLES,
  RESTRICTED_ROLES,
};
