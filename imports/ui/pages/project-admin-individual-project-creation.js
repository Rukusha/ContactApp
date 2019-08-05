import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Images } from '../../api/images/images';
import { Individuals } from '../../api/individuals/individuals';
import { IndividualsMinimal } from '../../api/IndividualsMinimal/IndividualsMinimal';
import { Users } from '../../api/users/users';
import { Partners } from '../../api/partners/partners';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveVar } from 'meteor/reactive-var';
import './project-admin-individual-project-creation.html';

function Back() {
    window.history.back();
};
var imageSent = false;
var Id = '';
var name = '';
var email = '';
var logoFile = '';
var owner = '';
var twitter = '';
var facebook = '';

var Cname = '';
var Cbio = '';
var Cfacebook = '';
var Ctwitter = '';

//persists data for forms on user navigation
Template.ProjectInividualFormCreate_page.rendered = function () {
    $("form[data-persist='garlic']").garlic();
};
Template.ProjectInividualFormCreate_page.onDestroyed(function onDestroyIndividualForm_page(){
    if(somethingChanged === true){
        alert("The information you have entered will be saved");
        somethingChanged = false;
    }
})
Template.ProjectInividualFormCreate_page.onCreated(function () {
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

});

Template.ProjectInividualFormCreate_page.helpers({
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

Template.ProjectInividualFormCreate_page.events({
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
    'submit .formOrg': function (event, template) {
        somethingChanged = false;
        event.preventDefault();
        const target = event.target;

        Cname = target.name.value;
        Cbio = target.bio.value;
        Cfacebook = target.Cfacebook.value;
        Ctwitter = target.Ctwitter.value;

        ClinkedIn = target.at_field_linkedIn.value;
        logoFileC = target.logo && target.logo.files && target.logo.files.length && target.logo.files[0];
        adminCheck = false;

        try {
            imageSent = false;
            Images.insert(logoFileC, (error, imageDocument) => {
                const Clogo = `cfs/files/images/${imageDocument._id}`;
                Meteor.call('partnersProject.insert', { Id, Cname, Cbio, Clogo, ClinkedIn, Cfacebook, Ctwitter },
                    function(error, result){
                        if(error){
                            console.log(error);
                        } else {
                            owner = result;

                        }
                });
                    imageSent = true;
                alert("You have sucessfully created a new Organisation. Now you will be asked to create an new admin account");
            });
        } catch (partner_Insert_Error) {
            alert("Please fill out all the fields and add an image");
        } finally {
                document.getElementById('AdminForm').style.display = "none";
                document.getElementById('CompanyAdminForm').style.display = "block";
        }
    },
    'change #logo'(){
        document.getElementById('OrgButton').style.display = "block";
    },
    'submit .formIndividual': function (event, template) {
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
        linkedIn = target.linkedIn.value;
        telephone = target.at_field_telephone.value;
        skype = target.at_field_skype.value;

        position = target.position.value;
        bio = target.bio.value;
        projects = [];
        var partnersInsert = Partners.findOne({ _id: result })

        partners = [partnersInsert];
        projectsNot = [];
        partnersNot = [];
        logoFile = target.logo && target.logo.files && target.logo.files.length && target.logo.files[0];

        //Insert a person into the individual collection
        if ((name !== '') && (logoFile !== '') && (owner !== '') && (emails !== '')) {
            try {
                imageSent = false;

                Images.insert(logoFile, (error, imageDocument) => {
                    const logo = `cfs/files/images/${imageDocument._id}`;
                    Meteor.call("individualsProject.insert", { result, Id, name, owner, twitter, facebook, linkedIn, bio, telephone, logo, skype, position, partners},
                    function(error, insertId){
                        if(error){
                            console.log(error);
                        } else {
                            Id = insertId;    
                        }
                    });

                    alert("You have sucessfully created a new Organisation Admin. Now you will be asked to create the project");
                });
            } finally {
                document.getElementById('CompanyAdminForm').style.display = "none";
                document.getElementById('projForm').style.display = "block";
                
            }
        } else {
            alert("Please fill out all the required fields");
        }
    },
    'change #projLogo'(){
        document.getElementById('projBtn').style.display = "block";
    },
    'change #adminLogo'(){
        document.getElementById('adminBtn').style.display = "block";
    },
    'click .createP'() {
        FlowRouter.go('ProjectIndividual.add');
    },
    //Project insert sections
    'submit .formProject'(event) {
        try {
            event.preventDefault();
            const target = event.target;
            const name = target.name.value;
            const domain = target.domain.value;
            const bio = target.bio.value;
            const logoFile = target.logo && target.logo.files && target.logo.files.length && target.logo.files[0];
            //retrieves the individual
            var insertId = IndividualsMinimal.findOne({ _id: Id });
            var owner = result;
            const individuals = [insertId];
            const admin = [insertId];

            //Insert a task into the collection
            try {
                Images.insert(logoFile, (error, imageDocument) => {
                    logo = `cfs/files/images/${imageDocument._id}`;
                    Meteor.call('projects.insert', { result, insertId, Id, owner, admin, name, individuals, partners, domain, bio, logo });
                });
                alert("You have created a new Project sucessfully");
            } catch (error) {
                alert("Please fill out all the required fields and add an image");
            }
        } catch{
            alert("Please fill out all the required fields and add an image");
        } finally {
            FlowRouter.go('ProjectList.show');
        }
    },
    'click .createP'() {
        FlowRouter.go('Individuals.add');
    },
    'click .cancel'(event) {
        Back();
    },
});