import { Storage } from './storage.js';
import { UI } from './ui.js';
export const Customers = {
  init(){
    this.list = document.getElementById('customersList');
    this.search = document.getElementById('searchCustomer');
    this.load();
    document.getElementById('addCustomerBtn')?.addEventListener('click', ()=> this.showAdd());
    this.search?.addEventListener('input', ()=> this.load());
  },
  load(){
    const data = Storage.read(); const q = this.search?.value?.toLowerCase?.()||'';
    const customers = (data.customers||[]).filter(c=>c.name.toLowerCase().includes(q) || (c.phone||'').includes(q));
    this.list.innerHTML = customers.map(c=>`<div class="card"><h4>${c.name}</h4><p>${c.phone||''}</p><p>Total: ₹${c.totalSpent||0} — Purchases: ${c.purchases||0}</p><div class="row"><button class="muted edit" data-id="${c.id}">Edit</button> <button class="danger del" data-id="${c.id}">Delete</button></div></div>`).join('') || '<p>No customers</p>';
    this.attach();
  },
  attach(){
    this.list.querySelectorAll('.del').forEach(b=> b.addEventListener('click', ()=>{ if(confirm('Delete customer?')){ const id=b.dataset.id; const data=Storage.read(); data.customers=(data.customers||[]).filter(x=>x.id!==id); Storage.write(data); this.load(); UI.toast('Deleted'); }}));
    this.list.querySelectorAll('.edit').forEach(b=> b.addEventListener('click', ()=> this.showEdit(b.dataset.id)));
  },
  showAdd(){
    const html=`<h3>Add Customer</h3><input id="cName" placeholder="Name"/><input id="cPhone" placeholder="Phone"/><input id="cAddress" placeholder="Address"/><div class="row" style="margin-top:8px"><button id="saveC" class="primary">Save</button></div>`;
    const m = UI.modal(html); m.querySelector('#saveC').addEventListener('click', ()=>{
      const name = m.querySelector('#cName').value.trim(); if(!name) return UI.toast('Name required');
      const data = Storage.read(); const id = 'CUST-' + String((data.customers||[]).length+1).padStart(3,'0');
      data.customers = data.customers||[]; data.customers.push({id,name,phone:m.querySelector('#cPhone').value,address:m.querySelector('#cAddress').value,purchases:0,totalSpent:0});
      Storage.write(data); UI.closeModal(m); this.load(); UI.toast('Customer added');
    });
  },
  showEdit(id){
    const data = Storage.read(); const c = (data.customers||[]).find(x=>x.id===id); if(!c) return;
    const html=`<h3>Edit Customer</h3><input id="cName" value="${c.name}"/><input id="cPhone" value="${c.phone||''}"/><input id="cAddress" value="${c.address||''}"/><div class="row" style="margin-top:8px"><button id="saveC" class="primary">Save</button></div>`;
    const m = UI.modal(html); m.querySelector('#saveC').addEventListener('click', ()=>{
      c.name = m.querySelector('#cName').value; c.phone = m.querySelector('#cPhone').value; c.address = m.querySelector('#cAddress').value; Storage.write(data); UI.closeModal(m); this.load(); UI.toast('Saved');
    });
  }
};