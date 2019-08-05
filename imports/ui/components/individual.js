import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Images } from '../../api/images/images';
import './individual.html';

var formDataHandle = {};
Template.Individual_component.imgLoaded = function() {
  return formDataHandle && formDataHandle.ready();
}

Template.Individual_component.formData = function() {
  if( formDataHandle && formDataHandle.ready() ) {
    const project = FlowRouter.getParam('individualsId');
     var form = Individuals.findOne({_id : project});
     return FormDatas.find({_id: form._id, logo });
  }
}

Template.Individual_component.created = function() {
  formDataHandle = Meteor.subscribe("individuals");
}

Template.Individual_component.rendered = function () {
  var showHide = document.getElementById("skypeIcon");
  if (showHide === null) {
      showHide.style.display = "block";
  } else {
      showHide.style.display = "none";
  }
};
Template.Individual_component.events({
  'click .card.individual-card'(event) {
    //Prevent default browser form submit
    event.preventDefault();
    event.stopPropagation();
    
    //Go to the individual detail page
    FlowRouter.go('IndividualsDetails.show', { individualsId: this._id.valueOf() });
  },
  'click .edit'() {
    FlowRouter.go('IndividualsEditDetails.edit', { individualsId: this._id.valueOf() });
  }

});