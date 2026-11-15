'use strict';
/*
 * Ru Classics Google Editor readiness report.
 * Performs safe static checks against local source and optional public Pages.
 * NEVER attempts OAuth, accesses production Firestore or prints API keys.
 */
const fs=require('node:fs');
const path=require('node:path');

function configOf(js){
  const m=String(js).match(/window\.RU_FIREBASE_CONFIG\s*=\s*(null|\{[^\n]*\})\s*;/);
  if(!m)return {state:'invalid',reason:'Konfigurasi Firebase tidak dikenali'};
  if(m[1]==='null')return {state:'inactive',reason:'Firebase belum dihubungkan'};
  try{
    const obj=JSON.parse(m[1]);
    const required=['apiKey','authDomain','projectId','appId'];
    if(!required.every(k=>typeof obj[k]==='string'&&obj[k].trim()))
      return {state:'invalid',reason:'Konfigurasi Firebase belum lengkap'};
    if(!/^[a-z][a-z0-9-]{4,62}$/.test(obj.projectId))
      return {state:'invalid',reason:'Format projectId tidak sesuai'};
    if(!/^[a-zA-Z0-9.-]+$/.test(obj.authDomain)||!obj.authDomain.endsWith('.firebaseapp.com'))
      return {state:'invalid',reason:'authDomain harus domain Firebase resmi'};
    return {state:'configured',projectId:obj.projectId,reason:'Konfigurasi publik tersedia (login belum dibuktikan)'};
  }catch(_){return {state:'invalid',reason:'Konfigurasi JSON tidak valid'};}
}
function sourceOf(js){
  const code=String(js);
  return {providerGoogle:code.includes('new state.lib.GoogleAuthProvider()'),
    rejectsOthers:code.includes("sign_in_provider!=='google.com'"),
    verifiedEmail:code.includes('!user.emailVerified'),
    pendingAccount:code.includes("role:'pending'"),
    noGithub:!code.includes('GithubAuthProvider')};
}
function overall(local,remote,source){
  const validSource=Object.values(source).every(Boolean);
  if(!validSource||local.state==='invalid')return 'PERLU PERBAIKAN KODE';
  if(local.state==='inactive'&&(!remote||remote.state==='inactive'))return 'MENUNGGU FIREBASE';
  if(remote?.state==='invalid')return 'PERLU PERBAIKAN PUBLIKASI';
  if(remote?.state==='inactive')return 'WEBSITE BELUM TERKONFIGURASI';
  return 'KONFIGURASI TERSEDIA — LOGIN BELUM DIUJI';
}
function markdown({local,remote,source,publicUrl}){
  const status=overall(local,remote,source);
  const display=v=>v? v.state+' — '+v.reason : 'Tidak diperiksa';
  return [
    '## Ru Classics — Pemeriksaan kesiapan Google Editor',
    '',
    '**Status:** '+status,
    '',
    '| Pemeriksaan | Hasil |',
    '|---|---|',
    '| GoogleAuthProvider | '+(source.providerGoogle?'Ada':'Tidak ditemukan')+' |',
    '| Penolakan login lain | '+(source.rejectsOthers?'Ada':'Tidak ditemukan')+' |',
    '| Pemeriksaan email terverifikasi | '+(source.verifiedEmail?'Ada':'Tidak ditemukan')+' |',
    '| Akun baru selalu pending | '+(source.pendingAccount?'Ada':'Tidak ditemukan')+' |',
    '| GitHubAuthProvider lama | '+(source.noGithub?'Tidak ada':'Masih ditemukan')+' |',
    '| Konfigurasi sumber | '+display(local)+' |',
    '| Konfigurasi website | '+display(remote)+' |',
    '',
    publicUrl?'Website diperiksa: '+publicUrl:'',
    '',
    '**Batas pengujian:** Pemeriksaan ini TIDAK membuktikan Google provider, Authorized domains, aturan Firestore produksi, login browser, atau UID admin sudah disiapkan.',
    '',
    'Agar login benar-benar aktif: sambungkan Firebase, publikasikan rules, tambahkan RU_FIREBASE_CONFIG_JSON, aktifkan domain, lalu uji login Google dan persetujuan editor secara langsung.',
    ''
  ].join('\n');
}
async function run(args=process.argv.slice(2)){
  const root=path.resolve(__dirname,'..');
  const local=configOf(fs.readFileSync(path.join(root,'ru-classics/firebase-config.js'),'utf8'));
  const source=sourceOf(fs.readFileSync(path.join(root,'ru-classics/editor.js'),'utf8'));
  const p=args.indexOf('--public');
  const publicUrl=p>=0?args[p+1]:null;
  let remote=null;
  if(publicUrl){
    if(!/^https:\/\/[a-z0-9.-]+\/[a-zA-Z0-9/_-]*firebase-config\.js$/.test(publicUrl))
      throw Error('Alamat pemeriksaan publik harus HTTPS dan berakhir dengan firebase-config.js');
    const ctrl=new AbortController();
    const timeout=setTimeout(()=>ctrl.abort(),12000);
    try{
      const result=await fetch(publicUrl,{signal:ctrl.signal,headers:{'Cache-Control':'no-cache'}});
      if(!result.ok)throw Error('HTTP '+result.status);
      remote=configOf(await result.text());
    }catch(e){remote={state:'invalid',reason:'URL publik gagal dibaca ('+e.message+')'};}
    finally{clearTimeout(timeout);}
  }
  const report=markdown({local,remote,source,publicUrl});
  console.log(report);
  if(process.env.GITHUB_STEP_SUMMARY)fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,report+'\n');
  if(overall(local,remote,source).startsWith('PERLU PERBAIKAN'))process.exitCode=1;
}
if(require.main===module)run().catch(e=>{console.error(e.message);process.exitCode=1});
module.exports={configOf,sourceOf,overall,markdown};
