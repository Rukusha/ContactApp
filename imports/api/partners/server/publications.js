import { Meteor } from 'meteor/meteor';
import { Partners } from '../partners';
import { Images } from '../../images/images';


Meteor.publish('partners', function partnersPublication() {
    
    return Partners.find({flagged: false}); 
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