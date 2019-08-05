import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Images } from '../../api/images/images';
import { Individuals } from '../../api/individuals/individuals';
import { Users } from '../../api/users/users';
import { Partners } from '../../api/partners/partners';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveVar } from 'meteor/reactive-var';
import './project-form-create.html';


function Back() {
    window.history.back();
};
//persists data for forms on user navigation
Template.ProjectFormCreate_page.rendered = function () {
    $("form[data-persist='garlic']").garlic();
};
Template.ProjectFormCreate_page.onDestroyed(function onDestroyIndividualForm_page(){
    if(somethingChanged === true){
        alert("The information you have entered will be saved");
        somethingChanged = false;
    }
});
Template.ProjectFormCreate_page.onCreated(function onCreatedProjectFormCreatePage() {
    somethingChanged = false;

    this.subscribe('partners');
    this.subscribe('projects');
    this.subscribe('individuals');

    Meteor.subscribe('partnersMinimal');
    Meteor.subscribe('projectsMinimal');
    Meteor.subscribe('individualsMinimal');

    this.availableIndividuals = new ReactiveVar([]);
    this.selectedIndividuals = new ReactiveVar([]);

    this.availablePartners = new ReactiveVar([]);
    this.selectedPartners = new ReactiveVar([]);
    
    this.autorun(() => {
        const individuals = Individuals.find({}, {
            fields: { name: 1 },
            sort: { name: 1 }
        }).fetch();
        this.availableIndividuals.set(individuals);
        this.selectedIndividuals.set([]);

        const partners = Partners.find({}, {
            fields: { _id: 1, name: 1 },
            sort: { name: 1 }
        }).fetch();
        this.availablePartners.set(partners);
        this.selectedPartners.set([]);
    });

    name = '';
    email = '';
    logoFile = '';
    owner = '';
});

Template.ProjectFormCreate_page.helpers({
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

Template.ProjectFormCreate_page.events({
    'click .no'() {
        document.getElementById('adminDirectId').style.display = "none";
    },

    'click .yes'() {
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

    'submit .formIndividual': function (event, template) {
        somethingChanged = false;
        //Prevent default browser form submit
        event.preventDefault();
        const roleText = "default-user";
        //Get value from form element
        const target = event.target;
        name = target.name.value;
        roles = roleText;
        emails = target.emails.value;
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
        owner = target.owner.value;
        linkedIn = target.at_field_linkedIn.value;
        telephone = target.at_field_telephone.value;
        skype = target.at_field_skype.value;
        position = target.position.value;
        bio = target.bio.value;
        projects = [];
        partners = [Template.instance().selectedPartners.get().map(({ _id }) => _id)];
        projectsNot = [];
        partnersNot = [];
        logoFile = target.logo && target.logo.files && target.logo.files.length && target.logo.files[0];

        //Insert a person into the individual collection
        if ((name !== '') && (logoFile !== '') && (owner !== '') && (emails !== '')) {
            try {
                const _id = Id;
                Images.insert(logoFile, (error, imageDocument) => {
                    const logo = `cfs/files/images/${imageDocument._id}`;
                    Meteor.call("individuals.insert", { Id, name, owner, linkedIn, bio, telephone, logo, skype, position, partners })
                });
            } finally {
                document.getElementById('formBoxInidividual').style.display = "none";
                document.getElementById('formBoxProject').style.display = "block";
            }
        } else {
            alert("Please fill out all the required fields");
        }
    },

    'click .addAdmin'() {
        FlowRouter.go('Admin.add');
    },
    
    'click .createAdmin'() {
        FlowRouter.go('ProjectAdmin.add');
    },

    //Project insert sections
    'submit .form'(event) {
        somethingChanged = false;

        try {
            event.preventDefault();
            const target = event.target;
            const name = target.name.value;
            const adminIn = Id;
            const domain = target.domain.value;
            const bio = target.bio.value;
            const logoFile = target.logo && target.logo.files && target.logo.files.length && target.logo.files[0];
            //retrieves the individual
            const docs = Individuals.findOne({ _id: adminIn });
            const owner = docs.owner;
            const individuals = [adminIn];
            const admin = [adminIn];

            //Insert a task into the collection
            try {
                Images.insert(logoFile, (error, imageDocument) => {
                    logo = `cfs/files/images/${imageDocument._id}`;
                    Meteor.call('projects.insert', { Id, adminIn, owner, admin, name, individuals, partners, domain, bio, logo });
                });
                alert("You have created a new Project sucessfully");
            } catch (error) {
                alert("Please fill out all the required fields and add an image");
            }
            Back();
        } catch{
            alert("Please fill out all the required fields and add an image");
        }finally{
            FlowRouter.go('ProjectList.show');
        }
    },

    'click .cancel'(event) {
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
});