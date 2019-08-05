import {Emitter, Events, EventsCreated} from '../events/events';
import { Projects } from '../projects/projects';
import { Partners } from '../partners/partners';
import { EventsCollection } from '../events/events';
import { Individuals } from '../individuals/individuals';

Emitter.on(Events.ITEM_CREATE, function(data) { 
EventsCollection.insert(data);

});
Emitter.on(EventsCreated.ITEM_CREATED, function(data) { 
EventsCollection.insert(data);
});
