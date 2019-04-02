import { Meteor } from 'meteor/meteor';
import { BusService } from '../../bus/bus';

Meteor.publish('busservice', function busservicePublication() {
    return BusService.find({});
  });
  BusService.allow({
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
  