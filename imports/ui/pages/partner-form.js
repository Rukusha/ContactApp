import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Images } from '../../api/images/images';
import { Partners } from '../../api/partners/partners';
import { Projects } from '../../api/projects/projects';
import { Individuals } from '../../api/individuals/individuals';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveVar } from 'meteor/reactive-var';
import { Roles }  from 'meteor/alanning:roles';

import './partner-form.html';


function Back() {
    window.history.back();
}
;
Template.PartnerForm_page.onCreated(function onCreatedPartnerFormPage() {

    this.subscribe('projects');
    this.subscribe('individuals');

    this.availableProjects = new ReactiveVar([]);
    this.availableIndividuals = new ReactiveVar([]);
    this.selectedProjects = new ReactiveVar([]);
    this.selectedIndividuals = new ReactiveVar([]);

    this.autorun(() => {

        const projects = Projects.find({}, {
            fields: {_id: 1, name: 1},
            sort: {name: 1}
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

    Template.PartnerForm_page.helpers({
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
        }
    });

    Template.PartnerForm_page.events({
        'submit .form'(event) {
            var loggedInUser = Meteor.user();

            event.preventDefault();
            const target = event.target;
            const name = target.name.value;
            const owner = loggedInUser;
            const bio = target.bio.value;
            const projects = Template.instance().selectedProjects.get().map(({ _id }) => _id);
            const individuals = Template.instance().selectedIndividuals.get().map(({ _id }) => _id);
            const logoFile = target.logo && target.logo.files && target.logo.files.length && target.logo.files[0];

            Images.insert(logoFile, (error, imageDocument) => {
                const logo = `cfs/files/images/${imageDocument._id}`;
                var loggedInUser = Meteor.user();
                if (Roles.userIsInRole(loggedInUser, ['admin'], 'default-group')) {
                    Meteor.call('partners.insert', {name, owner, bio, logo, projects, individuals});
                }
                var UserWhoIssuedEvent = Meteor.user();
                const busServicePartner = {
                    UserWhoIssuedEvent, name, owner, bio, logo, projects, individuals

                };
                //Server call to persist the data. 
                Meteor.call("createBusServicePartner", busServicePartner, function (error, result) {
                    if (error) {
                        $(event.target).find(".error").html(error.reason);
                    } else {
                        Back();
                    }
                });
            });
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
});
