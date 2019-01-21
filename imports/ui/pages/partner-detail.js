import { Template } from 'meteor/templating';
import { Projects } from '../../api/projects/projects';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { Users } from '../../api/users/users';
import { Partners } from '../../api/partners/partners';
import { Individuals } from '../../api/individuals/individuals';
import { FlowRouter } from 'meteor/kadira:flow-router';
import './partner-detail.html';
import { ReactiveVar } from 'meteor/reactive-var';


Template.PartnerDetails_page.onCreated(function onCreatedPartnerDetailsPage() {
    Template.PartnerDetails_page.helpers({
        projectsAdd() {
            return Projects.find({}, {sort: {name: 1}});
        },
        individualsAdd() {
            return Individuals.find({}, {sort: {name: 1}});
        }
    });

    Meteor.subscribe('projects');
    Meteor.subscribe('partners');
    Meteor.subscribe('individuals');
    Meteor.subscribe('users');

    this.availableProjects = new ReactiveVar([]);
    this.availableIndividuals = new ReactiveVar([]);
    this.selectedProjects = new ReactiveVar([]);
    this.selectedIndividuals = new ReactiveVar([]);
    this.autorun(() => {

        const projects = Projects.find({}, {
            fields: {_id: 1, name: 1},
            sort: {alias: 1}
        }).fetch();
        this.availableProjects.set(projects);
        this.selectedProjects.set([]);
        const individuals = Individuals.find({}, {
            fields: {name: 1},
            sort: {name: 1}
        }).fetch();
        this.availableIndividuals.set(individuals);
        this.selectedIndividuals.set([]);
    });

    Template.PartnerDetails_page.helpers({
        getAvailableProjects() {
            return Template.instance().availableProjects.get();
        },
        getSeletedProjects() {
            return Template.instance().selectedProjects.get();
        },
        getAvailableIndividuals() {
            return Template.instance().availableIndividuals.get();
        },
        getSeletedIndividuals() {
            return Template.instance().selectedIndividuals.get();
        }
    });
    Template.PartnerDetails_page.events({
        'click .individualAdd'() {
//            checks to make sure a user is logged in
            if (!Meteor.userId()) {
                throw new Meteor.Error('not-authorized');
            }
//            checks to make sure a user is logged in on an admin account
            var loggedInUser = Meteor.user();
            if (Roles.userIsInRole(loggedInUser, ['admin'], 'default-group')) {
//                Finds the appropriate partner Id
                const partnerId = FlowRouter.getParam('partnerId');
//                sets the the value to the Id of the project
                var name = $(this).attr('_id');
//                finds the partner with a matching id
                var doc = Partners.findOne({_id: partnerId});
//                updates the entry
                Partners.update({_id: doc._id}, {$addToSet: {individuals: name}});

                console.log("individual has been added to partner");
                var showHide = document.getElementById("addPeople");
                showHide.style.display = "none";
                var showHide = document.getElementById("employees");
                showHide.style.display = "block";
                var showHide = document.getElementById("projectList");
                showHide.style.display = "none";
                
            } else {
                console.log("cant add individual Not Authorized");

            }
        }
    });
    Template.PartnerDetails_page.events({
        'click .projectAdd'() {
//            checks to make sure a user is logged in
            if (!Meteor.userId()) {
                throw new Meteor.Error('not-authorized');
            }
//            checks to make sure a user is logged in on an admin account
            var loggedInUser = Meteor.user();
            if (Roles.userIsInRole(loggedInUser, ['admin'], 'default-group')) {
//                Finds the appropriate partner Id
                const partnerId = FlowRouter.getParam('partnerId');
//                sets the the value to the Id of the project
                var name = $(this).attr('_id');
//                finds the partner with a matching id
                var doc = Partners.findOne({_id: partnerId});
//                updates the entry
                Partners.update({_id: doc._id}, {$addToSet: {projects: name}});
                console.log("Project has been added to partner");
                var showHide = document.getElementById("addProject");
                showHide.style.display = "none";
                var showHide = document.getElementById("projectList");
                showHide.style.display = "block";
                var showHide = document.getElementById("employees");
                showHide.style.display = "none";
                
            } else {
                console.log("cant add project Not Authorized");
            }
        },
        'click .tabProject'() {
            var showHide = document.getElementById("projectList");
            if (showHide.style.display === "block") {
                showHide.style.display = "none";
            } else {
                showHide.style.display = "block";
            }
             var showHide = document.getElementById("employees");
             showHide.style.display = "none";
        },
        'click .tabIndividual'() {
            var showHide = document.getElementById("employees");
            if (showHide.style.display === "block") {
                showHide.style.display = "none";
            } else {
                showHide.style.display = "block";
            }
             var showHide = document.getElementById("projectList");
                showHide.style.display = "none";
        },
        'click .addP'() {
            var showHide = document.getElementById("addProject");
            if (showHide.style.display === "block") {
                showHide.style.display = "none";
            } else {
                showHide.style.display = "block";
            }
        },
        'click .addPeople'() {
            var showHide = document.getElementById("addPeople");
            if (showHide.style.display === "block") {
                showHide.style.display = "none";
            } else {
                showHide.style.display = "block";
            }
        },
        'click .remove'() {
            const partnerId = FlowRouter.getParam('partnerId');
            if (!Meteor.userId()) {
                throw new Meteor.Error('not-authorized');
            }
            var loggedInUser = Meteor.user();
            if (Roles.userIsInRole(loggedInUser, ['admin'], 'default-group')) {
                console.log("Partner has been removed");
                Partners.remove(partnerId);
                FlowRouter.go('PartnerList.show');
            } else {
                console.log("cant remove Not Authorized");
            }
        },
        'click .edit'() {
            const partnerId = FlowRouter.getParam('partnerId');
            if (!Meteor.userId()) {
                throw new Meteor.Error('not-authorized');
            }
            var loggedInUser = Meteor.user();
            if (Roles.userIsInRole(loggedInUser, ['admin'], 'default-group')) {
                FlowRouter.go('PartnerEditDetails.edit', {partnerId: partnerId});
            } else {
                console.log("Access restricted");
            }
        }
    }
    );

    Template.PartnerDetails_page.helpers({
        'click .card.partner'(event) {

            // Prevent default browser form submit
            event.preventDefault();
            event.stopPropagation();
            // Go to the partner detail page
            FlowRouter.go('PartnerEditDetails.edit', {partnerId: this._id.valueOf()});
        },
        partner() {
            const partnerId = FlowRouter.getParam('partnerId');
            return Partners.findOne({_id: partnerId});
        },
//  gets the projects that the partner is connected with
        hasProjects() {
            const partnerId = FlowRouter.getParam('partnerId');
            const partner = Partners.findOne({_id: partnerId});
            const projectIds = partner.projects || [];
            return !!projectIds.length;
        },
        projects() {
            const partnerId = FlowRouter.getParam('partnerId');
            const partner = Partners.findOne({_id: partnerId});
            const projectIds = partner.projects || [];
            return Projects.find({_id: {$in: projectIds}});
        },
        hasIndividual() {
            const partnerId = FlowRouter.getParam('partnerId');
            const partner = Partners.findOne({_id: partnerId});
            const individualsIds = partner.individuals || [];
            return !!individualsIds.length;
        },
        individuals() {
            const partnerId = FlowRouter.getParam('partnerId');
            const partner = Partners.findOne({_id: partnerId});
            const individualsIds = partner.individuals || [];
            return Individuals.find({_id: {$in: individualsIds}});
        }
    });
});