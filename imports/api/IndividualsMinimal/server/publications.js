import { Meteor } from 'meteor/meteor';
import { IndividualsMinimal } from '../IndividualsMinimal';

Meteor.publish('individualsMinimal', function individualsMinimalPublication() {
    return IndividualsMinimal.find({});
});

IndividualsMinimal.allow({
    insert() {
        return true;
    },
    update() {
        return true;
    },
    remove() {
        return true;
    }
});
