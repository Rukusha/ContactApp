import './navigation.html';
import { Images } from '../../api/images/images';

Template.Navigation_component.helpers({
  activeClass(routeName) {
    return ActiveRoute.name(routeName) ? 'is-active' : '';
  }
});