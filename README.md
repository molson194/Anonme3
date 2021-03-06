Links
* https://create-react-app.dev/docs/making-a-progressive-web-app/
* https://firt.dev/ios-15.4b
* https://www.npmjs.com/package/react-pwa-install-ios
* https://blog.logrocket.com/from-create-react-app-to-pwa/
* https://felixgerschau.com/how-to-make-your-react-app-a-progressive-web-app-pwa/
* https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events
* https://github.com/tyrion/sse-websockets-demo/blob/master/server.py

Tasks

1. ~~Set up firebase project with hosting/firestore~~
2. ~~Set up react with local hot change~~
3. ~~Import firebase into react~~
4. ~~Set up react router~~
5. ~~Login/Signup route redirect to form if user not logged in~~
6. ~~Perform login/signup with phone auth~~
7. ~~Create new group route to form~~
8. ~~Create new group in database~~
9. ~~Display groups on home page for logged in user~~
10. ~~Route to group chat and view setup (messages, input, send)~~
11. ~~Send message to database~~
12. ~~Server sent events to open chat windows when new chat arrives~~
13. ~~Login with other phone numbers~~
14. ~~Tailwind styling~~
15. ~~Access contacts and improve member adding~~
16. ~~Firestore rules~~ 
17. ~~Progressive web app download testing~~

Pivot:
* ~~Fix create new group database rules~~
* ~~Create group with code and share link with code~~
* ~~App name and title~~
* ~~Remove updateGroup/groupDetails page~~
* ~~Add to groupMememberships when joined with code~~
* ~~Auto add creator as member~~
* ~~Styling~~

18. ~~Progressive web app offline functionality and firebase caching (only update new messages/groups)~~
19. Improve group membership security setup (with functions updating users/{uid} with list of groups)

Improvements
* Phone number client side validation
* Loading screen phone input
* Separate groups and access tokens documents for read permission
* Loading screen access code validation
* Limit access code/message length
* Bottom navbar margin
* Message censorship

20. Progressive web app notifications
21. Github CI/CD (without firebase-config emulators)
22. React tests