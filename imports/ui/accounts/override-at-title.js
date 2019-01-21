import { Template } from 'meteor/templating';
import './override-at-title.html';

Template['override-atTitle'].replaces('atTitle');