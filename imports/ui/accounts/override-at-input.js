import { Template } from 'meteor/templating';
import './override-at-input.html';

Template['override-atTextInput'].replaces('atTextInput');
Template['override-atSelectInput'].replaces('atSelectInput');