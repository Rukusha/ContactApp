import { Template } from 'meteor/templating';
import './override-at-form.html';

Template['override-atForm'].replaces('atForm');