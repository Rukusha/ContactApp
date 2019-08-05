import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import './app-body.html';

Template.App_body.onCreated(function onCreatedPartnersListPage() {
  this.getCurrentUserId = () => Meteor.userId();

  this.autorun(() => {
    this.subscribe('Meteor.users.roles', this.getCurrentUserId());
  });
});
Template.App_body.helpers({
  isAdmin() {
    const user = Meteor.user();
    if (user && user.roles && user.roles && user.roles.includes && user.roles.includes('Admin')) {
      return true;
    }
    return false;
  }
});