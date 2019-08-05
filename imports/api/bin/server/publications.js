import { Meteor } from 'meteor/meteor';
import { Bin } from '../../bin/bin';

Meteor.publish('bin', function bin() {
    return Bin.find({});
  });
  Bin.allow({
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
  