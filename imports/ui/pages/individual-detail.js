import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Projects } from '../../api/projects/projects';
import { Partners } from '../../api/partners/partners';
import { Individuals } from '../../api/individuals/individuals';
import { Users } from '../../api/users/users';
import { FlowRouter } from 'meteor/kadira:flow-router';
import './individual-detail.html';
import { Roles } from 'meteor/alanning:roles';
import { IndividualsMinimal } from '../../api/IndividualsMinimal/IndividualsMinimal';


//this function is used to dislay the no access notification to the current user if they dont have access
function restrict() {
    var showHide = document.getElementById("overNoAccess");
    showHide.style.display = "block";
};

var formDataHandle = {};
Template.IndividualsDetails_page.imgLoaded = function() {
  return formDataHandle && formDataHandle.ready();
}

Template.IndividualsDetails_page.formData = function() {
  if( formDataHandle && formDataHandle.ready() ) {
     const project = FlowRouter.getParam('individualsId');
     var form = Individuals.findOne({ _id : project });
     return FormDatas.find({ _id: form._id, logo });
  }
}

Template.IndividualsDetails_page.created = function() {
  formDataHandle = Meteor.subscribe("individuals");
}

Template.IndividualsDetails_page.rendered = function () {
    
    const phone = $("#at-field-telephoneInvisible").val();
    const skype = $("#at-field-skypeInvisible").val();
    const linkedin = $("#at-field-linkedInInvisible").val();
    const facebook = $("#at-field-facebookInInvisible").val();
    const twitter = $("#at-field-twitterInInvisible").val();


    // social media icons wether to display them or not
    var facebookIcon = document.getElementById("facebookIcon");
    if (facebook != "") {
        facebookIcon.style.display = "-webkit-inline-box";
    } else {
        facebookIcon.style.display = "none";
    }
    var twitterIcon = document.getElementById("twitterIcon");
    if (twitter != "") {
        twitterIcon.style.display = "-webkit-inline-box";
    } else {
        twitterIcon.style.display = "none";
    }
    var skypeIcon = document.getElementById("skypeIcon");
    if (skype != "") {
        skypeIcon.style.display = "-webkit-inline-box";
    } else {
        skypeIcon.style.display = "none";
    }
    var phoneIcon = document.getElementById("phoneIcon");
    if (phone != "") {
        phoneIcon.style.display = "-webkit-inline-box";
    } else {
        phoneIcon.style.display = "none";
    }
    var linkedinIcon = document.getElementById("linkedinIcon");
    if (linkedin != "") {
        linkedinIcon.style.display = "-webkit-inline-box";
    } else {
        linkedinIcon.style.display = "none";
    }
};

Template.IndividualsDetails_page.onCreated(function onCreatedIndividualsDetailsPage() {
    Template.IndividualsDetails_page.helpers({
        //This lists the avaliable projects when the projects menu is selected
        projectsAdd() {
            const project = FlowRouter.getParam('individualsId');
            const individualsObject = Individuals.findOne({ _id: project });

            // gets the ProjectsNot for the individualsection
            const individualsIds = individualsObject.projectsNot;
            return individualsIds;
        },
        individualsAdd() {
            const project = FlowRouter.getParam('individualsId');
            const partnerObject = Individuals.findOne({ _id: project });

            const individualsIds = partnerObject.partnersNot;
            return individualsIds;
        }
    });

    Meteor.subscribe('projects');
    Meteor.subscribe('partners');
    
    Meteor.subscribe('users');

    Meteor.subscribe('projectsMinimal');
    Meteor.subscribe('partnersMinimal');

    Meteor.subscribe('individuals');
    Meteor.subscribe('individualsMinimal');

    this.availableProjects = new ReactiveVar([]);
    this.availablePartners = new ReactiveVar([]);
    this.selectedProjects = new ReactiveVar([]);
    this.selectedPartners = new ReactiveVar([]);

    this.autorun(() => {
        const projects = Projects.find({}, {
            fields: { _id: 1, name: 1 },
            sort: { name: 1 }
        }).fetch();
        this.availableProjects.set(projects);
        this.selectedProjects.set([]);
        const partners = Partners.find({}, {
            fields: { name: 1 },
            sort: { name: 1 }
        }).fetch();
        this.availablePartners.set(partners);
        this.selectedPartners.set([]);
    });

    Template.IndividualsDetails_page.events({
        'click .createProject'() {
            FlowRouter.go('Project.add');
        },
        'click .createP'() {
            FlowRouter.go('Admin.add');
        },
        'click .addPeoples'() {
            if (!Meteor.userId()) {
                restrict();
            } else {
                var loggedInUser = Meteor.userId();
                if ((Roles.userIsInRole(loggedInUser, ['cAdmin'], 'default-group')) || (Roles.userIsInRole(loggedInUser, ['admin'], 'default-group'))) {

                    var addProject = document.getElementById("addProject");
                    var showHide = document.getElementById("addPeople");
                    var modal = document.getElementById("modal-Mine");
                    var close = document.getElementById("modalClose");

                    var closeleft = document.getElementById("addPeoples");
                    closeleft.style.display = "none";
                    modal.style.display = "block";
                    showHide.style.display = "block";
                    close.style.display = "block";
                    addProject.style.display = "block";
                } else {
                    restrict();
                }
            }
        },
        'click .addP'() {
            if (!Meteor.userId()) {
                restrict();

            } else {
                var loggedInUser = Meteor.userId();
                if ((Roles.userIsInRole(loggedInUser, ['cAdmin'], 'default-group')) || (Roles.userIsInRole(loggedInUser, ['admin'], 'default-group'))) {
                    var showHide = document.getElementById("addProject");
                    var modal = document.getElementById("modal-Mine");
                    var close = document.getElementById("modalClose");

                    var closeleft = document.getElementById("addPeople");
                    closeleft.style.display = "none";

                    var addPeoples = document.getElementById("addPeoples");
                    addPeoples.style.display = "block";

                    modal.style.display = "block";
                    showHide.style.display = "block";
                    close.style.display = "block";
                    addPeoples.style.display = "block";
                } else {
                    restrict();
                }
            }
        },
        'click .remove'() {
            const individualsId = FlowRouter.getParam('individualsId');
            if (!Meteor.userId()) {
                restrict();
            } else {
                var loggedInUser = Meteor.user();
                if ((Roles.userIsInRole(loggedInUser, ['cAdmin'], 'default-group')) || (Roles.userIsInRole(loggedInUser, ['admin'], 'default-group'))) {
                    Meteor.call('individuals.remove', { individualsId });

                    console.log("Individual has been removed");
                    FlowRouter.go('IndividualsList.show');
                } else {
                    restrict();
                }
            }
        },
        'click .edit'() {
            const individualsId = FlowRouter.getParam('individualsId');
            if (!Meteor.userId()) {
                restrict();
            } else {
                var loggedInUser = Meteor.userId();
                if ((Roles.userIsInRole(loggedInUser, ['cAdmin'], 'default-group')) || (Roles.userIsInRole(loggedInUser, ['admin'], 'default-group'))) {
                    FlowRouter.go('IndividualsEditDetails.edit', { individualsId: individualsId });
                } else {
                    restrict();
                }
            }
        }
    });
    Template.IndividualsDetails_page.events({
        //This section will add a person to a partner
        'click .individualAdd'() {
            //checks to make sure a user is logged in
            if (!Meteor.userId()) {
                restrict();
            } else {
                //checks to make sure a user is logged in on an admin account
                var loggedInUser = Meteor.user();
                if ((Roles.userIsInRole(loggedInUser, ['cAdmin'], 'default-group')) || (Roles.userIsInRole(loggedInUser, ['admin'], 'default-group'))) {
                    //sets the the value to the Id of the partner
                    var name = $(this).attr('_id');
                    //updates the entry
                    const individualsId = FlowRouter.getParam('individualsId');
                    Meteor.call('individualsPartnersAdd.update', { name, individualsId });

                    //Partners.update({ _id: doc._id }, { $addToSet: { individuals: individualsId } });

                    console.log("individual has been added to partner");
                    var addProject = document.getElementById("addProject");
                    addProject.style.display = "none";
                } else {
                    restrict();
                }
            }
        }
    });
    Template.IndividualsDetails_page.events({
        'click .projectAdd'() {
            //checks to make sure a user is logged in
            if (!Meteor.userId()) {
                restrict();
            } else {
                //checks to make sure a user is logged in on an admin account
                var loggedInUser = Meteor.user();
                if ((Roles.userIsInRole(loggedInUser, ['cAdmin'], 'default-group')) || (Roles.userIsInRole(loggedInUser, ['admin'], 'default-group'))) {
                    //Finds the appropriate partner Id
                    //sets the the value to the Id of the project
                    var name = $(this).attr('_id');
                    //updates the entry
                    const individualsId = FlowRouter.getParam('individualsId');
                    Meteor.call('individualsProjectAdd.update', { name, individualsId });

                    console.log("Project has been added to individuals");
                    var showHide = document.getElementById("addProject");
                    showHide.style.display = "none";
                    var showHide = document.getElementById("projectList");
                    showHide.style.display = "hide";
                } else {
                    restrict();
                }
            }
        },
        'click .noAccessBtn-right'() {
            var showHide = document.getElementById("overNoAccess");
            showHide.style.display = "none";
        },
        'click .close'() {
            var addProject = document.getElementById("addProject");
            var addPeople = document.getElementById("addPeople");
            addProject.style.display = "none";
            addPeople.style.display = "none";

        }
    });
    Template.IndividualsDetails_page.helpers({
        'click .card.partner'(event) {
            //Prevent default browser form submit
            event.preventDefault();
            event.stopPropagation();
            //Go to the partner detail page
            FlowRouter.go('PartnerEditDetails.edit', { partnerId: this._id.valueOf() });
        }
    });
    Template.IndividualsDetails_page.helpers({
        individuals() {
            const partnerId = FlowRouter.getParam('individualsId');
            return Individuals.findOne({ _id: partnerId });
        },
        hasPartners() {
            const partnerIds = FlowRouter.getParam('individualsId');
            var projectObject = Individuals.findOne({ _id: partnerIds });

            const partnersObject = projectObject.partners || [];

            return !!partnersObject.length;
        },
        partners() {
            const partnerIds = FlowRouter.getParam('individualsId');
            var projectObject = Individuals.findOne({ _id: partnerIds });

            const partnersObject = projectObject.partners || [];

            return partnersObject;
        },
        //gets the projects that the individual is connected with
        hasProjects() {
            const partnerIds = FlowRouter.getParam('individualsId');
            var partnerObject = Individuals.findOne({ _id: partnerIds });

            const projectIds = partnerObject.projects || [];
            return !!projectIds.length;
        },
        projects() {
            const partnerIds = FlowRouter.getParam('individualsId');
            var partnerObject = Individuals.findOne({ _id: partnerIds });

            var projectIs = partnerObject.projects || [];
            return projectIs;
        },
    });
});
