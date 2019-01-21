import { Template } from 'meteor/templating';
import { Partners } from '../../api/partners/partners';
import './partner-list.html';

Template.PartnerList_page.onCreated(function onCreatedPartnersListPage() {
  Meteor.subscribe('partners');
  Meteor.subscribe('individuals');
});

Template.PartnerList_page.helpers({
  partners() {
    return Partners.find({}, { sort: { name: 1 }});
  }
});

Template.PartnerList_page.events({
  'submit .new-project'(event) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    const target = event.target;
    const alias = target.alias.value;
    const name = target.name.value;
    const domain = target.domain.value;
    const url = target.url.value;
    const logo = target.logo.value;

    // Insert a task into the collection
    Meteor.call('projects.insert', { alias, name, domain, url, logo });

    // Clear form
    target.alias.value = '';
    target.name.value = '';
    target.domain.value = '';
    target.url.value = '';
    target.logo.value = '';
  }
});