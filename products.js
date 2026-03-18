import { Storage } from './storage.js';
import { UI } from './ui.js';
export const Products = {
  init(){
    this.table = document.querySelector('#productsTable tbody');
    this.filter = document.getElementById('filterCategory');
    this.search = document.getElementById('searchProduct');
    this.load();
    document.getElementById('addProductBtn')?.addEventListener('click', ()=> this.showAdd());
    document.getElementById('exportProducts')?.addEventListener('click', ()=> this.export());
    document.getElementById('importProducts')?.addEventListener('click', ()=> this.import());
    this.search?.addEventListener('input', ()=> this.load());
    this.filter?.addEventListener('change', ()=> this.load());
  },
  load(){
    const data = Storage.read();
    const products = data.products || [];
    const q = this.search?.value?.toLowerCase?.() || '';
    const cat = this.filter?.value || '';
    // populate categories
    const cats = [...new Set(products.map(p=>p.category))];
    if(this.filter){ this.filter.innerHTML = '<option value="">All Categories</option>' + cats.map(c=>`<option>${c}</option>`).join(''); if(cat) this.filter.value=cat; }
    const rows = products.filter(p=> (p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q)) && (cat? p.category===cat: true))
      .map(p=>`<tr data-id="${p.id}"><td>${p.id}</td><td contenteditable data-field="name">${p.name}</td><td contenteditable data-field="category">${p.category}</td><td contenteditable data-field="quantity">${p.quantity}</td><td contenteditable data-field="buy">${p.buy}</td><td contenteditable data-field="sell">${p.sell}</td><td><button class="muted edit">Save</button> <button class="danger del">Delete</button></td></tr>`).join('');
    if(this.table) this.table.innerHTML = rows || '<tr><td colspan="7">No products</td></tr>';
    this.attachRowEvents();
  },
  attachRowEvents(){
    document.querySelectorAll('#productsTable tbody tr').forEach(tr=>{
      tr.querySelector('.del')?.addEventListener('click', ()=> this.delete(tr.dataset.id));
      tr.querySelector('.edit')?.addEventListener('click', ()=> this.saveInline(tr));
    });
  },
  showAdd(){
    const html = `<h3>Add Product</h3>
      <div class="row"><input id="pName" placeholder="Name"/><input id="pCategory" placeholder="Category"/></div>
      <div class="row" style="margin-top:8px"><input id="pQty" type="number" min="0" placeholder="Qty"/><input id="pBuy" type="number" min="0" placeholder="Buy Price"/><input id="pSell" type="number" min="0" placeholder="Sell Price"/></div>
      <div class="row" style="margin-top:8px"><button id="saveP" class="primary">Save</button></div>`;
    const m = UI.modal(html);
    m.querySelector('#saveP').addEventListener('click', ()=>{
      const name = m.querySelector('#pName').value.trim();
      if(!name){ UI.toast('Name required','error'); return; }
      const data = Storage.read();
      const id = 'SHOP-' + String((data.products||[]).length+1).padStart(3,'0');
      data.products.push({id,name,category:m.querySelector('#pCategory').value||'General',quantity:parseInt(m.querySelector('#pQty').value||0,10),buy:parseFloat(m.querySelector('#pBuy').value||0),sell:parseFloat(m.querySelector('#pSell').value||0)});
      Storage.write(data);
      UI.closeModal(m);
      this.load();
      UI.toast('Product added');
    });
  },
  saveInline(tr){
    const id = tr.dataset.id; const data = Storage.read();
    const p = (data.products||[]).find(x=>x.id===id);
    if(!p) return;
    tr.querySelectorAll('[contenteditable]').forEach(cell=>{
      const f = cell.dataset.field; let v = cell.textContent.trim();
      if(f==='quantity' || f==='buy' || f==='sell') v = Number(v) || 0;
      p[f] = v;
    });
    Storage.write(data);
    this.load();
    UI.toast('Saved');
  },
  delete(id){
    if(!confirm('Delete product?')) return;
    const data = Storage.read(); data.products = (data.products||[]).filter(p=>p.id!==id); Storage.write(data); this.load(); UI.toast('Deleted');
  },
  export(){
    const data = Storage.read(); const blob = new Blob([JSON.stringify(data, null,2)], {type:'application/json'});
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download='shopease_backup.json'; a.click();
  },
  import(){
    const input = document.createElement('input'); input.type='file'; input.accept='application/json'; input.onchange = e=>{
      const file = e.target.files[0]; const r = new FileReader(); r.onload = ()=>{ try{ const json = JSON.parse(r.result); const current = Storage.read(); const merged = Object.assign(current, json); Storage.write(merged); this.load(); UI.toast('Imported'); }catch(err){ UI.toast('Invalid JSON'); } }; r.readAsText(file);
    }; input.click();
  }
};