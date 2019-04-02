import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Projects } from '../projects/projects';
import { Partners } from '../partners/partners';
import { Individuals } from '../individuals/individuals';
import { generateAlias } from '../../utils';
import { Roles } from 'meteor/alanning:roles';
import { Emitter, EventsCreated} from '../events/events';
import { FlowRouter } from 'meteor/kadira:flow-router';


//this function is used to dislay the no access notification to the current user f they dont have access
function restrictother() {
    var showHide = document.getElementById("overNoAccess");
    showHide.style.display = "none";
}
;
//this function is used to dislay the no access notification to the current user f they dont have access
function restrict() {
    var showHide = document.getElementById("overNoAccess");
    showHide.style.display = "block";
}
;
Meteor.methods({
    'projects.insert'(newProject) {
        const {owner, admin, name, domain, bio, logo, individuals = [], partners = []} = newProject;
        if (!Meteor.userId()) {
            restrict();
        }
        var loggedInUser = Meteor.user();
        if ((Roles.userIsInRole(loggedInUser, ['cAdmin'], 'default-group')) || (Roles.userIsInRole(loggedInUser, ['admin'], 'default-group'))) {
//            check(name, String);
//            check(domain, String);
//            check(bio, String);
//            check(logo, String);

            var data = Projects.insert(
                    {
                        createdAt: new Date(), // current time
                        alias: generateAlias(name),
                        owner,
                        admin,
                        name,
                        domain,
                        bio,
                        logo,
                        individuals
                    },
                    );
            Emitter.emit(EventsCreated.ITEM_CREATED, {data, loggedInUser});

            const docs = Partners.findOne({individuals: admin});
//          Updating the Partners collection by adding the individuals Id into it
            Partners.update({_id: docs._id}, {$addToSet: {projects: data}});
        }
    },

//This handles updating the projects name field into the collection
    'projectsName.update'(nameNew, ProjectId) {
        var loggedInUser = Meteor.user();
        const docs = Projects.findOne({_id: ProjectId});

        Projects.update({_id: docs._id}, {$set: {name: nameNew}});
        Emitter.emit(EventsCreated.ITEM_CREATED, {nameNew, loggedInUser, ProjectId});
    },
//This handles updating the projects bio field into the collection
    'projectsBio.update'(bioNew, ProjectIdBio) {
        var loggedInUser = Meteor.user();

        const docs1 = Projects.findOne({_id: ProjectIdBio});

        Projects.update({_id: docs1._id}, {$set: {bio: bioNew}});
        Emitter.emit(EventsCreated.ITEM_CREATED, {bioNew, loggedInUser, ProjectIdBio});
    },
//This handles updating the projects website field into the collection
    'projectsDomain.update'(domainNew, ProjectIdDom) {
        var loggedInUser = Meteor.user();

        const docs2 = Projects.findOne({_id: ProjectIdDom});

        Projects.update({_id: docs2._id}, {$set: {domain: domainNew}});
        Emitter.emit(EventsCreated.ITEM_CREATED, {domainNew, loggedInUser, ProjectIdDom});
    },

//this method is used to dislay the no access notification to the current user if they dont have access
    'projects.restrict'() {
        var showHide = document.getElementById("overNoAccess");
        showHide.style.display = "block";
    },

    'projects.remove'(projectId) {
        if (!Meteor.userId()) {
            restrict();
        }
        var loggedInUser = Meteor.user();
        if ((Roles.userIsInRole(loggedInUser, ['cAdmin'], 'default-group'))) {
            check(projectId, String);
            Projects.remove(projectId);
        }
    }
});