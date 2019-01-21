import { Meteor } from 'meteor/meteor';
import { Projects } from '../projects';

Meteor.publish('projects', function projectsPublication() {

    return Projects.find({});
  });
  Projects.allow({
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