import { Meteor } from 'meteor/meteor';
import { Projects } from '../../projects/projects';
import { Users } from '../users';

const userFieldsPublication = {
    name: 1,
    roles: 1,
    position: 1,
    linkedIn: 1,
    telephone: 1,
    emails: 1,
    skype: 1
};

Meteor.publish('users', function usersPublication() {
    const currentUser = Meteor.user();

    if (currentUser === null) {
        return [];

//    } else if (currentUser.roles('Admin')) {
//        return Users.find({}, {fields: userFieldsPublication});
    } else {
        const projects = Projects.find({individuals: currentUser._id}).fetch();
        const userIds = projects.reduce((userIds, project) => {
            const projectUserIds = project.individuals;

            if (projectUserIds) {
                return userIds.concat(projectUserIds);
            }

            return userIds;
        }, []);
        const uniqueUserIds = [...new Set(userIds)];

        return Users.find({_id: {$in: uniqueUserIds}});
    }
});
Users.allow({
    insert() {
        return true;
    },
    update() {
        return true;
    },
    remove() {
        return true;
    }
});