import { Template } from 'meteor/templating';
import { Images } from '../../api/images/images';
import { Users } from '../../api/users/users';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveVar } from 'meteor/reactive-var';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import './navigation.html';

Template.Navigation_component.rendered = function () {
    if (!this._rendered) {
        this._rendered = true;
        var loggedInUser = Meteor.userId();
        if (!Meteor.userId()) {
            var admin = document.getElementById("admin");
            var user = document.getElementById("user");

            admin.style.display = "none";
            user.style.display = "none";

        }
        if (Meteor.userId()) {
            var admin = document.getElementById("admin");
            var user = document.getElementById("user");

            admin.style.display = "none";
            user.style.display = "block";
            if (Roles.userIsInRole(loggedInUser, ['admin'], 'default-group')) {
            var showHide = document.getElementById("admin");
            showHide.style.display = "block";
        }
        }
    }
};

Template.Navigation_component.helpers({
    activeClass(routeName) {
        return ActiveRoute.name(routeName) ? 'is-active' : '';
    }
});

Template.Navigation_component.events({
    'click .login-button'(){
        Tracker.autorun(function(){
  if(Meteor.userId()){
     window.location.reload();
  }
});
    },
    'click .mobileButton'() {
        var showHide = document.getElementById("mobileButtonMenu");
        if (showHide.style.display === "block") {
            showHide.style.display = "none";
        } else {
            showHide.style.display = "block";
        }
    },
    'click .noAccessBtn-right'() {
        FlowRouter.go('ProjectsList.show');
        var showHide = document.getElementById("overNoAccess");
        if (showHide.style.display === "block") {
            showHide.style.display = "none";
        } else {
            showHide.style.display = "block";
        }
    }
});