import { Meteor } from 'meteor/meteor';
import { Projects } from '../projects';
import { Images } from '../../images/images';
import { Individuals } from '../../individuals/individuals';


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
  Images.allow({
    insert: function(){
    return true;
    },
    update: function(){
    return true;
    },
    remove: function(){
    return true;
    },
    download: function(){
    return true;
    }
});