import { Meteor } from 'meteor/meteor';
import { Partners } from '../partners/partners';
import { PartnersMinimal } from '../PartnersMinimal/PartnersMinimal';
import { Projects } from '../projects/projects';
import { ProjectsMinimal } from '../ProjectsMinimal/ProjectsMinimal';
import { Individuals } from '../individuals/individuals';
import { IndividualsMinimal } from '../IndividualsMinimal/IndividualsMinimal';
import { Bin } from '../bin/bin';
import { Images } from '../../api/images/images';
import { Users } from '../users/users';


Meteor.methods({

    'bin.store'(data) {
        var { id, data, collectionName } = data;

        Bin.insert(
            {
                _id: id,
                collection: collectionName,
                data
            });
    },
    'partner.restore'(name) {
        var partnerObject = Bin.findOne({ _id: name.name });
        const project_All = Projects.find({}).fetch();
        const individual_All = Individuals.find({}).fetch();
        const projects_NEW = ProjectsMinimal.find({}).fetch();
        const individual_NEW = IndividualsMinimal.find({}).fetch();


        var full = partnerObject.data.PartnerObjectFull;
        var min = partnerObject.data.PartnerObjectMin;

        var full_Project_List = full.projects;
        var full_Individual_List = full.individuals;

        // Bin data with the data that has been created since the deletion included

        full.projectsNot = projects_NEW;
        full.individualsNot = individual_NEW;

        // this reinstates the partner into the partner collection
        Partners.insert(full);
        PartnersMinimal.insert(min);

        // just grabbing the id
        var id = full._id;

        // this is cyclign through the projects that the partner is associated with and pulling them from the projectsNot array
        // for the partner
        full_Project_List.forEach(function (element) {
            Partners.update({ _id: id }, { $pull: { projectsNot: element } });
        });

        // this is cyclign through the inidividuals that the partner is associated with and pulling them from the inidividualsNot array
        // for the partner
        full_Individual_List.forEach(function (element) {
            Partners.update({ _id: id }, { $pull: { individualsNot: element } });
        });

        // this reinstates the partner into the projects
        // for the projects
        project_All.forEach(function (element) {
            Projects.update({ _id: element._id }, { $addToSet: { partnersNot: min } });
        });
        full_Project_List.forEach(function (element) {
            Projects.update({ _id: element._id }, { $addToSet: { partners: min } });
            Projects.update({ _id: element._id }, { $pull: { partnersNot: min } });
        });

        // this reinstates the partner into the individuals
        // for the individuals
        individual_All.forEach(function (element) {
            Individuals.update({ _id: element._id }, { $addToSet: { partnersNot: min } });
        });
        full_Individual_List.forEach(function (element) {
            Individuals.update({ _id: element._id }, { $addToSet: { partners: min } });
            Individuals.update({ _id: element._id }, { $pull: { partnersNot: min } });
        });

        Bin.remove(partnerObject._id);

    },
    'project.restore'(name) {
        const partnerObject = Bin.findOne({ _id: name.name });
        const partners_All = Partners.find({}).fetch();
        const individual_All = Individuals.find({}).fetch();
        const partners_NEW = PartnersMinimal.find({}).fetch();
        const individual_NEW = IndividualsMinimal.find({}).fetch();

        // splits the project object into two seperate sections for the minimal collection and the main one
        var full = partnerObject.data.ProjectObjectFull;
        var min = partnerObject.data.ProjectObjectMin;

        // creates objects for the projects partners and individuals
        var full_Partner_List = full.partners;
        var full_Individual_List = full.individuals;

        // Bin data with the data that has been created since the deletion included
        full.partnersNot = partners_NEW;
        full.individualsNot = individual_NEW;

        // reinstates the deleted objects
        Projects.insert(full);
        ProjectsMinimal.insert(min);


        // just grabbing the id
        var id = full._id;

        // this is cyclign through the partners of the project and pulling them from the projectsNot array
        // for the partner
        full_Partner_List.forEach(function (element) {
            Projects.update({ _id: id }, { $pull: { partnersNot: element } });
        });

        // this is cyclign through the inidividuals that the project is associated with and pulling them from the inidividualsNot array
        // for the partner
        full_Individual_List.forEach(function (element) {
            Projects.update({ _id: id }, { $pull: { individualsNot: element } });
        });

        // this reinstates the project into the projects
        partners_All.forEach(function (element) {
            Partners.update({ _id: element._id }, { $addToSet: { projectsNot: min } });
        });
        full_Partner_List.forEach(function (element) {
            Partners.update({ _id: element._id }, { $addToSet: { projects: min } });
            Partners.update({ _id: element._id }, { $pull: { projectsNot: min } });
        });

        // this reinstates the project into the individuals
        individual_All.forEach(function (element) {
            Individuals.update({ _id: element._id }, { $addToSet: { projectsNot: min } });
        });
        full_Individual_List.forEach(function (element) {
            Individuals.update({ _id: element._id }, { $addToSet: { projects: min } });
            Individuals.update({ _id: element._id }, { $pull: { projectsNot: min } });
        });

        // this removes the project from the bin collection
        Bin.remove(partnerObject._id)
    },
    'individual.restore'(name) {
        const partnerObject = Bin.findOne({ _id: name.name });
        const partners_All = Partners.find({}).fetch();
        const Projects_All = Projects.find({}).fetch();

        const partners_NEW = PartnersMinimal.find({}).fetch();
        const projects_NEW = ProjectsMinimal.find({}).fetch();

        // splits the project object into two seperate sections for the minimal collection and the main one
        var full = partnerObject.data.IndividualObjectFull;
        var min = partnerObject.data.IndividualObjectMin;

        // creates objects for the projects partners and individuals
        var full_Projects_List = full.projects;
        var full_Partners_List = full.partners;

        // Bin data with the data that has been created since the deletion included
        full.partnersNot = partners_NEW;
        full.projectsNot = projects_NEW;

        // reinstates the deleted objects
        Individuals.insert(full);
        IndividualsMinimal.insert(min);

        // just grabbing the id
        var id = full._id;

        // this is cyclign through the partners of the project and pulling them from the projectsNot array
        // for the partner
        full_Partners_List.forEach(function (element) {
            Individuals.update({ _id: id }, { $pull: { partnersNot: element } });
        });

        // this is cycling through the inidividuals that the project is associated with and pulling them from the inidividualsNot array
        // for the partner
        full_Projects_List.forEach(function (element) {
            Individuals.update({ _id: id }, { $pull: { projectsNot: element } });
        });

        // this reinstates the project into the projects
        partners_All.forEach(function (element) {
            Partners.update({ _id: element._id }, { $addToSet: { individualsNot: min } });
        });
        full_Partners_List.forEach(function (element) {
            Partners.update({ _id: element._id }, { $addToSet: { individuals: min } });
            Partners.update({ _id: element._id }, { $pull: { individualsNot: min } });
        });

        // this reinstates the project into the individuals
        Projects_All.forEach(function (element) {
            Projects.update({ _id: element._id }, { $addToSet: { individualsNot: min } });
        });
        full_Projects_List.forEach(function (element) {
            Projects.update({ _id: element._id }, { $addToSet: { individuals: min } });
            Projects.update({ _id: element._id }, { $pull: { individualsNot: min } });
        });

        // this removes the object from the bin collection
        Bin.remove(partnerObject._id)
    }
});
