import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Images } from '../../api/images/images';
import { Partners } from '../../api/partners/partners';
import { Projects } from '../../api/projects/projects';
import { ProjectsMinimal } from '../../api/ProjectsMinimal/ProjectsMinimal';
import { Individuals } from '../../api/individuals/individuals';
import { Users } from '../../api/users/users';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveVar } from 'meteor/reactive-var';
import { Roles } from 'meteor/alanning:roles';

import './admin.html';
function Back() {
    window.history.back();
};

var Ctwitter = "#";
var Cfacebook = "#";
var ClinkedIn = "#";
var Id = "#";

var Cname = '';
var Cbio = '#';
var Cowner = '#';
var logoFileC = '';
var logoFile = '';
var projects = '#';
var individuals = '#';
var partnerId = '#';
const roleText = "cAdmin";

//persists data for forms on user navigation

Template.Admin_page.rendered = function () {
    $("form[data-persist='garlic']").garlic();
};
Template.Admin_page.onDestroyed(function onDestroyIndividualForm_page() {
    if (somethingChanged === true) {
        alert("The information you have entered will be saved");
        somethingChanged = false;
    }
});
Template.Admin_page.onCreated(function onCreatedAdminFormPage() {
    somethingChanged = false;

    this.subscribe('users');
    this.subscribe('individuals');
    this.subscribe('projects');

    Meteor.subscribe('partnersMinimal');
    Meteor.subscribe('projectsMinimal');
    Meteor.subscribe('individualsMinimal');

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
});
Template.Admin_page.helpers({
    getAvailableProjects() {
        return Template.instance().availableProjects.get();
    },
    getSeletedProjects() {
        return Template.instance().selectedProjects.get();
    },
    getAvailableIndividuals() {
        return Template.instance().availableIndividuals.get();
    },
    getSeletedIndividuals() {
        return Template.instance().selectedIndividuals.get();
    },
});

Template.Admin_page.events({
    'click .no'() {
        document.getElementById('adminDirectId').style.display = "none";
    },
    'click .addPeople'() {
        FlowRouter.go('AdminEmployee.add');
    },
    'change .form'() {
        if ((logoFile === '') || (Cname === '') || (Cowner === '')) {
            document.getElementById('adminSubmit').style.display = "none";
        }
    },
    'click .cancel'(event) {
        //Prevent default browser form submit
        event.preventDefault();

        const current = FlowRouter.current();
        const old = current.oldRoute;

        FlowRouter.go(old ? old.name : 'admin.show');
    },
    'change .formOrg'() {
        const target = event.target;
        logoFileC = target.logo && target.logo.files && target.logo.files.length && target.logo.files[0];
        if (logoFileC === '') {
            document.getElementById('adminSubmit2').style.display = "none";
        } else {
            document.getElementById('adminSubmit2').style.display = "block";
        }
    },
    'click .Cancel': function (event, template) {
        Back();
    },
    'submit .formOrg': function (event, template) {
        somethingChanged = false;

        event.preventDefault();
        const target = event.target;
        adminOld = target.admin.value;
        if (adminOld == "") {
            adminOld = "admin";
        }
        if (adminOld != "admin") {
            Cowner = adminOld;
        } else {
            Cowner = Id;
        }

        Cname = target.name.value;
        Cbio = target.bio.value;
        Ctwitter = target.at_field_twitter.value;
        Cfacebook = target.at_field_facebook.value;
        ClinkedIn = target.at_field_linkedIn.value;
        projects = Template.instance().selectedProjects.get().map(({ _id }) => _id);
        individuals = [Cowner];
        logoFileC = target.logo && target.logo.files && target.logo.files.length && target.logo.files[0];
        adminCheck = false;

        try {
            Images.insert(logoFileC, (error, imageDocument) => {
                const Clogo = `cfs/files/images/${imageDocument._id}`;
                Meteor.call('partners.insert', { Cname, Cbio, Clogo, Cowner, ClinkedIn, Cfacebook, Ctwitter, projects, individuals });
            });

        } catch (partner_Insert_Error) {
            alert("Please fill out all the fields and add an image");
        }
        if (adminOld == "admin") {
            //Hides the New organisation form
            var showHide = document.getElementById("CompanyForm");
            showHide.style.display = "none";
            //Shows the new individual form
            var showHide = document.getElementById("cAdminForm");
            showHide.style.display = "block";
            adminCheck = true;
            alert("You have sucessfully created a new Organisation and will now be asked to create an Admin for the Organisation that was just created");
        } else {
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
    'change select[name="partners"]'(event) {
        const id = event.target.value;
        const availablePartners = Template.instance().availablePartners.get();
        const selectedPartners = Template.instance().selectedPartners.get();
        const optionIndex = availablePartners.findIndex(option => option._id === id);
        const selectedPartner = availablePartners.splice(optionIndex, 1)[0];
        selectedPartners.push(selectedPartner);
        Template.instance().availablePartners.set(availablePartners);
        Template.instance().selectedPartners.set(selectedPartners);
    },
    'click .tag.is-partner'(event) {

        event.preventDefault();
        const id = event.target.dataset.id;
        const availablePartners = Template.instance().availablePartners.get();
        const selectedPartners = Template.instance().selectedPartners.get();
        const optionIndex = selectedPartners.findIndex(option => option._id === id);
        const deletedPartner = selectedPartners.splice(optionIndex, 1);
        availablePartners.push(deletedPartner);
        Template.instance().availablePartners.set(availablePartners);
        Template.instance().selectedPartners.set(selectedPartners);
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