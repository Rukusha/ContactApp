import { Template } from 'meteor/templating';
import './override-at-pwd-form.html';

Template['override-atPwdForm'].replaces('atPwdForm');
