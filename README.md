# ManDrawGora - Art gallery profilo and site management system

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.1.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

# Managing admins

Currently, there's no ui for registering a user, so you'll have to do this process through Firebase's dashboard or by using their sdks.
Enable Firebase Email and Password service on Authentication and create users with the emails you'd like. These people will be able to log into the application.
These emails need to be added to your environment, the attribute adminEmails is an array of emails that are allowed to use the Admin UI. You'll also have to add these emails to Firebase Storage and Firestore security rules. Steps are shown below. If the adminEmails array is empty, this assumes anyone who signs in (even if they don't have an email) can access the admin UI. This is for personal reasons (to allow the demo to work for anyone)

# Setup Firebase project:

Start up a firebase project and allow the following services: Storage, Firestore. You'll need to update the security and add indexes to Firestore. The example of the security rules below include 2 emails, <email 1> and <email 2>. You allow admin rights for as many emails as you'd like, just update as needed for your needs.

## Storage
Storage security rules:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && (request.auth.token.email == '<email 1>' || request.auth.token.email == '<email 2>');
    }
  }
}
```

Update the Bucket permission for your project to allow read access to anyone: https://console.cloud.google.com

Bucket name: ${projectID}.appspot.com
New members: allUsers
Role: Storage Object Viewer

When you try to add this permission, you'll be prompted that this resource will be public. Click 'ALLOW PUBLIC ACCESS'

## Firestore:
Firestore security rules:

```
rules_version = '2';
service cloud.firestore {
    match /databases/{database}/documents {
        match /files/{file}/{document=**} {
          	allow read: if true;
          	allow write: if request.auth != null && (request.auth.token.email == '<email 1>' || request.auth.token.email == '<email 2>');
        }

        match /sections/{section}/{document=**} {
          	allow read: if true;
          	allow write: if request.auth != null && (request.auth.token.email == '<email 1>' || request.auth.token.email == '<email 2>');
        }
    }
}
```

Firestore indexes:

Composite -> Create index

Collection ID: `files`

Fields to index:

`sectionSlug` (`Ascending`)
`order` (`Descending`)

Query scopes: `Collection` (not Collection group)

If you skip this step, Firestore will error and give you a link that will add this index to your project for you, so you can handle this step that way if you'd like.
