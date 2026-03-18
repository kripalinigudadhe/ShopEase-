import { Storage } from './storage.js';
export const UI = {
  init(){
    // splash
    const s = document.getElementById('splash');
    if(s) setTimeout(()=>s.remove(),900);
    // theme
    const root = document.documentElement;
    const data = Storage.read();
    if(data.theme==='light') document.body.classList.add('light');
    // toggle sidebar
    document.querySelectorAll('#toggleSidebar').forEach(btn=>btn.addEventListener('click', ()=>{
      document.querySelector('.sidebar').classList.toggle('collapsed');
    }));
    // toast container
    this.modalRoot = document.getElementById('modalRoot');
  },
  toast(msg, type='info', time=2500){
    const t = document.createElement('div'); t.className='toast'; t.textContent=msg; document.body.appendChild(t);
    setTimeout(()=>t.classList.add('show'),20);
    setTimeout(()=>{ t.classList.remove('show'); setTimeout(()=>t.remove(),300); }, time);
  },
  modal(html){
    const m = document.createElement('div'); m.className='modal'; m.innerHTML = html;
    this.modalRoot.appendChild(m);
    return m;
  },
  closeModal(m){ m.remove(); }
};