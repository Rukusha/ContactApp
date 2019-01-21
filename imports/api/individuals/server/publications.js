import { Meteor } from 'meteor/meteor';
import { Individuals } from '../individuals';

Meteor.publish('individuals', function individualsPublication() {
    return Individuals.find({});
});

Individuals.allow({
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