import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Images } from '../../api/images/images';
import { Partners } from '../../api/partners/partners';
import { Projects } from '../../api/projects/projects';
import { Individuals } from '../../api/individuals/individuals';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveVar } from 'meteor/reactive-var';
import './partner-edit.html';

function Back() {
    window.history.back();
    FlowRouter.go('ProjectDetail.show');
};
function logoFunc() {
    document.getElementById('logoSubmit').style.display = "none";
    document.getElementById('logoSubmitNone').style.display = "block";
};
function nullFunc() {
    document.getElementById('logoSubmit').style.display = "block";
    document.getElementById('logoSubmitNone').style.display = "none";
};
$(document).ready(function() {
    $(window).keydown(function(event){
      if(event.keyCode == 13) {
        event.preventDefault();
        return false;
      }
    });
  });
Template.PartnerEditForm_page.onDestroyed(function onDestroyIndividualForm_page() {
    if (somethingChanged === true) {
        alert("The information you have entered will be saved");
        somethingChanged = false;
    }
});
Template.PartnerEditForm_page.onCreated(function onCreatedPartnerEditFormPage() {
    somethingChanged = false;

    Template.PartnerEditForm_page.helpers({
        partners() {
            const partnerId = FlowRouter.getParam('partnerId');
            return Partners.findOne({ _id: partnerId });
        }
    });

    Meteor.subscribe('projects');
    Meteor.subscribe('individuals');
    Meteor.subscribe('partners');
    Meteor.subscribe('partnersMinimal');

    //this section is about retrieving the avaliable individuals and projects list
    this.availableProjects = new ReactiveVar([]);
    this.availableIndividuals = new ReactiveVar([]);
    this.selectedProjects = new ReactiveVar([]);
    this.selectedIndividuals = new ReactiveVar([]);

    this.autorun(() => {
        const projects = Projects.find({}, {
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

    Template.PartnerEditForm_page.helpers({
        // this section gets the information from the individuals array and the projects array and displays them on the edit page
        individualsAdd() {
            const person = FlowRouter.getParam('partnerId');
            var partnerObject = Partners.findOne({ _id: person });

            const individualsIds = partnerObject.individuals;
            return individualsIds;
        },
        projectsAdd() {
            const person = FlowRouter.getParam('partnerId');
            const individualsObject = Partners.findOne({ _id: person });

            const individualsIds = individualsObject.projects;
            return individualsIds;
        }
    });

    //this gets the values from the text fields on the partner edit page
    Template.PartnerEditForm_page.events({
        'click .projectDelete': function (event, template) {
            var name = $(this).attr('_id');
            var nameHTML = $(this).attr('name');
            //updates the entry
            const individualsId = FlowRouter.getParam('partnerId');
            alert("Project " + nameHTML + "Has been removed");
            Meteor.call('partnerProject.remove', { name, individualsId });
        },
        'click .individualDelete': function (event, template) {
            var name = $(this).attr('_id');
            var nameHTML = $(this).attr('name');
            //updates the entry
            const individualsId = FlowRouter.getParam('partnerId');
            Meteor.call('partnerIndividual.remove', { name, individualsId });
            alert("Individual " + nameHTML + "Has been removed")
        },
        'click .Cancel': function (event, template) {
            Back();
        },
        'submit .form'(event) {
            const ProjectId = FlowRouter.getParam('partnerId');
            event.preventDefault();
            const target = event.target;
            const logoFile = target.logo && target.logo.files && target.logo.files.length && target.logo.files[0];

            Images.insert(logoFile, (error, imageDocument) => {
                const logo = `cfs/files/images/${imageDocument._id}`;
                Meteor.call("partnersLogo.update", logo, ProjectId);
            });
            somethingChanged = false;

            alert("Organisation has been updated");
            Back();
        },
        'click .logoSubmit': function (event, template) {

        },
        'change .form'() {
            //gets project id
            const ProjectId = FlowRouter.getParam('partnerId');
            //gets values from the text fields
            const name = $("#ProjectNameInvisible").val();
            const bio = $("#bioInvisible").val();
            const twitter = $("#twitterInvisible").val();
            const facebook = $("#facebookInvisible").val();
            const linkedin = $("#linkedinInvisible").val();

            const linkedinNew = $("#linkedin").val();
            var nameNew = $("#ProjectName").val();
            var bioNew = $("#bio").val();
            const twitterNew = $("#twitter").val();
            const facebookNew = $("#facebook").val();

            var logoCheck = document.getElementById("logo");

            // this either shows or hides one of the two buttons. messy
            if (name === nameNew) {
                logoFunc();
            } else {
                //call to the method to update the project name field
                Meteor.call("partnersname.update", nameNew, ProjectId);
                nullFunc();
            }
            if (bioNew === bio) {
                logoFunc();
            } else {
                Meteor.call("partnerBio.update", bioNew, ProjectId);
                nullFunc();
            }
            if (facebookNew === facebook) {
                logoFunc();
            } else {
                Meteor.call("partnersfacebook.update", facebookNew, ProjectId);
                nullFunc();
            }
            if (twitterNew === twitter) {
                logoFunc();
            } else {
                Meteor.call("partnerstwitter.insert", twitterNew, ProjectId);
                nullFunc();
            }
            if (linkedinNew === linkedin) {
                logoFunc();
            } else {
                Meteor.call("partnerslinkedin.insert", linkedinNew, ProjectId);
                nullFunc();
            }
            var logoCheck = document.getElementById("logo");
            if (logoCheck.value !== '') {
                logoFunc();
            } else {
                nullFunc();

            }
        
        },
        'click .cancel'(event) {
            event.preventDefault();
            const current = FlowRouter.current();
            const old = current.oldRoute;
            FlowRouter.go(old ? old.name : 'ProjectList.show');
        },
        'change select[name="projects"]'(event) {
            const id = event.target.value;
            const availableProjects = Template.instance().availableProjects.get();
            const selectedProjects = Template.instance().selectedProjects.get();
            const optionIndex = availableProjects.findIndex(option => option._id === id);
            const selectedProject = availableProjects.splice(optionIndex, 1)[0];
            selectedProjects.push(selectedProject);
            Template.instance().availableProjects.set(availableProjects);
            Template.instance().selectedProjects.set(selectedProjects);
        },
        'click .tag.is-project'(event) {

            event.preventDefault();
            const id = event.target.dataset.id;
            const availableProjects = Template.instance().availableProjects.get();
            const selectedProjects = Template.instance().selectedProjects.get();
            const optionIndex = selectedProjects.findIndex(option => option._id === id);
            const deletedProject = selectedProjects.splice(optionIndex, 1);
            availableProjects.push(deletedProject);
            Template.instance().availableProjects.set(availableProjects);
            Template.instance().selectedProjects.set(selectedProjects);
        },
        'change select[name="individuals"]'(event) {
            const id = event.target.value;
            const availableIndividuals = Template.instance().availableIndividuals.get();
            const selectedIndividuals = Template.instance().selectedIndividuals.get();
            const optionIndex = availableIndividuals.findIndex(option => option._id === id);
            const selectedIndividual = availableIndividuals.splice(optionIndex, 1)[0];

            selectedIndividuals.push(selectedIndividual);

            Template.instance().availableIndividuals.set(availableIndividuals);
            Template.instance().selectedIndividuals.set(selectedIndividuals);
        },
        'click .tag.is-individual'(event) {

            event.preventDefault();

            const id = event.target.dataset.id;
            const availableIndividuals = Template.instance().availableIndividuals.get();
            const selectedIndividuals = Template.instance().selectedIndividuals.get();
            const optionIndex = selectedIndividuals.findIndex(option => option._id === id);
            const deletedIndividual = selectedIndividuals.splice(optionIndex, 1);

            availableIndividuals.push(deletedIndividual);

            Template.instance().availableIndividuals.set(availableIndividuals);
            Template.instance().selectedIndividuals.set(selectedIndividuals);
        }
    });
});
