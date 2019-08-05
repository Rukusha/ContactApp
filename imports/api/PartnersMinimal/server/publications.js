import { Meteor } from 'meteor/meteor';
import { PartnersMinimal } from '../PartnersMinimal';

Meteor.publish('partnersMinimal', function partnersMinimalPublication() {

    return PartnersMinimal.find({flagged: false}); 
    
});

PartnersMinimal.allow({
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