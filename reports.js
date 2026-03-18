import { Storage } from './storage.js';
import { UI } from './ui.js';
export const Reports = {
  init(){
    this.date = document.getElementById('reportDate');
    this.res = document.getElementById('reportResult');
    this.chart = document.getElementById('reportChart');
    document.getElementById('generateReport')?.addEventListener('click', ()=> this.generate());
    document.getElementById('exportJSON')?.addEventListener('click', ()=> this.exportAll());
  },
  generate(){
    const d = this.date.value || new Date().toISOString().slice(0,10);
    const data = Storage.read(); const sales = (data.sales || {})[d] || [];
    const total = sales.reduce((s,a)=>s+(a.amount||0),0); const profit = sales.reduce((s,a)=>s+(a.profit||0),0);
    const counts = {}; sales.forEach(s=> counts[s.productId]=(counts[s.productId]||0)+s.quantitySold);
    const most = Object.keys(counts).sort((a,b)=>counts[b]-counts[a]).slice(0,5);
    this.res.innerHTML = `<p>Date: ${d}</p><p>Total Sales: ₹${total}</p><p>Total Profit: ₹${profit}</p><p>Top: ${most.join(', ')||'—'}</p>`;
    this.drawChart(Object.entries(counts));
  },
  drawChart(entries){
    const ctx = this.chart.getContext('2d'); ctx.clearRect(0,0,this.chart.width,this.chart.height);
    if(!entries.length) return;
    const max = Math.max(...entries.map(e=>e[1]));
    const w = this.chart.width; const h = this.chart.height; const barW = w/(entries.length*1.6);
    entries.forEach((e,i)=>{ const x = 10 + i*(barW*1.6); const barH = (e[1]/max)*(h-30); ctx.fillStyle='rgba(178,34,34,0.9)'; ctx.fillRect(x,h-20-barH,barW,barH); ctx.fillStyle='#fff'; ctx.font='10px sans-serif'; ctx.fillText(e[0],x,h-5); });
  },
  exportAll(){
    const data = Storage.read(); const blob = new Blob([JSON.stringify(data,null,2)],{type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='shopease_all.json'; a.click();
  }
};