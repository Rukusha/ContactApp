import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

import { Projects } from '../../api/projects/projects';
import { ProjectsMinimal } from '../../api/ProjectsMinimal/ProjectsMinimal';


import { Partners } from '../../api/partners/partners';
import { PartnersMinimal } from '../../api/PartnersMinimal/PartnersMinimal';

import { Individuals } from '../../api/individuals/individuals';
import { IndividualsMinimal } from '../../api/IndividualsMinimal/IndividualsMinimal';

import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveVar } from 'meteor/reactive-var';
import './partner-detail.html';

//this function is used to dislay the no access notification to the current user f they dont have access
function restrict() {
    var showHide = document.getElementById("overNoAccess");
    showHide.style.display = "block";
};
FlowRouter.triggers.enter([() => { window.scrollTo(0, 0); }]);

var formDataHandle = {};
Template.PartnerDetails_page.imgLoaded = function() {
  return formDataHandle && formDataHandle.ready();
}

Template.PartnerDetails_page.formData = function() {
  if( formDataHandle && formDataHandle.ready() ) {
    const project = FlowRouter.getParam('partnerId');
     var form = Partners.findOne({_id : project});
     return FormDatas.find({_id: form._id, logo });
  }
}

Template.PartnerDetails_page.created = function() {
  formDataHandle = Meteor.subscribe("partners");
}

Template.PartnerDetails_page.onCreated(function onCreatedPartnerDetailsPage() {
    Template.PartnerDetails_page.helpers({
        projectsAdd() {
            const project = FlowRouter.getParam('partnerId');
            const partnerObject = Partners.findOne({ _id: project });

            const individualsIds = partnerObject.projectsNot;
            return individualsIds;
        },
        individualsAdd() {
            const project = FlowRouter.getParam('partnerId');
            const partnerObject = Partners.findOne({ _id: project });

            const individualsIds = partnerObject.individualsNot;
            return individualsIds;
        }
    });

    const project = FlowRouter.getParam('partnerId');
    const projectObject = Partners.find({ _id: project });
    const adminCheck = projectObject.owner;

    Meteor.subscribe('users');
    // not sure why this project is here on the partners subscribe
    Meteor.subscribe('partners', project);
    Meteor.subscribe('projects');
    Meteor.subscribe('individuals');

    Meteor.subscribe('projectsMinimal');
    Meteor.subscribe('individualsMinimal');
    Meteor.subscribe('partnersMinimal');

    this.availableProjects = new ReactiveVar([]);
    this.availableIndividuals = new ReactiveVar([]);
    this.selectedProjects = new ReactiveVar([]);
    this.selectedIndividuals = new ReactiveVar([]);
    this.autorun(() => {
        const projects = Projects.find({}, {
            fields: { _id: 1, name: 1 },
            sort: { alias: 1 }
        }).fetch();
        this.availableProjects.set(projects);
        this.selectedProjects.set([]);
        const individuals = Individuals.find({}, {
            fields: { name: 1 },
            sort: { name: 1 }
        }).fetch();
        this.availableIndividuals.set(individuals);
        this.selectedIndividuals.set([]);
    });

    Template.PartnerDetails_page.events({
        'click .individualAdd'() {
            //checks to make sure a user is logged in
            if (!Meteor.userId()) {
                restrict();
            } else {
                //checks to make sure a user is logged in on an admin account
                var loggedInUser = Meteor.user();
                if ((Roles.userIsInRole(loggedInUser, ['cAdmin'], 'default-group')) || (Roles.userIsInRole(loggedInUser, ['admin'], 'default-group'))) {
                    //Finds the appropriate partner Id
                    const partnerId = FlowRouter.getParam('partnerId');
                    //sets the the value to the Id of the project
                    var name = $(this).attr('_id');
                    var docName = IndividualsMinimal.findOne({ _id: name });

                    //finds the partner with a matching id
                    var doc = PartnersMinimal.findOne({ _id: partnerId });

                    var admin = docName.owner;
                    if(admin.length === 0){
                        Individuals.update({ _id: docName._id }, { $addToSet: { owner: partnerId } });
                    }
                    //updates the entry
                    Partners.update({ _id: partnerId }, { $addToSet: { individuals: docName } });
                    Partners.update({ _id: partnerId }, { $pull: { individualsNot: docName } });
                    
                    Individuals.update({ _id: name }, { $addToSet: { partners: doc } });
                    Individuals.update({ _id: name }, { $pull: { partnersNot: doc } });

                    //this section holds the variables for the while loops to follow.
                    //gets the array length and sets them to the appropiate var
                    var projectsLength = Projects.count;
                    //          counters
                    var i = 0;
                    while (projectsLength > i) {
                        //Here its using the projects array to search for a individuals id match in the Projects collection
                        const doc = Projects.findOne({ individuals: name });
                        //Updating the projects collection by adding the individuals Id into it
                        Partners.update({ _id: partnerId }, { $addToSet: { projects: doc._id } });
                        i++;
                    }
                    console.log("individual has been added to partner");

                    var showHide = document.getElementById("addPeoples");
                    showHide.style.display = "none";
                } else {
                    restrict();
                }
            }
        },
        'click .projectAdd'() {
            //checks to make sure a user is logged in
            if (!Meteor.userId()) {
                restrict();
            }
            //checks to make sure a user is logged in on an admin account
            var loggedInUser = Meteor.user();
            if ((Roles.userIsInRole(loggedInUser, ['cAdmin'], 'default-group')) || (Roles.userIsInRole(loggedInUser, ['admin'], 'default-group'))) {
                //Finds the appropriate partner Id
                const partnerId = FlowRouter.getParam('partnerId');
                //sets the the value to the Id of the project
                var name = $(this).attr('_id');
                var docName = ProjectsMinimal.findOne({ _id: name });

                //finds the partner with a matching id
                var doc = PartnersMinimal.findOne({ _id: partnerId });
                //updates the entry
                
                Partners.update({ _id: doc._id }, { $addToSet: { projects: docName } });
                Partners.update({ _id: doc._id }, { $pull: { projectsNot: docName } });

                Projects.update({ _id: name }, { $addToSet: { partners: doc } });
                Projects.update({ _id: name }, { $pull: { partnersNot: doc } });
                console.log("Project has been added to partner");

                var showHide = document.getElementById("addPeoples");
                showHide.style.display = "none";
            } else {
                restrict();
            }
        },
        'click .addP'() {
            if (!Meteor.userId()) {
                restrict();
            } else {
                var loggedInUser = Meteor.user();
                if ((Roles.userIsInRole(loggedInUser, ['cAdmin'], 'default-group')) || (Roles.userIsInRole(loggedInUser, ['admin'], 'default-group'))) {
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
                if ((Roles.userIsInRole(loggedInUser, ['cAdmin'], 'default-group')) || (Roles.userIsInRole(loggedInUser, ['admin'], 'default-group'))) {
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
        'click .Add_Admin'() {
            if (!Meteor.userId()) {
                restrict();
            } else {
                var loggedInUser = Meteor.user();
                if ((Roles.userIsInRole(loggedInUser, ['cAdmin'], 'default-group')) || (Roles.userIsInRole(loggedInUser, ['admin'], 'default-group'))) {
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
                    Meteor.call('Partners.remove', { partnerId });

                    FlowRouter.go('PartnerList.show', { partnerId: partnerId });
                } else {
                    restrict();
                }
            }
        },

        'click .createProject'() {
            FlowRouter.go('Project.add');
        },
        'click .createP'() {
            const partnerId = FlowRouter.getParam('partnerId');
            FlowRouter.go('partners-Individuals.add', {partnerId: partnerId });
        },
        'click .edit'() {
            const partnerId = FlowRouter.getParam('partnerId');
            if (!Meteor.userId()) {
                restrict();
            } else {
                var loggedInUser = Meteor.userId();
                if ((Roles.userIsInRole(loggedInUser, ['admin'], 'default-group')) || (adminCheck === loggedInUser)) {
                    FlowRouter.go('PartnerEditDetails.edit', { partnerId: partnerId });
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
        'click .card.partner'(event) {
            // Prevent default browser form submit
            event.preventDefault();
            event.stopPropagation();
            // Go to the partner detail page
            FlowRouter.go('PartnerEditDetails.edit', { partnerId: this._id.valueOf() });
        },
        partner() {
            const partnerIds = FlowRouter.getParam('partnerId');
            partnerObject = Partners.findOne({ _id: partnerIds });
            return partnerObject;
        },
        //  gets the projects that the partner is connected with
        hasProjects() {
            const partnerIds = FlowRouter.getParam('partnerId');
            var partnerObject = Partners.findOne({ _id: partnerIds });

            const projectIds = partnerObject.projects || [];
            return !!projectIds.length;
        },
        projects() {
            const partnerIds = FlowRouter.getParam('partnerId');
            var partnerObject = Partners.findOne({ _id: partnerIds });

            var projectIs = partnerObject.projects || [];
            return projectIs;
        },
        hasIndividual() {
            const partnerIds = FlowRouter.getParam('partnerId');
            var partnerObject = Partners.findOne({ _id: partnerIds });

            const individualsIds = partnerObject.individuals || [];
            return !!individualsIds.length;
        },
        individuals() {
            const partnerIds = FlowRouter.getParam('partnerId');
            var partnerObject = Partners.findOne({ _id: partnerIds });

            const individualsIds = partnerObject.individuals || [];
            return individualsIds;
        }
    });
});