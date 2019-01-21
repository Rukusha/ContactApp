import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Images } from '../../api/images/images';
import './project.html';

Template.Project_component.events({
  'click .card.project'(event) {
    // Prevent default browser form submit
    event.preventDefault();
    event.stopPropagation();

    // Go to the project detail page
    FlowRouter.go('ProjectDetail.show', { projectId: this._id.valueOf() });
  }
});