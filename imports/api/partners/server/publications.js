import { Meteor } from 'meteor/meteor';
import { Projects } from '../../projects/projects';
import { Partners } from '../partners';


Meteor.publish('partners', function partnersPublication() {

    return Partners.find({});
});

Partners.allow({
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