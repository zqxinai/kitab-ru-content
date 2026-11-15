'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'../..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');

test('Published Ru Classics reader exposes Google editor only, without false default login',()=>{
 const html=read('ru-classics/index.html');
 const script=read('ru-classics/editor.js');
 const cfg=read('ru-classics/firebase-config.js');
 assert.match(html,/src="\.\/firebase-config\.js"/);
 assert.match(html,/src="\.\/editor\.js"/);
 assert.match(script,/new state\.lib\.GoogleAuthProvider\(\)/);
 assert.match(script,/token\.claims\.firebase\?\.sign_in_provider!=='google\.com'/);
 assert.match(script,/!user\.emailVerified/);
 assert.match(script,/email:user\.email,role:'pending'/);
 assert.match(script,/Masuk dengan Google/);
 assert.doesNotMatch(script,/GithubAuthProvider|Masuk dengan GitHub|Login GitHub/);
 const match=cfg.match(/window\.RU_FIREBASE_CONFIG\s*=\s*(\{[^\n]*\})\s*;/);
 assert.ok(match,'Firebase Web App public config must be present');
 const publicConfig=JSON.parse(match[1]);
 assert.equal(publicConfig.projectId,'ru-classics');
 assert.equal(publicConfig.authDomain,'ru-classics.firebaseapp.com');
 for(const k of ['apiKey','appId','messagingSenderId']) assert.ok(publicConfig[k],k+' missing');
 assert.doesNotMatch(cfg, /-----BEGIN PRIVATE KEY-----|private_key\s*:/);
});

test('Pages deployment reads explicit Firebase public config and keeps website optional',()=>{
 const workflow=read('.github/workflows/deploy-pages.yml');
 assert.match(workflow,/RU_FIREBASE_CONFIG_JSON/);
 assert.match(workflow,/ru-classics\/firebase-config\.js/);
 assert.match(workflow,/not isinstance\(cfg, dict\)/);
 assert.match(workflow,/Firebase belum terhubung/);
 assert.match(workflow,/uses: actions\/upload-pages-artifact@v3/);
});
