import { Storage } from './storage.js';
import { UI } from './ui.js';
export const Settings = {
  init(){
    document.getElementById('toggleTheme')?.addEventListener('click', ()=> this.toggleTheme());
    document.getElementById('exportData')?.addEventListener('click', ()=> this.exportData());
    document.getElementById('importFile')?.addEventListener('change', (e)=> this.importFile(e));
    document.getElementById('resetData')?.addEventListener('click', ()=> this.resetAll());
  },
  toggleTheme(){
    document.body.classList.toggle('light');
    const data = Storage.read(); data.theme = document.body.classList.contains('light') ? 'light' : 'dark'; Storage.write(data); UI.toast('Theme updated');
  },
  exportData(){ const data = Storage.read(); const blob = new Blob([JSON.stringify(data,null,2)],{type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='shopease_export.json'; a.click(); },
  importFile(e){
    const file = e.target.files[0]; const r=new FileReader(); r.onload=()=>{ try{ const json=JSON.parse(r.result); Storage.write(json); UI.toast('Imported'); }catch(err){ UI.toast('Invalid file'); } }; r.readAsText(file);
  },
  resetAll(){ if(!confirm('Reset all data?')) return; Storage.reset(); UI.toast('Reset done'); }
};