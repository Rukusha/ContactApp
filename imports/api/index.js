import { Meteor } from 'meteor/meteor';

// Images API
import './images/images';

// Partners API
import './partners/partners';
import './partners/methods';

// Projects API
import './projects/projects';
import './projects/methods';

// Individuals API
import './individuals/individuals';
import './individuals/methods';

// Users API
import './users/users';

//Events
import './events/events';
import './events/methods';

//Bus
import './bus/bus';
import './bus/methods';

//notifications
import './notifications/listeners'

if (Meteor.isServer) {
  import './images/server/publications';
  import './partners/server/publications';
  import './projects/server/publications';
  import './individuals/server/publications';
  import './users/server/publications';
  import './events/server/publications';
    import './bus/server/publications';
}