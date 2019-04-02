import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Projects } from '../projects/projects';
import { Users } from '../users/users';
import { Individuals } from '../individuals/individuals';

Meteor.methods({
    'individuals.insert'(newIndividuals) {
        const {id_, names, owner, bio, position, linkedIn, skype, telephone, logo, individuals = [], projects = []} = newIndividuals;

        if (!Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }
//        check(names, String);
//        check(position, String);
//        check(bio, String);
//        check(logo, String);
        Individuals.insert(
                {
                    createdAt: new Date(), // current time
                    id_,
                    names,
                    owner,
                    logo,
                    bio,
                    position,
                    linkedIn,
                    skype,
                    telephone,
                    projects
                },
        );
    },
    'individuals.update'(updatedIndividuals) {
        const {name, bio, position, linkedIn, skype, telephone, logo, individuals = [], projects = []} = updatedIndividuals;
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
                    bio,
                    position,
                    linkedIn,
                    skype,
                    telephone,
                    individuals,
                    projects
                },
                );
    }
});
