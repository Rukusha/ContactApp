import { Template } from 'meteor/templating';
import { Partners } from '../../api/partners/partners';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Meteor } from 'meteor/meteor';

import './partner-list.html';

Template.PartnerList_page.onCreated(function onCreatedPartnersListPage() {
    Meteor.subscribe('partners');
    Meteor.subscribe('individuals');
});

Template.PartnerList_page.helpers({
    partners() {
        return Partners.find({}, { sort: { name: 1 } });
    }
});

Template.PartnerList_page.events({
    'click .addAdmin'() {
        //checks to make sure a user is logged in on a cadmin account
        if (!Meteor.userId()) {
            restrict();
        }
        FlowRouter.go('Admin.add');
    },
    'click .noAccessBtn-right'() {
        FlowRouter.go('PartnerList.show');
        var showHide = document.getElementById("overNoAccess");
        if (showHide.style.display === "block") {
            showHide.style.display = "none";
        } else {
            showHide.style.display = "block";
        }
    }
});