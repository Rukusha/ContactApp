import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Images } from '../../api/images/images';
import './individual.html';

Template.Individual_component.events({
  'click .card.individual-card'(event) {
    // Prevent default browser form submit
    event.preventDefault();
    event.stopPropagation();
    
    // Go to the individual detail page
    FlowRouter.go('IndividualsDetails.show', { individualsId: this._id.valueOf() });
  },
  'click .edit'() {
    FlowRouter.go('IndividualsEditDetails.edit', { individualsId: this._id.valueOf() });
  }

});