import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Images } from '../../api/images/images';
import { Partners } from '../../api/partners/partners';
import { Individuals } from '../../api/individuals/individuals';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveVar } from 'meteor/reactive-var';
import { Roles }  from 'meteor/alanning:roles';
import './project-form.html';

Template.ProjectForm_page.onCreated(function onCreatedProjectFormPage() {

    this.subscribe('partners');
    this.subscribe('individuals');

    this.availablePartners = new ReactiveVar([]);
    this.availableIndividuals = new ReactiveVar([]);

    this.selectedPartners = new ReactiveVar([]);
    this.selectedIndividuals = new ReactiveVar([]);

    this.autorun(() => {

        const partners = Partners.find({}, {
            fields: {_id: 1, name: 1},
            sort: {name: 1}
        }).fetch();
        this.availablePartners.set(partners);
        this.selectedPartners.set([]);

        const individuals = Individuals.find({}, {
            fields: {name: 1},
            sort: {name: 1}
        }).fetch();

        this.availableIndividuals.set(individuals);
        this.selectedIndividuals.set([]);
    });
});

Template.ProjectForm_page.helpers({
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
Template.ProjectForm_page.events({
    'submit .form'(event) {
        event.preventDefault();
        const target = event.target;
        const owner = Template.instance().selectedIndividuals.get().map(({ _id }) => _id);
        const name = target.name.value;
        const domain = target.domain.value;
        const bio = target.bio.value;
        const individuals = Template.instance().selectedIndividuals.get().map(({ _id }) => _id);
        const logoFile = target.logo && target.logo.files && target.logo.files.length && target.logo.files[0];

        // Insert a task into the collection
        Images.insert(logoFile, (error, imageDocument) => {
            const logo = `/cfs/files/images/${imageDocument._id}`;
            var loggedInUser = Meteor.user();
            if (Roles.userIsInRole(loggedInUser, ['admin'], 'default-group')) {
                Meteor.call('projects.insert', {owner, name, domain, bio, logo, individuals});
            } else {
                console.log("Access restricted");
            }
        });
        FlowRouter.go('ProjectList.show');
    },
    'click .cancel'(event) {
        // Prevent default browser form submit
        event.preventDefault();

        FlowRouter.go('ProjectList.show');
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