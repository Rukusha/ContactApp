import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { generateAlias } from '../../utils';
import { Partners } from '../partners/partners';
import { PartnersMinimal } from '../PartnersMinimal/PartnersMinimal';
import { Projects } from '../projects/projects';
import { ProjectsMinimal } from '../ProjectsMinimal/ProjectsMinimal';
import { Individuals } from '../individuals/individuals';
import { IndividualsMinimal } from '../IndividualsMinimal/IndividualsMinimal';
import { Roles } from 'meteor/alanning:roles';

//this function is used to dislay the no access notification to the current user f they dont have access
function restrict() {
    var showHide = document.getElementById("overNoAccess");
    showHide.style.display = "block";
}
;
Meteor.methods({
    'projectsNo.insert'(newProject) {
        const { Id, adminIn, owner, admin = [], name, domain, bio, logo, individuals = [], partners = [] } = newProject;
        if (!Meteor.userId()) {
            restrict();
        }
        var loggedInUser = Meteor.user();
        if ((Roles.userIsInRole(loggedInUser, ['cAdmin'], 'default-group')) || (Roles.userIsInRole(loggedInUser, ['admin'], 'default-group'))) {
            check(name, String);
            check(domain, String);
            check(bio, String);
            check(logo, String);

            var individualsFirst = IndividualsMinimal.findOne({ _id: individuals[0] });
            var AllInidividuals = IndividualsMinimal.find({}).fetch();
            var AllPartners = PartnersMinimal.find({}).fetch();
            var adminArray = admin[0];

            var AdminOwnerId = Individuals.findOne({ _id: adminArray });

            if (AdminOwnerId !== undefined) {
                var ownerArrayCheck = owner.length;
                var ownerCheck = owner[0];
                if ((ownerArrayCheck !== 0) && (ownerCheck !== null)) {
                    var Admin = AdminOwnerId.owner[0];
                    var AdminOwner = PartnersMinimal.findOne({ _id: Admin });

                    // filters individuals
                    var AllIni = AllInidividuals.filter(function (i) {
                        return (i._id !== individuals._id);
                    });
                    // filters Partners
                    var AllPrartners = AllPartners.filter(function (e) {
                        return (e._id !== AdminOwner._id);
                    });

                    var docsAdminOwner = AdminOwner.owner;

                    AllPartners = PartnersMinimal.find({}).fetch();

                    var data = Projects.insert(
                        {
                            createdAt: new Date(), // current time
                            alias: generateAlias(name),
                            owner: docsAdminOwner,
                            admin: individuals[0],
                            name,
                            domain,
                            bio,
                            logo,
                            individuals: [individualsFirst],
                            individualsNot: AllIni,
                            partners: [AdminOwner],
                            partnersNot: AllPrartners
                        },
                    );
                    ProjectsMinimal.insert(
                        {
                            _id: data,
                            createdAt: new Date(), // current time
                            alias: generateAlias(name),
                            owner: docsAdminOwner,
                            admin: individuals[0],
                            name,
                            domain,
                            bio,
                            logo,
                        },
                    );
                } else {
                    AllPartners = PartnersMinimal.find({}).fetch();

                    var data = Projects.insert(
                        {
                            createdAt: new Date(), // current time
                            alias: generateAlias(name),
                            owner: [],
                            admin: individuals[0],
                            name,
                            domain,
                            bio,
                            logo,
                            individuals: [individualsFirst],
                            individualsNot: AllIni,
                            partners: [],
                            partnersNot: AllPrartners
                        },
                    );
                    ProjectsMinimal.insert(
                        {
                            _id: data,
                            createdAt: new Date(), // current time
                            alias: generateAlias(name),
                            owner: [],
                            admin: individuals[0],
                            name,
                            domain,
                            bio,
                            logo,
                        },
                    );
                }
                if (Array.isArray(owner)) {
                    var noArrayowner = owner[0];
                } else {
                    var noArrayowner = owner;
                }
                var PartnersFirst = PartnersMinimal.findOne({ _id: noArrayowner });

                const docsIndi = IndividualsMinimal.findOne({ _id: individuals[0] });
                const docsProj = ProjectsMinimal.findOne({ _id: data });

                Projects.update({ _id: docsProj._id }, { $addToSet: { individuals: docsIndi } });
                Projects.update({ _id: docsProj._id }, { $pull: { individualsNot: docsIndi } });

                Individuals.update({ _id: docsIndi._id }, { $addToSet: { partners: PartnersFirst } });
                Individuals.update({ _id: docsIndi._id }, { $addToSet: { projects: docsProj } });

                Partners.update({ _id: PartnersFirst._id }, { $addToSet: { individuals: docsIndi } });
                Partners.update({ _id: PartnersFirst._id }, { $addToSet: { projects: docsProj } });

                // mass partners update

                const docsPartn = Partners.find({}).fetch();
                docsPartn.forEach(element => {
                    Partners.update({ _id: element._id }, { $addToSet: { "projectsNot": docsProj } }, { multi: true });
                });
                Partners.update({ _id: PartnersFirst._id }, { $pull: { projectsNot: docsProj } });
                // // mass individuals update
                const docsPart = Individuals.find({}).fetch();
                docsPart.forEach(element => {
                    Individuals.update({ _id: element._id }, { $addToSet: { "projectsNot": docsProj } }, { multi: true });
                });
                Individuals.update({ _id: docsIndi._id }, { $pull: { projectsNot: docsProj } });
            }
        }
        },
        'ProjectindividualsAdd.update'(individualAdd) {
            var indiAdd = individualAdd.name;
            var projectAdd = individualAdd.projectId;
            var project = ProjectsMinimal.findOne({ _id: projectAdd });

            var person = IndividualsMinimal.findOne({ _id: indiAdd });
         
            var individualOwner = person.owner;
            if(individualOwner.length !== 0){
            var partnerRetrieve = individualOwner[0];
            
            var doc = PartnersMinimal.findOne({ _id: partnerRetrieve });
            if (partnerRetrieve === undefined) {
                doc = PartnersMinimal.findOne({ owner: individualOwner });
            }

                // adds project into the partner collection
                Partners.update({ _id: doc._id }, { $addToSet: { projects: project } });
                Partners.update({ _id: doc._id }, { $pull: { projectsNot: project } });

                // adds the partner to the project cllection
                Projects.update({ _id: project._id }, { $addToSet: { partners: doc } });
                Projects.update({ _id: project._id }, { $pull: { partnersNot: doc } });
            
        }
            // adds project into the individual collection
            Individuals.update({ _id: person._id }, { $addToSet: { projects: project } });
            Individuals.update({ _id: person._id }, { $pull: { projectsNot: project } });

            // adds the individual to the project
            Projects.update({ _id: project._id }, { $addToSet: { individuals: person } });
            Projects.update({ _id: project._id }, { $pull: { individualsNot: person } });
        },
        'projects.insert'(newProject) {
            const { Id, owner, admin = [], name, domain, bio, logo } = newProject;
            if (!Meteor.userId()) {
                restrict();
            }
            var loggedInUser = Meteor.user();
            if ((Roles.userIsInRole(loggedInUser, ['cAdmin'], 'default-group')) || (Roles.userIsInRole(loggedInUser, ['admin'], 'default-group'))) {
                check(name, String);
                check(domain, String);
                check(bio, String);
                check(logo, String);

                var individualsFirst = IndividualsMinimal.findOne({ _id: Id });
                var AllInidividuals = IndividualsMinimal.find({}).fetch();
                var AllPartners = PartnersMinimal.find({}).fetch();
                if (Array.isArray(owner)) {
                    var noArrayowner = owner[0];
                } else {
                    var noArrayowner = owner;
                }
                var PartnersFirst = PartnersMinimal.findOne({ _id: noArrayowner });

                // filters individuals
                var AllIni = AllInidividuals.filter(function (i) {
                    return (i._id !== individualsFirst._id);
                });
                // filters Partners
                var AllPrartners = AllPartners.filter(function (e) {
                    return (e._id !== PartnersFirst._id);
                });

                var docsOwner = Partners.findOne({ _id: noArrayowner });
                var docsAdminOwner = docsOwner.owner;
                var data = Projects.insert(
                    {
                        createdAt: new Date(), // current time
                        alias: generateAlias(name),
                        owner: docsAdminOwner,
                        admin: individualsFirst,
                        "flagged": false,
                        name,
                        domain,
                        bio,
                        logo,
                        individuals: [individualsFirst],
                        individualsNot: AllIni,
                        partners: [PartnersFirst],
                        partnersNot: AllPrartners
                    },
                );
                ProjectsMinimal.insert(
                    {
                        _id: data,
                        createdAt: new Date(), // current time
                        alias: generateAlias(name),
                        owner: docsAdminOwner,
                        admin: individualsFirst,
                        "flagged": false,
                        name,
                        domain,
                        bio,
                        logo,
                    },
                );
                // Updating the Partners collection by adding the individuals Id into it
                const docsIndi = IndividualsMinimal.findOne({ _id: Id });
                const docsProj = ProjectsMinimal.findOne({ _id: data });

                Projects.update({ _id: docsProj._id }, { $addToSet: { individuals: docsIndi } });
                Projects.update({ _id: docsProj._id }, { $pull: { individualsNot: docsIndi } });

                // Individuals.update({ _id: docsIndi._id }, { $addToSet: { partners: PartnersFirst } });
                Individuals.update({ _id: docsIndi._id }, { $addToSet: { projects: docsProj } });

                Partners.update({ _id: PartnersFirst._id }, { $addToSet: { individuals: docsIndi } });
                Partners.update({ _id: PartnersFirst._id }, { $addToSet: { projects: docsProj } });

                const docsPartn = Partners.find({}).fetch();
                const docsProjects = Projects.find({}).fetch();
                const docsIndividuals = Individuals.find({}).fetch();


                docsProjects.forEach(element => {
                    Projects.update({ _id: element._id }, { $addToSet: { "partnersNot": PartnersFirst } }, { multi: true });
                });
                docsIndividuals.forEach(element => {
                    Individuals.update({ _id: element._id }, { $addToSet: { "partnersNot": PartnersFirst } }, { multi: true });
                });
                docsPartn.forEach(element => {
                    Partners.update({ _id: element._id }, { $addToSet: { "individualsNot": docsIndi } }, { multi: true });
                });
                docsProjects.forEach(element => {
                    Projects.update({ _id: element._id }, { $addToSet: { "individualsNot": docsIndi } }, { multi: true });
                });
                // mass partners update

                docsPartn.forEach(element => {
                    Partners.update({ _id: element._id }, { $addToSet: { "projectsNot": docsProj } }, { multi: true });
                });
                Partners.update({ _id: PartnersFirst._id }, { $pull: { projectsNot: docsProj } });
                // // mass individuals update
                const docsPart = Individuals.find({}).fetch();
                docsPart.forEach(element => {
                    Individuals.update({ _id: element._id }, { $addToSet: { "projectsNot": docsProj } }, { multi: true });
                });
                Individuals.update({ _id: docsIndi._id }, { $pull: { projectsNot: docsProj } });
            }
        },
        //  This handles updating the projects admin field into the collection
        'projectsAdmin.update'(admin, ProjectId) {
            const docs = Projects.findOne({ _id: ProjectId });
            Projects.update({ _id: docs._id }, { $addToSet: { admin: admin } });
            Projects.update({ _id: docs._id }, { $addToSet: { individuals: admin } });
        },
        //  This handles updating the projects name field into the collection
        'projectsName.update'(nameNew, ProjectId) {
            const docs = Projects.findOne({ _id: ProjectId });

            const docsM = ProjectsMinimal.findOne({ _id: ProjectId });
            const docsProjects = Partners.find({}, {}).fetch();
            const docsIndividuals = Individuals.find({}, {}).fetch();


            docsProjects.forEach(element => {
                var i = 0;
                var arrayLength = element.projects.length;
                while (i <= arrayLength) {
                    Partners.update({ _id: element._id, ["projects." + i + "._id"]: docsM._id }, { $set: { ["projects." + i + ".name"]: nameNew } }, { multi: true });
                    Partners.update({ _id: element._id, ["projects." + i + "._id"]: docsM._id }, { $set: { ["projectsNot." + i + ".name"]: nameNew } }, { multi: true });
                    i++;
                }
            });
            docsIndividuals.forEach(element => {
                var i = 0;

                var arrayLength = element.projects.length;
                while (i <= arrayLength) {
                    Individuals.update({ _id: element._id, ["projects." + i + "._id"]: docsM._id }, { $set: { ["projects." + i + ".name"]: nameNew } }, { multi: true });
                    Individuals.update({ _id: element._id, ["projects." + i + "._id"]: docsM._id }, { $set: { ["projectsNot." + i + ".name"]: nameNew } }, { multi: true });
                    i++;
                }
            });
            Projects.update({ _id: docs._id }, { $set: { name: nameNew } });
            ProjectsMinimal.update({ _id: docs._id }, { $set: { name: nameNew } });

        },
        //  This handles updating the projects bio field into the collection
        'projectsBio.update'(bioNew, ProjectId) {
            const docs1 = Projects.findOne({ _id: ProjectId });

            const docsM = ProjectsMinimal.findOne({ _id: ProjectId });
            const docsProjects = Partners.find({}, { projects: docsM }).fetch();
            const docsIndividuals = Individuals.find({}, { projects: docsM }).fetch();

            docsProjects.forEach(element => {
                var i = 0;

                var arrayLength = element.projects.length;
                while (i <= arrayLength) {
                    Partners.update({ _id: element._id, ["projects." + i + "._id"]: docsM._id }, { $set: { ["projects." + i + ".bio"]: bioNew } }, { multi: true });
                    Partners.update({ _id: element._id, ["projects." + i + "._id"]: docsM._id }, { $set: { ["projectsNot." + i + ".bio"]: bioNew } }, { multi: true });
                    i++;
                }
            });
            docsIndividuals.forEach(element => {
                var i = 0;

                var arrayLength = element.projects.length;
                while (i <= arrayLength) {
                    Individuals.update({ _id: element._id, ["projects." + i + "._id"]: docsM._id }, { $set: { ["projects." + i + ".bio"]: bioNew } }, { multi: true });
                    Individuals.update({ _id: element._id, ["projects." + i + "._id"]: docsM._id }, { $set: { ["projectsNot." + i + ".bio"]: bioNew } }, { multi: true });
                    i++;
                }
            });
            Projects.update({ _id: docs1._id }, { $set: { bio: bioNew } });
            ProjectsMinimal.update({ _id: docs1._id }, { $set: { bio: bioNew } });
        },
        //  This handles updating the projects website field into the collection
        'projectsDomain.update'(domainNew, ProjectId) {
            const docs1 = Projects.findOne({ _id: ProjectId });

            const docsM = ProjectsMinimal.findOne({ _id: ProjectId });
            const docsProjects = Partners.find({}, { projects: docsM }).fetch();
            const docsIndividuals = Individuals.find({}, { projects: docsM }).fetch();


            docsProjects.forEach(element => {
                var i = 0;

                var arrayLength = element.projects.length;
                while (i <= arrayLength) {
                    Partners.update({ _id: element._id, ["projects." + i + "._id"]: docsM._id }, { $set: { ["projects." + i + ".domain"]: domainNew } }, { multi: true });
                    Partners.update({ _id: element._id, ["projects." + i + "._id"]: docsM._id }, { $set: { ["projectsNot." + i + ".domain"]: domainNew } }, { multi: true });
                    i++;
                }
            });
            docsIndividuals.forEach(element => {
                var i = 0;

                var arrayLength = element.projects.length;
                while (i <= arrayLength) {
                    Individuals.update({ _id: element._id, ["projects." + i + "._id"]: docsM._id }, { $set: { ["projects." + i + ".domain"]: domainNew } }, { multi: true });
                    Individuals.update({ _id: element._id, ["projects." + i + "._id"]: docsM._id }, { $set: { ["projectsNot." + i + ".domain"]: domainNew } }, { multi: true });
                    i++;
                }
            });
            Projects.update({ _id: docs1._id }, { $set: { domain: domainNew } });
            ProjectsMinimal.update({ _id: docs1._id }, { $set: { domain: domainNew } });
        },
        //  This handles updating the projects logo field into the collection
        'projectsLogo.update'(logo, ProjectId) {
            var doc = Partners.findOne({ _id: ProjectId });

            Projects.update({ _id: doc._id }, { $set: { logo: logo } });
            ProjectsMinimal.update({ _id: doc._id }, { $set: { logo: logo } });

            const docsM = ProjectsMinimal.findOne({ _id: ProjectId });
            const docsPartners = Partners.find({}, { projects: docsM }).fetch();
            const docsIndividuals = Individuals.find({}, { projects: docsM }).fetch();

            docsPartners.forEach(element => {
                var arrayLength = element.projects.length;
                while (i <= arrayLength) {
                    var i = 0;

                    Partners.update({ _id: element._id, ["projects." + i + "._id"]: docsM._id }, { $set: { ["projects." + i + ".logo"]: logo } }, { multi: true });
                    Partners.update({ _id: element._id, ["projects." + i + "._id"]: docsM._id }, { $set: { ["projectsNot." + i + ".logo"]: logo } }, { multi: true });
                    i++;
                }
            });
            docsIndividuals.forEach(element => {
                var i = 0;
                var arrayLength = element.projects.length;
                while (i <= arrayLength) {
                    Individuals.update({ _id: element._id, ["projects." + i + "._id"]: docsM._id }, { $set: { ["projects." + i + ".logo"]: logo } }, { multi: true });
                    Individuals.update({ _id: element._id, ["projects." + i + "._id"]: docsM._id }, { $set: { ["projectsNot." + i + ".logo"]: logo } }, { multi: true });
                    i++;
                }
            });
        },

        //  this method is used to dislay the no access notification to the current user if they dont have access
        'projects.restrict'() {
            var showHide = document.getElementById("overNoAccess");
            showHide.style.display = "block";
        },

        'projects.remove'(projectId) {
            var project = projectId.projectId;
            const projectObject = ProjectsMinimal.findOne({ _id: project });

            const partnerjObject = Partners.find({}).fetch();
            const IndividualsObject = Individuals.find({}).fetch();

            IndividualsObject.forEach(function (element) {
                // remove partner individuals from the project            
                Individuals.update({ _id: element._id }, { $pull: { projectsNot: projectObject } });
                Individuals.update({ _id: element._id }, { $pull: { projects: projectObject } });
            });
            partnerjObject.forEach(function (element) {
                // remove partner individuals from the project            
                Partners.update({ _id: element._id }, { $pull: { projectsNot: projectObject } });
                Partners.update({ _id: element._id }, { $pull: { projects: projectObject } });
            });

            var id = project;
            const ProjectObjectFull = Projects.findOne({ _id: project });
            var ProjectObjectMin = projectObject;

            var data = { ProjectObjectMin, ProjectObjectFull }
            var collectionName = "projects";
            // stores a copy of the data that is about to be deleted
            Meteor.call('bin.store', { id, data, collectionName });

            Projects.remove(project);
            ProjectsMinimal.remove(projectObject);
        },
        'PartnersIndividuals.remove'(RemoveProject) {
            var projectId = RemoveProject.individualsId;
            var person = RemoveProject.name;

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
        'ProjectIndividuals.remove'(RemovePartner) {
            // removes partner from the chosen project
            var parnerId = RemovePartner.individualsId;
            var person = RemovePartner.name;

            var projectMinimal = ProjectsMinimal.findOne({ _id: parnerId });

            var individualsMinimal = IndividualsMinimal.findOne({ _id: person });

            Projects.update({ _id: projectMinimal._id }, { $addToSet: { individualsNot: individualsMinimal } });
            // remove partner from project
            Projects.update({ _id: projectMinimal._id }, { $pull: { individuals: individualsMinimal } });
            // remove partner from individual
            Individuals.update({ _id: individualsMinimal._id }, { $pull: { projects: projectMinimal } });
            Individuals.update({ _id: individualsMinimal._id }, { $addToSet: { projectsNot: projectMinimal } });

        },
    });