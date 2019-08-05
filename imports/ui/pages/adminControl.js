import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Bin } from '../../api/bin/bin';

import './adminControl.html';

Template.adminControl_page.onCreated(function AdminControlPage() {
    Meteor.subscribe('users');
    Meteor.subscribe('bin');

    Meteor.subscribe('individuals');
    Meteor.subscribe('projects');
    Meteor.subscribe('partners');

    Meteor.subscribe('partnersMinimal');
    Meteor.subscribe('projectsMinimal');
    Meteor.subscribe('individualsMinimal');

});
Template.adminControl_page.helpers({
    individualsAdd() {
        var bin = Bin.find({}).fetch();
        // filters individuals
        var AllIndividuals = bin.filter(function (el) {
            if (el.collection === "individuals") {
                var Individuals = el.data.IndividualObjectMin;
                return Individuals;
            }
        });
        return AllIndividuals;
    },
    partnersAdd() {
        var bin = Bin.find({}).fetch();
        // filters Partners
        var AllPartners = bin.filter(function (el) {
            if (el.collection === "partners") {
                var partners = el.data.PartnerObjectMin;
                return partners;
            }
        });
        return AllPartners;
    },
    projectsAdd() {
        var bin = Bin.find({}).fetch();
        // filters Projects
        var AllProjects = bin.filter(function (el) {
            if (el.collection === "projects") {
                var projects = el.data.ProjectObjectMin;
                return projects;
            }
        });
        return AllProjects;
    },
});

Template.adminControl_page.events({
    'click .partnerRestore': function (event, template) {
        var name = $(this).attr('_id');
        var nameHTML = $(this).attr('data');
        var nameOfElement = nameHTML.PartnerObjectMin.name;

        //updates the entry
        Meteor.call('partner.restore', { name });
        alert("Organisation " + nameOfElement + " Has been restored")
    },
    'click .projectRestore': function (event, template) {
        var name = $(this).attr('_id');
        var nameHTML = $(this).attr('data');
        var nameOfElement = nameHTML.ProjectObjectMin.name;

        //updates the entry
        Meteor.call('project.restore', { name });
        alert("Project " + nameOfElement + " Has been restored")
    },
    'click .individualRestore': function (event, template) {
        var name = $(this).attr('_id');
        var nameHTML = $(this).attr('data');
        var nameOfElement = nameHTML.IndividualObjectMin.name;
        //updates the entry
        Meteor.call('individual.restore', { name });
        alert("Individual " + nameOfElement + " Has been restored")
    },
});