import { Template } from 'meteor/templating';
import './override-at-signin-link.html';

Template['override-atSigninLink'].replaces('atSigninLink')
