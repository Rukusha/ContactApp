import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Images } from '../../api/images/images';
import './partner.html';
 
Template.Partner_component.events({
  'click .card.partner'(event) {
    // Prevent default browser form submit
    event.preventDefault();
    event.stopPropagation();

    // Go to the project detail page
    FlowRouter.go('PartnerDetails.show', { partnerId: this._id.valueOf() });
  },
  'click .delete'() {
    Meteor.call('partner.remove', this._id.valueOf());
  }
});