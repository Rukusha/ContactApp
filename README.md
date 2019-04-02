# Introduction #
Using this application you will be able to view information about partners and their employees aswell as what projects they are involved with.
You can find contact information for each individual and each partner on their respective details page.

# Installation #
To run/update the application you will need to do the following.

```bash
ssh -p 9245 user@icemain.hopto.org
cd /opt/meteor/ic-projects
docker-compose down
git pull
./docker-build.sh
docker-compose up -d
exit
```

## Errors that may turn up ##
  1. During the build its possible you may run into a 302 error. to rectify this you will just need to rebuild the application as this was caused by a network error during the build process.  
  2. You may run into a permission errors. You will need to check the ownership of the project and the group perissions to make sure you have access.  
