import { Meteor } from 'meteor/meteor';
import { PartnersMinimal } from '../PartnersMinimal/PartnersMinimal';
import { Individuals } from '../individuals/individuals';
import { IndividualsMinimal } from '../IndividualsMinimal/IndividualsMinimal';
import { Partners } from '../partners/partners';
import { Projects } from '../projects/projects';
import { ProjectsMinimal } from '../ProjectsMinimal/ProjectsMinimal';
import { generateAlias } from '../../utils';

Meteor.methods({
   'partnersProjectAdd.update'(addPartner){
        var projectAdd = addPartner.name;
        var personTransfer = addPartner.individualsId;

        var doc = PartnersMinimal.findOne({ _id: projectAdd });
        var person = IndividualsMinimal.findOne({ _id: personTransfer });
        
        Partners.update({ _id: doc._id}, { $addToSet: { individuals: person } });
        Partners.update({ _id: doc._id}, { $pull: { individualsNot: person } });

        Individuals.update({ _id: person._id}, { $addToSet: { partners: doc } });
        Individuals.update({ _id: person._id}, { $pull: { partnersNot: doc } });
    },
    'partnersMinimal.insert'(newPartner) {
        var { Cowner, Cname, twitter, linkedin, facebook, Clogo, Cbio, projects = [], individual = [] } = newPartner;
        const name = newPartner.newPartner.Cname;
        const bio = newPartner.newPartner.Cbio;
        const owner = newPartner.newPartner.Cowner;
        const logo = newPartner.newPartner.Clogo;
        const flagged = false;
        var AllProj = newPartner.AllProj;

        var IndividualsFirst = newPartner.IndividualsFirst;
        var twitter = newPartner.newPartner.twitter;
        var facebook = newPartner.newPartner.facebook;
        var linkedin = newPartner.newPartner.linkedin;

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

            var part = PartnersMinimal.insert(
                {
                    createdAt: new Date(), // current time
                    _id: AllProj,
                    alias: generateAlias(name),
                    owner: [owner],
                    flagged,
                    name,
                    logo,
                    bio,
                    twitter,
                    facebook,
                    linkedin
                },
                (error) => {
                })
                var partObject = PartnersMinimal.findOne({_id: part});

                Individuals.update({ _id: IndividualsFirst._id},{$addToSet: {partners: partObject}})

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
                Individuals.update({ _id: IndividualsFirst._id }, { $addToSet: { owner: part } });
                Individuals.update({ _id: IndividualsFirst._id }, { $pull: { partnersNot: partObject } });

        }
    }
});