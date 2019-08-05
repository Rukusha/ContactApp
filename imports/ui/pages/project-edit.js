import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Images } from '../../api/images/images';
import { Projects } from '../../api/projects/projects';
import { Individuals } from '../../api/individuals/individuals';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveVar } from 'meteor/reactive-var';
import './project-edit.html';

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
Template.ProjectEdit_page.onDestroyed(function onDestroyIndividualForm_page(){
    if(somethingChanged === true){
        alert("The information you have entered will be saved");
        somethingChanged = false;
    }
});
Template.ProjectEdit_page.onCreated(function onCreatedProjectEditPage() {
    somethingChanged = false;
    Template.ProjectEdit_page.helpers({
        projects() {
            const project = FlowRouter.getParam('projectId');
            return Projects.findOne({ _id: project });
        },
        individualsAdd() {
            const person = FlowRouter.getParam('projectId');
            var partnerObject = Projects.findOne({ _id: person });

            const individualsIds = partnerObject.individuals;
            return individualsIds;
        },
        partnersAdd() {
            const person = FlowRouter.getParam('projectId');
            const individualsObject = Projects.findOne({ _id: person });

            const individualsIds = individualsObject.partners;
            return individualsIds;
        }
    });
    Meteor.subscribe('projects');
    Meteor.subscribe('individuals');
    Meteor.subscribe('partners');

    Meteor.subscribe('projectsMinimal');
    Meteor.subscribe('individualsMinimal');
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
    Template.ProjectEdit_page.helpers({
        getAvailableIndividuals() {
            return Template.instance().availableIndividuals.get();
        },
        getSeletedIndividuals() {
            return Template.instance().selectedIndividuals.get();
        }
    });
    //this gets the values from the text fields on the partner edit page
    Template.ProjectEdit_page.events({
        'click .individualsDelete': function (event, template) {
            var name = $(this).attr('_id');
            var nameHTML = $(this).attr('name');

            //updates the entry
            const individualsId = FlowRouter.getParam('projectId');
            alert("Individual " + nameHTML + " Has been removed");
            Meteor.call('ProjectIndividuals.remove', { name, individualsId });
        },
        'click .partnerDelete': function (event, template) {
            var name = $(this).attr('_id');
            var nameHTML = $(this).attr('name');
            
            //updates the entry
            const individualsId = FlowRouter.getParam('projectId');
            Meteor.call('PartnersIndividuals.remove', { name, individualsId });
            alert("Partner " +nameHTML + " Has been removed")
        },
        'click .Cancel': function (event, template) {
            Back();
        },
        'click .logoSubmit': function (event, template) {
            somethingChanged = false;
            alert("Project has been updated");
            Back();
        },
        'submit .form'(event) {
            somethingChanged = false;
            // This is only for the file upload for the logos
            event.preventDefault();
            const target = event.target;
            const logoFile = target.logo && target.logo.files && target.logo.files.length && target.logo.files[0];
            try {
                //this takes the values for the logo
                Images.insert(logoFile, (error, imageDocument) => {
                    const ProjectId = FlowRouter.getParam('projectId');
                    const logo = `cfs/files/images/${imageDocument._id}`;
                    var doc = Projects.findOne({ _id: ProjectId });
                    Projects.update({ _id: doc._id }, { $set: { logo: logo } });
                });
                alert("Project has been updated");
                Back();
            } catch{
                alert("Update was not succesfull please try again later");
            }
        },
        'change .form'() {
            var admin = $("#admin").val();
            //gets project id
            const ProjectId = FlowRouter.getParam('projectId');

            //gets values from the text fields
            const name = $("#ProjectNameInvisible").val();
            const bio = $("#bioInvisible").val();
            const domain = $("#domainInvisible").val();
            var nameNew = $("#ProjectName").val();
            var domainNew = $("#domain").val();
            var bioNew = $("#bio").val();
            var adminCheck = document.getElementById('admin').value;

            //compares old value of name and new value after the change
            if (name === nameNew) {
                logoFunc();
            } else {
            //call to the method to update the project name field
                Meteor.call("projectsName.update", nameNew, ProjectId);
                nullFunc();
            }
            if (domain === domainNew) {
                logoFunc();
            } else {
                Meteor.call("projectsDomain.update", domainNew, ProjectId);
                nullFunc();
            }
            if (bioNew === bio) {
                logoFunc();
            } else {
                Meteor.call("projectsBio.update", bioNew, ProjectId);
                nullFunc();
            }
            if (admin === adminCheck) {
                logoFunc();
            }
            else {
                Meteor.call("projectsAdmin.update", admin, ProjectId);
                nullFunc();
            }
            var logo = document.getElementById("logo");
            if (logo.value !== '') {
                nullFunc();
            } else {
                logoFunc();
            }
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
