import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Images } from '../../api/images/images';
import { Partners } from '../../api/partners/partners';
import { Individuals } from '../../api/individuals/individuals';

import { Projects } from '../../api/projects/projects';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveVar } from 'meteor/reactive-var';
import { Roles } from 'meteor/alanning:roles';
import { Users } from '../../api/users/users';

import './individual-form.html';

function Back() {
    $('#NewIndividual').val(Id);
    window.history.back();
};
fieldValue = '#';
//this function is used to dislay the no access notification to the current user f they dont have access
function restrict() {
    var showHide = document.getElementById("overNoAccess");
    showHide.style.display = "block";
};
//persists data for forms on user navigation
Template.IndividualForm_page.rendered = function () {
    $("form[data-persist='garlic']").garlic();
};

Template.IndividualForm_page.onDestroyed(function onDestroyIndividualForm_page(){
    if(somethingChanged === true){
        alert("The information you have entered will be saved");
        somethingChanged = false;
    }
});
Template.IndividualForm_page.onCreated(function onCreatedIndividualFormPage() {
    somethingChanged = false;

    this.subscribe('partners');
    this.subscribe('projects');

    this.availablePartners = new ReactiveVar([]);
    this.availableProjects = new ReactiveVar([]);

    this.selectedPartners = new ReactiveVar([]);
    this.selectedProjects = new ReactiveVar([]);

    this.autorun(() => {
        const projects = Projects.find({}, {
            fields: { _id: 1, name: 1 },
            sort: { name: 1 }
        }).fetch();
        this.availableProjects.set(projects);
        this.selectedProjects.set([]);

        const partners = Partners.find({}, {
            fields: { _id: 1, name: 1 },
            sort: { name: 1 }
        }).fetch();
        this.availablePartners.set(partners);
        this.selectedPartners.set([]);
    });
});

Template.IndividualForm_page.helpers({
    getAvailablePartners() {
        return Template.instance().availablePartners.get();
    },
    getSeletedPartners() {
        return Template.instance().selectedPartners.get();
    }
});

Template.IndividualForm_page.events({
    'click .Cancel': function (event, template) {
        Back();
    },
    'submit .form': function (event, template) {
        somethingChanged = false;
        //Prevent default browser form submit
        event.preventDefault();
        const roleText = "default-user";
        //Get value from form element
        const target = event.target;
        var name = target.name.value;
        const roles = roleText;
        const emails = target.emails.value;
        //Insert a admin into the collection
        //Here its adding the new user to the Users collection and retrieving the id
        Id = Users.insert({
            "services": {
                "password": {
                    "bcrypt": "$2b$10$AJaGl2l8EnMcRdt5n8EaWeukIw4XkzoxeRYOSbBUH9fij4ZgYjaFC"
                },
                "resume": {
                    "loginTokens": [
                        {
                        }
                    ]
                }
            },
            "emails": [
                {
                    "address": emails,
                    "verified": false
                }
            ],
            "profile": {
                "name": name
            },
            "roles": {
                "default-group": [
                    "default-user"
                ]
            }
        });

        //Prevent default browser form submit
        event.preventDefault();
        //Get value from form element
        const owner = target.owner.value;
        const linkedIn = target.at_field_linkedIn.value;
        const telephone = target.at_field_telephone.value;
        const skype = target.at_field_skype.value;
        const position = target.position.value;
        const bio = target.bio.value;

        const projects = Template.instance().selectedProjects.get().map(({ _id }) => _id);
        const partners = [Template.instance().selectedPartners.get().map(({ _id }) => _id)];
        const projectsNot = [];
        const partnersNot = [];
        const logoFile = target.logo && target.logo.files && target.logo.files.length && target.logo.files[0];

        //Insert a person into the individual collection
        try {
            Images.insert(logoFile, (error, imageDocument) => {
                const logo = `cfs/files/images/${imageDocument._id}`;
                Meteor.call('individuals.insert', { name, Id, owner, linkedIn, telephone, skype, position, bio, projectsNot, partnersNot, projects, partners, logo });
            });
            alert("You have created a new Individual sucessfully");
            fieldValue = Id;
            Back();

        } catch (error) {
            alert("Please fill out all the required fields");
            FlowRouter.go('Individuals.add');
        }
    },
    'click .no'() {
        document.getElementById('adminDirectId').style.display = "none";
    },
    'click .addPeople'() {
        FlowRouter.go('AdminEmployee.add');
    },
    'click .addAdmin'() {
        FlowRouter.go('Admin.add');
    },
    'click .cancel'() {
        //Prevent default browser form submit
        Back();
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
Template.IndividualForm_page.helpers({
    partners() {
        const Company = localStorage.getItem('key');
        return Partners.findOne({ _id: Company });
    },
    getAvailablePartners() {
        return Template.instance().availablePartners.get();
    },
    getSeletedPartners() {
        return Template.instance().selectedPartners.get();
    },
    getAvailableProjects() {
        return Template.instance().availableProjects.get();
    },
    getSeletedProjects() {
        return Template.instance().selectedProjects.get();
    }
});