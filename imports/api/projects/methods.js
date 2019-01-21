import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Projects } from './projects';
import { Partners } from '../partners/partners';
import { Individuals } from '../individuals/individuals';
import { generateAlias } from '../../utils';

Meteor.methods({
  'projects.insert'(newProject) {
    const { owner, name, domain, bio, logo, individuals = [], partners } = newProject;

    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
    check(name, String);
    check(domain, String);
    check(bio, String);
    check(logo, String);

    Projects.insert(
      {
        createdAt: new Date(), // current time
        alias: generateAlias(name),
        owner,
        name,
        domain,
        bio,
        logo,
        individuals
      },
    );
  },
  'projects.remove'(projectId) {
      if (!Meteor.userId()) {
         throw new Meteor.Error('not-authorized');
    }
    check(projectId, String);
    Projects.remove(projectId);
  }
});