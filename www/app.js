(() => {
  const $ = (id) => document.getElementById(id);
  const translations = {
    ar:{workspace:"مساحة عملك",newInvoice:"إنشاء فاتورة جديدة",intro:"أنشئ فاتورتك واحفظها أو اطبعها في ثوانٍ.",currency:"العملة",date:"التاريخ",invoiceNo:"رقم الفاتورة",sellerInfo:"معلومات البائع",businessName:"اسم المحل / المؤسسة",phone:"الهاتف",address:"العنوان",clientInfo:"معلومات الزبون",clientName:"اسم الزبون",items:"المنتجات والخدمات",product:"المنتج / الخدمة",quantity:"الكمية",unitPrice:"سعر الوحدة",lineTotal:"المجموع",addItem:"إضافة منتج",summary:"ملخص الفاتورة",discount:"التخفيض",tax:"الضريبة % (اختياري)",taxAmount:"الضريبة",subtotal:"المجموع الجزئي",totalDue:"المبلغ الإجمالي",notes:"ملاحظات",saveInvoice:"حفظ الفاتورة",printInvoice:"طباعة / PDF",clear:"فاتورة جديدة",privacy:"بياناتك محفوظة على هذا الجهاز فقط، ولا يتم إرسالها إلى خادم.",savedInvoices:"الفواتير المحفوظة",empty:"لا توجد فواتير محفوظة بعد.",load:"فتح",delete:"حذف",saved:"تم حفظ الفاتورة بنجاح",deleted:"تم حذف الفاتورة",confirmDelete:"هل تريد حذف هذه الفاتورة؟",needItem:"أضف منتجاً واحداً على الأقل.",untitled:"فاتورة",confirmNew:"هل تريد بدء فاتورة جديدة؟ سيتم مسح البيانات غير المحفوظة.",notePlaceholder:"ملاحظات إضافية...",productPlaceholder:"اسم المنتج أو الخدمة"},
    fr:{workspace:"Votre espace",newInvoice:"Créer une facture",intro:"Créez, enregistrez ou imprimez votre facture en quelques secondes.",currency:"Devise",date:"Date",invoiceNo:"N° de facture",sellerInfo:"Informations du vendeur",businessName:"Nom du commerce / entreprise",phone:"Téléphone",address:"Adresse",clientInfo:"Informations du client",clientName:"Nom du client",items:"Produits et services",product:"Produit / service",quantity:"Quantité",unitPrice:"Prix unitaire",lineTotal:"Total",addItem:"Ajouter un article",summary:"Résumé de la facture",discount:"Remise",tax:"Taxe % (facultatif)",taxAmount:"Taxe",subtotal:"Sous-total",totalDue:"Total à payer",notes:"Notes",saveInvoice:"Enregistrer",printInvoice:"Imprimer / PDF",clear:"Nouvelle facture",privacy:"Vos données restent sur cet appareil et ne sont envoyées à aucun serveur.",savedInvoices:"Factures enregistrées",empty:"Aucune facture enregistrée.",load:"Ouvrir",delete:"Supprimer",saved:"Facture enregistrée avec succès",deleted:"Facture supprimée",confirmDelete:"Supprimer cette facture ?",needItem:"Ajoutez au moins un article.",untitled:"Facture",confirmNew:"Créer une nouvelle facture ? Les données non enregistrées seront effacées.",notePlaceholder:"Notes supplémentaires...",productPlaceholder:"Nom du produit ou service"},
    en:{workspace:"Your workspace",newInvoice:"Create a new invoice",intro:"Create, save or print your invoice in seconds.",currency:"Currency",date:"Date",invoiceNo:"Invoice number",sellerInfo:"Seller information",businessName:"Shop / business name",phone:"Phone",address:"Address",clientInfo:"Customer information",clientName:"Customer name",items:"Products and services",product:"Product / service",quantity:"Quantity",unitPrice:"Unit price",lineTotal:"Line total",addItem:"Add item",summary:"Invoice summary",discount:"Discount",tax:"Tax % (optional)",taxAmount:"Tax",subtotal:"Subtotal",totalDue:"Total due",notes:"Notes",saveInvoice:"Save invoice",printInvoice:"Print / PDF",clear:"New invoice",privacy:"Your data stays on this device and is not sent to a server.",savedInvoices:"Saved invoices",empty:"No saved invoices yet.",load:"Open",delete:"Delete",saved:"Invoice saved successfully",deleted:"Invoice deleted",confirmDelete:"Delete this invoice?",needItem:"Add at least one item.",untitled:"Invoice",confirmNew:"Start a new invoice? Unsaved data will be cleared.",notePlaceholder:"Additional notes...",productPlaceholder:"Product or service name"}
  };
  let lang = localStorage.getItem("fatourati_lang") || "ar";
  let toastTimer;
  const currency = () => $("currency").value;
  const money = (n) => new Intl.NumberFormat(lang === "en" ? "en-US" : lang === "fr" ? "fr-FR" : "ar-DZ",{minimumFractionDigits:2,maximumFractionDigits:2}).format(Number(n)||0) + " " + currency();
  const t = (key) => translations[lang][key] || key;
  const showToast = (message) => { $("toast").textContent=message; $("toast").classList.add("show"); clearTimeout(toastTimer); toastTimer=setTimeout(()=>$("toast").classList.remove("show"),2500); };
  const today = new Date();
  $("invoiceDate").value = new Date(today.getTime()-today.getTimezoneOffset()*60000).toISOString().slice(0,10);
  const nextNumber = () => "FAC-" + String(Date.now()).slice(-6);
  $("invoiceNo").value = nextNumber();

  function applyLanguage(){
    document.documentElement.lang=lang; document.documentElement.dir=lang==="ar"?"rtl":"ltr";
    document.querySelectorAll("[data-i18n]").forEach(el=>{const key=el.dataset.i18n; if(translations[lang][key]) el.textContent=t(key);});
    $("notes").placeholder=t("notePlaceholder");
    document.querySelectorAll(".product-name").forEach(el=>el.placeholder=t("productPlaceholder"));
    $("historyBtn").title=t("savedInvoices");
    calculate();
  }
  function addRow(item={name:"",qty:1,price:0}){
    const tr=document.createElement("tr");
    tr.innerHTML='<td><input class="product-name" type="text" placeholder=""></td><td><input class="qty" type="number" min="0" step="0.01"></td><td><input class="price" type="number" min="0" step="0.01"></td><td class="row-total">0.00</td><td><button class="remove-row" type="button" aria-label="Remove">×</button></td>';
    tr.querySelector(".product-name").value=item.name||"";
    tr.querySelector(".qty").value=item.qty ?? 1;
    tr.querySelector(".price").value=item.price ?? 0;
    tr.querySelectorAll("input").forEach(input=>input.addEventListener("input",calculate));
    tr.querySelector(".remove-row").addEventListener("click",()=>{tr.remove(); if(!$("itemsBody").children.length)addRow(); calculate();});
    $("itemsBody").appendChild(tr);
    tr.querySelector(".product-name").placeholder=t("productPlaceholder");
    calculate();
  }
  function calculate(){
    let subtotal=0;
    [...$("itemsBody").rows].forEach(row=>{const q=Math.max(0,Number(row.querySelector(".qty").value)||0),p=Math.max(0,Number(row.querySelector(".price").value)||0),total=q*p;subtotal+=total;row.querySelector(".row-total").textContent=money(total);});
    const discount=Math.min(subtotal,Math.max(0,Number($("discount").value)||0));
    const taxable=Math.max(0,subtotal-discount),tax=taxable*Math.min(100,Math.max(0,Number($("tax").value)||0))/100,total=taxable+tax;
    $("subtotal").textContent=money(subtotal);$("discountValue").textContent=money(discount);$("taxValue").textContent=money(tax);$("grandTotal").textContent=money(total);
    return {subtotal,discount,tax,total};
  }
  function collect(){
    const totals=calculate();
    return {id:$("invoiceNo").value||nextNumber(),date:$("invoiceDate").value,currency:currency(),seller:{name:$("sellerName").value,phone:$("sellerPhone").value,address:$("sellerAddress").value},client:{name:$("clientName").value,phone:$("clientPhone").value,address:$("clientAddress").value},items:[...$("itemsBody").rows].map(r=>({name:r.querySelector(".product-name").value,qty:Number(r.querySelector(".qty").value)||0,price:Number(r.querySelector(".price").value)||0})),discount:Number($("discount").value)||0,tax:Number($("tax").value)||0,notes:$("notes").value,totals,updatedAt:new Date().toISOString()};}
  function fill(data){
    $("invoiceNo").value=data.id||nextNumber();$("invoiceDate").value=data.date||$("invoiceDate").value;$("currency").value=data.currency||"DZD";
    $("sellerName").value=data.seller?.name||"";$("sellerPhone").value=data.seller?.phone||"";$("sellerAddress").value=data.seller?.address||"";
    $("clientName").value=data.client?.name||"";$("clientPhone").value=data.client?.phone||"";$("clientAddress").value=data.client?.address||"";
    $("discount").value=data.discount||0;$("tax").value=data.tax||0;$("notes").value=data.notes||"";
    $("itemsBody").innerHTML="";(data.items?.length?data.items:[{}]).forEach(addRow);calculate();
  }
  const getSaved=()=>{try{return JSON.parse(localStorage.getItem("fatourati_invoices")||"[]");}catch{return [];}};
  function save(){
    const data=collect();if(!data.items.some(x=>x.name.trim()&&x.qty>0)){showToast(t("needItem"));return;}
    const all=getSaved(),index=all.findIndex(x=>x.id===data.id);if(index>=0)all[index]=data;else all.unshift(data);
    try{localStorage.setItem("fatourati_invoices",JSON.stringify(all));showToast(t("saved"));}catch{showToast("Storage is full. Export or delete old invoices.");}
  }
  function openHistory(){
    const list=getSaved();const host=$("historyList");host.innerHTML="";
    if(!list.length){host.innerHTML='<div class="empty">'+t("empty")+'</div>';}
    list.forEach((item,index)=>{
      const row=document.createElement("div");row.className="history-item";
      const info=document.createElement("div");const strong=document.createElement("strong");strong.textContent=item.id;const small=document.createElement("small");small.textContent=(item.client?.name||t("untitled"))+" · "+(item.date||"")+" · "+money(item.totals?.total||0);info.append(strong,small);
      const actions=document.createElement("div");actions.className="history-buttons";
      const open=document.createElement("button");open.textContent=t("load");open.onclick=()=>{$("historyDialog").close();fill(item);};
      const del=document.createElement("button");del.className="danger";del.textContent=t("delete");del.onclick=()=>{if(confirm(t("confirmDelete"))){const current=getSaved();current.splice(index,1);localStorage.setItem("fatourati_invoices",JSON.stringify(current));openHistory();showToast(t("deleted"));}};
      actions.append(open,del);row.append(info,actions);host.appendChild(row);
    });
    $("historyDialog").showModal();
  }
  $("addItem").addEventListener("click",()=>addRow());
  ["discount","tax","currency"].forEach(id=>$(id).addEventListener("input",calculate));
  $("saveBtn").addEventListener("click",save);
  $("printBtn").addEventListener("click",()=>window.print());
  $("historyBtn").addEventListener("click",openHistory);
  $("closeHistory").addEventListener("click",()=>$("historyDialog").close());
  $("newBtn").addEventListener("click",()=>{if(confirm(t("confirmNew"))){fill({id:nextNumber(),date:$("invoiceDate").value,currency:"DZD",items:[{}]});}});
  $("language").value=lang;$("language").addEventListener("change",e=>{lang=e.target.value;localStorage.setItem("fatourati_lang",lang);applyLanguage();});
  addRow();applyLanguage();
})();