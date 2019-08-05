import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Projects } from '../../api/projects/projects';
import { ReactiveVar } from 'meteor/reactive-var';
import { Roles } from 'meteor/alanning:roles';
import { FlowRouter } from 'meteor/kadira:flow-router';

import './project-list.html';

//this function is used to dislay the no access notification to the current user f they dont have access
function restrictother() {
    var showHide = document.getElementById("overNoAccess");
    showHide.style.display = "none";
}
;
//this function is used to dislay the no access notification to the current user f they dont have access
function restrict() {
    var showHide = document.getElementById("overNoAccess");
    showHide.style.display = "block";
}
;
Template.ProjectList_page.onCreated(function onCreatedProjectListPage() {
    Meteor.subscribe('projects');

});

Template.ProjectList_page.helpers({
    projects() {
        return Projects.find({}, { sort: { name: 1 } });
    }
});
Template.ProjectList_page.events({
    'click .addP'() {
        //checks to make sure a user is logged in on a cadmin account
        var loggedInUser = Meteor.userId();
        if (!Meteor.userId()) {
            restrict();
        }
        else if ((Roles.userIsInRole(loggedInUser, ['cAdmin'], 'default-group')) || (Roles.userIsInRole(loggedInUser, ['admin'], 'default-group'))) {
            FlowRouter.go('Project.add');
        }
    },

    'click .noAccessBtn-right'() {
        var showHide = document.getElementById("overNoAccess");
        showHide.style.display = "none";
    }
});

