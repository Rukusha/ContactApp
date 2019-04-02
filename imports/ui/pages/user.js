import { Template } from 'meteor/templating';
import { Individuals } from '../../api/individuals/individuals';
import { Projects } from '../../api/projects/projects';
import { Partners } from '../../api/partners/partners';
import { Users } from '../../api/users/users';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { FlowRouter } from 'meteor/kadira:flow-router';

import './user.html';
import '../components/user.html';

const loggedInUser = Meteor.userId();

//this function is used to dislay the no access notification to the current user f they dont have access
function restrict() {
    var showHide = document.getElementById("overNoAccess");
    showHide.style.display = "block";
}
;
Template.user.onCreated(function onCreatedIndividualListPage() {
    Meteor.subscribe('individuals');
    Meteor.subscribe('projects');
    Meteor.subscribe('partners');
    Meteor.subscribe('users');
});

Template.user.onCreated(function onCreatedIndividualsDetailsPage() {
    Template.user.helpers({
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

    Template.user.helpers({
        getAvailableProjects() {
            return Template.instance().availableProjects.get();
        },
        getSeletedProjects() {
            return Template.instance().selectedProjects.get();
        },
        getAvailablePartners() {
            return Template.instance().availablePartners.get();
        },
        getSeletedPartners() {
            return Template.instance().selectedPartners.get();
        },
        getAvailableIndividuals() {
            return Template.instance().availableIndividuals.get();
        },
        getSeletedIndividuals() {
            return Template.instance().selectedIndividuals.get();
        }
    });
    Template.user.events({
        'click .addP'() {
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
        },
        'click .addPeoples'() {
                    var showHide = document.getElementById("addProject");
                    var modal = document.getElementById("modal-Mine");
                    var close = document.getElementById("modalClose");

                    var closeleft = document.getElementById("addPeople");
                    closeleft.style.display = "block";

                    var addPeoples = document.getElementById("addPeoples");
                    addPeoples.style.display = "none";

                        modal.style.display = "block";
                        showHide.style.display = "block";
                        close.style.display = "block";

        },
        'click .remove'() {
            const individualsId = FlowRouter.getParam('individualsId');
            if (!Meteor.userId()) {
                restrict();
            }
            var loggedInUser = Meteor.user();
            if (Roles.userIsInRole(loggedInUser, ['admin'], 'default-group')) {
                Individuals.remove(individualsId);
                console.log("Individual has been removed");
                FlowRouter.go('IndividualsList.show');
            } else {
                restrict();
            }
        },
        'click .edit'() {
            const individualsId = loggedInUser;
            if (!Meteor.userId()) {
                restrict();
            }
                FlowRouter.go('IndividualsEditDetails.edit', {individualsId: individualsId});
        },
        'click .close'() {
            var showHide = document.getElementById("addProject");
            showHide.style.display = "none";

        }
    });
    Template.user.events({
//    This section will add a person to a partner
        'click .individualAdd'() {
//            checks to make sure a user is logged in
            if (!Meteor.userId()) {
                restrict();
            }
////            checks to make sure a user is logged in on an admin account
            var loggedInUser = Meteor.user();
            if (Roles.userIsInRole(loggedInUser, ['admin'], 'default-group')) {
//                sets the the value to the Id of the partner
                var name = $(this).attr('_id');
//                finds the partner with a matching id
                var doc = Partners.findOne({_id: name});
//                updates the entry
                const individualsId = FlowRouter.getParam('individualsId');
                Partners.update({_id: doc._id}, {$addToSet: {individuals: individualsId}});

                console.log("individual has been added to partner");
                var showHide = document.getElementById("addPeople");
                showHide.style.display = "none";
                var showHide = document.getElementById("employees");
                showHide.style.display = "block";
                var showHide = document.getElementById("projectList");
                showHide.style.display = "none";
            } else {
                restrict();
            }
        }
    });
    Template.user.events({
        'click .projectAdd'() {
//            checks to make sure a user is logged in
            if (!Meteor.userId()) {
                restrict();
            }
//            checks to make sure a user is logged in on an admin account
            var loggedInUser = Meteor.user();
            if (Roles.userIsInRole(loggedInUser, ['admin'], 'default-group')) {
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
    });
    Template.user.helpers({
        'click .card.partner'(event) {
            // Prevent default browser form submit
            event.preventDefault();
            event.stopPropagation();
            // Go to the partner detail page
            FlowRouter.go('PartnerEditDetails.edit', {partnerId: this._id.valueOf()});
        }
    });
    Template.user.helpers({
        individuals() {
            const partnerId = Meteor.userId();
            return Individuals.findOne({_id: partnerId});

        },
        hasPartners() {

            const partner = Partners.findOne({individuals: loggedInUser});
            const partnerIds = partner.individuals || [];

            return partnerIds.length;
        },
        partners() {
            const partner = Partners.findOne({individuals: loggedInUser});
            const partnerIds = partner.individuals || [];

            return Partners.find({individuals: {$in: partnerIds}});
        },
//          gets the projects that the partner is connected with
        hasProjects() {
            const partner = Projects.findOne({individuals: loggedInUser});
            const projectIds = partner.individuals || [];

            return !!projectIds.length;
        },
        projects() {
            const partner = Projects.findOne({individuals: loggedInUser});
            const projectIds = partner.individuals || [];

            return Projects.find({individuals: {$in: projectIds}});
        }
    });
});
