import { Storage } from './storage.js';
import { UI } from './ui.js';
export const Sales = {
  init(){
    this.prodSel = document.getElementById('saleProduct');
    this.custSel = document.getElementById('saleCustomer');
    this.qty = document.getElementById('saleQuantity');
    this.history = document.getElementById('salesHistory');
    this.form = document.getElementById('saleForm');
    this.loadForm();
    this.renderHistory();
    this.form?.addEventListener('submit', (e)=>{ e.preventDefault(); this.record(); });
  },
  loadForm(){
    const data = Storage.read();
    const products = data.products || [];
    if(this.prodSel) this.prodSel.innerHTML = products.map(p=>`<option value="${p.id}">${p.id} — ${p.name} (${p.quantity})</option>`).join('');
    const customers = data.customers || [];
    if(this.custSel) this.custSel.innerHTML = '<option value="">Walk-in</option>' + customers.map(c=>`<option value="${c.id}">${c.name}</option>`).join('');
  },
  record(){
    const pid = this.prodSel.value; const q = Number(this.qty.value||0);
    if(!pid || q<=0){ UI.toast('Select product and quantity'); return; }
    const data = Storage.read();
    const product = (data.products||[]).find(p=>p.id===pid);
    if(!product){ UI.toast('Product not found'); return; }
    if(product.quantity < q){ UI.toast('Insufficient stock'); return; }
    const amount = q * product.sell;
    const profit = q * (product.sell - product.buy);
    product.quantity -= q;
    const date = new Date().toISOString().slice(0,10);
    data.sales = data.sales || {}; data.sales[date] = data.sales[date] || [];
    const sale = {productId: pid, quantitySold: q, amount, profit, customerId: this.custSel.value||null, time: new Date().toISOString()};
    data.sales[date].push(sale);
    // update customer summary
    if(sale.customerId){
      const cust = (data.customers||[]).find(c=>c.id===sale.customerId);
      if(cust){ cust.purchases = (cust.purchases||0)+1; cust.totalSpent = (cust.totalSpent||0)+amount; }
    }
    Storage.write(data);
    UI.toast('Sale recorded');
    this.loadForm(); this.renderHistory();
  },
  renderHistory(){
    const data = Storage.read(); const sales = data.sales || {};
    const all = Object.keys(sales).sort((a,b)=>b.localeCompare(a)).map(date=>`<h4>${date}</h4><ul>` + (sales[date]||[]).map(s=>`<li>${s.quantitySold}x ${s.productId} — ₹${s.amount} (Profit ₹${s.profit})</li>`).join('') + '</ul>').join('');
    if(this.history) this.history.innerHTML = all || '<p>No sales yet.</p>';
  }
};