import { Template } from 'meteor/templating';
import { Individuals } from '../../api/individuals/individuals';
import './individual-list.html';
import '../components/individual.html';

Template.IndividualList_page.onCreated(function onCreatedIndividualListPage() {
  Meteor.subscribe('individuals');
});

Template.IndividualList_page.helpers({
  individualsInfo() {
    return Individuals.find({}, { sort: { name: 1 }});
  }
});