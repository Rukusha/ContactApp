import { Template } from 'meteor/templating';
import { Images } from '../../api/images/images';
import { Users } from '../../api/users/users';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveVar } from 'meteor/reactive-var';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import './navigation.html';

Template.Navigation_component.rendered = function () {
    var showHide = document.getElementById("user");
    var adminControl = document.getElementById("adminControl");

    var loggedInUser = Meteor.userId();

    if (loggedInUser === "ngrCLuKYiRA6gshXM") {
        showHide.style.display = "none";
        adminControl.style.display = "block";
    } else {
        showHide.style.display = "block";
        adminControl.style.display = "none";
    }

    var showHideMobile = document.getElementById("userMobile");
    var adminControlMobile = document.getElementById("adminControlMobile");

    var loggedInUserMobile = Meteor.userId();

    if (loggedInUserMobile === "ngrCLuKYiRA6gshXM") {
        showHideMobile.style.display = "none";
        adminControlMobile.style.display = "block";
    } else {
        showHidshowHideMobileeobile.style.display = "block";
        adminControlMobile.style.display = "none";
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