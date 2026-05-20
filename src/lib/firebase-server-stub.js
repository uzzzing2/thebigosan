// Empty stub used in place of firebase/* packages when building the
// server (Cloudflare Worker) bundle. Firebase Web SDK pulls in
// protobufjs which uses `new Function`, banned by Workers.
//
// Our app only calls firebase from inside useEffect / event handlers
// (client-only), so the worker never actually needs firebase at
// runtime — it just must not be present in the worker bundle.
module.exports = {}
