                    import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Projects } from '../../api/projects/projects';
import { Partners } from '../../api/partners/partners';
import { Individuals } from '../../api/individuals/individuals';
import { Users } from '../../api/users/users';
import { FlowRouter } from 'meteor/kadira:flow-router';
import './individual-detail.html';
import { Roles } from 'meteor/alanning:roles';


//this function is used to dislay the no access notification to the current user f they dont have access
function restrict() {
    var showHide = document.getElementById("overNoAccess");
    showHide.style.display = "block";
};
Template.IndividualsDetails_page.onCreated(function onCreatedIndividualsDetailsPage() {
    Template.IndividualsDetails_page.helpers({
        projectsAdd() {
            return Projects.find({}, {sort: {name: 1}});
        },
        individualsAdd() {
            return Partners.find({}, {sort: {name: 1}});
        }
    });
    Meteor.subscribe('projects');
    Meteor.subscribe('partners');                                               
    Meteor.subscribe('users');

    this.availableProjects = new ReactiveVar([]);
    this.availablePartners = new ReactiveVar([]);
    this.selectedProjects = new ReactiveVar([]);
    this.selectedPartners = new ReactiveVar([]);
    this.autorun(() => {

        const projects = Projects.find({}, {
            fields: {_id: 1, name: 1},
            sort: {name: 1}
        }).fetch();
        this.availableProjects.set(projects);
        this.selectedProjects.set([]);
        const partners = Partners.find({}, {
            fields: {name: 1},
            sort: {name: 1}
        }).fetch();
        this.availablePartners.set(Partners);
        this.selectedPartners.set([]);
    });

    Template.IndividualsDetails_page.events({
        'click .addPeoples'() {
            if (!Meteor.userId()) {
                restrict();
            } else {
                var loggedInUser = Meteor.userId();
                const individualsId = FlowRouter.getParam('individualsId');
                if ((Roles.userIsInRole(loggedInUser, ['cAdmin'], 'default-group')) || (Roles.userIsInRole( loggedInUser, ['admin'], 'default-group'))) {

                    var addProject = document.getElementById("addProject");
                    var showHide = document.getElementById("addPeople");
                    var modal = document.getElementById("modal-Mine");
                    var close = document.getElementById("modalClose");

                    var closeleft = document.getElementById("addPeoples");
                    closeleft.style.display = "none";

                        modal.style.display = "block";
                        showHide.style.display = "block";
                        close.style.display = "block";
                        addProject.style.display ="block";
                } else {
                restrict();

                }
            }
        },
        'click .addP'() {
            if (!Meteor.userId()) {
                restrict();

            } else {
                var loggedInUser = Meteor.userId();
                const individualsId = FlowRouter.getParam('individualsId');
                if ((Roles.userIsInRole(loggedInUser, ['cAdmin'], 'default-group')) || (Roles.userIsInRole( loggedInUser, ['admin'], 'default-group'))) {
                    var showHide = document.getElementById("addProject");
                    var modal = document.getElementById("modal-Mine");
                    var close = document.getElementById("modalClose");

                    var closeleft = document.getElementById("addPeople");
                    closeleft.style.display = "none";

                    var addPeoples = document.getElementById("addPeoples");
                    addPeoples.style.display = "block";

                        modal.style.display = "block";
                        showHide.style.display = "block";
                        close.style.display = "block";
                        addPeoples.style.display ="block";
                } else {
                restrict();

                }
            }
        },
        'click .remove'() {
            const individualsId = FlowRouter.getParam('individualsId');
            if (!Meteor.userId()) {
                    restrict();
            } else {
                var loggedInUser = Meteor.user();
                if ((Roles.userIsInRole(loggedInUser, ['cAdmin'], 'default-group')) || (Roles.userIsInRole( loggedInUser, ['admin'], 'default-group'))) {
                    Individuals.remove(individualsId);
                    Users.remove(individualsId);
                    console.log("Individual has been removed");
                    FlowRouter.go('IndividualsList.show');
                } else {
                restrict();

                }
            }
        },
        'click .edit'() {
            const individualsId = FlowRouter.getParam('individualsId');
            if (!Meteor.userId()) {
                restrict();

            } else {
                var loggedInUser = Meteor.userId();
                if ((Roles.userIsInRole(loggedInUser, ['cAdmin'], 'default-group')) || (Roles.userIsInRole( loggedInUser, ['admin'], 'default-group'))) {
                    FlowRouter.go('IndividualsEditDetails.edit', {individualsId: individualsId});
                } else {
                restrict();

                }
            }
        }});
    Template.IndividualsDetails_page.events({
//    This section will add a person to a partner
        'click .individualAdd'() {
//            checks to make sure a user is logged in
            if (!Meteor.userId()) {
                restrict();

            } else {
////            checks to make sure a user is logged in on an admin account
                var loggedInUser = Meteor.user();
                const individualsId = FlowRouter.getParam('individualsId');

                if ((Roles.userIsInRole(loggedInUser, ['cAdmin'], 'default-group')) || (Roles.userIsInRole( loggedInUser, ['admin'], 'default-group'))) {
//                sets the the value to the Id of the partner
                    var name = $(this).attr('_id');
//                finds the partner with a matching id
                    var doc = Partners.findOne({_id: name});
//                updates the entry
                    const individualsId = FlowRouter.getParam('individualsId');
                    Partners.update({_id: doc._id}, {$addToSet: {individuals: individualsId}});

                    console.log("individual has been added to partner");
                    var addProject = document.getElementById("addProject");
                    addProject.style.display = "none";
                } else {
                restrict();

                }
            }
        }});
    Template.IndividualsDetails_page.events({
        'click .projectAdd'() {
//            checks to make sure a user is logged in
            if (!Meteor.userId()) {
                restrict();

            } else {
//            checks to make sure a user is logged in on an admin account
                var loggedInUser = Meteor.user();
                if ((Roles.userIsInRole(loggedInUser, ['cAdmin'], 'default-group')) || (Roles.userIsInRole( loggedInUser, ['admin'], 'default-group'))) {
//                Finds the appropriate partner Id
//                sets the the value to the Id of the project
                    var name = $(this).attr('_id');
//                finds the partner with a matching id
                    var doc = Projects.findOne({_id: name});
//                updates the entry
                    const individualsId = FlowRouter.getParam('individualsId');
                    Projects.update({_id: doc._id}, {$addToSet: {individuals: individualsId}});
                    console.log("Project has been added to individuals");
                    var showHide = document.getElementById("addProject");
                    showHide.style.display = "none";
                    var showHide = document.getElementById("projectList");
                    showHide.style.display = "block";
                    var showHide = document.getElementById("employees");
                    showHide.style.display = "none";
                } else {
                restrict();

                }
            }
        },
        'click .noAccessBtn-right'() {
            var showHide = document.getElementById("overNoAccess");
                showHide.style.display = "none";
        },
        'click .close'() {
            var addProject = document.getElementById("addProject");
            var addPeople = document.getElementById("addPeople");
            addProject.style.display = "none";
            addPeople.style.display = "none";

        }
    });
    Template.IndividualsDetails_page.helpers({
        'click .card.partner'(event) {
            // Prevent default browser form submit
            event.preventDefault();
            event.stopPropagation();
            // Go to the partner detail page
            FlowRouter.go('PartnerEditDetails.edit', {partnerId: this._id.valueOf()});
        }
    });
    Template.IndividualsDetails_page.helpers({
        individuals() {
            const partnerId = FlowRouter.getParam('individualsId');
            return Individuals.findOne({_id: partnerId});
        },
        hasPartners() {
            const projectId = FlowRouter.getParam('individualsId');
            const partner = Partners.findOne({individuals: projectId});
            const partnerIds = partner.individuals || [];

            return partnerIds.length;
        },
        partners() {
            const projectId = FlowRouter.getParam('individualsId');
            const partner = Partners.findOne({individuals: projectId});
            const partnerIds = partner.individuals || [];
            return Partners.find({individuals: {$in: partnerIds}});
        },
//          gets the projects that the individual is connected with
        hasProjects() {
            const individualsId = FlowRouter.getParam('individualsId');
            const partner = Projects.findOne({individuals: individualsId});
            const projectIds = partner.individuals || [];

            return !!projectIds.length;
        },
        projects() {
            const individualsId = FlowRouter.getParam('individualsId');
            const partner = Projects.findOne({individuals: individualsId});
            const projectIds = partner.individuals || [];

            return Projects.find({individuals: {$in: projectIds}});
        }
    });
});
