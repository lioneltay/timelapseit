# Tasks

- [ ] Refactor to use `redux` and `redux-observable`

- [ ] Fix bugs

- [ ] Add 'asap' tasks that put a persistent notification on your device

- [ ] pull should not trigger edit modal

* [ ] figure out whats wrong with rxjs


- [ ] add notification to kill service worker
- [ ] firegure out how to make modals and drawers work on mobile with back button (you can block back button, add an event handgler instead?)

- [ ] ensure service worker clears cache when initialising
- [ ] security
- [ ] feedback

* [ ] deleted tasks should go to trash and be automatically deleted after a week

  - [ ] save feedback to firebase
  - [ ] screenshots

- [ ] handle non logged in user

  - [ ] don't show anything, just prompt to log in? OR
  - [ ] non logged in version should store data localy
    - [ ] when signing in, if there are local notes ask if they would like them to be transfered, then delete the local notes

- [ ] shared lists

- [ ] invite a friend

* [ ] multiselect

  - [ ] drag on mobile
  - [ ] shift click on keyboard

* [ ] implement max number of tasks per list

* [ ] firegout how to put app on app store (pwa builder)
* [ ] tests

- [ ] rich text editor

* [ ] seo

* [ ] code splitting

* [ ] bundle optimisation with webpack

  - [ ] tree shaking
  - [ ] minification

* [ ] Performance review/analysis

- [ ] drag and drop

  - [ ] drag doesnt work on mobile
  - [ ] lock drag to vertical only

- [ ] advertisements

* [ ] add created date to edit modal

* [ ] order by fields

  - [ ] date added
  - [ ] last updated
  - [ ] priority
  - [ ] due date

* [ ] pinned tasks

* [ ] due dates

* [ ] pwa push notifications on due dates
  - [ ] 1 hour before notification

# Future

- [ ] hooks api?

  - Not feasible since we want to also impletement shouldcomponentupdate for you although there is an issue around it

- [ ] Stop the connect component from rerendering
  - [ ] Not possbile at the moment since there is not way to stop the rendering triggered by a context update.