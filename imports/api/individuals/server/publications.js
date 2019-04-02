import { Meteor } from 'meteor/meteor';
import { Individuals } from '../individuals';
import { Projects } from '../../projects/projects';
import { Partners } from '../../partners/partners';
import { Images } from '../../images/images';

Meteor.publish('individuals', function individualsPublication() {
    return Individuals.find({});
    return Projects.find({});

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