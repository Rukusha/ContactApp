import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Images } from '../../api/images/images';
import { Partners } from '../../api/partners/partners';
import { Projects } from '../../api/projects/projects';
import { Individuals } from '../../api/individuals/individuals';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ReactiveVar } from 'meteor/reactive-var';
import './project-edit.html';

Template.ProjectEdit_page.onCreated(function onCreatedProjectEditPage() {

    Template.ProjectEdit_page.helpers({
        project() {
            return Projects.find({}, {sort: {name: 1}});
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
        'submit .form'(event) {
            event.preventDefault();

            const target = event.target;
            const name = target.name.value;
            const domain = target.domain.value;
            const bio = target.bio.value;
            const individuals = target.individuals.value;
            const logoFile = target.logo && target.logo.files && target.logo.files.length && target.logo.files[0];

            // Insert a task into the collection
            
                Images.insert(logoFile, (error, imageDocument) => {
                const ProjectId = FlowRouter.getParam('projectId');
                const logo = `/cfs/files/images/${imageDocument._id}`;
                var doc = Projects.findOne({ _id: ProjectId });
                Projects.update({ _id:doc._id }, {$set:{name:name, domain:domain, logo:logo, bio:bio, individuals:individuals }});
                 FlowRouter.go('ProjectList.show');
            });
        },
        'click .cancel'(event) {
            event.preventDefault();

            const current = FlowRouter.current();
            const old = current.oldRoute;
            FlowRouter.go(old ? old.name : 'ProjectList.show');
        }
    });
});
