import { Meteor } from 'meteor/meteor';
import { Partners } from '../partners/partners';
import { Users } from '../users/users';
import { Projects } from '../projects/projects';
import { ProjectsMinimal } from '../ProjectsMinimal/ProjectsMinimal';
import { Individuals } from '../individuals/individuals';
import { IndividualsMinimal } from '../IndividualsMinimal/IndividualsMinimal';
import { generateAlias } from '../../utils';
import { PartnersMinimal } from '../PartnersMinimal/PartnersMinimal';
import { Bin } from '../bin/bin';

Meteor.methods({
    'Partners.remove'(partnerId) {
        var partner = partnerId.partnerId;
        const PartnerObject = PartnersMinimal.findOne({ _id: partner });
        const PartnerObjectFull = Partners.findOne({ _id: partner });
        var id = partner;
        var PartnerObjectMin = PartnerObject;
        const data = { PartnerObjectFull, PartnerObjectMin }

        const projObject = Projects.find({}).fetch();
        const IndividualsObject = Individuals.find({}).fetch();

        console.log("Partner has been removed");
        Partners.remove(PartnerObject._id);
        PartnersMinimal.remove(PartnerObject._id);

        IndividualsObject.forEach(function (element) {
            // remove partner individuals from the project            
            Individuals.update({ _id: element._id }, { $pull: { partnersNot: PartnerObject } });
            Individuals.update({ _id: element._id }, { $pull: { partners: PartnerObject } });
        });
        projObject.forEach(function (element) {
            // remove partner individuals from the project            
            Projects.update({ _id: element._id }, { $pull: { partnersNot: PartnerObject } });
            Projects.update({ _id: element._id }, { $pull: { partners: PartnerObject } });
        });
        // stores a copy of the data that is about to be deleted
        var collectionName = "partners"
        Meteor.call('bin.store', { id, data, collectionName });

    },
    'partnerIndividual.remove'(RemoveProject) {
        var projectId = RemoveProject.name;
        var partner = RemoveProject.individualsId;

        var partnerObject = Partners.findOne({ _id: partner });
        var partnersMinimal = PartnersMinimal.findOne({ _id: partner });

        var individualsMinimal = IndividualsMinimal.findOne({ _id: projectId });
        // removes individual from partner
        Partners.update({ _id: partnerObject._id }, { $addToSet: { individualsNot: individualsMinimal } });
        Partners.update({ _id: partnerObject._id }, { $pull: { individuals: individualsMinimal } });

        // remove partners from the indiividual            
        Individuals.update({ _id: individualsMinimal._id }, { $addToSet: { partnersNot: partnersMinimal } });
        Individuals.update({ _id: individualsMinimal._id }, { $pull: { partners: partnersMinimal } });
    },
    'partnerProject.remove'(RemoveProject) {
        var projectId = RemoveProject.name;
        var partner = RemoveProject.individualsId;

        var projectObject = Projects.findOne({ _id: projectId });
        var partnerObject = Partners.findOne({ _id: partner });
        var partnersMinimal = PartnersMinimal.findOne({ _id: partner });


        var projectMinimal = ProjectsMinimal.findOne({ _id: projectId });

        var individualsMinimal = IndividualsMinimal.findOne({ _id: partner });

        var individuals = partnerObject.individuals;
        individuals.forEach(function (element) {
            // remove partner individuals from the project            
            Projects.update({ _id: projectMinimal._id }, { $addToSet: { individualsNot: element } });
            Projects.update({ _id: projectMinimal._id }, { $pull: { individuals: element } });
        });

        // removes project from partner
        Partners.update({ _id: partnerObject._id }, { $addToSet: { projectsNot: projectMinimal } });
        Partners.update({ _id: partnerObject._id }, { $pull: { projects: projectMinimal } });

        // remove partners from the project            
        Projects.update({ _id: projectMinimal._id }, { $addToSet: { partnersNot: partnersMinimal } });
        Projects.update({ _id: projectMinimal._id }, { $pull: { partners: partnersMinimal } });
    },
    'partnersCreateInidividual.insert'(TotalDATA) {
        var emails = TotalDATA.personDATA.emails;
        var name = TotalDATA.personDATA.name;

        Id = Users.insert({
            "services": {
                "password": {
                    "bcrypt": "$2b$10$AJaGl2l8EnMcRdt5n8EaWeukIw4XkzoxeRYOSbBUH9fij4ZgYjaFC"
                },
                "resume": {
                    "loginTokens": [
                        {
                        }
                    ]
                }
            },
            "emails": [
                {
                    "address": emails,
                    "verified": false
                }
            ],
            "profile": {
                "name": name
            },
            "roles": {
                "default-group": [
                    "default-user"
                ]
            }
        });

        var logo = TotalDATA.personDATA.logo;
        var bio = TotalDATA.personDATA.bio;
        var position = TotalDATA.personDATA.position;
        var linkedIn = TotalDATA.personDATA.linkedIn;
        var skype = TotalDATA.personDATA.skype;
        var telephone = TotalDATA.personDATA.telephone;
        logoFile = TotalDATA.personDATA.logoFile;

        var projects = [];
        var partners = [];

        var AllProjects = ProjectsMinimal.find({}).fetch();
        var AllInidividuals = IndividualsMinimal.find({}).fetch();
        var AllPartners = PartnersMinimal.find({}).fetch();

        var insertId = Individuals.insert(
            {
                createdAt: new Date(), // current time
                _id: Id,
                flagged: false,
                name,
                owner: [],
                logo,
                bio,
                position,
                linkedIn,
                skype,
                telephone,
                projects,
                partners,
                projectsNot: AllProjects,
                partnersNot: AllPartners
            },
        );
        IndividualsMinimal.insert(
            {
                createdAt: new Date(), // current time
                _id: Id,
                flagged: false,
                name,
                owner: [],
                logo,
                bio,
                position,
                linkedIn,
                skype,
                telephone
            },
        );

        var name = TotalDATA.CompanyDATA.Cname;
        var logo = TotalDATA.CompanyDATA.Clogo;
        var bio = TotalDATA.CompanyDATA.Cbio;
        var facebook = TotalDATA.CompanyDATA.Cfacebook;
        var twitter = TotalDATA.CompanyDATA.Ctwitter;
        var linkedin = TotalDATA.CompanyDATA.ClinkedIn;


        var projects = [];
        var individuals = [];

        var FirstInidividual = IndividualsMinimal.findOne({ _id: insertId });

        AllProj = Partners.insert(
            {
                createdAt: new Date(), // current time
                alias: generateAlias(name),
                owner: [FirstInidividual._id],
                flagged: false,
                name,
                logo,
                bio,
                twitter,
                facebook,
                linkedIn,
                projectsNot: AllProjects,
                projects: [],
                individualsNot: AllInidividuals,
                individuals: [FirstInidividual]
            },
        );
        PartnersMinimal.insert(
            {
                _id: AllProj,
                createdAt: new Date(), // current time
                alias: generateAlias(name),
                owner: [FirstInidividual._id],
                flagged: false,
                name,
                logo,
                bio,
                twitter,
                facebook,
                linkedin,
            },
        );
        var FirstPartner = PartnersMinimal.findOne({ _id: AllProj });

        // Adds partner to partnerNot sections and pulls the appropriate one
        var partObject = FirstPartner;

        Individuals.update({ _id: FirstInidividual._id }, { $addToSet: { partners: partObject } })

        // // mass Projects update
        const docsPartn = Projects.find({}).fetch();
        docsPartn.forEach(element => {
            Projects.update({ _id: element._id }, { $addToSet: { "partnersNot": partObject } }, { multi: true });
        });
        Projects.update({ _id: partObject._id }, { $pull: { partnersNot: partObject } });

        // // mass individuals update
        const docsPart = Individuals.find({}).fetch();
        docsPart.forEach(element => {
            Individuals.update({ _id: element._id }, { $addToSet: { "partnersNot": partObject } }, { multi: true });
        });
        Individuals.update({ _id: FirstInidividual._id }, { $pull: { partnersNot: partObject } });

        Individuals.update({ _id: FirstInidividual._id }, { $set: { owner: [AllProj] } });
        IndividualsMinimal.update({ _id: FirstInidividual._id }, { $set: { owner: [AllProj] } });


        // Adds individual to indiviidualNot sections and pulls the appropriate one


        // // mass Projects update
        const docsPartnProj = Partners.find({}).fetch();
        docsPartnProj.forEach(element => {
            Partners.update({ _id: element._id }, { $addToSet: { "individualsNot": FirstInidividual } }, { multi: true });
        });
        Partners.update({ _id: partObject._id }, { $pull: { individualsNot: FirstInidividual } });

        // // mass individuals update
        const docsProj = Projects.find({}).fetch();
        docsProj.forEach(element => {
            Projects.update({ _id: element._id }, { $addToSet: { "individualsNot": FirstInidividual } }, { multi: true });
        });

        return result = Id;

    },
    'partnersProject.insert'(newPartner) {
        const { Cowner, Cname, linkedin, Clogo, Cbio } = newPartner;
        var Id = newPartner.Id;
        const name = Cname;
        const bio = Cbio;
        const owner = Cowner;
        const logo = Clogo;
        const flagged = false;
        var twitter = linkedin;
        var facebook = facebook;
        // 
        if (!Meteor.userId()) {
            restrict();
        }
        // check(name, String);
        // check(bio, String);
        // check(logo, String);
        // check(twitter, String);
        // check(facebook, String);
        // check(linkedin, String);

        var loggedInUser = Meteor.user();

        if (Roles.userIsInRole(loggedInUser, ['admin'], 'default-group')) {
            var AllProjects = ProjectsMinimal.find({}).fetch();
            var AllInidividuals = IndividualsMinimal.find({}).fetch();
            // inserts the partner entry
            var AllProj = Partners.insert(
                {
                    createdAt: new Date(), // current time
                    alias: generateAlias(name),
                    owner: [Id],
                    flagged,
                    name,
                    logo,
                    bio,
                    twitter,
                    facebook,
                    linkedin,
                    projectsNot: AllProjects,
                    projects: [],
                    individualsNot: AllInidividuals,
                    individuals: []
                },
            );
            var PartnersM = PartnersMinimal.insert(
                {
                    _id: AllProj,
                    createdAt: new Date(), // current time
                    alias: generateAlias(name),
                    owner: [Id],
                    flagged,
                    name,
                    logo,
                    bio,
                    twitter,
                    facebook,
                    linkedin
                }
            );

            Meteor.call("insertUpdate.insert", { Id, AllProj, PartnersM, logo, bio, twitter, facebook, name, twitter, facebook, linkedin });
            return result = AllProj;
        }
    },

    'insertUpdate.insert'(PartnersM) {
        var Id = PartnersM.Id;
        var AllProj = PartnersM.AllProj;
        var logo = PartnersM.logo;
        var name = PartnersM.name;
        var bio = PartnersM.bio;
        var twitter = PartnersM.twitter;
        var facebook = PartnersM.facebook;
        var linkedin = PartnersM.linkedin;
        const flagged = false;

        // mass partners update

        const docsProj = Projects.find({}).fetch();

        var i = 0;
        var minPart = {
            _id: AllProj,
            createdAt: new Date(), // current time
            alias: generateAlias(name),
            owner: [Id],
            flagged,
            name,
            logo,
            bio,
            twitter,
            facebook,
            linkedin
        };
        docsProj.forEach(element => {
            var arrayLength = element.partners.length;
            while (i <= arrayLength) {
                Projects.update({ _id: element._id }, { $set: { ["partners." + i]: minPart } }, { multi: true });
                i++;
            }
        });
        const docsIndi = Individuals.find({}).fetch();

        docsIndi.forEach(element => {
            var arrayLength = element.partners.length;
            while (i <= arrayLength) {
                Individuals.update({ _id: element._id }, {
                    $set: {
                        ["partners." + i]:
                        {
                            _id: AllProj,
                            createdAt: new Date(), // current time
                            alias: generateAlias(name),
                            owner: [Id],
                            flagged,
                            name,
                            logo,
                            bio,
                            twitter,
                            facebook,
                            linkedin
                        }
                    }
                }, { multi: true });
                i++;
            }
        });
        var removeCreatedPartner = {
            _id: AllProj,
            createdAt: new Date(), // current time
            alias: generateAlias(name),
            owner: [Id],
            flagged,
            name,
            logo,
            bio,
            twitter,
            facebook,
            linkedin
        }
        Individuals.update({ _id: AllProj._id }, { $pull: { partnersNot: removeCreatedPartner } });

        return AllProj;
    },
    'partners.insert'(newPartner) {
        const { Cowner, Cname, twitter, linkedin, facebook, Clogo, Cbio, projects = [], individuals = [] } = newPartner;
        const name = Cname;
        const bio = Cbio;
        const owner = Cowner;
        const logo = Clogo;
        const flagged = false;
        // 
        if (!Meteor.userId()) {
            restrict();
        }
        // check(name, String);
        // check(bio, String);
        // check(logo, String);
        // check(twitter, String);
        // check(facebook, String);
        // check(linkedin, String);

        var loggedInUser = Meteor.user();

        if (Roles.userIsInRole(loggedInUser, ['admin'], 'default-group')) {
            var ProjectsFirst = [];

            var AllProjects = ProjectsMinimal.find({}).fetch();
            var AllInidividuals = IndividualsMinimal.find({}).fetch();
            var IndividualsFirst = IndividualsMinimal.findOne({ _id: Cowner });

            // filters individuals
            var AllIni = AllInidividuals.filter(function (el) {
                return (el._id !== IndividualsFirst._id);
            });
            // filters projects
            var AllPro = AllProjects.filter(function (el) {
                return (el._id !== ProjectsFirst._id);
            });

            // inserts the partner entry
            try {
                var AllProj = Partners.insert(
                    {
                        createdAt: new Date(), // current time
                        alias: generateAlias(name),
                        owner: [owner],
                        flagged,
                        name,
                        logo,
                        bio,
                        twitter,
                        facebook,
                        linkedin,
                        projectsNot: AllPro,
                        projects: ProjectsFirst,
                        individualsNot: AllIni,
                        individuals: [IndividualsFirst]
                    },
                    (error) => {
                    })
            } catch (error) {
                console.log("partners insert failed")
            }
            Meteor.call('partnersMinimal.insert', { IndividualsFirst, newPartner, AllProj });

        }
    },
    'partnersProjectsRemove.update'(ProjectsFirst, AllProj) {
        // removes the projects the partner is working on from the projectsNot field
        var NewPartner = Partners.find({ _id: AllProj });
        var proj = ProjectsFirst.ProjectsFirst;

        proj.forEach(function () {
            var holder = proj;
            Projects.update({ _id: holder }, { $addToSet: { partner: NewPartner } });
            Partners.update({ _id: AllProj }, { $pull: { projectsNot: holder } });
        });
    },
    //  This handles updating the projects admin field into the collection
    'partnersprojects.update'(proj, ProjectId) {
        const docs = Partners.findOne({ _id: ProjectId });
        Partners.update({ _id: docs._id }, { $addToSet: { projects: proj } });
    },
    'partnersindividuals.update'(individuals, ProjectId) {
        const docs = Partners.findOne({ _id: ProjectId });
        Partners.update({ _id: docs._id }, { $addToSet: { individuals: individuals } });
    },
    'partners.person'(AllProj) {

        var holder = AllProj.IndividualsFirst;
        const docs = Individuals.findOne({ _id: holder._id });
        const partnerOne = Partners.findOne({ _id: AllProj.AllProj });

        Individuals.update({ _id: docs._id }, { $addToSet: { partners: partnerOne } });
    },
    'partnersProjects.update'(partnerupdate) {
        const { Id, data, owner } = partnerupdate;

        const docsPart = Partners.findOne({ _id: owner[0] });
        const docsIndi = Individuals.findOne({ _id: Id });
        const docsProj = Projects.findOne({ _id: data });

        Projects.update({ _id: docsProj._id }, { $addToSet: { individuals: docsIndi } });
        Projects.update({ _id: docsProj._id }, { $pull: { individualsNot: docsIndi } });

        Partners.update({ _id: docsPart._id }, { $addToSet: { individuals: docsIndi } });
        Partners.update({ _id: docsPart._id }, { $addToSet: { projects: docsProj } });
    },

    //  This handles updating the projects facebook field into the collection
    'partnersfacebook.insert'(facebookNew, ProjectIdfacebook) {
        const docs1 = Partners.findOne({ _id: ProjectIdfacebook });
        Partners.update({ _id: docs1._id }, { $set: { facebook: facebookNew } });
    },
    //  This handles updating the projects bio field into the collection
    'partnerBio.update'(bioNew, ProjectId) {
        const docs1 = Partners.findOne({ _id: ProjectId });

        const docsM = PartnersMinimal.findOne({ _id: ProjectId });
        const docsProjects = Projects.find({}, { partners: docsM }).fetch();
        const docsIndividuals = Individuals.find({}, { partners: docsM }).fetch();

        var i = 0;

        docsProjects.forEach(element => {
            var arrayLength = element.partners.length;
            while (i <= arrayLength) {
                Projects.update({ _id: element._id, ["partners." + i + "._id"]: docsM._id }, { $set: { ["partners." + i + ".bio"]: bioNew } }, { multi: true });
                Projects.update({ _id: element._id, ["partners." + i + "._id"]: docsM._id }, { $set: { ["partnersNot." + i + ".bio"]: bioNew } }, { multi: true });
                i++;
            }
        });
        var i = 0;
        docsIndividuals.forEach(element => {
            var arrayLength = element.partners.length;
            while (i <= arrayLength) {
                Individuals.update({ _id: element._id, ["partners." + i + "._id"]: docsM._id }, { $set: { ["partners." + i + ".bio"]: bioNew } }, { multi: true });
                Individuals.update({ _id: element._id, ["partners." + i + "._id"]: docsM._id }, { $set: { ["partnersNot." + i + ".bio"]: bioNew } }, { multi: true });
                i++;
            }
        });
        Partners.update({ _id: docs1._id }, { $set: { bio: bioNew } });
        PartnersMinimal.update({ _id: docs1._id }, { $set: { bio: bioNew } });
    },
    //  This handles updating the projects name field into the collection
    'partnersname.update'(nameNew, ProjectId) {
        const docs1 = Partners.findOne({ _id: ProjectId });

        const docsM = PartnersMinimal.findOne({ _id: ProjectId });
        const docsProjects = Projects.find({}, { partners: docsM }).fetch();
        const docsIndividuals = Individuals.find({}, { partners: docsM }).fetch();

        var i = 0;

        docsProjects.forEach(element => {
            var arrayLength = element.partners.length;
            while (i <= arrayLength) {
                Projects.update({ _id: element._id, ["partners." + i + "._id"]: docsM._id }, { $set: { ["partners." + i + ".name"]: nameNew } }, { multi: true });
                Projects.update({ _id: element._id, ["partners." + i + "._id"]: docsM._id }, { $set: { ["partnersNot." + i + ".name"]: nameNew } }, { multi: true });
                i++;
            }
        });
        var i = 0;
        docsIndividuals.forEach(element => {
            var arrayLength = element.partners.length;
            while (i <= arrayLength) {
                Individuals.update({ _id: element._id, ["partners." + i + "._id"]: docsM._id }, { $set: { ["partners." + i + ".name"]: nameNew } }, { multi: true });
                Individuals.update({ _id: element._id, ["partners." + i + "._id"]: docsM._id }, { $set: { ["partnersNot." + i + ".name"]: nameNew } }, { multi: true });
                i++;
            }
        });
        Partners.update({ _id: docs1._id }, { $set: { name: nameNew } });
        PartnersMinimal.update({ _id: docs1._id }, { $set: { name: nameNew } });
    },
    //  This handles updating the projects twitter field into the collection
    'partnerstwitter.insert'(twitterNew, ProjectId) {
        const docs1 = Partners.findOne({ _id: ProjectId });

        const docsM = PartnersMinimal.findOne({ _id: ProjectId });
        const docsProjects = Projects.find({}, { partners: docsM }).fetch();
        const docsIndividuals = Individuals.find({}, { partners: docsM }).fetch();

        var i = 0;

        docsProjects.forEach(element => {
            var arrayLength = element.partners.length;
            while (i <= arrayLength) {
                Projects.update({ _id: element._id, ["partners." + i + "._id"]: docsM._id }, { $set: { ["partners." + i + ".twitter"]: twitterNew } }, { multi: true });
                Projects.update({ _id: element._id, ["partners." + i + "._id"]: docsM._id }, { $set: { ["partnersNot." + i + ".twitter"]: twitterNew } }, { multi: true });
                i++;
            }
        });
        var i = 0;
        docsIndividuals.forEach(element => {
            var arrayLength = element.partners.length;
            while (i <= arrayLength) {
                Partners.update({ _id: docs1._id }, { $set: { twitter: twitterNew } });
                Individuals.update({ _id: element._id, ["partners." + i + "._id"]: docsM._id }, { $set: { ["partners." + i + ".twitter"]: twitterNew } }, { multi: true });
                Individuals.update({ _id: element._id, ["partners." + i + "._id"]: docsM._id }, { $set: { ["partnersNot." + i + ".twitter"]: twitterNew } }, { multi: true });
                i++;
            }
        });
        Partners.update({ _id: docs1._id }, { $set: { twitter: twitterNew } });
        PartnersMinimal.update({ _id: docs1._id }, { $set: { twitter: twitterNew } });
    },
    //  This handles updating the projects name field into the collection
    'partnerslinkedin.insert'(linkedinNew, ProjectId) {
        const docs1 = Partners.findOne({ _id: ProjectId });
        const docsM = PartnersMinimal.findOne({ _id: ProjectId });
        const docsProjects = Projects.find({}, { partners: docsM }).fetch();
        const docsIndividuals = Individuals.find({}, { partners: docsM }).fetch();

        var i = 0;

        docsProjects.forEach(element => {
            var arrayLength = element.partners.length;
            while (i <= arrayLength) {
                Projects.update({ _id: element._id, ["partners." + i + "._id"]: docsM._id }, { $set: { ["partners." + i + ".linkedin"]: linkedinNew } }, { multi: true });
                Projects.update({ _id: element._id, ["partners." + i + "._id"]: docsM._id }, { $set: { ["partnersNot." + i + ".linkedin"]: linkedinNew } }, { multi: true });
                i++;
            }
        });
        var i = 0;
        docsIndividuals.forEach(element => {
            var arrayLength = element.partners.length;
            while (i <= arrayLength) {
                Individuals.update({ _id: element._id, ["partners." + i + "._id"]: docsM._id }, { $set: { ["partners." + i + ".linkedin"]: linkedinNew } }, { multi: true });
                Individuals.update({ _id: element._id, ["partners." + i + "._id"]: docsM._id }, { $set: { ["partnersNot." + i + ".linkedin"]: linkedinNew } }, { multi: true });
                i++;
            }
        });
        Partners.update({ _id: docs1._id }, { $set: { linkedIn: linkedinNew } });
        PartnersMinimal.update({ _id: docs1._id }, { $set: { linkedIn: linkedinNew } });
    },
    'partners.update'(updatedPartner) {
        const { partnerId, logo } = updatedPartner;
        const docs1 = Partners.findOne({ _id: partnerId });

        // Make sure the user is logged in before inserting a task
        if (!Meteor.userId()) {
            restrict();
        }
        Partners.update({ _id: docs1._id }, { $set: { logo: logo } });
        // Projects.update({_id: {$in: projects}}, {$addToSet: {partners: partnerId}}, {multi: true});
        // Individuals.update({_id: {$in: projects}}, {$addToSet: {partners: partnerId}}, {multi: true});
    },
    "partnersLogo.update"(logo, ProjectId) {
        var doc = Partners.findOne({ _id: ProjectId });

        Partners.update({ _id: doc._id }, { $set: { logo: logo } });
        PartnersMinimal.update({ _id: doc._id }, { $set: { logo: logo } });

        const docsM = PartnersMinimal.findOne({ _id: ProjectId });
        const docsProjects = Projects.find({}, { individuals: docsM }).fetch();
        const docsIndividuals = Individuals.find({}, { partners: docsM }).fetch();

        docsProjects.forEach(element => {
            var arrayLength = element.individuals.length;
            var i = 0;
            while (i <= arrayLength) {
                Projects.update({ _id: element._id, ["partners." + i + "._id"]: docsM._id }, { $set: { ["partners." + i + ".logo"]: logo } }, { multi: true });
                Projects.update({ _id: element._id, ["partners." + i + "._id"]: docsM._id }, { $set: { ["partnersNot." + i + ".logo"]: logo } }, { multi: true });
                i++;
            }
        });
        docsIndividuals.forEach(element => {
            var i = 0;
            var arrayLength = element.partners.length;
            while (i <= arrayLength) {
                Individuals.update({ _id: element._id, ["partners." + i + "._id"]: docsM._id }, { $set: { ["partners." + i + ".logo"]: logo } }, { multi: true });
                Individuals.update({ _id: element._id, ["partners." + i + "._id"]: docsM._id }, { $set: { ["partnersNot." + i + ".logo"]: logo } }, { multi: true });
                i++;
            }
        });
    },
    'partnersfacebook.update'(facebookNew, ProjectId) {
        const docs = Partners.findOne({ _id: ProjectId });

        Partners.update({ _id: docs._id }, { $set: { facebook: facebookNew } });
        PartnersMinimal.update({ _id: docs._id }, { $set: { facebook: facebookNew } });

        const docs1 = Partners.findOne({ _id: ProjectId });
        const docsM = PartnersMinimal.findOne({ _id: ProjectId });
        const docsProjects = Projects.find({}, { partners: docsM }).fetch();
        const docsIndividuals = Individuals.find({}, { partners: docsM }).fetch();

        var i = 0;

        docsProjects.forEach(element => {
            var arrayLength = element.partners.length;
            while (i <= arrayLength) {
                Projects.update({ _id: element._id, ["partners." + i + "._id"]: docsM._id }, { $set: { ["partners." + i + ".facebook"]: facebookNew } }, { multi: true });
                Projects.update({ _id: element._id, ["partners." + i + "._id"]: docsM._id }, { $set: { ["partnersNot." + i + ".facebook"]: facebookNew } }, { multi: true });
                i++;
            }
        });
        var i = 0;
        docsIndividuals.forEach(element => {
            var arrayLength = element.partners.length;
            while (i <= arrayLength) {
                Individuals.update({ _id: element._id, ["partners." + i + "._id"]: docsM._id }, { $set: { ["partners." + i + ".facebook"]: facebookNew } }, { multi: true });
                Individuals.update({ _id: element._id, ["partners." + i + "._id"]: docsM._id }, { $set: { ["partnersNot." + i + ".facebook"]: facebookNew } }, { multi: true });
                i++;
            }
        });
        Partners.update({ _id: docs1._id }, { $set: { facebook: facebookNew } });
        PartnersMinimal.update({ _id: docs1._id }, { $set: { facebook: facebookNew } });
    },
});