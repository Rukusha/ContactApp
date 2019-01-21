import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Images } from '../../api/images/images';
import { Partners } from '../../api/partners/partners';
import { Projects } from '../../api/projects/projects';
import { Individuals } from '../../api/individuals/individuals';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveVar } from 'meteor/reactive-var';
import './partner-edit.html';

Template.PartnerEditForm_page.onCreated(function onCreatedPartnerEditFormPage() {
    
Template.PartnerEditForm_page.helpers({
  partners() {
    return Partners.find({}, { sort: { name: 1 }});
  }
});
    Meteor.subscribe('projects');
    Meteor.subscribe('individuals');
    Meteor.subscribe('partners');
   
//   this section is about retrieving the avaliable individuals and projects list
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

    Template.PartnerEditForm_page.helpers({
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
//this gets the values from the text fields on the partner edit page
    Template.PartnerEditForm_page.events({
        'submit .form'(event) {
            event.preventDefault();
            const target = event.target;
            const name = target.name.value;
            const bio = target.bio.value;
            const projects = Template.instance().selectedProjects.get().map(({ _id }) => _id);
            const individuals = Template.instance().selectedIndividuals.get().map(({ _id }) => _id);
            const logoFile = target.logo && target.logo.files && target.logo.files.length && target.logo.files[0];

            //this takes the values for the logo
            Images.insert(logoFile, (error, imageDocument) => {
                const partnerId = FlowRouter.getParam('partnerId');
                const logo = `/cfs/files/images/${imageDocument._id}`;
                var doc = Partners.findOne({ _id: partnerId });
                Partners.update({ _id:doc._id }, {$set:{name:name, logo:logo, bio:bio, projects:projects, individuals:individuals }});
                FlowRouter.go('PartnerList.show');
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
