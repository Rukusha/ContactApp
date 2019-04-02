import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Projects } from '../projects/projects';
import { Partners } from '../partners/partners';
import { Individuals } from '../individuals/individuals';
import { generateAlias } from '../../utils';
import { Roles } from 'meteor/alanning:roles';
import { Emitter, EventsCollection} from '../events/events';


Meteor.methods({
    'eventsProjects.insert'(newProjectLog) {
        const {owner, admin, name, UserWhoIssuedEvent, domain, bio, logo, individuals = []} = newProjectLog;
        //          Event log
        EventsCollection.insert(
                {
                    createdAt: new Date(), // current time
                    alias: generateAlias(name),
                    owner,
                    admin,
                    UserWhoIssuedEvent,
                    name,
                    domain,
                    bio,
                    logo,
                    individuals
                },
                );
    }
});