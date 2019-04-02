import { Meteor } from 'meteor/meteor';
import { EventsCollection } from '../events';
import { Images } from '../../images/images';

Meteor.publish('events', function eventsPublication() {

    return EventsCollection.find({});
  });
  EventsCollection.allow({
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