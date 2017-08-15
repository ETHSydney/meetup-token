
var assert = require('assert');

assert(process.env.MEETUP_KEY, 'MEETUP_KEY variable isn\'t set on enviroment (use \'set \'MEETUP_KEY=key\'\' on Windows)');

var meetup = require('meetup-api')({
    key: process.env.MEETUP_KEY
});

// meetup.getEvent({
//     'urlname': 'banodejs',
//     'id': '221235192'
// }, function(error, event) {
//     if (error) {
//         console.log(error);
//     } else {
//         console.log(event);
//     }
// });
//
// meetup.getMembers({
//     'group_id': '15817402'
// }, function(error, event) {
//     if (error) {
//         console.log(error);
//     } else {
//         console.log(event);
//     }
// });
//
// meetup.getProfiles({
//     'group_id': '15817402'  //SydEthereum
// }, function(error, event) {
//     if (error) {
//         console.log(error);
//     } else {
//         console.log(event);
//     }
// });
//
// meetup.getMemberProfiles({
//     'urlname': 'SydEthereum',
//     "page": 200,
//     "offset": 7
// }, function(error, members) {
//     if (error) {
//         console.log(error);
//     } else {
//         console.log(members);
//         console.log(members.length);
//     }
// });

//
// meetup.getSelfGroups({
// }, function(error, event) {
//     if (error) {
//         console.log(error);
//     } else {
//         console.log(event);
//     }
// });


meetup.getEventRSVPs({
    'urlname': 'SydEthereum',
    "event_id": 237360133
}, function(error, members) {
    if (error) {
        console.log(error);
    } else {
        console.log(members);
        console.log(members.length);
    }
});