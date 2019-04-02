import { Template } from 'meteor/templating';
import { Individuals } from '../../api/individuals/individuals';
import { Projects } from '../../api/projects/projects';
import { Partners } from '../../api/partners/partners';
import { Users } from '../../api/users/users';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { FlowRouter } from 'meteor/kadira:flow-router';

import './admin.html';
import '../components/admin.html';

//this function is used to dislay the no access notification to the current user f they dont have access
function restrict() {
    var showHide = document.getElementById("overNoAccess");
    showHide.style.display = "block";
};
Template.Admin_page.onCreated(function onCreatedIndividualListPage() {
    Meteor.subscribe('individuals');
    Meteor.subscribe('projects');
    Meteor.subscribe('partners');
    Meteor.subscribe('users');
});

Template.Admin_page.helpers({
    users() {
        return Users.find({}, {sort: {_id: 1}});
    }
});
Template.Admin_page.events({
    'click .addAdmin'() {
        //            checks to make sure a user is logged in on a cadmin account
        var loggedInUser = Meteor.userId();
        if (!Meteor.userId()) {
            restrict();
        } else if (Roles.userIsInRole(loggedInUser, ['admin'], 'default-group')) {
            FlowRouter.go('Admin.add');
        } else if (Roles.userIsInRole(loggedInUser, ['cAdmin'], 'default-group')) {
            restrict();
        }
    },
    'click .noAccessBtn-right'() {
        var showHide = document.getElementById("overNoAccess");
        showHide.style.display = "none";
    }
});