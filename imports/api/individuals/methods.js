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
    'individuals.remove'(individualsId) {
        var individual = individualsId.individualsId;
        const IndividualObject = IndividualsMinimal.findOne({ _id: individual });

        var id = individual;
        const IndividualObjectFull = Individuals.findOne({ _id: individual });
        var IndividualObjectMin = IndividualObject;
        var data = { IndividualObjectMin, IndividualObjectFull }

        const projObject = Projects.find({}).fetch();
        const partObject = Partners.find({}).fetch();

        partObject.forEach(function (element) {
            // remove partner individuals from the project            
            Partners.update({ _id: element._id }, { $pull: { individualsNot: IndividualObject } });
            Partners.update({ _id: element._id }, { $pull: { individuals: IndividualObject } });
        });
        projObject.forEach(function (element) {
            // remove partner individuals from the project            
            Projects.update({ _id: element._id }, { $pull: { individualsNot: IndividualObject } });
            Projects.update({ _id: element._id }, { $pull: { individuals: IndividualObject } });
        });
        // stores a copy of the data that is about to be deleted
        var collectionName = "individuals";
        Meteor.call('bin.store', { id, data, collectionName });

        Individuals.remove(individual);
        IndividualsMinimal.remove(individual);
        Users.remove(individual);
    },
    'individualsProject.insert'(newIndividual) {
        var { result, name, Id, owner, facebook, linkedIn, twitter, telephone, skype, position, bio, projectsNot = [], partnersNot = [], projects = [], partners = [], logo } = newIndividual;
        if (!Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }
        //        check(names, String);
        //        check(position, String);
        //        check(bio, String);
        //        check(logo, String); ++

        if (owner === undefined || owner === '' || owner === null) {
            docsAdminOwner = '#';
        }
        var AllProjects = ProjectsMinimal.find({}).fetch();
        var AllPartners = PartnersMinimal.find({}).fetch();
        var ownerPartner = PartnersMinimal.findOne({ _id: owner });
        // filters individuals
        var AllPart = AllPartners.filter(function (el) {
            return (el._id !== owner);
        });
        //filters projects
        //var AllPro = AllProjects.filter(function (el) {
        //   return (el._id !== ProjectsFirst._id);
        //});
        var insertId = Individuals.insert(
            {
                createdAt: new Date(), // current time
                _id: Id,
                name,
                owner: [owner],
                logo,
                bio,
                twitter,
                facebook,
                position,
                linkedIn,
                skype,
                telephone,
                projects,
                partners: [ownerPartner],
                projectsNot: AllProjects,
                partnersNot: AllPart
            },
        );
        var insertIds = IndividualsMinimal.insert(
            {
                createdAt: new Date(), // current time
                _id: Id,
                name,
                owner: [owner],
                logo,
                bio,
                twitter,
                facebook,
                position,
                linkedIn,
                skype,
                telephone
            },
        );
        Partners.update({ _id: result }, { $set: { owner: [insertIds] } });
        PartnersMinimal.update({ _id: result }, { $set: { owner: [insertIds] } });

        return insertId;
    },
    'individuals.insert'(newIndividual) {
        var { twitter, facebook, name, Id, owner, linkedIn, telephone, skype, position, bio, projectsNot = [], partnersNot = [], projects = [], partners = [], logo } = newIndividual;
        if (!Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }
        //        check(names, String);
        //        check(position, String);
        //        check(bio, String);
        //        check(logo, String); 

        var AllProjects = ProjectsMinimal.find({}).fetch();
        var AllPartners = PartnersMinimal.find({}).fetch();
        var PartnersFirst = PartnersMinimal.findOne({ _id: owner });

        if (owner === undefined || owner === "" || owner === null) {
            var insertId = Individuals.insert(
                {
                    createdAt: new Date(), // current time
                    _id: Id,
                    name,
                    owner: [],
                    logo,
                    bio,
                    facebook,
                    twitter,
                    position,
                    linkedIn,
                    skype,
                    telephone,
                    projects,
                    partners: [],
                    projectsNot: AllProjects,
                    partnersNot: AllPartners
                },
            );
            var insertIdMin = IndividualsMinimal.insert(
                {
                    createdAt: new Date(), // current time
                    _id: Id,
                    name,
                    owner: [],
                    logo,
                    bio,
                    facebook,
                    twitter,
                    position,
                    linkedIn,
                    skype,
                    telephone
                },
            );

            // // mass PARTNERS update
            var individualsMinimal = IndividualsMinimal.findOne({ _id: insertIdMin });
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

        } else {
            //filters individuals
            var AllPart = AllPartners.filter(function (el) {
                return (el._id !== PartnersFirst._id);
            });

            var insertId = Individuals.insert(
                {
                    createdAt: new Date(), // current time
                    _id: Id,
                    name,
                    owner: [PartnersFirst._id],
                    logo,
                    bio,
                    facebook,
                    twitter,
                    position,
                    linkedIn,
                    skype,
                    telephone,
                    projects,
                    partners: [PartnersFirst],
                    projectsNot: AllProjects,
                    partnersNot: AllPart
                },
            );
            var insertIdMin = IndividualsMinimal.insert(
                {
                    createdAt: new Date(), // current time
                    _id: Id,
                    name,
                    owner: [PartnersFirst._id],
                    logo,
                    bio,
                    facebook,
                    twitter,
                    position,
                    linkedIn,
                    skype,
                    telephone
                },
            );

            //mass PARTNERS update

            var individualsObject = IndividualsMinimal.findOne({ _id: insertId });
            var partnersObject = Partners.find({}).fetch();

            partnersObject.forEach(function (element) {
                // adds individuals to the partnersNot            
                Partners.update({ _id: element._id }, { $addToSet: { individualsNot: individualsObject } });
            });
            var projectObject = Projects.find({}).fetch();

            projectObject.forEach(function (element) {
                // adds individuals to the partnersNot            
                Projects.update({ _id: element._id }, { $addToSet: { individualsNot: individualsObject } });
            });
            Partners.update({ _id: PartnersFirst._id }, { $addToSet: { individuals: individualsObject } });
            Partners.update({ _id: PartnersFirst._id }, { $pull: { individualsNot: individualsObject } });

        }
    },
    'individualsProject.remove'(RemoveProject) {
        var projectId = RemoveProject.name;
        var person = RemoveProject.individualsId;

        var projectObject = Projects.findOne({ _id: projectId });
        var projectMinimal = ProjectsMinimal.findOne({ _id: projectId });

        var individualsMinimal = IndividualsMinimal.findOne({ _id: person });

        var partners = projectObject.partners;
        partners.forEach(function (element) {
            // add project to partnersNot collection
            Partners.update({ _id: element._id }, { $addToSet: { projectsNot: projectMinimal } });
            // remove project from partners
            Partners.update({ _id: element._id }, { $pull: { projects: projectMinimal } });

            // remove partners from the project            
            Projects.update({ _id: projectMinimal._id }, { $addToSet: { partnersNot: element } });
            Projects.update({ _id: projectMinimal._id }, { $pull: { partners: element } });


            // remove Inidividual from project
            Projects.update({ _id: projectMinimal._id }, { $pull: { individuals: individualsMinimal } });
            Projects.update({ _id: projectMinimal._id }, { $addToSet: { individualsNot: individualsMinimal } });

            // remove project from individual
            Individuals.update({ _id: individualsMinimal._id }, { $pull: { projects: projectMinimal } });
            Individuals.update({ _id: individualsMinimal._id }, { $addToSet: { projectsNot: projectMinimal } });

        });
    },
    'individualsPartner.remove'(RemovePartner) {
        // removes partner from the chosen individual
        var parnerId = RemovePartner.name;
        var person = RemovePartner.individualsId;

        var partnersMinimal = PartnersMinimal.findOne({ _id: parnerId });

        var individualsMinimal = IndividualsMinimal.findOne({ _id: person });

        Partners.update({ _id: partnersMinimal._id }, { $addToSet: { individualsNot: individualsMinimal } });
        // remove project from partners
        Partners.update({ _id: partnersMinimal._id }, { $pull: { individuals: individualsMinimal } });
        // remove project from individual
        Individuals.update({ _id: individualsMinimal._id }, { $pull: { partners: partnersMinimal } });
        Individuals.update({ _id: individualsMinimal._id }, { $addToSet: { partnersNot: partnersMinimal } });

    },
   
    'individualsPartners.insert'(newIndividual) {
        var { name, Id, owner, linkedIn, telephone, skype, position, bio, projectsNot = [], partnersNot = [], projects = [], partners = [], logo } = newIndividual;
        if (!Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }
        //        check(names, String);
        //        check(position, String);
        //        check(bio, String);
        //        check(logo, String); 
        if (owner === undefined || owner === '' || owner === null) {
            docsAdminOwner = '#';
        }
        var AllProjects = ProjectsMinimal.find({}).fetch();
        var AllPartners = PartnersMinimal.find({}).fetch();
        var PartnersFirst = Partners.findOne({ _id: owner });

        //filters individuals
        var AllPart = AllPartners.filter(function (el) {
            return (el._id !== PartnersFirst._id);
        });

        Individuals.insert(
            {
                createdAt: new Date(), // current time
                _id: Id,
                name,
                owner: [PartnersFirst._id],
                logo,
                bio,
                facebook,
                twitter,
                position,
                linkedIn,
                skype,
                telephone,
                projects,
                partners: [PartnersFirst],
                projectsNot: AllProjects,
                partnersNot: AllPart
            },
        );

        var insertId = IndividualsMinimal.insert(
            {
                createdAt: new Date(), // current time
                _id: Id,
                name,
                owner: [PartnersFirst._id],
                logo,
                bio,
                facebook,
                twitter,
                position,
                linkedIn,
                skype,
                telephone
            },
        );
        var insert = IndividualsMinimal.findOne({ _id: insertId });
        Partners.update({ _id: owner }, { $addToSet: { individuals: insert } });

    },
    'IndividualEmail.update'(emailNew, ProjectId) {
        Meteor.users.update({
            _id: ProjectId
        },
            {
                $set: {
                    'emails.0.address': emailNew
                }
            });
    },
    'IndividualBio.update'(bioNew, ProjectId) {
        const docs = Individuals.findOne({ _id: ProjectId });
        const docsM = IndividualsMinimal.findOne({ _id: ProjectId });

        Individuals.update({ _id: docs._id }, { $set: { bio: bioNew } });
        IndividualsMinimal.update({ _id: docs._id }, { $set: { bio: bioNew } });

        // updates projects individuals section
        const docsProjects = Projects.find({}, { individuals: docsM }).fetch();
        var i = 0;
        docsProjects.forEach(element => {
            var arrayLength = element.individuals.length;
            while (i <= arrayLength) {
                Projects.update({ _id: element._id, ["individualsNot." + i + "._id"]: docsM._id }, { $set: { ["individuals." + i + ".bio"]: bioNew } }, { multi: true });
                Projects.update({ _id: element._id, ["individuals." + i + "._id"]: docsM._id }, { $set: { ["individuals." + i + ".bio"]: bioNew } }, { multi: true });
                i++;
            }
        });
        // updates company section for individuals
        const docsPartners = Partners.find({}, { individuals: docsM }).fetch();
        var iPartner = 0;
        docsPartners.forEach(element => {
            var arrayPartnerLength = element.individuals.length;
            while (iPartner <= arrayPartnerLength) {
                Partners.update({ _id: element._id, ["individualsNot." + iPartner + "._id"]: docsM._id }, { $set: { ["individuals." + iPartner + ".bio"]: bioNew } }, { multi: true });
                Partners.update({ _id: element._id, ["individuals." + iPartner + "._id"]: docsM._id }, { $set: { ["individuals." + iPartner + ".bio"]: bioNew } }, { multi: true });
                iPartner++;
            }
        });
    },
    'IndividualDomain.update'(domainNew, ProjectId) {
        const docs = Individuals.findOne({ _id: ProjectId });
        const docsM = IndividualsMinimal.findOne({ _id: ProjectId });

        // updates individual and individualMinimal
        Individuals.update({ _id: docs._id }, { $set: { domain: domainNew } });
        IndividualsMinimal.update({ _id: docs._id }, { $set: { domain: domainNew } });

        // updates projects individuals section
        const docsProjects = Projects.find({}, { individuals: docsM }).fetch();
        var i = 0;
        docsProjects.forEach(element => {
            var arrayLength = element.individuals.length;
            while (i <= arrayLength) {
                Projects.update({ _id: element._id, ["individualsNot." + i + "._id"]: docsM._id }, { $set: { ["individuals." + i + ".domain"]: domainNew } }, { multi: true });
                Projects.update({ _id: element._id, ["individuals." + i + "._id"]: docsM._id }, { $set: { ["individuals." + i + ".domain"]: domainNew } }, { multi: true });
                i++;
            }
        });
        // updates company section for individuals
        const docsPartners = Partners.find({}, { individuals: docsM }).fetch();
        var iPartner = 0;
        docsPartners.forEach(element => {
            var arrayPartnerLength = element.individuals.length;
            while (iPartner <= arrayPartnerLength) {
                Partners.update({ _id: element._id, ["individualsNot." + iPartner + "._id"]: docsM._id }, { $set: { ["individuals." + iPartner + ".domain"]: domainNew } }, { multi: true });
                Partners.update({ _id: element._id, ["individuals." + iPartner + "._id"]: docsM._id }, { $set: { ["individuals." + iPartner + ".domain"]: domainNew } }, { multi: true });
                iPartner++;
            }
        });
    },
    'IndividualName.update'(nameNew, ProjectId) {
        const docs = Individuals.findOne({ _id: ProjectId });
        const docsM = IndividualsMinimal.findOne({ _id: ProjectId });

        // updates individual and individualMinimal
        Individuals.update({ _id: docs._id }, { $set: { name: nameNew } });
        IndividualsMinimal.update({ _id: docs._id }, { $set: { name: nameNew } });

        // updates projects individuals section
        const docsProjects = Projects.find({}, { individuals: docsM }).fetch();
        var i = 0;
        docsProjects.forEach(element => {
            var arrayLength = element.individuals.length;
            while (i <= arrayLength) {
                Projects.update({ _id: element._id, ["individualsNot." + i + "._id"]: docsM._id }, { $set: { ["individuals." + i + ".name"]: nameNew } }, { multi: true });
                Projects.update({ _id: element._id, ["individuals." + i + "._id"]: docsM._id }, { $set: { ["individuals." + i + ".name"]: nameNew } }, { multi: true });
                i++;
            }
        });
        // updates company section for individuals
        const docsPartners = Partners.find({}, { individuals: docsM }).fetch();
        var iPartner = 0;
        docsPartners.forEach(element => {
            var arrayPartnerLength = element.individuals.length;
            while (iPartner <= arrayPartnerLength) {
                Partners.update({ _id: element._id, ["individualsNot." + iPartner + "._id"]: docsM._id }, { $set: { ["individuals." + iPartner + ".name"]: nameNew } }, { multi: true });
                Partners.update({ _id: element._id, ["individuals." + iPartner + "._id"]: docsM._id }, { $set: { ["individuals." + iPartner + ".name"]: nameNew } }, { multi: true });
                iPartner++;
            }
        });
    },
    'individualSkype.update'(skypeNew, ProjectId) {
        const docs = Individuals.findOne({ _id: ProjectId });
        Individuals.update({ _id: docs._id }, { $set: { skype: skypeNew } });
        IndividualsMinimal.update({ _id: docs._id }, { $set: { skype: skypeNew } });

        const docsM = IndividualsMinimal.findOne({ _id: ProjectId });

        // updates projects individuals section
        const docsProjects = Projects.find({}, { individuals: docsM }).fetch();
        var i = 0;
        docsProjects.forEach(element => {
            var arrayLength = element.individuals.length;
            while (i <= arrayLength) {
                Projects.update({ _id: element._id, ["individualsNot." + i + "._id"]: docsM._id }, { $set: { ["individuals." + i + ".skype"]: skypeNew } }, { multi: true });
                Projects.update({ _id: element._id, ["individuals." + i + "._id"]: docsM._id }, { $set: { ["individuals." + i + ".skype"]: skypeNew } }, { multi: true });
                i++;
            }
        });
        // updates company section for individuals
        const docsPartners = Partners.find({}, { individuals: docsM }).fetch();
        var iPartner = 0;
        docsPartners.forEach(element => {
            var arrayPartnerLength = element.individuals.length;
            while (iPartner <= arrayPartnerLength) {
                Partners.update({ _id: element._id, ["individualsNot." + iPartner + "._id"]: docsM._id }, { $set: { ["individuals." + iPartner + ".skype"]: skypeNew } }, { multi: true });
                Partners.update({ _id: element._id, ["individuals." + iPartner + "._id"]: docsM._id }, { $set: { ["individuals." + iPartner + ".skype"]: skypeNew } }, { multi: true });
                iPartner++;
            }
        });
    },
    'individualLogo.update'(logo, ProjectId) {

        var doc = Individuals.findOne({ _id: ProjectId });

        Individuals.update({ _id: doc._id }, { $set: { logo: logo } });
        IndividualsMinimal.update({ _id: doc._id }, { $set: { logo: logo } });

        const docsM = IndividualsMinimal.findOne({ _id: ProjectId });
        const docsProjects = Projects.find({}, { individuals: docsM }).fetch();
        var i = 0;

        docsProjects.forEach(element => {
            var arrayLength = element.individuals.length;
            while (i <= arrayLength) {
                Projects.update({ _id: element._id, ["individuals." + i + "._id"]: docsM._id }, { $set: { ["individuals." + i + ".logo"]: logo } }, { multi: true });
                Projects.update({ _id: element._id, ["individuals." + i + "._id"]: docsM._id }, { $set: { ["individualsNot." + i + ".logo"]: logo } }, { multi: true });
                i++;
            }
        });
        const docsPartners = Partners.find({}, { individuals: docsM }).fetch();
        var i = 0;
        docsPartners.forEach(element => {
            var arrayLength = element.individuals.length;
            while (i <= arrayLength) {
                Partners.update({ _id: element._id, ["individuals." + i + "._id"]: docsM._id }, { $set: { ["individuals." + i + ".logo"]: logo } }, { multi: true });
                Partners.update({ _id: element._id, ["individuals." + i + "._id"]: docsM._id }, { $set: { ["individualsNot." + i + ".logo"]: logo } }, { multi: true });
                i++;
            }
        });
        // FlowRouter.go('IndividualsEditDetails.edit');
    },
    'individuallinkedin.update'(linkedinNew, ProjectId) {
        const docs = Individuals.findOne({ _id: ProjectId });
        Individuals.update({ _id: docs._id }, { $set: { linkedin: linkedinNew } });
        IndividualsMinimal.update({ _id: docs._id }, { $set: { linkedin: linkedinNew } });
        const docsM = IndividualsMinimal.findOne({ _id: ProjectId });


        // updates projects individuals section
        const docsProjects = Projects.find({}, { individuals: docsM }).fetch();
        var i = 0;
        docsProjects.forEach(element => {
            var arrayLength = element.individuals.length;
            while (i <= arrayLength) {
                Projects.update({ _id: element._id, ["individualsNot." + i + "._id"]: docsM._id }, { $set: { ["individuals." + i + ".linkedIn"]: linkedinNew } }, { multi: true });
                Projects.update({ _id: element._id, ["individuals." + i + "._id"]: docsM._id }, { $set: { ["individuals." + i + ".linkedIn"]: linkedinNew } }, { multi: true });
                i++;
            }
        });
        // updates company section for individuals
        const docsPartners = Partners.find({}, { individuals: docsM }).fetch();
        var iPartner = 0;
        docsPartners.forEach(element => {
            var arrayPartnerLength = element.individuals.length;
            while (iPartner <= arrayPartnerLength) {
                Partners.update({ _id: element._id, ["individualsNot." + iPartner + "._id"]: docsM._id }, { $set: { ["individuals." + iPartner + ".linkedIn"]: linkedinNew } }, { multi: true });
                Partners.update({ _id: element._id, ["individuals." + iPartner + "._id"]: docsM._id }, { $set: { ["individuals." + iPartner + ".linkedIn"]: linkedinNew } }, { multi: true });
                iPartner++;
            }
        });
    },
    'IndividualPhone.update'(phoneNew, ProjectId) {
        const docs = Individuals.findOne({ _id: ProjectId });
        Individuals.update({ _id: docs._id }, { $set: { telephone: phoneNew } });
        IndividualsMinimal.update({ _id: docs._id }, { $set: { telephone: phoneNew } });
        const docsM = IndividualsMinimal.findOne({ _id: ProjectId });

        // updates projects individuals section
        const docsProjects = Projects.find({}, { individuals: docsM }).fetch();
        var i = 0;
        docsProjects.forEach(element => {
            var arrayLength = element.individuals.length;
            while (i <= arrayLength) {
                Projects.update({ _id: element._id, ["individualsNot." + i + "._id"]: docsM._id }, { $set: { ["individuals." + i + ".telephone"]: phoneNew } }, { multi: true });
                Projects.update({ _id: element._id, ["individuals." + i + "._id"]: docsM._id }, { $set: { ["individuals." + i + ".telephone"]: phoneNew } }, { multi: true });
                i++;
            }
        });
        // updates company section for individuals
        const docsPartners = Partners.find({}, { individuals: docsM }).fetch();
        var iPartner = 0;
        docsPartners.forEach(element => {
            var arrayPartnerLength = element.individuals.length;
            while (iPartner <= arrayPartnerLength) {
                Partners.update({ _id: element._id, ["individualsNot." + iPartner + "._id"]: docsM._id }, { $set: { ["individuals." + iPartner + ".telephone"]: phoneNew } }, { multi: true });
                Partners.update({ _id: element._id, ["individuals." + iPartner + "._id"]: docsM._id }, { $set: { ["individuals." + iPartner + ".telephone"]: phoneNew } }, { multi: true });
                iPartner++;
            }
        });
    },
    'individualposition.update'(positionNew, ProjectId) {
        const docs = Individuals.findOne({ _id: ProjectId });
        Individuals.update({ _id: docs._id }, { $set: { position: positionNew } });
        IndividualsMinimal.update({ _id: docs._id }, { $set: { position: positionNew } });
        const docsM = IndividualsMinimal.findOne({ _id: ProjectId });

        // updates projects individuals section
        const docsProjects = Projects.find({}, { individuals: docsM }).fetch();
        var i = 0;
        docsProjects.forEach(element => {
            var arrayLength = element.individuals.length;
            while (i <= arrayLength) {
                Projects.update({ _id: element._id, ["individualsNot." + i + "._id"]: docsM._id }, { $set: { ["individuals." + i + ".position"]: positionNew } }, { multi: true });
                Projects.update({ _id: element._id, ["individuals." + i + "._id"]: docsM._id }, { $set: { ["individuals." + i + ".position"]: positionNew } }, { multi: true });
                i++;
            }
        });
        // updates company section for individuals
        const docsPartners = Partners.find({}, { individuals: docsM }).fetch();
        var iPartner = 0;
        docsPartners.forEach(element => {
            var arrayPartnerLength = element.individuals.length;
            while (iPartner <= arrayPartnerLength) {
                Partners.update({ _id: element._id, ["individualsNot." + iPartner + "._id"]: docsM._id }, { $set: { ["individuals." + iPartner + ".position"]: positionNew } }, { multi: true });
                Partners.update({ _id: element._id, ["individuals." + iPartner + "._id"]: docsM._id }, { $set: { ["individuals." + iPartner + ".position"]: positionNew } }, { multi: true });
                iPartner++;
            }
        });
    },
    'individualsPartnersAdd.update'(newIndividual) {
        // adds an individual to a partner
        var projectAdd = newIndividual.name;
        var personTransfer = newIndividual.individualsId;

        var person = IndividualsMinimal.findOne({ _id: personTransfer });
        var personIndividuals = PartnersMinimal.findOne({ _id: projectAdd });

        // this section adds a owner if none is present
        var admin = person.owner;
        if(admin.length === 0){
            Individuals.update({ _id: person._id }, { $addToSet: { owner: projectAdd } });
        }
        Partners.update({ _id: personIndividuals._id }, { $addToSet: { individuals: person } });
        Partners.update({ _id: personIndividuals._id }, { $pull: { individualsNot: person } });

        Individuals.update({ _id: person._id }, { $pull: { partnersNot: personIndividuals } });
        Individuals.update({ _id: person._id }, { $addToSet: { partners: personIndividuals } });
    },
    'individualsProjectAdd.update'(newIndividual) {
        var projectAdd = newIndividual.name;
        var personTransfer = newIndividual.individualsId;

        var doc = ProjectsMinimal.findOne({ _id: projectAdd });
        var person = IndividualsMinimal.findOne({ _id: personTransfer });
        var personFull = Individuals.findOne({ _id: personTransfer });

        var personHolder = personFull.partners;

        // Adds project to partners the individual is employed by
        personHolder.forEach(element => {
            Partners.update({ _id: element._id }, { $addToSet: { projects: doc } });
            Partners.update({ _id: element._id }, { $pull: { projectsNot: doc } });
            // adds partners to the project
            Projects.update({ _id: doc._id }, { $addToSet: { partners: element } });
            Projects.update({ _id: doc._id }, { $pull: { partnersNot: element } });
        });

        Projects.update({ _id: doc._id }, { $addToSet: { individuals: person } });
        Projects.update({ _id: doc._id }, { $pull: { individualsNot: person } });

        Individuals.update({ _id: personTransfer }, { $pull: { projectsNot: doc } });
        Individuals.update({ _id: personTransfer }, { $addToSet: { projects: doc } });
    },
    'individuals.update'(updatedIndividuals) {
        const { twitter, facebook, name, bio, position, linkedIn, skype, telephone, logo, individuals = [], projects = [] } = updatedIndividuals;
        //Make sure the user is logged in before inserting a task
        if (!Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }
        Individuals.update(
            {
                createdAt: new Date(), // current time
                //alias: generateAlias(name),
                name,
                logo,
                bio,
                facebook,
                twitter,
                position,
                linkedIn,
                skype,
                telephone,
                individuals,
                projects
            },
        );
    }
});
