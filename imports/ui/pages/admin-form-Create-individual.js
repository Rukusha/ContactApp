import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Images } from '../../api/images/images';
import { Individuals } from '../../api/individuals/individuals';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveVar } from 'meteor/reactive-var';
import { Roles } from 'meteor/alanning:roles';
import './admin-form-Create-individual.html';

function Back() {
    FlowRouter.go('PartnerList.show');
};

var CompanyDATA = [];
var personDATA = [];
var Ctwitter = "#";
var Cfacebook = "#";
var ClinkedIn = "#";

//persists data for forms
Template.AdminFormCreate_page.rendered = function () {
    $("form[data-persist='garlic']").garlic();
};
Template.AdminFormCreate_page.onDestroyed(function onDestroyIndividualForm_page() {
    // when the template is being destroyed it will ask the user if their sure they want to leave
    if (somethingChanged === true) {
        alert("The information you have entered will be saved");
        somethingChanged = false;
    }
});
// these variables are here to make sure to clear the fields when navigating back to this page after inserts have already happened
    var bio ='';
    var Cname = '';
    var Cbio = '#';
    var owner = '#';
    var emails = '';
    var logoFileC = '';
    var logoFile = '';
    var projects = '#';
    var individuals = '#';
    var AllProj = '';

    const roleText = "cAdmin";
    var logo = "";
    var linkedIn = '';
    var telephone = '';
    var skype = '';
    var position = '';
    var partners = '';
    var projects = '';
    var logoFile = '';


    var name = '';
    var emails = '';
    var bio = '';
    var linkedIn = '';
    var telephone = '';
    var skype = '';
    var position = '';
    var partners = [];
    var projects = [];
    var logoFile = 
    
Template.AdminFormCreate_page.onCreated(function onCreatedAdminFormCreatePage() {
    somethingChanged = false;

    // this subscribes to the appropiate collections
    this.subscribe('users');
    this.subscribe('individuals');
    this.subscribe('projects');

    Meteor.subscribe('partnersMinimal');
    Meteor.subscribe('projectsMinimal');
    Meteor.subscribe('individualsMinimal');

    this.availableIndividuals = new ReactiveVar([]);
    this.selectedIndividuals = new ReactiveVar([]);

    this.autorun(() => {
        const individuals = Individuals.find({}, {
            fields: { name: 1 },
            sort: { name: 1 }
        }).fetch();
        this.availableIndividuals.set(individuals);
        this.selectedIndividuals.set([]);
    });

    Template.AdminFormCreate_page.helpers({
        getAvailableIndividuals() {
            return Template.instance().availableIndividuals.get();
        },
        getSeletedIndividuals() {
            return Template.instance().selectedIndividuals.get();
        },
    });
});
Template.AdminFormCreate_page.events({
    // Navigation to adding a employee form
    'click .addPeople'() {
        FlowRouter.go('Individuals.add');
    },

    'submit .form': function (event, template) {
        somethingChanged = false;
        //Prevent default browser form submit
        event.preventDefault();
        //Get value from form element
        //Insert a admin into the collection
        var loggedInUser = Meteor.user();
        //role check
        if (Roles.userIsInRole(loggedInUser, ['admin'], 'default-group')) {
            //Here its adding the new user to the Users collection and retrieving the id
            roles = roleText;
            target = event.target;
            name = target.name.value;
            emails = target.emails.value;
            bio = target.bio.value;
            linkedIn = target.linkedIn.value;
            telephone = target.at_field_telephone.value;
            skype = target.at_field_skype.value;
            position = target.position.value;
            partners = [];
            projects = [];
            logoFile = target.logo && target.logo.files && target.logo.files.length && target.logo.files[0];
            
            //Insert a image into the images collections
            Images.insert(logoFile, (error, imageDocument) => {
                var logo = `cfs/files/images/${imageDocument._id}`;
                // stores all the data collected into a single 
                personDATA = { skype, telephone, roles, emails, owner, name, bio, position, logo, partners, linkedIn, projects, partners };


            });
            alert("You have sucessfully created a new Organisation Admin and now will be asked to create the Organisation itself");
        }
    },
    'click .cancel'(event) {
        //Prevent default browser form submit
        event.preventDefault();
        const current = FlowRouter.current();
        const old = current.oldRoute;
        FlowRouter.go(old ? old.name : 'admin.show');
    },
    'change .formAdminOrg'() {
        const target = event.target;
        logoFileC = target.logo && target.logo.files && target.logo.files.length && target.logo.files[0];
    //  this checks to see if the file input is empty or not
// if it isnt it will display the appropiate button
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
        event.preventDefault();
        const target = event.target
        Cname = target.nameC.value;
        Cbio = target.bioC.value;
        var Ctwitter = target.at_field_twitter.value;
        var Cfacebook = target.at_field_facebook.value;
        var ClinkedIn = target.at_field_linkedIn.value;
        var Cprojects = [];
        var Cindividuals = [];


        logoFileC = target.logoC && target.logoC.files && target.logoC.files.length && target.logoC.files[0];
        adminCheck = false;
        alert("You have sucessfully created a new Organisation");
        Images.insert(logoFileC, (error, imageDocument) => {
            var Clogo = `cfs/files/images/${imageDocument._id}`;

            CompanyDATA = { Cname, Cbio, Clogo, ClinkedIn, Cfacebook, Ctwitter, Cprojects, Cindividuals };
            var TotalDATA = { personDATA, CompanyDATA };

            Meteor.call('partnersCreateInidividual.insert', TotalDATA, function(error, result){
                AllProj = result;
            });
        });
        Back();
    },
    'click .cancel'(event) {
        event.preventDefault();

        const current = FlowRouter.current();
        const old = current.oldRoute;

        FlowRouter.go(old ? old.name : 'ProjectList.show');
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