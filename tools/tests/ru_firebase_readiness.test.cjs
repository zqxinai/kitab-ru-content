'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const {configOf,sourceOf,overall,markdown}=require('../ru_firebase_readiness.cjs');
const config={
  apiKey:'public-example',authDomain:'ruclassics-demo.firebaseapp.com',
  projectId:'ruclassics-demo',appId:'1:111111:web:abc'
};
const js=o=>'window.RU_FIREBASE_CONFIG = '+JSON.stringify(o)+';\n';
const source="const provider=new state.lib.GoogleAuthProvider();\n"+
  "if(token.claims.firebase?.sign_in_provider!=='google.com'||!user.emailVerified){}\n"+
  "const p={role:'pending'};";
test('null config clearly reports Firebase not connected',()=>{
 const local=configOf('window.RU_FIREBASE_CONFIG = null;');
 assert.equal(local.state,'inactive');
 assert.equal(overall(local,null,sourceOf(source)),'MENUNGGU FIREBASE');
});
test('recognizes deployed public web configuration without displaying API key',()=>{
 const local=configOf(js(config));
 assert.equal(local.state,'configured');
 assert.equal(local.projectId,config.projectId);
 const report=markdown({local,remote:local,source:sourceOf(source),publicUrl:'https://example.com/firebase-config.js'});
 assert.match(report,/LOGIN BELUM DIUJI/);
 assert.doesNotMatch(report,/public-example/);
});
test('rejects invalid JSON or incomplete and non-Firebase auth domain',()=>{
 assert.equal(configOf('window.RU_FIREBASE_CONFIG = {};').state,'invalid');
 assert.equal(configOf('window.RU_FIREBASE_CONFIG = {oops};').state,'invalid');
 assert.equal(configOf(js({...config,authDomain:'attacker.example.com'})).state,'invalid');
});
test('detects old GitHub Auth and missing Google provider safeguards',()=>{
 const unsafe=sourceOf('new state.lib.GithubAuthProvider()');
 assert.equal(unsafe.noGithub,false);
 assert.equal(overall(configOf(js(config)),null,unsafe),'PERLU PERBAIKAN KODE');
});
test('reports source and deployed config disagreement',()=>{
 const local=configOf(js(config)),remote=configOf('window.RU_FIREBASE_CONFIG = null;');
 assert.equal(overall(local,remote,sourceOf(source)),'WEBSITE BELUM TERKONFIGURASI');
});
