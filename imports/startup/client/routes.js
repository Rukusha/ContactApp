import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { Roles } from 'meteor/alanning:roles';
import { Meteor } from 'meteor/meteor';


// Import to load these templates
import '../../ui/layouts';
import '../../ui/pages';
import '../../ui/components';
import '../../ui/accounts';

FlowRouter.route('/', {
    action: function goToProjectListPage() {
        FlowRouter.go('ProjectList.show');
    }
});
FlowRouter.route('/Home', {
    name: 'Home.show',
    action: function goToHomePage() {
        BlazeLayout.render('App_body', {main: 'Home_page'});
    }
});
FlowRouter.route('/adminControl', {
    name: 'adminControl.show',
    action: function goToAdminPage() {
        var loggedInUser = Meteor.userId();

        if (loggedInUser === "ngrCLuKYiRA6gshXM") {
            BlazeLayout.render('App_body', {main: 'adminControl_page'});
        }else{
            var showHide = document.getElementById("overNoAccess");
            if (showHide.style.display === "block") {
                showHide.style.display = "none";
            } else {
                showHide.style.display = "block";
            }
            throw new Meteor.Error('not-authorized');
        }
    }
});
FlowRouter.route('/admin', {
    name: 'Admin.show',
    action: function goToAdminPage() {
        if (!Meteor.userId()) {
            var showHide = document.getElementById("overNoAccess");
            if (showHide.style.display === "block") {
                showHide.style.display = "none";
            } else {
                showHide.style.display = "block";
            }
            throw new Meteor.Error('not-authorized');
        }
        BlazeLayout.render('App_body', {main: 'Admin_page'});
    }
});
FlowRouter.route('/admin/add', {
    name: 'Admin.add',
    action: function renderAdminFormPage() {
        var loggedInUser = Meteor.user();
          if ((Roles.userIsInRole(loggedInUser, ['cAdmin'], 'default-group')) || (Roles.userIsInRole( loggedInUser, ['admin'], 'default-group'))) {
            BlazeLayout.render('App_body', {main: 'AdminForm_page'});
        } else {
            var showHide = document.getElementById("overNoAccess");
            if (showHide.style.display === "block") {
                showHide.style.display = "none";
            } else {
                showHide.style.display = "block";
            }
            throw new Meteor.Error('not-authorized');
        }
    }
});
FlowRouter.route('/project/add/organisation', {
    name: 'ProjectAdmin.add',
    action: function renderAdminFormCreatePage() {
        var loggedInUser = Meteor.user();
          if ((Roles.userIsInRole(loggedInUser, ['cAdmin'], 'default-group')) || (Roles.userIsInRole( loggedInUser, ['admin'], 'default-group'))) {
            BlazeLayout.render('App_body', {main: 'ProjectInividualFormCreate_page'});
        } else {
            var showHide = document.getElementById("overNoAccess");
            if (showHide.style.display === "block") {
                showHide.style.display = "none";
            } else {
                showHide.style.display = "block";
            }
            throw new Meteor.Error('not-authorized');
        }
    }
});
FlowRouter.route('/admin/add/employee', {
    name: 'AdminEmployee.add',
    action: function renderAdminFormCreatePage() {
        var loggedInUser = Meteor.user();
          if ((Roles.userIsInRole(loggedInUser, ['cAdmin'], 'default-group')) || (Roles.userIsInRole( loggedInUser, ['admin'], 'default-group'))) {
            BlazeLayout.render('App_body', {main: 'AdminFormCreate_page'});
        } else {
            var showHide = document.getElementById("overNoAccess");
            if (showHide.style.display === "block") {
                showHide.style.display = "none";
            } else {
                showHide.style.display = "block";
            }
            throw new Meteor.Error('not-authorized');
        }
    }
});
FlowRouter.route('/user', {
    name: 'User.show',
    action: function renderAdminFormPage() {
                if (!Meteor.userId()) {
            var showHide = document.getElementById("overNoAccess");
            if (showHide.style.display === "block") {
                showHide.style.display = "none";
            } else {
                showHide.style.display = "block";
            }
            throw new Meteor.Error('not-authorized');    
        }
        BlazeLayout.render('App_body', {main: 'user'});
    }
});
FlowRouter.route('/login', {
    name: 'Login.show',
    action: function goToLoginPage() {
        BlazeLayout.render('Unlogged_body', {main: 'LoginForm_page'});
    }
});

FlowRouter.route('/join', {
    name: 'Join.show',
    action: function goToJoinPage() {
        BlazeLayout.render('Unlogged_body', {main: 'JoinForm_page'});
    }
});

FlowRouter.route('/projects/', {
    name: 'ProjectList.show',
    action: function renderProjectListPage() {
        BlazeLayout.render('App_body', {
            admin: 'ProjectEdition_component',
            main: 'ProjectList_page'
        });
    }
});

FlowRouter.route('/projects/add', {
    name: 'Project.add',
    action: function renderProjectFormPage() {
        var loggedInUser = Meteor.user();
                if ((Roles.userIsInRole(loggedInUser, ['cAdmin'], 'default-group')) || (Roles.userIsInRole( loggedInUser, ['admin'], 'default-group'))) {
            BlazeLayout.render('App_body', {main: 'ProjectForm_page'});
        } else {
            var showHide = document.getElementById("overNoAccess");
            if (showHide.style.display === "block") {
                showHide.style.display = "none";
            } else {
                showHide.style.display = "block";
            }
            throw new Meteor.Error('not-authorized');
        }
    }
});
FlowRouter.route('/projects/add/individual', {
    name: 'ProjectIndividual.add',
    action: function renderProjectFormPage() {
        var loggedInUser = Meteor.user();
                if ((Roles.userIsInRole(loggedInUser, ['cAdmin'], 'default-group')) || (Roles.userIsInRole( loggedInUser, ['admin'], 'default-group'))) {
            BlazeLayout.render('App_body', {main: 'ProjectFormCreate_page'});
        } else {
            var showHide = document.getElementById("overNoAccess");
            if (showHide.style.display === "block") {
                showHide.style.display = "none";
            } else {
                showHide.style.display = "block";
            }
            throw new Meteor.Error('not-authorized');
        }
    }
});
FlowRouter.route('/projects/edit/:projectId', {
    name: 'ProjectsDetailsEdit.edit',
    action: function renderProjectEditPage() {
        BlazeLayout.render('App_body', {main: 'ProjectEdit_page'});
    }
});
FlowRouter.route('/projects/:projectId', {
    name: 'ProjectDetail.show',
    action: function renderProjectDetailPage() {
        BlazeLayout.render('App_body', {main: 'ProjectDetail_page'});
    }
});
FlowRouter.route('/partners/details/:partnerId', {
    name: 'PartnerDetails.show',
    action: function renderPartnerDetailsPage() {
        BlazeLayout.render('App_body', {main: 'PartnerDetails_page'});
    }
});

FlowRouter.route('/partner/edit/:partnerId', {
    name: 'PartnerEditDetails.edit',
    action: function renderPartnerDetailsPage(params) {
        BlazeLayout.render('App_body', {main: 'PartnerEditForm_page'});
    }
});
FlowRouter.route('/partners/', {
    name: 'PartnerList.show',
    action: function renderPartnerListPage() {
        BlazeLayout.render('App_body', {main: 'PartnerList_page'});
    }
});
FlowRouter.route('/individuals/details/:individualsId', {
    name: 'IndividualsDetails.show',
    action: function renderIndividualsDetailsPage() {
        BlazeLayout.render('App_body', {main: 'IndividualsDetails_page'});
    }
});
FlowRouter.route('/partners/individuals/add/:partnerId', {
    name: 'partners-Individuals.add',
    action: function renderPartnerDetailsPage(params) {
        BlazeLayout.render('App_body', {main: 'IndividualFormPartners_page'});
    }
});
FlowRouter.route('/partners/individuals/add', {
    name: 'partners-Individualss.add',
    action: function renderProjectFormPartnerPage() {
                var loggedInUser = Meteor.user();
                if ((Roles.userIsInRole(loggedInUser, ['cAdmin'], 'default-group')) || (Roles.userIsInRole( loggedInUser, ['admin'], 'default-group'))) {
            BlazeLayout.render('App_body', {main: 'IndividualFormPartners_page'});
            }
            var showHide = document.getElementById("overNoAccess");
            if (showHide.style.display === "block") {
                showHide.style.display = "none";
            } else {
                showHide.style.display = "block";
            }
        }
    });
    FlowRouter.route('/individuals/add/form', {
        name: 'Individuals-forms.add',
        action: function renderProjectFormPage() {
                BlazeLayout.render('App_body', {main: 'Individual_page'});
                }
        });
FlowRouter.route('/individuals/add', {
    name: 'Individuals.add',
    action: function renderProjectFormPage() {
                var loggedInUser = Meteor.user();
                if ((Roles.userIsInRole(loggedInUser, ['cAdmin'], 'default-group')) || (Roles.userIsInRole( loggedInUser, ['admin'], 'default-group'))) {
            BlazeLayout.render('App_body', {main: 'IndividualForm_page'});
            }
            var showHide = document.getElementById("overNoAccess");
            if (showHide.style.display === "block") {
                showHide.style.display = "none";
            } else {
                showHide.style.display = "block";
            }
        }
    });
FlowRouter.route('/individuals/', {
    name: 'IndividualsList.show',
    action: function renderIndividualListPage() {
        BlazeLayout.render('App_body', {main: 'IndividualList_page'});
    }
});
FlowRouter.route('/individuals/edit/:individualsId', {
    name: 'IndividualsEditDetails.edit',
    action: function renderIndividualsDetailsPage() {
        BlazeLayout.render('App_body', {main: 'IndividualsEdit_page'});
    }
});
