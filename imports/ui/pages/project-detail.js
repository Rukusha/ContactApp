import { Template } from 'meteor/templating';
import { Projects } from '../../api/projects/projects';
import { Partners } from '../../api/partners/partners';
import { Individuals } from '../../api/individuals/individuals';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Meteor }  from 'meteor/meteor';
import { Roles }  from 'meteor/alanning:roles';
import './project-detail.html';
import { ReactiveVar } from 'meteor/reactive-var';



Template.ProjectDetail_page.onCreated(function onCreatedProjectDetailPage() {
    Template.ProjectDetail_page.helpers({
        projectsAdd() {
            return Partners.find({}, {sort: {name: 1}});
        },
        individualsAdd() {
            return Individuals.find({}, {sort: {name: 1}});
        }
    });
    Meteor.subscribe('projects');
    Meteor.subscribe('partners');
    Meteor.subscribe('individuals');

    this.availableProjects = new ReactiveVar([]);
    this.availableIndividuals = new ReactiveVar([]);
    this.selectedProjects = new ReactiveVar([]);
    this.selectedIndividuals = new ReactiveVar([]);
    this.autorun(() => {

        const projects = Partners.find({}, {
            fields: {_id: 1, name: 1},
            sort: {name: 1}
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

    Template.ProjectDetail_page.helpers({
        getAvailablePartners() {
            return Template.instance().availableProjects.get();
        },
        getSeletedPartners() {
            return Template.instance().selectedProjects.get();
        },
        getAvailableIndividuals() {
            return Template.instance().availableIndividuals.get();
        },
        getSeletedIndividuals() {
            return Template.instance().selectedIndividuals.get();
        }
    });
    Template.ProjectDetail_page.events({
        'click .individualAdd'() {
//            checks to make sure a user is logged in
            if (!Meteor.userId()) {
                throw new Meteor.Error('not-authorized');
            }
//            checks to make sure a user is logged in on an admin account
            var loggedInUser = Meteor.user();
            if (Roles.userIsInRole(loggedInUser, ['admin'], 'default-group')) {
//                Finds the appropriate project Id
                const partnerId = FlowRouter.getParam('projectId');
//                sets the the value to the Id of the project
                var name = $(this).attr('_id');
//                finds the project with a matching id
                var doc = Projects.findOne({_id: partnerId});
//                updates the entry
                Projects.update({_id: doc._id}, {$addToSet: {individuals: name}});

                console.log("individual has been added to projects");
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
    Template.ProjectDetail_page.events({
        'click .projectAdd'() {
//            checks to make sure a user is logged in
            if (!Meteor.userId()) {
                throw new Meteor.Error('not-authorized');
            }
//            checks to make sure a user is logged in on an admin account
            var loggedInUser = Meteor.user();
            if (Roles.userIsInRole(loggedInUser, ['admin'], 'default-group')) {
//                Finds the appropriate partner Id
                const partnerId = FlowRouter.getParam('projectId');
//                sets the the value to the Id of the partner
                var name = $(this).attr('_id');
//                finds the partner with a matching id
                var doc = Partners.findOne({_id: name});
//                updates the entry
                Partners.update({_id: doc._id}, {$addToSet: {projects: partnerId}});
                console.log("Project has been added to project");
                var showHide = document.getElementById("addProject");
                showHide.style.display = "none";
                var showHide = document.getElementById("projectList");
                showHide.style.display = "block";
                var showHide = document.getElementById("employees");
                showHide.style.display = "none";

            } else {
                console.log("cant add partner Not Authorized");
            }
        },
    });
    Template.ProjectDetail_page.events({
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
            if (!Meteor.userId()) {
                throw new Meteor.Error('not-authorized');
            }
            var loggedInUser = Meteor.user();
            if (Roles.userIsInRole(loggedInUser, ['admin'], 'default-group')) {
                const projectId = FlowRouter.getParam('projectId');
                console.log("Project has been removed");
                Projects.remove(projectId);
                FlowRouter.go('ProjectList.show');
            } else {
                console.log("Access restricted");
            }
        },
        'click .edit'() {
            if (!Meteor.userId()) {
                throw new Meteor.Error('not-authorized');
            }
            var loggedInUser = Meteor.user();
            if (Roles.userIsInRole(loggedInUser, ['admin'], 'default-group')) {
                const projectId = FlowRouter.getParam('projectId');
                FlowRouter.go('ProjectsDetailsEdit.edit', {projectId: projectId});
            } else {
                console.log("Access restricted");
            }
        }
    });
    Template.ProjectDetail_page.helpers({
        project() {
            const projectId = FlowRouter.getParam('projectId');
            return Projects.findOne({_id: projectId});
        },
        hasPartners() {
            const projectId = FlowRouter.getParam('projectId');
            const partner = Partners.findOne({projects: projectId});
            const partnerIds = partner.projects || [];

            return !!partnerIds.length;
        },
        partners() {
            const projectId = FlowRouter.getParam('projectId');
            const partner = Partners.findOne({projects: projectId});
            const partnerIds = partner.projects || [];

            return Partners.find({projects: {$in: partnerIds}});
        },
        hasIndividual() {
            const partnerId = FlowRouter.getParam('projectId');
            const partner = Projects.findOne({_id: partnerId});
            const individualsIds = partner.individuals || [];

            return !!individualsIds.length;
        },
        individuals() {
            const partnerId = FlowRouter.getParam('projectId');
            const partner = Projects.findOne({_id: partnerId});
            const individualsIds = partner.individuals || [];
            return Individuals.find({_id: {$in: individualsIds}});
        }
    });

    Template.ProjectDetail_page.helpers({
        projects() {
            return Projects.find({}, {sort: {name: 1}});
        }
    });
});
