export enum SystemUserGroupNames {
  SmallBusiness = 'Small Business',
  // DKG - this is "PayFactors Services" in the DB (stage + prod) so you must use .toLower() or similar when making comparisons
  PayfactorsServices = 'Payfactors Services',
  PeerOnly = 'Peer Only',
  SmallBusinessPaid = 'Small Business - Paid'
}
