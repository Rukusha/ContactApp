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

if (Meteor.isServer) {
  import './images/server/publications';
  import './partners/server/publications';
  import './projects/server/publications';
  import './individuals/server/publications';
  import './users/server/publications';
}