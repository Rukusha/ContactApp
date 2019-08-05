import { Template } from 'meteor/templating';
import { Projects } from '../../api/projects/projects';
import { ProjectsMinimal } from '../../api/ProjectsMinimal/ProjectsMinimal';
import { Partners } from '../../api/partners/partners';
import { PartnersMinimal } from '../../api/PartnersMinimal/PartnersMinimal';
import { Individuals } from '../../api/individuals/individuals';
import { IndividualsMinimal } from '../../api/IndividualsMinimal/IndividualsMinimal';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import './project-detail.html';
import { ReactiveVar } from 'meteor/reactive-var';
import { ReactiveDict } from 'meteor/reactive-dict';


//this function is used to dislay the no access notification to the current user f they dont have access
function restrict() {
    var showHide = document.getElementById("overNoAccess");
    showHide.style.display = "block";
};

var formDataHandle = {};
Template.ProjectDetail_page.imgLoaded = function() {
  return formDataHandle && formDataHandle.ready();
}

Template.ProjectDetail_page.formData = function() {
  if( formDataHandle && formDataHandle.ready() ) {
    const project = FlowRouter.getParam('projectId');
     var form = Projects.findOne({_id : project});
     return FormDatas.find({_id: form._id, logo });
  }
}

Template.ProjectDetail_page.created = function() {
  formDataHandle = Meteor.subscribe("projects");
}

Template.ProjectDetail_page.helpers({
    projects() {
        return Projects.find({}, { sort: { name: 1 } });
    },
    projectsAdd() {
        const project = FlowRouter.getParam('projectId');
        const partnerObject = Projects.findOne({ _id: project });

        const individualsIds = partnerObject.partnersNot;
        return individualsIds;
    },
    individualsAdd() {
        const project = FlowRouter.getParam('projectId');
        const individualsObject = Projects.findOne({ _id: project });

        const individualsIds = individualsObject.individualsNot;
        return individualsIds;
    }
});

Template.ProjectDetail_page.onCreated(function onCreatedProjectDetailPage() {
    Meteor.subscribe('projects');
    Meteor.subscribe('partners');
    Meteor.subscribe('individuals');

    Meteor.subscribe('projectsMinimal');
    Meteor.subscribe('partnersMinimal');
    Meteor.subscribe('individualsMinimal');

    const project = FlowRouter.getParam('projectId');
    const projectObject = Projects.find({ _id: project });

    const adminCheck = projectObject.admin;
    var check = true;
    this.availableProjects = new ReactiveVar([]);
    this.availableIndividuals = new ReactiveVar([]);
    this.selectedProjects = new ReactiveVar([]);
    this.selectedIndividuals = new ReactiveVar([]);
    this.state = new ReactiveDict();

    this.autorun(() => {
        const projects = Partners.find({}, {
            fields: { _id: 1, name: 1 },
            sort: { name: 1 }
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

    Template.ProjectDetail_page.events({
        'change .EmployeeCheckbox input'(event, instance) {
            var showHide = document.getElementById("addPeoples");
            var HideShow = document.getElementById("addPeoplesComp");
            if (check === true) {
                showHide.style.display = "none";
                HideShow.style.display = "block";
                check = false;
            } else {
                showHide.style.display = "block";
                HideShow.style.display = "none";
                check = true;
            }
        },
        'click .individualAdd'() {
            //checks to make sure a user is logged in
            if (!Meteor.userId()) {
                restrict();
            }
            //checks to make sure a user is logged in on an admin account
            var loggedInUser = Meteor.userId();
             projectId = FlowRouter.getParam('projectId');
            if ((Roles.userIsInRole(loggedInUser, ['cAdmin'], 'default-group')) || (Roles.userIsInRole(loggedInUser, ['admin'], 'default-group'))) {
                //sets the the value to the Id of the project
                var name = $(this).attr('_id');
                //updates the entry
                Meteor.call('ProjectindividualsAdd.update', { name, projectId });
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
            //checks to make sure a user is logged in
            if (!Meteor.userId()) {
                restrict();
            }
            //checks to make sure a user is logged in on an admin account
            var loggedInUser = Meteor.userId();
            if ((Roles.userIsInRole(loggedInUser, ['cAdmin'], 'default-group')) || (Roles.userIsInRole(loggedInUser, ['admin'], 'default-group')) || (adminCheck === loggedInUser)) {
                //Finds the appropriate partner Id
                const partnerId = FlowRouter.getParam('projectId');
                //sets the the value to the Id of the partner
                var name = $(this).attr('_id');
                //finds the partner with a matching id
                var doc = PartnersMinimal.findOne({ _id: name });
                var docpartnerId = ProjectsMinimal.findOne({ _id: partnerId });

                //updates the entry
                Projects.update({ _id: docpartnerId._id }, { $addToSet: { partners: doc } });
                Projects.update({ _id: docpartnerId._id }, { $pull: { partnersNot: doc } });

                Partners.update({ _id: doc._id }, { $addToSet: { projects: docpartnerId } });
                Partners.update({ _id: doc._id }, { $pull: { projectsNot: docpartnerId } });

                var showHide = document.getElementById("addPeople");
                showHide.style.display = "none";
            } else {
                restrict();
            }
        }
    });

    Template.ProjectDetail_page.events({
        'click .addP'() {
            var HideShow = document.getElementById("addPeoplesComp");
            HideShow.style.display = "none";
            if (!Meteor.userId()) {
                restrict();
            } else {
                var loggedInUser = Meteor.userId();
                if ((Roles.userIsInRole(loggedInUser, ['cAdmin'], 'default-group')) || (Roles.userIsInRole(loggedInUser, ['admin'], 'default-group')) || (adminCheck === loggedInUser)) {
                    var showHide = document.getElementById("addPeople");
                    var modal = document.getElementById("modal-Mine");
                    var close = document.getElementById("modalClose");
                    var addProject = document.getElementById("addProject");
                    var addPeoples = document.getElementById("addPeoples");
                    
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
            FlowRouter.go('Admin.add');
        },
        'click .createP'() {
            FlowRouter.go('Individuals.add');
        },
        'click .addPeople'() {
            var HideShow = document.getElementById("addPeoplesComp");
            HideShow.style.display = "none";
            if (!Meteor.userId()) {
                restrict();
            } else {
                var loggedInUser = Meteor.userId();
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
                    Meteor.call('projects.remove', { projectId });
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
                    FlowRouter.go('ProjectsDetailsEdit.edit', { projectId: projectId });
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
            return Projects.findOne({ _id: projectId });
        },
        hasPartners() {
            const partnerIds = FlowRouter.getParam('projectId');
            var projectObject = Projects.findOne({ _id: partnerIds });

            const partnersObject = projectObject.partners || [];

            return !!partnersObject.length;
        },
        partners() {
            const partnerIds = FlowRouter.getParam('projectId');
            var projectObject = Projects.findOne({ _id: partnerIds });

            const partnersObject = projectObject.partners || [];

            return partnersObject;
        },
        hasIndividual() {
            const partnerIds = FlowRouter.getParam('projectId');
            var projectObject = Projects.findOne({ _id: partnerIds });

            const individualsIds = projectObject.individuals || [];
            return !!individualsIds.length;
        },
        individuals() {
            const partnerIds = FlowRouter.getParam('projectId');
            var projectObject = Projects.findOne({ _id: partnerIds });

            const individualsIds = projectObject.individuals || [];
            return individualsIds;
        }
    });
});
