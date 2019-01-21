import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Images } from '../../api/images/images';
import { Individuals } from '../../api/individuals/individuals';
import { FlowRouter } from 'meteor/kadira:flow-router';
import './individual-edit.html';

Template.IndividualsEdit_page.onCreated(function onCreatedIndividualsEditPage() {

    Template.IndividualsEdit_page.helpers({
        individuals() {
            return Individuals.find({}, {sort: {name: 1}});
        }
    });
    Meteor.subscribe('individuals');

//this gets the values from the text fields on the partner edit page
    Template.IndividualsEdit_page.events({
        'submit .form'(event) {
            event.preventDefault();
            const target = event.target;
            const name = target.name.value;
            const linkedIn = target.at_field_linkedIn.value;
            const telephone = target.at_field_telephone.value;
            const skype = target.at_field_skype.value;
            const position = target.position.value;
            const bio = target.bio.value;
            const logoFile = target.logo && target.logo.files && target.logo.files.length && target.logo.files[0];

            //this takes the values for the logo
            Images.insert(logoFile, (error, imageDocument) => {
                const IndividualsId = FlowRouter.getParam('individualsId');
                const logo = `/cfs/files/images/${imageDocument._id}`;
                var doc = Individuals.findOne({_id: IndividualsId});
                Individuals.update({_id: doc._id}, {$set: {name: name, logo: logo, bio: bio, skype: skype, position: position, telephone: telephone, linkedIn: linkedIn}});
                FlowRouter.go('IndividualsList.show');
            });
        }
    });
});
