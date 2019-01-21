import { Template } from 'meteor/templating';
import './override-at-signup-link.html';

Template['override-atSignupLink'].replaces('atSignupLink')
