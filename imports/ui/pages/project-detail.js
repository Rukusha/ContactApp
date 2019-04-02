import { Template } from 'meteor/templating';
import { Projects } from '../../api/projects/projects';
import { Partners } from '../../api/partners/partners';
import { Individuals } from '../../api/individuals/individuals';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Meteor }  from 'meteor/meteor';
import { Roles }  from 'meteor/alanning:roles';
import './project-detail.html';
import { ReactiveVar } from 'meteor/reactive-var';

//this function is used to dislay the no access notification to the current user f they dont have access
function restrict() {
    var showHide = document.getElementById("overNoAccess");
    showHide.style.display = "block";
};

Template.ProjectDetail_page.onCreated(function onCreatedProjectDetailPage() {
    Meteor.subscribe('projects');
    Meteor.subscribe('partners');
    Meteor.subscribe('individuals');

    const project = FlowRouter.getParam('projectId');
    const projectObject = Projects.findOne({_id: project});
    const adminCheck = projectObject.admin;

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
        projectsAdd() {
            return Partners.find({}, {sort: {name: 1}});
        },
        individualsAdd() {
            return Individuals.find({}, {sort: {name: 1}});

        }
    });
    Template.ProjectDetail_page.events({
        'click .individualAdd'() {
//            checks to make sure a user is logged in
            if (!Meteor.userId()) {
                restrict();
            }
//            checks to make sure a user is logged in on an admin account
            var loggedInUser = Meteor.userId();
            const projectId = FlowRouter.getParam('projectId');
            if ((Roles.userIsInRole(loggedInUser, ['cAdmin'], 'default-group')) || (Roles.userIsInRole(loggedInUser, ['admin'], 'default-group'))) {

//                Finds the appropriate project Id
                const partnerId = FlowRouter.getParam('projectId');
//                sets the the value to the Id of the project
                var name = $(this).attr('_id');
//                finds the project with a matching id
                var doc = Projects.findOne({_id: partnerId});
//                updates the entry
                Projects.update({_id: doc._id}, {$addToSet: {individuals: name}});
                console.log("individual has been added to projects");

                var loggedInUser = Meteor.userId();
                var part = Partners.findOne({owner: loggedInUser});
                const ProjectId = FlowRouter.getParam('projectId');
                Partners.update({_id: part._id}, {$addToSet: {projects: ProjectId}});

                var showHide = document.getElementById("addPeople");
                showHide.style.display = "none";
            } else {
                restrict();
            }
        },
        'click .noAccessBtn-right'() {
            var showHide = document.getElementById("overNoAccess");
            showHide.style.display = "none";
        },
        'click .close'() {
            var showHide = document.getElementById("addPeople");
            showHide.style.display = "none";
        }
    });
    Template.ProjectDetail_page.events({
        'click .projectAdd'() {
//            checks to make sure a user is logged in
            if (!Meteor.userId()) {
                restrict();
            }
//            checks to make sure a user is logged in on an admin account
            var loggedInUser = Meteor.userId();
            const projectId = FlowRouter.getParam('projectId');
            if ((Roles.userIsInRole(loggedInUser, ['cAdmin'], 'default-group')) || (Roles.userIsInRole(loggedInUser, ['admin'], 'default-group')) || (adminCheck === loggedInUser)) {
//                Finds the appropriate partner Id
                const partnerId = FlowRouter.getParam('projectId');
//                sets the the value to the Id of the partner
                var name = $(this).attr('_id');
//                finds the partner with a matching id
                var doc = Partners.findOne({_id: name});
//                updates the entry
                Partners.update({_id: doc._id}, {$addToSet: {projects: partnerId}});
                console.log("Project has been added to project");
                var showHide = document.getElementById("addPeople");
                showHide.style.display = "none";
            } else {
                restrict();
            }
        }
    });
    Template.ProjectDetail_page.events({
        'click .addP'() {
            if (!Meteor.userId()) {
                restrict();
            } else {
                var loggedInUser = Meteor.userId();
                const projectId = FlowRouter.getParam('projectId');
                if ((Roles.userIsInRole(loggedInUser, ['cAdmin'], 'default-group')) || (Roles.userIsInRole(loggedInUser, ['admin'], 'default-group')) || (adminCheck === loggedInUser)) {

                    var showHide = document.getElementById("addPeople");
                    var modal = document.getElementById("modal-Mine");
                    var close = document.getElementById("modalClose");
                    var addProject = document.getElementById("addProject");
                    var addPeoples = document.getElementById("addPeoples");
                    addPeoples.style.display = "none";

                    addPeoples.style.display = "none";
                    addProject.style.display = "block";
                    modal.style.display = "block";
                    showHide.style.display = "block";
                    close.style.display = "block";

                } else {
                    restrict();
                }
            }
        },
        'click .createProject'() {
            FlowRouter.go('Partner.add');
        },
        'click .createP'() {
            FlowRouter.go('Individuals.add');
        },
        'click .addPeople'() {
            if (!Meteor.userId()) {
                restrict();
            } else {
                var loggedInUser = Meteor.userId();
                const projectId = FlowRouter.getParam('projectId');
                if ((Roles.userIsInRole(loggedInUser, ['cAdmin'], 'default-group')) || (Roles.userIsInRole(loggedInUser, ['admin'], 'default-group')) || (adminCheck === loggedInUser)) {

                    var showHide = document.getElementById("addPeople");
                    var modal = document.getElementById("modal-Mine");
                    var close = document.getElementById("modalClose");
                    var addPeoples = document.getElementById("addPeoples");
                    var addProject = document.getElementById("addProject");

                    addPeoples.style.display = "block";
                    addProject.style.display = "none";
                    modal.style.display = "block";
                    showHide.style.display = "block";
                    close.style.display = "block";

                } else {
                    restrict();
                }
            }
        },
        'click .remove'() {
            if (!Meteor.userId()) {
                restrict();
            } else {
                var loggedInUser = Meteor.userId();
                const projectId = FlowRouter.getParam('projectId');
                if ((Roles.userIsInRole(loggedInUser, ['admin'], 'default-group')) || (adminCheck === loggedInUser)) {
                    console.log("Project has been removed");
                    Projects.remove(projectId);
                    FlowRouter.go('ProjectList.show');
                } else {
                    restrict();
                }
            }
        },
        'click .edit'() {
            if (!Meteor.userId()) {
                restrict();
            } else {
                var loggedInUser = Meteor.userId();
                const projectId = FlowRouter.getParam('projectId');
                if ((Roles.userIsInRole(loggedInUser, ['admin'], 'default-group')) || (adminCheck === loggedInUser)) {
                    FlowRouter.go('ProjectsDetailsEdit.edit', {projectId: projectId});
                } else {
                    restrict();
                }
            }
        },
        'click .close'() {
            var showHide = document.getElementById("addPeople");
            showHide.style.display = "none";
            var addProject = document.getElementById("addProject");
            addProject.style.display = "none";
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
