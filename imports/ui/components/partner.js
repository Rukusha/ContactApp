import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Images } from '../../api/images/images';
import './partner.html';

var formDataHandle = {};

Template.Partner_component.imgLoaded = function() {
  return formDataHandle && formDataHandle.ready();
}

Template.Partner_component.formData = function() {
  if( formDataHandle && formDataHandle.ready() ) {
    const project = FlowRouter.getParam('partnerId');
     var form = Partners.findOne({_id : project});
     return FormDatas.find({_id: form._id, logo });
  }
}

Template.Partner_component.created = function() {
  formDataHandle = Meteor.subscribe("partners");
}

Template.Partner_component.events({
  'click .card.partner'(event) {
  //Prevent default browser form submit
    event.preventDefault();
    event.stopPropagation();

  //Go to the project detail page
    FlowRouter.go('PartnerDetails.show', { partnerId: this._id.valueOf()});
  }
});