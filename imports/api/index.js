import { Meteor } from 'meteor/meteor';

// Images API
import './images/images';

// Partners API
import './partners/partners';
import './partners/methods';

// Partners Minimal API
import './PartnersMinimal/PartnersMinimal';
import './PartnersMinimal/methods';

// Projects API
import './projects/projects';
import './projects/methods';

// ProjectsMinimal API
import './ProjectsMinimal/ProjectsMinimal';
import './ProjectsMinimal/methods';

// individualsMinimal API
import './IndividualsMinimal/IndividualsMinimal';
import './IndividualsMinimal/methods';

// Individuals API
import './individuals/individuals';
import './individuals/methods';

// Bin API
import './bin/bin';
import './bin/methods';


// Users API
import './users/users';

if (Meteor.isServer) {
  import './images/server/publications';
  import './IndividualsMinimal/server/publications';
  import './partners/server/publications';
  import './PartnersMinimal/server/publications';
  import './ProjectsMinimal/server/publications';
  import './projects/server/publications';
  import './individuals/server/publications';
  import './users/server/publications';
  import './bin/server/publications';

}