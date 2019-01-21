import { Partners } from '../../api/partners/partners';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { Users } from '../../api/users/users'; 

var id = Meteor.users.findOne({_id: "ngrCLuKYiRA6gshXM"});
Roles.addUsersToRoles(id._id, ['admin'], 'default-group');


const initialPartners = [
  // {
  //   name: 'SIVECO ROMANIA SA',
  //   alias: 'siveco-romania-sa',
  //   logo: 'siveco-romania-sa.png'
  // },
  // {
  //   name: 'USATGES BCN 21 SL',
  //   alias: 'usatges-bcn-21-sl',
  //   logo: 'usatges-bcn-21-sl.png'
  // },
  // {
  //   name: 'INTU-VIEW LTD',
  //   alias: 'intu-view-ltd',
  //   logo: 'intu-view-ltd.png'
  // },
  // {
  //   name: 'MAVEN SEVEN SOLUTIONS ZARTKORUEN MUKODO RESZVENYTARSASAG',
  //   alias: 'maven-seven-solutions-zartkoruen-mukodo-reszvenytarsasag',
  //   logo: 'maven-seven-solutions-zartkoruen-mukodo-reszvenytarsasag.png'
  // },
  // {
  //   name: 'MALTA INFORMATION TECHNOLOGY LAW ASSOCIATION',
  //   alias: 'malta-information-technology-law-association',
  //   logo: 'malta-information-technology-law-association.png'
  // },
  // {
  //   name: 'INTERDISCIPLINARY CENTER (IDC) HERZLIYA',
  //   alias: 'interdisciplinary-center-herzliya',
  //   logo: 'interdisciplinary-center-herzliya.png'
  // },  
  // {
  //   name: 'EOTVOS LORAND TUDOMANYEGYETEM',
  //   alias: 'eotvos-lorand-tudomanyedyetem',
  //   logo: 'eotvos-lorand-tudomanyedyetem.png'
  // },
  // {
  //   name: 'CITY UNIVERSITY OF LONDON',
  //   alias: 'city-university-of-london',
  //   logo: 'city-university-of-london.png'
  // },
  // {
  //   name: 'BIRMINGHAM CITY UNIVERSITY',
  //   alias: 'birmingham-city-university',
  //   logo: 'birmingham-city-university.png'
  // },
  // {
  //   name: 'MAYOR\'S OFFICE FOR POLICINGAND CRIME',
  //   alias: 'mayors-office-for-policingang-crime',
  //   logo: 'mayors-office-for-policingang-crime.png'
  // },
  // {
  //   name: 'MINISTERE DE L\'INTERIEUR',
  //   alias: 'ministere-de-linterieur',
  //   logo: 'ministere-de-linterieur.png'
  // },
  // {
  //   name: 'SERVICIUL DE PROTECTIE SI PAZA',
  //   alias: 'serviciul-de-protectie-si-paza',
  //   logo: 'serviciul-de-protectie-si-paza.png'
  // },
  // {
  //   name: 'MINISTRY OF PUBLIC SECURITY',
  //   alias: 'ministry-of-public-security',
  //   logo: 'ministry-of-public-security.png'
  // },
  // {
  //   name: 'MINISTERIO DEL INTERIOR',
  //   alias: 'ministerio-del-interior',
  //   logo: 'ministerio-del-interior.png'
  // },
  // {
  //   name: 'SERVICIUL DE PROTECTIE SI PAZA DE STAT',
  //   alias: 'serviciul-de-protectie-si-paza-de-stat',
  //   logo: 'serviciul-de-protectie-si-paza-de-stat.png'
  // },
  // {
  //   name: 'INFORMATION CATALYST FOR ENTERPRISE LTD',
  //   alias: 'information-catalyst-for-enterprise-ltd',
  //   logo: 'information-catalyst-for-enterprise-ltd.png'
  // }
];

initialPartners.forEach(function addPartnerToCollection(partner) {
  const existentPartner = Partners.findOne({ alias: partner.alias});

  if (!existentPartner) {
    Partners.insert(partner);
  }
});
