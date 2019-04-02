import EventEmitter from 'event-emitter';
import { Mongo } from 'meteor/mongo';
 
export const EventsCollection = new Mongo.Collection('events');

const Emitter = new EventEmitter();
const Events = {
    ITEM_CREATE: 'item_create'
};
const EventsCreated = {
    ITEM_CREATED: 'item_created'
};
export { Emitter, Events, EventsCreated }

