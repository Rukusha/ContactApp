import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Images } from '../../api/images/images';
import { Partners } from '../../api/partners/partners';
import { Projects } from '../../api/projects/projects';
import { Individuals } from '../../api/individuals/individuals';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveVar } from 'meteor/reactive-var';
import { Emitter, Events} from '../../api/events/events';

import './project-edit.html';
Template.ProjectEdit_page.onCreated(function onCreatedProjectEditPage() {
    Template.ProjectEdit_page.helpers({
        project() {
            const partnerId = FlowRouter.getParam('projectId');
            return Projects.findOne({_id: partnerId});
        }
    });
    Meteor.subscribe('projects');
    Meteor.subscribe('individuals');
//   this section is about retrieving the avaliable individuals and projects list
    this.availableIndividuals = new ReactiveVar([]);
    this.selectedIndividuals = new ReactiveVar([]);
    this.autorun(() => {

        const individuals = Individuals.find({}, {
            fields: {name: 1},
            sort: {name: 1}
        }).fetch();
        this.availableIndividuals.set(individuals);
        this.selectedIndividuals.set([]);
    });

    Template.ProjectEdit_page.helpers({
        getAvailableIndividuals() {
            return Template.instance().availableIndividuals.get();
        },
        getSeletedIndividuals() {
            return Template.instance().selectedIndividuals.get();
        }
    });
//this gets the values from the text fields on the partner edit page

    Template.ProjectEdit_page.events({
        'change .form'() {
            const ProjectId = FlowRouter.getParam('projectId');

            const name = $("#ProjectNameInvisible").val();
            const bio = $("#bioInvisible").val();
            const domain = $("#domainInvisible").val();
            const logo = $("#logoInvisible").val();

            var nameNew = $("#ProjectName").val();
            var domainNew = $("#domain").val();
            var bioNew = $("#bio").val();

            var loggedInUser = Meteor.user();


            var UserWhoIssuedEvent = Meteor.user();
            if (name !== nameNew) {
                var data = {
                    nameNew, loggedInUser, ProjectId
                };
                Emitter.emit(Events.ITEM_CREATE, {data});
                Meteor.call("projectsName.update", nameNew, ProjectId);
                const busServiceUpdateName = {
                    UserWhoIssuedEvent, nameNew
                };
                //Server call to persist the data. 
                Meteor.call("updateNameBusServiceProject", busServiceUpdateName, function (error) {
                    if (error) {
                        $(event.target).find(".error").html(error.reason);
                    }
                });
            } else if (domain !== domainNew) {
                var data = {
                    domainNew, loggedInUser, ProjectId
                };
                Emitter.emit(Events.ITEM_CREATE, {domainNew, loggedInUser, ProjectId});
                Meteor.call("projectsDomain.update", domainNew, ProjectId);
                const busServiceUpdateDomain = {
                    UserWhoIssuedEvent, domainNew
                };
                //Server call to persist the data. 
                Meteor.call("updateDomBusServiceProject", busServiceUpdateDomain, function (error) {
                    if (error) {
                        $(event.target).find(".error").html(error.reason);
                    }
                });
            } else if (bio !== bioNew) {
                var data = {
                    bioNew, loggedInUser, ProjectId
                };
                Emitter.emit(Events.ITEM_CREATE, {bioNew, loggedInUser, ProjectId});
                Meteor.call("projectsBio.update", bioNew, ProjectId);
                const busServiceUpdateBio = {
                    UserWhoIssuedEvent, bioNew
                };
                //Server call to persist the data. 
                Meteor.call("updateBioBusServiceProject", busServiceUpdateBio, function (error) {
                    if (error) {
                        $(event.target).find(".error").html(error.reason);
                    }
                });
            }
//                Emitter.emit(Events.ITEM_CREATE, {domainNew, loggedInUser});
//                Meteor.call("projectsDomain.update", domainNew, ProjectIdDom);
//
//                Emitter.emit(Events.ITEM_CREATE, {bioNew, loggedInUser});
//                Meteor.call("projectsBio.update", bioNew, ProjectIdBio);

        },
        'submit .form'(event) {
                back();
        },
        'click .cancel'(event) {
            FlowRouter.go('ProjectDetail.edit');
        }
    });
});
