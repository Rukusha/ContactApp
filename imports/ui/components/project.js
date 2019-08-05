import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Images } from '../../api/images/images';
import './project.html';

var formDataHandle = {};

Template.Project_component.imgLoaded = function() {
  return formDataHandle && formDataHandle.ready();
}

Template.Project_component.formData = function() {
  if( formDataHandle && formDataHandle.ready() ) {
    const project = FlowRouter.getParam('projectId');
    var form = Projects.findOne({_id : project});
    return FormDatas.find({_id: form._id, logo });
  }
}

Template.Project_component.created = function() {
  formDataHandle = Meteor.subscribe("projects");
}

Template.Project_component.events({
  'click .card.project'(event) {
  //Prevent default browser form submit
    event.preventDefault();
    event.stopPropagation();

  //Go to the project detail page
    FlowRouter.go('ProjectDetail.show', { projectId: this._id.valueOf() });
  }
});