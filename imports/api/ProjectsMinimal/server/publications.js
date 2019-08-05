import { Meteor } from 'meteor/meteor';
import { ProjectsMinimal } from '../ProjectsMinimal';
import { Images } from '../../images/images';

Meteor.publish('projectsMinimal', function projectsMinimalPublication() {
    return ProjectsMinimal.find();
});

ProjectsMinimal.allow({
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