import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Images } from '../../api/images/images';
import { Individuals } from '../../api/individuals/individuals';
import { Projects } from '../../api/projects/projects';
import { Users } from '../../api/users/users';
import { FlowRouter } from 'meteor/kadira:flow-router';

import './individual-edit.html';
import { IndividualsMinimal } from '../../api/IndividualsMinimal/IndividualsMinimal';

function Back() {
    window.history.back();
};
function logoFunc() {
    document.getElementById('logoSubmit').style.display = "none";
    document.getElementById('logoSubmitNone').style.display = "block";
};
function nullFunc() {
    document.getElementById('logoSubmit').style.display = "block";
    document.getElementById('logoSubmitNone').style.display = "none";
};
Meteor.subscribe('allEmails');

Template.IndividualsEdit_page.onDestroyed(function onDestroyIndividualForm_page() {
    if (somethingChanged === true) {
        alert("The information you have entered will be saved");
        somethingChanged = false;
    }
});

Template.IndividualsEdit_page.onCreated(function onCreatedIndividualsEditPage() {
    somethingChanged = false;

    Template.IndividualsEdit_page.helpers({

        users() {
            const userId = FlowRouter.getParam('individualsId');
            var personEdit = Meteor.users.findOne({ _id: userId });
            var email = personEdit.emails[0].address;
            return email;
        },
        individuals() {
            return Individuals.find({}, { sort: { name: 1 } });
        }
    });
    Meteor.subscribe('usersALL');
    Meteor.subscribe('users');
    Meteor.subscribe('individuals');
    Meteor.subscribe('partners');
    Meteor.subscribe('projects');
    Meteor.subscribe('individualsMinimal');
    Meteor.subscribe('partnersMinimal');
    Meteor.subscribe('projectsMinimal');

    partnerObject = "#";

    Template.IndividualsEdit_page.helpers({
        partnersAdd() {
            const person = FlowRouter.getParam('individualsId');
            var partnerObject = Individuals.findOne({ _id: person });

            const individualsIds = partnerObject.partners;
            return individualsIds;
        },
        projectsAdd() {
            const person = FlowRouter.getParam('individualsId');
            const individualsObject = Individuals.findOne({ _id: person });

            const individualsIds = individualsObject.projects;
            return individualsIds;
        },
        individuals() {
            const partnerId = FlowRouter.getParam('individualsId');
            return Individuals.findOne({ _id: partnerId });
        }
    });
    //this gets the values from the text fields on the partner edit page
    Template.IndividualsEdit_page.events({
        'click .projectDelete': function (event, template) {
            var name = $(this).attr('_id');
            var nameHTML = $(this).attr('name');

            //updates the entry
            const individualsId = FlowRouter.getParam('individualsId');
            alert("Project " + nameHTML + "Has been removed");
            Meteor.call('individualsProject.remove', { name, individualsId });
        },
        'click .partnerDelete': function (event, template) {
            var name = $(this).attr('_id');
            var nameHTML = $(this).attr('name');

            //updates the entry
            const individualsId = FlowRouter.getParam('individualsId');
            Meteor.call('individualsPartner.remove', { name, individualsId });
            alert("Partner " + nameHTML + "Has been removed")
        },
        'click .Cancel': function (event, template) {
            Back();
        },
        'click .logoSubmit': function (event, template) {
            const individualsId = FlowRouter.getParam('individualsId');

            var user = Users.findOne({ _id: individualsId });
            somethingChanged = false;

            alert("Individual has been updated");
            Back();
        },
        'change .form'() {
            var admin = $("#admin").val();
            
            //gets project id
            const ProjectId = FlowRouter.getParam('individualsId');
            const emails = $("#emails").val();

            //gets values from the text fields
            const name = $("#ProjectNameInvisible").val();
            const bio = $("#bioInvisible").val();
            const domain = $("#domainInvisible").val();
            const email = $("#emailsInvisible").val();

            const phone = $("#at-field-telephoneInvisible").val();
            const skype = $("#at-field-skypeInvisible").val();
            const linkedin = $("#at-field-linkedInInvisible").val();
            const position = $("#positionInvisible").val();

            var emailNew = $("#emails").val();
            var nameNew = $("#ProjectName").val();
            var domainNew = $("#domain").val();
            var bioNew = $("#bio").val();

            const phoneNew = $("#at-field-telephone").val();
            const skypeNew = $("#at-field-skype").val();
            const linkedinNew = $("#at-field-linkedIn").val();
            const positionNew = $("#position").val();

            //compares old value of name and new value after the change
            if (email === emailNew) {
                logoFunc();
            } else {
                //call to the method to update the project name field
                Meteor.call("IndividualEmail.update", emailNew, ProjectId);
                nullFunc();
            }
            if (name === nameNew) {
                logoFunc();
            } else {
                //call to the method to update the project name field
                Meteor.call("IndividualName.update", nameNew, ProjectId);
                nullFunc();
            }
            if (domain === domainNew) {
                logoFunc();
            } else {
                Meteor.call("IndividualDomain.update", domainNew, ProjectId);
                nullFunc();
            }
            if (bioNew === bio) {
                logoFunc();
            } else {
                Meteor.call("IndividualBio.update", bioNew, ProjectId);
                nullFunc();
            }
            if (phone === phoneNew) {
                logoFunc();
            } else {
                //call to the method to update the project name field
                Meteor.call("IndividualPhone.update", phoneNew, ProjectId);
                nullFunc();
            }
            if (skype === skypeNew) {
                logoFunc();
            } else {
                //call to the method to update the project name field
                Meteor.call("individualSkype.update", skypeNew, ProjectId);
                nullFunc();
            }
            if (linkedin === linkedinNew) {
                logoFunc();
            } else {
                //call to the method to update the project name field
                Meteor.call("individuallinkedin.update", linkedinNew, ProjectId);
                nullFunc();
            }
            if (position === positionNew) {
                logoFunc();
            } else {
                //call to the method to update the project name field
                Meteor.call("individualposition.update", positionNew, ProjectId);
                nullFunc();
            }
            var logoCheck = document.getElementById("logo");
            if (logoCheck.value !== '') {
                nullFunc();
            } else {
                logoFunc();
            }
        },
        'submit .form'(event) {
            somethingChanged = false;

            event.preventDefault();
            const target = event.target;
            const logoFile = target.logo && target.logo.files && target.logo.files.length && target.logo.files[0];

            //this takes the values for the logo
            const ProjectId = FlowRouter.getParam('individualsId');
            Images.insert(logoFile, (error, imageDocument) => {
                const logo = `cfs/files/images/${imageDocument._id}`;
                Meteor.call("individualLogo.update", logo, ProjectId);
            });
        }
    });
});
