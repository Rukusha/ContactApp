import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Individuals } from '../../api/individuals/individuals';
import { FlowRouter } from 'meteor/kadira:flow-router';
import './individual-list.html';
import '../components/individual.html';


//this function is used to dislay the no access notification to the current user f they dont have access
function restrict() {
    var showHide = document.getElementById("overNoAccess");
    showHide.style.display = "block";
};

Template.IndividualList_page.onCreated(function onCreatedIndividualListPage() {
    Meteor.subscribe('individuals');
});

Template.IndividualList_page.helpers({
    individualsInfo() {
        return Individuals.find({}, { sort: { name: 1 } });
    }
});
Template.IndividualList_page.events({
    'click .addPerson'() {
        //checks to make sure a user is logged in on a cadmin account
        var loggedInUser = Meteor.userId();
        if (!Meteor.userId()) {
            restrict();
        }
        if ((Roles.userIsInRole(loggedInUser, ['cAdmin'], 'default-group')) || (Roles.userIsInRole(loggedInUser, ['admin'], 'default-group'))) {
            FlowRouter.go('Individuals-forms.add');
        } else {
            restrict();
        }
    },
    'click .noAccessBtn-right'() {
        FlowRouter.go('IndividualsList.show');
        var showHide = document.getElementById("overNoAccess");
        if (showHide.style.display === "block") {
            showHide.style.display = "none";
        } else {
            showHide.style.display = "block";
        }
    }
});
