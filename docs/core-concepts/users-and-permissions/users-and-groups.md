---
title: Users and Groups
layout: tutorial
---

# Users and Groups

One of the biggest questions you need to answer in your design is, "Who is going to be doing what?" From there you want to separate concerns for site management and content governance so that each user only has access to what they need is vital from a security perspective. Apostrophe has several options available to help you achieve this.

## Users

The "user" is a concept as old as technology itself. You can imagine that when the wheel was invented, the creator of the wheel was the first user, and they provided permission to their friends to also be users. Access control was managed and enforced by a large club which was used to hit unauthorized users. On modern computer systems, each user is identified by their username, and access is enforced by login credentials which -- while not as fun as clubs -- are more effective at securing computer systems than trying to hit every unauthorized user with a club.

## Groups

The "group" is a necessary extension of users. Rather than individually provide permission to each user, you add users to a group and provide permissions to that group, and by association, all the users who are a member of it. In the above example, the caveman had a group called "Friends" which were given access to the wheel, while all other users were excluded. Apostrophe primarily provides permissions through groups, and not directly to individual users.

## Creating Users

New users are created and assigned to groups through the the admin bar in Apostrophe. To create new users,

1. Log on to Apostrophe.

2. Click on *Users* in the admin bar.

    ![](/images/assets/user-menu.png)

3. Next, click *Add User* and fill in the user's information.

4. To define the users permissions, select the group from the select menu.

    ![](/images/assets/user-select-group.png)

5. Click *Save User* to add the user to the system.

You can create as many users as you need, and you can edit users by clicking on their name after they are created.

Next, you'll learn more about using groups and customizing your permissions.
