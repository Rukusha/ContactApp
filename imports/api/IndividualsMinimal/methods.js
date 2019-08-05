import { Meteor } from 'meteor/meteor';
import { Partners } from '../partners/partners';
import { PartnersMinimal } from '../PartnersMinimal/PartnersMinimal';
import { Projects } from '../projects/projects';
import { ProjectsMinimal } from '../ProjectsMinimal/ProjectsMinimal';
import { Individuals } from '../individuals/individuals';
import { IndividualsMinimal } from '../IndividualsMinimal/IndividualsMinimal';

Meteor.methods({
    'individualsMinimal.insert'(newIndividual) {
        var {twitter, facebook, owner, projectsNot = [], partnersNot = [], projects = [], partners = []} = newIndividual;
        var owner = newIndividual.newIndividual.owner;
        if (owner === undefined || owner === '' || owner === null) {
            docsAdminOwner = '#';
        } else {
            var docsOwner = Partners.findOne({ _id: owner });
            var docsAdminOwner = docsOwner.owner;
            var projects = newIndividual.newIndividual.projects;

            var insertMinimalID = IndividualsMinimal.insert(
                {
                    createdAt: new Date(), // current time
                    _id: newIndividual.insertId,
                    name: newIndividual.newIndividual.name,
                    owner: [docsAdminOwner],
                    logo: newIndividual.newIndividual.logo,
                    bio: newIndividual.newIndividual.bio,
                    facebook: newIndividual.newIndividual.facebook,
                    twitter: newIndividual.newIndividual.twitter,
                    position: newIndividual.newIndividual.position,
                    linkedIn: newIndividual.newIndividual.linkedIn,
                    skype: newIndividual.newIndividual.skype,
                    telephone: newIndividual.newIndividual.telephone
                },
            );
            var insertDocs = '#';
            if (owner !== '') {
                 insertDocs = IndividualsMinimal.findOne({ _id: newIndividual.insertId });
                // Partners added to partners section
                Partners.update({ _id: owner }, { $addToSet: { individuals: insertDocs } });
                // Individuals added to partners section
                Individuals.update({ _id: insertDocs._id }, { $addToSet: { partners: docsOwner } });
            }

            // individuals collection
            const insertAllPartnersDocs = PartnersMinimal.findOne({});
            Individuals.update({ _id: newIndividual._id }, { $addToSet: { partnersNot: insertAllPartnersDocs } });
        }    
        const insert = IndividualsMinimal.findOne({ _id: insertMinimalID });

                    // // mass PARTNERS update
            
                    var individualsMinimal = IndividualsMinimal.findOne({ _id: insert._id });
                    const projObject = Projects.find({}).fetch();
                    const partObject = Partners.find({}).fetch();

                    partObject.forEach(function (element) {
                        // remove partner individuals from the project            
                        Partners.update({ _id: element._id }, { $addToSet: { individualsNot: individualsMinimal } });
                    });
                    projObject.forEach(function (element) {
                        // remove partner individuals from the project            
                        Projects.update({ _id: element._id }, { $addToSet: { individualsNot: individualsMinimal } });
                    });
    }
});
