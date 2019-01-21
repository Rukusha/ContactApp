import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Partners } from '../partners/partners';
import { Projects } from '../projects/projects';
import { Individuals } from '../individuals/individuals';
import { generateAlias } from '../../utils';

Meteor.methods({
  'partners.insert'(newPartner) {
    const { name, logo, bio, projects = [], individuals = [] } = newPartner;
    
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

//    check(name, String);
//    check(logo, String);
//    check(bio, String);
//    check(projects, Array);
 
    Partners.insert(
      {
        createdAt: new Date(), // current time
        alias: generateAlias(name),
        name,
        logo,
        bio,
        projects,
        individuals
      },
      (error, partnerId) => {
        Projects.update({ _id: { $in: projects }}, { $addToSet: { partners: partnerId } }, { multi: true });
        Individuals.update({ _id: { $in: projects }}, { $addToSet: { partners: partnerId } }, { multi: true });

        }
    );
  },
  'partners.update'(updatedPartner) {
    const { name, logo, bio, projects = [], individuals = [] } = updatedPartner;
    // Make sure the user is logged in before inserting a task
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
    Partners.update(
      {
        createdAt: new Date(), // current time
//        alias: generateAlias(name),
        name,
        logo,
        bio,
        projects,
        individuals
      },
      (error, partnerId) => {
        Projects.update({ _id: { $in: projects }}, { $addToSet: { partners: partnerId } }, { multi: true });
        Individuals.update({ _id: { $in: projects }}, { $addToSet: { partners: partnerId } }, { multi: true });

        }
    );  },
  'partners.remove'(partnerId) {
    check(partnerId, String);
    Partners.remove(partnerId);
  }
});