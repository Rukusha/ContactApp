import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Partners } from '../partners/partners';
import { Projects } from '../projects/projects';
import { Users } from '../users/users';
import { Individuals } from '../individuals/individuals';

Meteor.methods({
  'individuals.insert'(newIndividuals) {
    const { name, bio, position, linkedIn, skype, telephone, logo } = newIndividuals;
    
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
    Individuals.insert(
      {
        createdAt: new Date(), // current time
        name,
        logo,
        bio,
        position,
        linkedIn,
        skype,
        telephone
      },
            (error, IndividualsId) => {
        Individuals.update({ _id: { $in: Individuals }}, { $addToSet: { Individuals: IndividualsId } }, { multi: true });
      }
    );
  },
  'individuals.update'(updatedIndividuals) {
    const { name, logo, bio } = updatedIndividuals;
    // Make sure the user is logged in before inserting a task
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
    Individuals.update(
      {
        createdAt: new Date(), // current time
//        alias: generateAlias(name),
        name,
        logo,
        bio
      },
    );  
  }
});
