import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Images } from '../../api/images/images';
import { Individuals } from '../../api/individuals/individuals';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveVar } from 'meteor/reactive-var';
import './project-form.html';

function Back() {
    window.history.back();
};

//persists data for forms on user navigation
Template.ProjectForm_page.rendered = function(){
    $( "form[data-persist='garlic']" ).garlic();
};
Template.ProjectForm_page.onDestroyed(function onDestroyIndividualForm_page(){
    if(somethingChanged === true){
        alert("The information you have entered will be saved");
        somethingChanged = false;
    }
});
Template.ProjectForm_page.onCreated(function onCreatedProjectFormPage() {
    somethingChanged = false;

    this.subscribe('partners');
    this.subscribe('projects');
    this.subscribe('individuals');

    Meteor.subscribe('partnersMinimal');
    Meteor.subscribe('projectsMinimal');
    Meteor.subscribe('individualsMinimal');

    this.availableIndividuals = new ReactiveVar([]);
    this.selectedIndividuals = new ReactiveVar([]);

    this.autorun(() => {
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
    'click .no'(){
        document.getElementById('adminDirectId').style.display = "none";
    },

    'click .logoSubmit': function (event, template) {
        somethingChanged = false;

        alert("Project has been updated");
        Back();
    },

    'click .Cancel': function (event, template) {
        Back();
    },

    'submit .form'(event) {   
        somethingChanged = false;

        try{
            event.preventDefault();
            const target = event.target;
            const name = target.name.value;
            const adminIn = target.admin.value;
            const domain = target.domain.value;
            const bio = target.bio.value;
            const logoFile = target.logo && target.logo.files && target.logo.files.length && target.logo.files[0];
            
            //retrieves the individual
            const docs = Individuals.findOne({_id: adminIn});
            const owner = docs.owner;
            const individuals = [adminIn];
            const admin = [adminIn];
            //Insert a task into the collection
            try{
                Images.insert(logoFile, (error, imageDocument) => {
                    logo = `cfs/files/images/${imageDocument._id}`;
                    Meteor.call('projectsNo.insert', {adminIn, owner, admin, name, individuals, domain, bio, logo});
                });

                alert("You have created a new Project sucessfully");
                FlowRouter.go('Project.add');

            }catch (error) {
                    alert("Please fill out all the required fields and add an image");
            }
            Back();
        }catch{
                alert("Please fill out all the required fields and add an image");
        }finally{

        }
    },

    'click .createP'() {
        FlowRouter.go('ProjectIndividual.add');
    },

    'click .cancel'(event) {
        Back();
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