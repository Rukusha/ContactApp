import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Projects } from '../projects/projects';
import { Partners } from '../partners/partners';
import { Individuals } from '../individuals/individuals';
import { generateAlias } from '../../utils';
import { Roles } from 'meteor/alanning:roles';
import { Emitter, Events} from '../events/events';
import { EventsCollection } from '../events/events';

Meteor.methods({
//    Creates a bus for the insert of a project
    createBusServiceProject: function (busService) {
        if (!busService.name) {
            throw new Meteor.Error("Name field cannot be empty");
        }
        if (!busService.domain) {
            throw new Meteor.Error("Website field cannot be empty");
        }
        if (!busService.logo) {
            throw new Meteor.Error("Logo field cannot be empty");
        }
        if (!busService.bio) {
            throw new Meteor.Error("Description field cannot be empty");
        }
        if (!busService.admin) {
            throw new Meteor.Error("Admin field cannot be empty");
        }
        busService.createdAt = new Date();
        busService.updatedAt = null;
        EventsCollection.insert(busService);
    },
//    Creates a bus for the updating of a project name
    updateNameBusServiceProject: function (busServiceUpdateName) {
        if (!busServiceUpdateName.nameNew) {
            throw new Meteor.Error("Name field cannot be empty");
        }
        busServiceUpdateName.updatedAt = new Date();
        ;
        EventsCollection.insert(busServiceUpdateName);
    },
    updateDomBusServiceProject: function (busServiceUpdateDomain) {
        if (!busServiceUpdateDomain.domain) {
            throw new Meteor.Error("Website field cannot be empty");
        }
        busServiceUpdateDomain.updatedAt = new Date();
        ;
        EventsCollection.insert(busServiceUpdateDomain);
    },
    updateLogoBusServiceProject: function (busServiceUpdateLogo) {
        if (!busServiceUpdateLogo.logo) {
            throw new Meteor.Error("Logo field cannot be empty");
        }
        busServiceUpdateLogo.updatedAt = new Date();
        ;
        EventsCollection.insert(busServiceUpdateLogo);
    },
    updateBioBusServiceProject: function (busServiceUpdateBio) {
        if (!busServiceUpdateBio.bio) {
            throw new Meteor.Error("Description field cannot be empty");
        }
        busServiceUpdateBio.updatedAt = new Date();
        ;
        EventsCollection.insert(busServiceUpdateBio);
    },

    createBusServicePartner: function (busServicePartner) {
        if (!busServicePartner.name) {
            throw new Meteor.Error("Name field cannot be empty");
        }
        if (!busServicePartner.logo) {
            throw new Meteor.Error("Logo field cannot be empty");
        }
        if (!busServicePartner.bio) {
            throw new Meteor.Error("Description field cannot be empty");
        }
        if (!busServicePartner.owner) {
            throw new Meteor.Error("Admin field cannot be empty");
        }
        busServicePartner.createdAt = new Date();
        busServicePartner.updatedAt = null;
        EventsCollection.insert(busServicePartner);
    },

    createBusServiceIndividual: function (busServiceIndividual) {
        if (!busServiceIndividual.name) {
            throw new Meteor.Error("Name field cannot be empty");
        }
        if (!busServiceIndividual.logo) {
            throw new Meteor.Error("Logo field cannot be empty");
        }
        if (!busServiceIndividual.bio) {
            throw new Meteor.Error("Description field cannot be empty");
        }
        if (!busServiceIndividual.linkedin) {
            throw new Meteor.Error("LinkedIn field cannot be empty");
        }
        if (!busServiceIndividual.telephone) {
            throw new Meteor.Error("Telephone field cannot be empty");
        }
        if (!busServiceIndividual.skype) {
            throw new Meteor.Error("Skype field cannot be empty");
        }
        if (!busServiceIndividual.position) {
            throw new Meteor.Error("Position field cannot be empty");
        }
        busServiceIndividual.createdAt = new Date();
        busServiceIndividual.updatedAt = null;
        EventsCollection.insert(busServiceIndividual);
    }
});
