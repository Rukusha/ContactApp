import { Template } from 'meteor/templating';
import { Projects } from '../../api/projects/projects';
import './project-list.html';

Template.ProjectList_page.onCreated(function onCreatedProjectListPage() {
  Meteor.subscribe('projects');
});

Template.ProjectList_page.helpers({
  projects() {
    return Projects.find({}, { sort: { name: 1 }});
  }
});