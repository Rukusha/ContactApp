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
FlowRouter.route('/partner/adds', {
    name: 'Partner.add',
    action: function renderProjectFormPage() {
        var loggedInUser = Meteor.user();
                if ((Roles.userIsInRole(loggedInUser, ['cAdmin'], 'default-group')) || (Roles.userIsInRole( loggedInUser, ['admin'], 'default-group'))) {
            BlazeLayout.render('App_body', {main: 'PartnerForm_page'});
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
            throw new Meteor.Error('not-authorized');
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
