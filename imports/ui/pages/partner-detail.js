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

//this function is used to dislay the no access notification to the current user f they dont have access
function restrict() {
    var showHide = document.getElementById("overNoAccess");
    showHide.style.display = "block";
};

Template.PartnerDetails_page.onCreated(function onCreatedPartnerDetailsPage() {
    Template.PartnerDetails_page.helpers({
        projectsAdd() {
            return Projects.find({}, {sort: {name: 1}});
        },
        individualsAdd() {
                        return Individuals.find({}, {sort: {name: 1}});       
        }
    });
    const project = FlowRouter.getParam('partnerId');
    const projectObject = Partners.findOne({_id: project});
    const adminCheck = projectObject.owner;
    
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

    Template.PartnerDetails_page.events({
          'click .projects'(event) {
              },
        'click .individualAdd'() {
//            checks to make sure a user is logged in
            if (!Meteor.userId()) {
                restrict();
            } else {
//          checks to make sure a user is logged in on an admin account
                var loggedInUser = Meteor.user();
                if ((Roles.userIsInRole(loggedInUser, ['cAdmin'], 'default-group')) || (Roles.userIsInRole( loggedInUser, ['admin'], 'default-group'))) {
//          Finds the appropriate partner Id
                    const partnerId = FlowRouter.getParam('partnerId');
//          sets the the value to the Id of the project
                    var name = $(this).attr('_id');
//          finds the partner with a matching id
                    var doc = Partners.findOne({_id: partnerId});
//          updates the entry
                    Partners.update({_id: doc._id}, {$addToSet: {individuals: name}});
//          this section holds the variables for the while loops to follow.
//          gets the array length and sets them to the appropiate var
                    var projectsLength = Projects.count;
//          counters
                    var i = 0;
                    while (projectsLength > i) {
//          Here its using the projects array to search for a individuals id match in the Projects collection
                        const doc = Projects.findOne({individuals: name});
//          Updating the projects collection by adding the individuals Id into it
                        Partners.update({_id: partnerId}, {$addToSet: {projects: doc._id}});
                        i++;
                    }
                    console.log("individual has been added to partner");
                } else {
                    restrict();
                }
            }
        }
    });
    
    Template.PartnerDetails_page.events({
        'click .projectAdd'() {
//            checks to make sure a user is logged in
            if (!Meteor.userId()) {
                restrict();
            }
//            checks to make sure a user is logged in on an admin account
            var loggedInUser = Meteor.user();
                if ((Roles.userIsInRole(loggedInUser, ['cAdmin'], 'default-group')) || (Roles.userIsInRole( loggedInUser, ['admin'], 'default-group'))) {
//                Finds the appropriate partner Id
                const partnerId = FlowRouter.getParam('partnerId');
//                sets the the value to the Id of the project
                var name = $(this).attr('_id');
//                finds the partner with a matching id
                var doc = Partners.findOne({_id: partnerId});
//                updates the entry
                Partners.update({_id: doc._id}, {$addToSet: {projects: name}});
                console.log("Project has been added to partner");
            } else {
                restrict();
            }
        },
        'click .addP'() {
            if (!Meteor.userId()) {
                restrict();
            } else {
                var loggedInUser = Meteor.user();
                if ((Roles.userIsInRole(loggedInUser, ['cAdmin'], 'default-group')) || (Roles.userIsInRole( loggedInUser, ['admin'], 'default-group'))) {
                    var showHide = document.getElementById("addProject");
                    var modal = document.getElementById("modal-Mine");
                    var close = document.getElementById("modalClose");
                    var addPeoples = document.getElementById("addPeoples");
                    addPeoples.style.display = "block";

                    modal.style.display = "block";
                    showHide.style.display = "block";
                    close.style.display = "block";
                    addPeoples.style.display = "block";
                } else {
                    restrict();
                }
                }
            },
            
        'click .addPeople'() {
            if (!Meteor.userId()) {
                restrict();
            } else {
                var loggedInUser = Meteor.user();
                if ((Roles.userIsInRole(loggedInUser, ['cAdmin'], 'default-group')) || (Roles.userIsInRole( loggedInUser, ['admin'], 'default-group'))) {
                    var showHide = document.getElementById("addPeople");
                    var modal = document.getElementById("modal-Mine");
                    var close = document.getElementById("modalClose");
                    var addPeoples = document.getElementById("addPeoples");
                    addPeoples.style.display = "block";

                    modal.style.display = "block";
                    showHide.style.display = "block";
                    close.style.display = "block";
                    addPeoples.style.display = "block";
                } else {
                    restrict();
                }
            }
        },
        
        'click .remove'() {
            const partnerId = FlowRouter.getParam('partnerId');
            if (!Meteor.userId()) {
                restrict();
            } else {
                var loggedInUser = Meteor.userId();
                if ((Roles.userIsInRole(loggedInUser, ['admin'], 'default-group')) || (adminCheck === loggedInUser)) {
                    Partners.remove(partnerId);
                    FlowRouter.go('PartnerList.show', {partnerId: partnerId});
                } else {
                    restrict();
                }
            }
        },
        
        'click .createProject'(){
                FlowRouter.go('Project.add');
        },
        
        'click .createP'(){
                FlowRouter.go('Individuals.add');
        },
        
        'click .edit'() {
            const partnerId = FlowRouter.getParam('partnerId');
            if (!Meteor.userId()) {
                restrict();
            } else {
                var loggedInUser = Meteor.userId();
                if ((Roles.userIsInRole(loggedInUser, ['admin'], 'default-group')) || (adminCheck === loggedInUser)) {
                    FlowRouter.go('PartnerEditDetails.edit', {partnerId: partnerId});
                } else {
                    restrict();
                }
            }
        },
        
        'click .noAccessBtn-right'() {
            FlowRouter.go('PartnerDetails.show');
            var showHide = document.getElementById("overNoAccess");
            if (showHide.style.display === "block") {
                showHide.style.display = "none";
            } else {
                showHide.style.display = "block";
            }
        },
        
        'click .close'() {
            var modal = document.getElementById("modal-Mine");
            modal.style.display = "none";
            var showHide = document.getElementById("addPeople");
            showHide.style.display = "none";
            var addProject = document.getElementById("addProject");
            addProject.style.display = "none";
        }
    }
    );

    Template.PartnerDetails_page.helpers({
//        'click .projects'(){
//        hasIndividualss() {
//            const partnerId = FlowRouter.getParam('partnerId');
//            const partner = Partners.findOne({_id: partnerId});
//            const individualsIds = partner.individuals || [];
//            return !!individualsIds.length;
//        },
//        individualss() {
//            const partnerId = FlowRouter.getParam('partnerId');
//            const partner = Partners.findOne({_id: partnerId});
//            const individualsIds = partner.individuals || [];
//            return Individuals.find({_id: {$in: individualsIds}});
//        }
//        },
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