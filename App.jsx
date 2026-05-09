import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// ─── SUPABASE ─────────────────────────────────────────────────────────────────
const supabase = createClient(
  "https://kvjjchtormcchtucdnmz.supabase.co",
  "sb_publishable_vAY5Tqx5mZ-1EOqfd2AQHw_Ypc7kQog"
);

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const C = {
  orange:"#E8612A", orangeL:"#FF8F5E", orangeXL:"#FFF0E8",
  yellow:"#FFD166", yellowL:"#FFF5D6",
  mint:"#3ECFB2", mintL:"#E6FAF6",
  bg:"#FFF9F4",
  text:"#2A1A0E", muted:"#9B8577", border:"#FFE0CC",
  po:"#E8612A", poBg:"#FFF0E8",
  rs:"#1DB87A", rsBg:"#E6FAF6",
  warn:"#F59E0B",
};
const FF = { display:"'Fredoka One', cursive", body:"'Nunito', sans-serif" };
const fmt  = (n) => "Rp " + Number(n).toLocaleString("id-ID");
const genId = () => "BK" + Date.now().toString(36).toUpperCase().slice(-8);
const COURIERS = ["JNE","J&T Express","SiCepat","Anteraja","Ninja Xpress"];
const STATUSES = ["Menunggu Pembayaran","Pembayaran Dikonfirmasi","Diproses","Dikirim","Selesai"];
const BANK     = { bank:"BCA", no:"1234-5678-90", atas:"BukuKiddo Store" };
const WA       = "6281234567890";
const ADMIN_PASS = "bukukiddo2025";

// ─── DATA MAPPERS ─────────────────────────────────────────────────────────────
const mapProduct = (p) => ({ ...p, desc: p.description });
const mapOrder   = (o) => ({
  id: o.id,
  form:{ f:{ name:o.buyer_name, phone:o.buyer_phone, address:o.buyer_address, city:o.buyer_city, payment:o.payment, notes:o.notes } },
  cart: o.cart || [],
  sub:  o.sub,
  ongkir: o.ongkir || 0,
  total: o.total,
  status: o.status,
  courier: o.courier,
  resi: o.resi,
  date: o.created_at,
});

// ─── BADGE ────────────────────────────────────────────────────────────────────
function Badge({ type }) {
  const po = type === "preorder";
  return (
    <span style={{ background:po?C.poBg:C.rsBg, color:po?C.po:C.rs, border:`1.5px solid ${po?C.po:C.rs}`, borderRadius:20, padding:"3px 11px", fontSize:"0.7rem", fontWeight:800, fontFamily:FF.body, letterSpacing:"0.5px", textTransform:"uppercase", whiteSpace:"nowrap" }}>
      {po?"⏳ Pre-Order":"✅ Ready Stock"}
    </span>
  );
}

// ─── STATUS PILL ──────────────────────────────────────────────────────────────
function StatusPill({ s }) {
  const map = { "Menunggu Pembayaran":["#FFF3E0","#E65100"], "Pembayaran Dikonfirmasi":["#E8F5E9","#1B5E20"], "Diproses":["#E3F2FD","#0D47A1"], "Dikirim":["#F3E5F5","#6A1B9A"], "Selesai":[C.rsBg,C.rs] };
  const [bg,col] = map[s]||[C.bg,C.muted];
  return <span style={{ background:bg, color:col, borderRadius:20, padding:"4px 12px", fontSize:"0.75rem", fontWeight:800, fontFamily:FF.body }}>{s}</span>;
}

// ─── COUNTDOWN ────────────────────────────────────────────────────────────────
function Countdown({ deadline }) {
  const [t,setT] = useState({d:0,h:0,m:0,s:0});
  useEffect(() => {
    const tick = () => {
      const diff = new Date(deadline) - new Date();
      if (diff<=0) return setT({d:0,h:0,m:0,s:0});
      setT({ d:Math.floor(diff/864e5), h:Math.floor(diff%864e5/36e5), m:Math.floor(diff%36e5/6e4), s:Math.floor(diff%6e4/1000) });
    };
    tick(); const id=setInterval(tick,1000); return ()=>clearInterval(id);
  },[deadline]);
  return (
    <div style={{display:"flex",gap:6}}>
      {[["d","Hari"],["h","Jam"],["m","Mnt"],["s","Dtk"]].map(([k,l])=>(
        <div key={k} style={{textAlign:"center"}}>
          <div style={{background:C.orange,color:"#fff",borderRadius:8,padding:"5px 8px",fontFamily:FF.display,fontSize:"1rem",minWidth:36}}>{String(t[k]).padStart(2,"0")}</div>
          <div style={{fontSize:"0.62rem",color:C.muted,fontFamily:FF.body,marginTop:2}}>{l}</div>
        </div>
      ))}
    </div>
  );
}

// ─── NAV ──────────────────────────────────────────────────────────────────────
function Nav({ setView, cartCount, back, backLabel }) {
  return (
    <nav style={{background:"#fff",borderBottom:`3px solid ${C.yellow}`,padding:"12px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100,boxShadow:"0 2px 16px rgba(232,97,42,0.07)"}}>
      <button onClick={()=>setView(back||"home")} style={{background:"none",border:"none",cursor:"pointer",fontFamily:FF.display,fontSize:"1.3rem",color:C.orange,display:"flex",alignItems:"center",gap:6}}>
        {back?"←":"📚"} {backLabel||"BukuKiddo"}
      </button>
      <div style={{display:"flex",gap:8}}>
        <button onClick={()=>setView("track")} style={{background:"none",border:`2px solid ${C.border}`,borderRadius:20,padding:"6px 14px",color:C.muted,cursor:"pointer",fontFamily:FF.body,fontWeight:700,fontSize:"0.82rem"}}>🔍 Lacak</button>
        <button onClick={()=>setView("admin")} style={{background:"none",border:`2px solid ${C.border}`,borderRadius:20,padding:"6px 14px",color:C.muted,cursor:"pointer",fontFamily:FF.body,fontWeight:700,fontSize:"0.82rem"}}>⚙️ Admin</button>
        <button onClick={()=>setView("cart")} style={{background:C.orange,color:"#fff",border:"none",borderRadius:20,padding:"8px 18px",cursor:"pointer",fontFamily:FF.display,fontSize:"1rem",display:"flex",alignItems:"center",gap:6}}>
          🛒 {cartCount>0&&<span style={{background:C.yellow,color:C.text,borderRadius:10,padding:"1px 7px",fontSize:"0.78rem",fontWeight:800}}>{cartCount}</span>}
        </button>
      </div>
    </nav>
  );
}

// ─── HOME ─────────────────────────────────────────────────────────────────────
function HomePage({ products, loading, cart, setView, setSelected, filter, setFilter, search, setSearch }) {
  const cartCount = cart.reduce((s,i)=>s+i.qty,0);
  const filtered  = products.filter(p=>{
    const mf = filter==="all"||p.status===filter;
    const ms = p.name.toLowerCase().includes(search.toLowerCase())||(p.category||"").toLowerCase().includes(search.toLowerCase());
    return mf&&ms;
  });
  return (
    <div style={{fontFamily:FF.body,background:C.bg,minHeight:"100vh"}}>
      <Nav setView={setView} cartCount={cartCount}/>
      {/* Hero */}
      <div style={{background:"linear-gradient(135deg,#FFF0E4 0%,#FFEBD0 60%,#FFE4C4 100%)",padding:"36px 20px 28px",textAlign:"center",position:"relative",overflow:"hidden"}}>
        {["⭐","🌟","✨","⭐"].map((e,i)=><div key={i} style={{position:"absolute",top:i*8+10,left:i%2===0?20:"auto",right:i%2===1?40:"auto",fontSize:"1.8rem",opacity:0.2}}>{e}</div>)}
        <div style={{fontSize:"6rem",marginBottom:4}}>📚</div>
        <h1 style={{fontFamily:FF.display,fontSize:"2.2rem",color:C.orange,margin:"0 0 6px",lineHeight:1.2}}>BukuKiddo 📚</h1>
        <p style={{color:C.muted,fontSize:"1rem",fontWeight:700,margin:"0 0 22px"}}>Teman Baca Terbaik untuk Si Kecil yang Penasaran!</p>
        <div style={{position:"relative",maxWidth:400,margin:"0 auto"}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍  Cari judul atau kategori buku..."
            style={{width:"100%",padding:"13px 20px",borderRadius:30,border:`2.5px solid ${C.border}`,fontSize:"0.92rem",fontFamily:FF.body,outline:"none",boxSizing:"border-box",background:"#fff",boxShadow:"0 4px 20px rgba(232,97,42,0.1)"}}/>
        </div>
      </div>
      {/* Filters */}
      <div style={{padding:"18px 20px 4px",display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap"}}>
        {[["all","📚 Semua"],["preorder","⏳ Pre-Order"],["ready","✅ Ready Stock"]].map(([v,l])=>(
          <button key={v} onClick={()=>setFilter(v)} style={{padding:"8px 18px",borderRadius:20,cursor:"pointer",fontFamily:FF.body,fontWeight:700,fontSize:"0.88rem",background:filter===v?C.orange:"#fff",color:filter===v?"#fff":C.muted,border:`2px solid ${filter===v?C.orange:C.border}`,transition:"all .2s"}}>{l}</button>
        ))}
      </div>
      {/* Loading */}
      {loading && (
        <div style={{textAlign:"center",padding:"60px 24px",color:C.muted}}>
          <div style={{fontSize:"3rem",marginBottom:12}}>⏳</div>
          <p style={{fontFamily:FF.display,fontSize:"1.2rem"}}>Memuat produk...</p>
        </div>
      )}
      {/* Grid */}
      {!loading && (
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))",gap:18,padding:"16px 20px 48px",maxWidth:1120,margin:"0 auto"}}>
          {filtered.map(p=>(
            <div key={p.id} onClick={()=>{setSelected(p);setView("product");}}
              style={{background:"#fff",borderRadius:18,overflow:"hidden",border:`2px solid ${C.border}`,cursor:"pointer",transition:"transform .2s, box-shadow .2s",boxShadow:"0 2px 12px rgba(232,97,42,0.05)"}}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-5px)";e.currentTarget.style.boxShadow="0 10px 28px rgba(232,97,42,0.14)";}}
              onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="0 2px 12px rgba(232,97,42,0.05)";}}>
              <div style={{background:"linear-gradient(135deg,#FFF0E4,#FFF5D6)",height:160,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"5rem",position:"relative"}}>
                {p.emoji||"📗"}
                <div style={{position:"absolute",top:10,left:10}}><Badge type={p.status}/></div>
                {p.status==="ready"&&p.stock&&p.stock<=5&&<div style={{position:"absolute",top:10,right:10,background:"#FFF3E0",color:"#E65100",borderRadius:10,padding:"2px 8px",fontSize:"0.65rem",fontWeight:800,fontFamily:FF.body}}>Stok {p.stock}!</div>}
              </div>
              <div style={{padding:"14px 16px"}}>
                <div style={{fontSize:"0.72rem",color:C.muted,fontWeight:700,marginBottom:3,textTransform:"uppercase",letterSpacing:"0.5px"}}>{p.category||"Umum"} · {p.origin||""}</div>
                <h3 style={{fontFamily:FF.display,fontSize:"0.97rem",color:C.text,margin:"0 0 6px",lineHeight:1.35}}>{p.name}</h3>
                <p style={{fontSize:"0.8rem",color:C.muted,margin:"0 0 10px",lineHeight:1.55,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{p.desc||""}</p>
                {p.status==="preorder"&&p.deadline&&<div style={{marginBottom:8}}><div style={{fontSize:"0.7rem",color:C.po,fontWeight:800,marginBottom:4}}>⏰ Ditutup dalam:</div><Countdown deadline={p.deadline}/></div>}
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:10}}>
                  <div style={{fontFamily:FF.display,fontSize:"1.15rem",color:C.orange}}>{fmt(p.price)}</div>
                  <div style={{fontSize:"0.73rem",color:C.muted}}>{p.status==="ready"?`Stok: ${p.stock||"∞"}`:p.age||""}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {!loading&&filtered.length===0&&(
        <div style={{textAlign:"center",padding:"60px 24px",color:C.muted}}>
          <div style={{fontSize:"4rem"}}>📭</div>
          <p style={{fontFamily:FF.display,fontSize:"1.3rem",margin:"12px 0 6px"}}>{products.length===0?"Belum ada produk":"Buku tidak ditemukan"}</p>
          <p style={{fontSize:"0.88rem"}}>{products.length===0?"Admin sedang menyiapkan katalog — pantau terus ya!":"Coba kata kunci lain atau ubah filter"}</p>
        </div>
      )}
      <footer style={{background:C.text,color:"#fff",padding:"28px 24px",textAlign:"center"}}>
        <div style={{fontFamily:FF.display,fontSize:"1.4rem",marginBottom:6}}>📚 BukuKiddo</div>
        <p style={{color:"#aaa",fontSize:"0.82rem",margin:"0 0 4px"}}>Pengiriman dari Jakarta · Semarang · Jawa Tengah</p>
        <p style={{color:"#666",fontSize:"0.75rem",margin:0}}>© 2025 BukuKiddo. Teman baca terbaik si kecil.</p>
      </footer>
    </div>
  );
}

// ─── PRODUCT DETAIL ───────────────────────────────────────────────────────────
function ProductPage({ product:p, onAdd, setView, cart }) {
  const [qty,setQty]   = useState(1);
  const [added,setAdded] = useState(false);
  const cartCount = cart.reduce((s,i)=>s+i.qty,0);
  const doAdd = () => { onAdd(p,qty); setAdded(true); setTimeout(()=>setAdded(false),2200); };
  return (
    <div style={{fontFamily:FF.body,background:C.bg,minHeight:"100vh"}}>
      <Nav setView={setView} cartCount={cartCount} back="home" backLabel="BukuKiddo"/>
      <div style={{maxWidth:900,margin:"0 auto",padding:"28px 20px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:36}}>
        <div>
          <div style={{background:"linear-gradient(135deg,#FFF0E4,#FFF5D6)",borderRadius:20,height:380,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"9rem",border:`2px solid ${C.border}`}}>{p.emoji||"📗"}</div>
        </div>
        <div>
          <div style={{marginBottom:10}}><Badge type={p.status}/></div>
          <div style={{fontSize:"0.78rem",color:C.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:6}}>{p.category||"Umum"} · Dikirim dari {p.origin||""}</div>
          <h1 style={{fontFamily:FF.display,fontSize:"1.7rem",color:C.text,margin:"0 0 10px",lineHeight:1.3}}>{p.name}</h1>
          <div style={{fontFamily:FF.display,fontSize:"2rem",color:C.orange,marginBottom:14}}>{fmt(p.price)}</div>
          <p style={{color:C.muted,lineHeight:1.75,marginBottom:16,fontSize:"0.93rem"}}>{p.desc||""}</p>
          <div style={{background:C.bg,borderRadius:12,padding:"12px 16px",marginBottom:16,border:`2px solid ${C.border}`}}>
            {[["📖","Halaman",(p.pages||"-")+" hal"],["👶","Usia",p.age||"-"],["📦","Berat",p.weight||"-"],["📍","Asal",p.origin||"-"]].map(([icon,l,v])=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",fontSize:"0.86rem"}}>
                <span style={{color:C.muted}}>{icon} {l}</span><span style={{fontWeight:800,color:C.text}}>{v}</span>
              </div>
            ))}
          </div>
          {p.status==="preorder"&&p.deadline&&(
            <div style={{background:C.poBg,borderRadius:12,padding:"12px 16px",marginBottom:16,border:`2px solid ${C.po}30`}}>
              <div style={{fontSize:"0.8rem",color:C.po,fontWeight:800,marginBottom:8}}>⏰ Pre-Order Ditutup Dalam:</div>
              <Countdown deadline={p.deadline}/>
              <p style={{fontSize:"0.76rem",color:C.po,margin:"8px 0 0"}}>⚠️ Segera pesan sebelum periode pre-order berakhir!</p>
            </div>
          )}
          {p.status==="ready"&&p.stock&&p.stock<=5&&(
            <div style={{background:"#FFF3E0",borderRadius:12,padding:"10px 14px",marginBottom:14,border:"2px solid #FFC947"}}>
              <span style={{color:"#E65100",fontWeight:800,fontSize:"0.85rem"}}>🔥 Stok tersisa {p.stock} pcs — segera pesan!</span>
            </div>
          )}
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,background:"#fff",border:`2px solid ${C.border}`,borderRadius:30,padding:"4px 8px"}}>
              <button onClick={()=>setQty(Math.max(1,qty-1))} style={{width:32,height:32,borderRadius:"50%",border:"none",background:C.bg,cursor:"pointer",fontSize:"1.2rem",fontWeight:800,color:C.orange}}>−</button>
              <span style={{fontFamily:FF.display,fontSize:"1.1rem",minWidth:24,textAlign:"center"}}>{qty}</span>
              <button onClick={()=>setQty(qty+1)} style={{width:32,height:32,borderRadius:"50%",border:"none",background:C.orange,cursor:"pointer",fontSize:"1.1rem",fontWeight:800,color:"#fff"}}>+</button>
            </div>
            <button onClick={doAdd} style={{flex:1,background:added?C.rs:C.orange,color:"#fff",border:"none",borderRadius:30,padding:"14px 20px",fontFamily:FF.display,fontSize:"1.05rem",cursor:"pointer",transition:"background .3s"}}>
              {added?"✅ Ditambahkan ke Keranjang!":"🛒 Tambah ke Keranjang"}
            </button>
          </div>
          {added&&<div style={{background:C.rsBg,borderRadius:10,padding:"10px 14px",marginTop:10,textAlign:"center"}}>
            <button onClick={()=>setView("cart")} style={{background:"none",border:"none",color:C.rs,fontFamily:FF.body,fontWeight:800,cursor:"pointer",fontSize:"0.9rem"}}>Lihat Keranjang & Checkout →</button>
          </div>}
        </div>
      </div>
    </div>
  );
}

// ─── CART ─────────────────────────────────────────────────────────────────────
function CartPage({ cart, setCart, setView }) {
  const total = cart.reduce((s,i)=>s+i.product.price*i.qty,0);
  const count = cart.reduce((s,i)=>s+i.qty,0);
  const upd = (id,d)=>setCart(c=>c.map(i=>i.product.id===id?{...i,qty:Math.max(1,i.qty+d)}:i));
  const del = (id)=>setCart(c=>c.filter(i=>i.product.id!==id));
  return (
    <div style={{fontFamily:FF.body,background:C.bg,minHeight:"100vh"}}>
      <nav style={{background:"#fff",borderBottom:`3px solid ${C.yellow}`,padding:"12px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100}}>
        <button onClick={()=>setView("home")} style={{background:"none",border:"none",cursor:"pointer",fontFamily:FF.display,fontSize:"1.2rem",color:C.orange}}>← Lanjut Belanja</button>
        <span style={{fontFamily:FF.display,fontSize:"1.3rem",color:C.text}}>🛒 Keranjang</span>
        <div style={{width:120}}/>
      </nav>
      <div style={{maxWidth:680,margin:"0 auto",padding:"24px 20px"}}>
        {cart.length===0?(
          <div style={{textAlign:"center",padding:"80px 0",color:C.muted}}>
            <div style={{fontSize:"5rem"}}>🛒</div>
            <p style={{fontFamily:FF.display,fontSize:"1.4rem",margin:"14px 0 6px"}}>Keranjang Masih Kosong</p>
            <p style={{fontSize:"0.88rem"}}>Yuk pilih buku seru untuk si kecil!</p>
            <button onClick={()=>setView("home")} style={{background:C.orange,color:"#fff",border:"none",borderRadius:20,padding:"12px 28px",fontFamily:FF.display,fontSize:"1rem",cursor:"pointer",marginTop:16}}>Lihat Buku</button>
          </div>
        ):(
          <>
            {cart.map(({product:p,qty})=>(
              <div key={p.id} style={{background:"#fff",borderRadius:16,padding:"16px",marginBottom:12,border:`2px solid ${C.border}`,display:"flex",gap:14,alignItems:"center"}}>
                <div style={{fontSize:"2.8rem",background:"linear-gradient(135deg,#FFF0E4,#FFF5D6)",borderRadius:12,width:70,height:70,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{p.emoji||"📗"}</div>
                <div style={{flex:1}}>
                  <div style={{fontFamily:FF.display,fontSize:"0.97rem",color:C.text,marginBottom:3}}>{p.name}</div>
                  <Badge type={p.status}/>
                  <div style={{fontFamily:FF.display,color:C.orange,marginTop:5,fontSize:"1.05rem"}}>{fmt(p.price*qty)}</div>
                </div>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <button onClick={()=>upd(p.id,-1)} style={{width:28,height:28,borderRadius:"50%",border:`2px solid ${C.border}`,background:"#fff",cursor:"pointer",fontWeight:700,color:C.text}}>−</button>
                    <span style={{fontWeight:800,minWidth:20,textAlign:"center",fontFamily:FF.display}}>{qty}</span>
                    <button onClick={()=>upd(p.id,1)} style={{width:28,height:28,borderRadius:"50%",border:"none",background:C.orange,cursor:"pointer",fontWeight:700,color:"#fff"}}>+</button>
                  </div>
                  <button onClick={()=>del(p.id)} style={{background:"none",border:"none",color:"#e74c3c",cursor:"pointer",fontSize:"0.78rem",fontWeight:700}}>🗑️ Hapus</button>
                </div>
              </div>
            ))}
            {cart.some(i=>i.product.status==="preorder")&&(
              <div style={{background:C.poBg,border:`2px solid ${C.po}40`,borderRadius:12,padding:"12px 16px",marginBottom:14}}>
                <p style={{margin:0,fontSize:"0.83rem",color:C.po,fontWeight:700}}>⏳ Ada produk Pre-Order di keranjangmu. Pesanan diproses setelah periode pre-order selesai.</p>
              </div>
            )}
            <div style={{background:"#fff",borderRadius:16,padding:"20px",border:`2px solid ${C.border}`}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:8,color:C.muted,fontSize:"0.88rem"}}><span>Subtotal ({count} item)</span><span style={{fontWeight:700,color:C.text}}>{fmt(total)}</span></div>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:14,color:C.muted,fontSize:"0.88rem"}}><span>Ongkos kirim</span><span style={{color:C.mint,fontWeight:700}}>Ditentukan agen</span></div>
              <div style={{borderTop:`2px dashed ${C.border}`,paddingTop:14,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{fontSize:"0.82rem",color:C.muted}}>Total Belanja</div>
                  <div style={{fontFamily:FF.display,fontSize:"1.6rem",color:C.orange}}>{fmt(total)}</div>
                </div>
                <button onClick={()=>setView("checkout")} style={{background:C.orange,color:"#fff",border:"none",borderRadius:20,padding:"14px 26px",fontFamily:FF.display,fontSize:"1.05rem",cursor:"pointer"}}>Checkout →</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── CARD ─────────────────────────────────────────────────────────────────────
function Card({ title, children }) {
  return <div style={{background:"#fff",borderRadius:16,padding:"20px",marginBottom:16,border:`2px solid ${C.border}`}}><h3 style={{fontFamily:FF.display,color:C.text,margin:"0 0 16px",fontSize:"1.05rem"}}>{title}</h3>{children}</div>;
}

// ─── CHECKOUT ─────────────────────────────────────────────────────────────────
function CheckoutPage({ cart, setView, onPlace }) {
  const [f,setF] = useState({name:"",phone:"",address:"",city:"",province:"",zip:"",payment:"transfer",notes:""});
  const sub   = cart.reduce((s,i)=>s+i.product.price*i.qty,0);
  const set   = (k,v)=>setF(x=>({...x,[k]:v}));
  const valid = f.name&&f.phone&&f.address&&f.city;
  const submit = ()=>{ if(!valid) return alert("Mohon lengkapi nama, nomor HP, alamat, dan kota."); onPlace({f,cart,sub,total:sub}); };
  const inp   = (k,label,type="text",ph="")=>(
    <div style={{marginBottom:12}}>
      <label style={{display:"block",fontSize:"0.82rem",fontWeight:700,color:C.text,marginBottom:4}}>{label}</label>
      <input type={type} placeholder={ph} value={f[k]} onChange={e=>set(k,e.target.value)}
        style={{width:"100%",padding:"10px 14px",borderRadius:10,border:`2px solid ${C.border}`,fontSize:"0.9rem",fontFamily:FF.body,boxSizing:"border-box",outline:"none"}}/>
    </div>
  );
  return (
    <div style={{fontFamily:FF.body,background:C.bg,minHeight:"100vh"}}>
      <nav style={{background:"#fff",borderBottom:`3px solid ${C.yellow}`,padding:"12px 20px",display:"flex",alignItems:"center",gap:14,position:"sticky",top:0,zIndex:100}}>
        <button onClick={()=>setView("cart")} style={{background:"none",border:"none",cursor:"pointer",fontFamily:FF.display,fontSize:"1.2rem",color:C.orange}}>←</button>
        <span style={{fontFamily:FF.display,fontSize:"1.3rem",color:C.text}}>📝 Checkout</span>
      </nav>
      <div style={{maxWidth:860,margin:"0 auto",padding:"24px 20px",display:"grid",gridTemplateColumns:"1fr 360px",gap:22}}>
        <div>
          <Card title="📍 Data Pengiriman">
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 14px"}}>
              <div style={{gridColumn:"1/-1"}}>{inp("name","Nama Lengkap *","text","Nama penerima")}</div>
              {inp("phone","Nomor HP / WA *","tel","08xx-xxxx-xxxx")}
              {inp("zip","Kode Pos","text","12345")}
              <div style={{gridColumn:"1/-1"}}>{inp("address","Alamat Lengkap *","text","Jl. Contoh No. 1, RT 02/RW 03")}</div>
              {inp("city","Kota/Kabupaten *","text","Jakarta Selatan")}
              {inp("province","Provinsi","text","DKI Jakarta")}
            </div>
            <div style={{background:C.yellowL,border:`2px solid ${C.yellow}`,borderRadius:10,padding:"10px 14px",marginBottom:12}}>
              <p style={{margin:0,fontSize:"0.83rem",color:"#7A5C00",fontWeight:700}}>🚚 Kurir pengiriman akan ditentukan oleh agen dan dikonfirmasi oleh admin setelah pesananmu diproses.</p>
            </div>
            <div>
              <label style={{display:"block",fontSize:"0.82rem",fontWeight:700,color:C.text,marginBottom:4}}>Catatan (opsional)</label>
              <textarea value={f.notes} onChange={e=>set("notes",e.target.value)} placeholder="Instruksi khusus untuk pengiriman..." rows={2}
                style={{width:"100%",padding:"10px 14px",borderRadius:10,border:`2px solid ${C.border}`,fontSize:"0.9rem",fontFamily:FF.body,boxSizing:"border-box",resize:"none"}}/>
            </div>
          </Card>
          <Card title="💳 Metode Pembayaran">
            {[["transfer","🏦 Transfer Bank Manual","Konfirmasi via WhatsApp · BCA"],["qris","⚡ QRIS / Virtual Account","Pembayaran otomatis via Midtrans · Xendit"]].map(([v,l,d])=>(
              <div key={v} onClick={()=>set("payment",v)} style={{border:`2.5px solid ${f.payment===v?C.orange:C.border}`,borderRadius:12,padding:"13px 16px",marginBottom:10,cursor:"pointer",background:f.payment===v?C.poBg:"#fff",display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:20,height:20,borderRadius:"50%",border:`2.5px solid ${f.payment===v?C.orange:C.border}`,background:f.payment===v?C.orange:"#fff",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  {f.payment===v&&<div style={{width:8,height:8,borderRadius:"50%",background:"#fff"}}/>}
                </div>
                <div><div style={{fontWeight:700,color:C.text,fontSize:"0.92rem"}}>{l}</div><div style={{fontSize:"0.78rem",color:C.muted}}>{d}</div></div>
              </div>
            ))}
          </Card>
        </div>
        <div>
          <div style={{background:"#fff",borderRadius:16,padding:"20px",border:`2px solid ${C.border}`,position:"sticky",top:80}}>
            <h3 style={{fontFamily:FF.display,color:C.text,margin:"0 0 14px",fontSize:"1.1rem"}}>📋 Ringkasan Order</h3>
            {cart.map(({product:p,qty})=>(
              <div key={p.id} style={{display:"flex",justifyContent:"space-between",marginBottom:8,fontSize:"0.85rem"}}>
                <span style={{color:C.text,flex:1}}>{p.emoji||"📗"} {p.name} <span style={{color:C.muted}}>×{qty}</span></span>
                <span style={{fontWeight:700,color:C.text,marginLeft:8}}>{fmt(p.price*qty)}</span>
              </div>
            ))}
            <div style={{borderTop:`2px dashed ${C.border}`,marginTop:12,paddingTop:12}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6,fontSize:"0.85rem",color:C.muted}}><span>Subtotal</span><span>{fmt(sub)}</span></div>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:14,fontSize:"0.85rem",color:C.warn}}><span>Ongkos Kirim</span><span>Ditentukan agen</span></div>
              <div style={{display:"flex",justifyContent:"space-between",fontFamily:FF.display,fontSize:"1.2rem",color:C.orange,margin:"10px 0 16px"}}><span>Total</span><span>{fmt(sub)}</span></div>
              <button onClick={submit} style={{width:"100%",background:valid?C.orange:"#ccc",color:"#fff",border:"none",borderRadius:20,padding:"14px",fontFamily:FF.display,fontSize:"1.05rem",cursor:valid?"pointer":"not-allowed"}}>
                Pesan Sekarang 🚀
              </button>
              {!valid&&<p style={{fontSize:"0.75rem",color:C.muted,textAlign:"center",margin:"8px 0 0"}}>* Lengkapi data pengiriman dahulu</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PAYMENT ──────────────────────────────────────────────────────────────────
function PaymentPage({ order, setView }) {
  const [proof,setProof] = useState(null);
  const [sent,setSent]   = useState(false);
  const name  = order.form?.f?.name||"";
  const phone = order.form?.f?.phone||"";
  const waMsg = encodeURIComponent(`Halo BukuKiddo! 👋\nSaya sudah transfer untuk pesanan berikut:\n\nID Pesanan: ${order.id}\nNama: ${name}\nTotal: ${fmt(order.total)}\n\nMohon dikonfirmasi ya, terima kasih! 🙏`);
  return (
    <div style={{fontFamily:FF.body,background:C.bg,minHeight:"100vh"}}>
      <nav style={{background:"#fff",borderBottom:`3px solid ${C.yellow}`,padding:"12px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100}}>
        <span style={{fontFamily:FF.display,fontSize:"1.3rem",color:C.text}}>💳 Pembayaran</span>
        <button onClick={()=>setView("home")} style={{background:"none",border:`2px solid ${C.border}`,borderRadius:20,padding:"6px 14px",color:C.muted,cursor:"pointer",fontFamily:FF.body,fontWeight:700}}>🏠 Beranda</button>
      </nav>
      <div style={{maxWidth:580,margin:"0 auto",padding:"28px 20px"}}>
        <div style={{background:`linear-gradient(135deg,${C.orange},${C.orangeL})`,color:"#fff",borderRadius:18,padding:"22px",marginBottom:22,textAlign:"center"}}>
          <div style={{fontSize:"0.82rem",opacity:0.85,marginBottom:4}}>🎉 Pesanan Berhasil Dibuat!</div>
          <div style={{fontFamily:FF.display,fontSize:"2rem",letterSpacing:3}}>{order.id}</div>
          <div style={{fontSize:"0.78rem",opacity:0.8,marginTop:6}}>📌 Simpan ID ini untuk melacak pesananmu</div>
        </div>
        {order.form?.f?.payment==="transfer"?(
          <>
            <Card title="🏦 Detail Transfer Bank">
              <div style={{textAlign:"center",background:C.poBg,borderRadius:12,padding:"18px",marginBottom:14}}>
                <div style={{fontFamily:FF.display,fontSize:"2rem",color:C.orange}}>{BANK.bank}</div>
                <div style={{fontSize:"1.5rem",fontWeight:900,letterSpacing:3,color:C.text,margin:"4px 0"}}>{BANK.no}</div>
                <div style={{color:C.muted,fontSize:"0.88rem"}}>a.n. <strong>{BANK.atas}</strong></div>
              </div>
              <div style={{background:"#fff",border:`2px solid ${C.orange}`,borderRadius:12,padding:"14px",textAlign:"center"}}>
                <div style={{fontSize:"0.83rem",color:C.muted,marginBottom:4}}>Total yang harus ditransfer</div>
                <div style={{fontFamily:FF.display,fontSize:"2rem",color:C.orange}}>{fmt(order.total)}</div>
                <div style={{fontSize:"0.75rem",color:C.po,marginTop:4}}>⚠️ Transfer tepat sesuai nominal untuk mempercepat konfirmasi</div>
              </div>
            </Card>
            <Card title="📤 Konfirmasi Pembayaran">
              <p style={{fontSize:"0.85rem",color:C.muted,margin:"0 0 14px"}}>Setelah transfer, konfirmasi via WhatsApp atau upload bukti bayar di bawah ini.</p>
              <a href={`https://wa.me/${WA}?text=${waMsg}`} target="_blank" rel="noreferrer"
                style={{display:"block",background:"#25D366",color:"#fff",borderRadius:20,padding:"14px",textAlign:"center",textDecoration:"none",fontFamily:FF.display,fontSize:"1.05rem",marginBottom:12}}>
                📱 Konfirmasi via WhatsApp
              </a>
              {!sent?(
                <div style={{border:`2px dashed ${C.border}`,borderRadius:12,padding:"20px",textAlign:"center",cursor:"pointer"}} onClick={()=>document.getElementById("pf").click()}>
                  <input id="pf" type="file" accept="image/*" style={{display:"none"}} onChange={e=>{if(e.target.files[0]){setProof(URL.createObjectURL(e.target.files[0]));setSent(true);}}}/>
                  {proof?<img src={proof} alt="bukti" style={{maxWidth:"100%",borderRadius:8}}/>:<><div style={{fontSize:"2rem",marginBottom:6}}>📎</div><p style={{color:C.muted,fontSize:"0.85rem",margin:0}}>Upload bukti transfer (JPG / PNG)</p></>}
                </div>
              ):(
                <div style={{background:C.rsBg,borderRadius:12,padding:"16px",textAlign:"center"}}>
                  <div style={{fontSize:"2rem"}}>✅</div>
                  <p style={{color:C.rs,fontWeight:800,margin:"4px 0"}}>Bukti Berhasil Diupload!</p>
                  <p style={{color:C.muted,fontSize:"0.8rem",margin:0}}>Admin akan memverifikasi dalam 1×24 jam</p>
                </div>
              )}
            </Card>
          </>
        ):(
          <Card title="⚡ QRIS / Virtual Account">
            <div style={{textAlign:"center",padding:"10px 0"}}>
              <div style={{background:"#f9f9f9",borderRadius:16,padding:"24px",display:"inline-block",marginBottom:14}}>
                <div style={{fontSize:"0.82rem",color:C.muted,marginBottom:10}}>Scan QRIS untuk Bayar</div>
                <div style={{width:180,height:180,background:"#fff",border:`2px solid ${C.border}`,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto"}}>
                  <div style={{fontSize:"0.73rem",color:C.muted,textAlign:"center",padding:12,lineHeight:1.5}}>🔧 QR Code aktif setelah integrasi Midtrans / Xendit diaktifkan admin</div>
                </div>
              </div>
              <div style={{fontFamily:FF.display,fontSize:"1.6rem",color:C.orange}}>{fmt(order.total)}</div>
              <a href={`https://wa.me/${WA}?text=${waMsg}`} target="_blank" rel="noreferrer"
                style={{display:"inline-block",background:"#25D366",color:"#fff",borderRadius:20,padding:"12px 24px",textDecoration:"none",fontFamily:FF.display,marginTop:14}}>
                📱 Hubungi Admin via WA
              </a>
            </div>
          </Card>
        )}
        <div style={{background:C.rsBg,borderRadius:12,padding:"14px 16px"}}>
          <p style={{margin:0,fontSize:"0.85rem",color:C.rs,fontWeight:700}}>🔍 Lacak pesanan dengan ID: <strong>{order.id}</strong></p>
          <button onClick={()=>setView("track")} style={{background:"none",border:"none",color:C.rs,fontWeight:700,cursor:"pointer",padding:0,marginTop:4,textDecoration:"underline",fontFamily:FF.body,fontSize:"0.85rem"}}>
            Klik di sini untuk lacak pesanan →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── TRACK ────────────────────────────────────────────────────────────────────
function TrackPage({ setView }) {
  const [q,setQ]           = useState("");
  const [res,setRes]       = useState(null);
  const [notFound,setNF]   = useState(false);
  const [searching,setSrch] = useState(false);
  const [tracking,setTrk]  = useState(null);
  const [loadTrk,setLoadTrk] = useState(false);

  const doSearch = async () => {
    if(!q.trim()) return;
    setSrch(true); setRes(null); setNF(false); setTrk(null);
    const { data } = await supabase.from("orders").select("*").eq("id",q.trim().toUpperCase()).maybeSingle();
    if(data) setRes(mapOrder(data)); else setNF(true);
    setSrch(false);
  };

  const fetchResi = async () => {
    setLoadTrk(true);
    await new Promise(r=>setTimeout(r,1800));
    setTrk([
      {time:"08:00",info:"Paket diterima di gudang pengirim",loc:res?.form?.f?.city||"Jakarta"},
      {time:"12:30",info:"Paket dalam proses sortir di hub utama",loc:"Hub "+(res?.courier||"Kurir")},
      {time:"15:45",info:"Paket dalam perjalanan ke kota tujuan",loc:"Dalam Pengiriman"},
      {time:"18:00",info:"Paket tiba di gudang kota tujuan",loc:res?.form?.f?.city||"Kota Tujuan"},
    ]);
    setLoadTrk(false);
  };

  return (
    <div style={{fontFamily:FF.body,background:C.bg,minHeight:"100vh"}}>
      <nav style={{background:"#fff",borderBottom:`3px solid ${C.yellow}`,padding:"12px 20px",display:"flex",alignItems:"center",gap:14,position:"sticky",top:0,zIndex:100}}>
        <button onClick={()=>setView("home")} style={{background:"none",border:"none",cursor:"pointer",fontFamily:FF.display,fontSize:"1.2rem",color:C.orange}}>←</button>
        <span style={{fontFamily:FF.display,fontSize:"1.3rem",color:C.text}}>🔍 Lacak Pesanan</span>
      </nav>
      <div style={{maxWidth:600,margin:"0 auto",padding:"32px 20px"}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{fontSize:"4rem",marginBottom:8}}>📦</div>
          <h2 style={{fontFamily:FF.display,color:C.text,margin:"0 0 6px"}}>Cek Status Pesananmu</h2>
          <p style={{color:C.muted,fontSize:"0.9rem"}}>Masukkan ID pesanan yang kamu terima setelah checkout</p>
        </div>
        <div style={{display:"flex",gap:8,marginBottom:24}}>
          <input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doSearch()} placeholder="Contoh: BKA1B2C3D4"
            style={{flex:1,padding:"13px 18px",borderRadius:20,border:`2px solid ${C.border}`,fontSize:"0.95rem",fontFamily:FF.body,outline:"none"}}/>
          <button onClick={doSearch} disabled={searching} style={{background:C.orange,color:"#fff",border:"none",borderRadius:20,padding:"13px 22px",fontFamily:FF.display,cursor:"pointer",fontSize:"0.95rem"}}>
            {searching?"⏳":"Lacak"}
          </button>
        </div>
        {notFound&&<div style={{textAlign:"center",color:C.muted,padding:28}}><div style={{fontSize:"3rem"}}>😕</div><p style={{fontFamily:FF.display,fontSize:"1.2rem"}}>Pesanan tidak ditemukan</p><p style={{fontSize:"0.85rem"}}>Pastikan ID pesanan sudah benar</p></div>}
        {res&&(
          <>
            <div style={{background:"#fff",borderRadius:16,padding:"20px",border:`2px solid ${C.border}`,marginBottom:14}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
                <div>
                  <div style={{fontFamily:FF.display,fontSize:"1.15rem",color:C.text}}>{res.id}</div>
                  <div style={{fontSize:"0.8rem",color:C.muted}}>{res.form?.f?.name} · {new Date(res.date).toLocaleDateString("id-ID",{dateStyle:"long"})}</div>
                </div>
                <StatusPill s={res.status}/>
              </div>
              {STATUSES.map((s,i)=>{
                const cur=STATUSES.indexOf(res.status); const done=i<=cur;
                return (
                  <div key={s} style={{display:"flex",gap:12,position:"relative"}}>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                      <div style={{width:24,height:24,borderRadius:"50%",background:done?C.orange:C.border,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                        {done&&<span style={{color:"#fff",fontSize:"0.72rem"}}>✓</span>}
                      </div>
                      {i<STATUSES.length-1&&<div style={{width:2,height:28,background:done&&i<cur?C.orange:C.border}}/>}
                    </div>
                    <div style={{paddingBottom:i<STATUSES.length-1?18:0,display:"flex",alignItems:"flex-start",paddingTop:3}}>
                      <span style={{fontSize:"0.87rem",fontWeight:done?800:400,color:done?C.text:C.muted}}>{s}</span>
                      {i===cur&&<span style={{background:C.poBg,color:C.po,fontSize:"0.7rem",fontWeight:800,borderRadius:6,padding:"1px 6px",marginLeft:8}}>Sekarang</span>}
                    </div>
                  </div>
                );
              })}
              {res.resi&&(
                <div style={{background:C.poBg,borderRadius:10,padding:"12px 14px",marginTop:14}}>
                  <div style={{fontSize:"0.8rem",color:C.muted,marginBottom:4}}>Nomor Resi</div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div><span style={{fontFamily:FF.display,fontSize:"1.05rem",color:C.orange}}>{res.resi}</span><span style={{fontSize:"0.78rem",color:C.muted,marginLeft:8}}>via {res.courier||"—"}</span></div>
                    <button onClick={fetchResi} style={{background:C.orange,color:"#fff",border:"none",borderRadius:16,padding:"6px 14px",cursor:"pointer",fontFamily:FF.body,fontWeight:700,fontSize:"0.8rem"}}>
                      {loadTrk?"⏳ Memuat...":"🔍 Lacak Resi"}
                    </button>
                  </div>
                </div>
              )}
              {!res.resi&&res.status==="Pembayaran Dikonfirmasi"&&<p style={{fontSize:"0.8rem",color:C.muted,margin:"12px 0 0"}}>📦 Nomor resi akan muncul di sini setelah pesanan diproses oleh admin.</p>}
            </div>
            {tracking&&(
              <div style={{background:"#fff",borderRadius:16,padding:"20px",border:`2px solid ${C.border}`}}>
                <h4 style={{fontFamily:FF.display,color:C.text,margin:"0 0 16px",fontSize:"1.05rem"}}>📍 Riwayat Pengiriman</h4>
                {tracking.map((t,i)=>(
                  <div key={i} style={{display:"flex",gap:12}}>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                      <div style={{width:10,height:10,borderRadius:"50%",background:i===tracking.length-1?C.orange:C.border,flexShrink:0,marginTop:4}}/>
                      {i<tracking.length-1&&<div style={{width:1,height:34,background:C.border}}/>}
                    </div>
                    <div style={{paddingBottom:i<tracking.length-1?18:0}}>
                      <div style={{fontSize:"0.87rem",fontWeight:700,color:C.text}}>{t.info}</div>
                      <div style={{fontSize:"0.76rem",color:C.muted}}>{t.loc} · {t.time}</div>
                    </div>
                  </div>
                ))}
                <p style={{fontSize:"0.73rem",color:C.muted,margin:"12px 0 0",fontStyle:"italic"}}>* Integrasi real-time API kurir aktif setelah backend tersambung.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─── ADMIN ────────────────────────────────────────────────────────────────────
function AdminPage({ products, fetchProducts, setView, auth, setAuth }) {
  const [pass,setPass]       = useState("");
  const [tab,setTab]         = useState("orders");
  const [orders,setOrders]   = useState([]);
  const [loadingOrd,setLO]   = useState(false);
  const [np,setNP]           = useState({name:"",desc:"",price:"",status:"ready",deadline:"",category:"",origin:"Jakarta",emoji:"📗",pages:"",age:"",weight:"",stock:""});
  const setnp = (k,v)=>setNP(x=>({...x,[k]:v}));

  useEffect(()=>{ if(auth) loadOrders(); },[auth]);

  const loadOrders = async () => {
    setLO(true);
    const {data} = await supabase.from("orders").select("*").order("created_at",{ascending:false});
    if(data) setOrders(data.map(mapOrder));
    setLO(false);
  };

  const updOrder = async (id, updates) => {
    const db={};
    if(updates.status!==undefined)  db.status  = updates.status;
    if(updates.courier!==undefined) db.courier = updates.courier;
    if(updates.resi!==undefined)    db.resi    = updates.resi;
    if(updates.ongkir!==undefined){
      const val = parseInt(updates.ongkir)||0;
      const ord = orders.find(o=>o.id===id);
      db.ongkir = val;
      db.total  = (ord?.sub||0)+val;
      updates.total = db.total;
    }
    await supabase.from("orders").update(db).eq("id",id);
    setOrders(prev=>prev.map(o=>o.id===id?{...o,...updates}:o));
  };

  const delProd = async (id)=>{
    if(!window.confirm("Hapus produk ini?")) return;
    await supabase.from("products").delete().eq("id",id);
    fetchProducts();
  };

  const addProd = async ()=>{
    if(!np.name||!np.price) return alert("Nama dan harga wajib diisi");
    const {error} = await supabase.from("products").insert([{
      name:np.name, description:np.desc, price:parseInt(np.price),
      status:np.status,
      deadline:np.status==="preorder"&&np.deadline?new Date(np.deadline).toISOString():null,
      category:np.category, origin:np.origin, emoji:np.emoji||"📗",
      pages:parseInt(np.pages)||null, age:np.age, weight:np.weight,
      stock:np.status==="ready"?(parseInt(np.stock)||null):null,
    }]);
    if(error) return alert("Gagal menambahkan: "+error.message);
    fetchProducts();
    setNP({name:"",desc:"",price:"",status:"ready",deadline:"",category:"",origin:"Jakarta",emoji:"📗",pages:"",age:"",weight:"",stock:""});
    alert("✅ Produk berhasil ditambahkan!");
  };

  if(!auth) return (
    <div style={{fontFamily:FF.body,background:C.bg,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{background:"#fff",borderRadius:20,padding:"40px",width:360,border:`2px solid ${C.border}`,textAlign:"center"}}>
        <div style={{fontSize:"3rem",marginBottom:10}}>🔐</div>
        <h2 style={{fontFamily:FF.display,color:C.text,margin:"0 0 6px"}}>Admin Login</h2>
        <p style={{color:C.muted,fontSize:"0.85rem",marginBottom:22}}>Masukkan password admin BukuKiddo</p>
        <input type="password" placeholder="Password admin" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&(pass===ADMIN_PASS?setAuth(true):alert("Password salah!"))}
          style={{width:"100%",padding:"12px",borderRadius:10,border:`2px solid ${C.border}`,fontSize:"1rem",fontFamily:FF.body,boxSizing:"border-box",marginBottom:12,outline:"none"}}/>
        <button onClick={()=>pass===ADMIN_PASS?setAuth(true):alert("Password salah!")} style={{width:"100%",background:C.orange,color:"#fff",border:"none",borderRadius:20,padding:"13px",fontFamily:FF.display,fontSize:"1.05rem",cursor:"pointer"}}>Masuk</button>
        <button onClick={()=>setView("home")} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",marginTop:12,fontFamily:FF.body,fontSize:"0.85rem"}}>← Kembali ke Toko</button>
        <p style={{fontSize:"0.72rem",color:C.muted,marginTop:14,background:C.bg,borderRadius:8,padding:"6px 10px"}}>Demo: <strong>bukukiddo2025</strong></p>
      </div>
    </div>
  );

  const stats=[
    ["📦","Total Order",orders.length,C.orange],
    ["⏳","Pending",orders.filter(o=>o.status==="Menunggu Pembayaran").length,"#E65100"],
    ["🚚","Dikirim",orders.filter(o=>o.status==="Dikirim").length,"#6A1B9A"],
    ["✅","Selesai",orders.filter(o=>o.status==="Selesai").length,C.rs],
  ];

  return (
    <div style={{fontFamily:FF.body,background:C.bg,minHeight:"100vh"}}>
      <nav style={{background:C.orange,padding:"13px 20px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:"1.3rem"}}>📚</span>
          <span style={{fontFamily:FF.display,fontSize:"1.3rem",color:"#fff"}}>BukuKiddo Admin</span>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={loadOrders} style={{background:"rgba(255,255,255,0.2)",color:"#fff",border:"none",borderRadius:20,padding:"7px 16px",cursor:"pointer",fontFamily:FF.body,fontWeight:700,fontSize:"0.85rem"}}>🔄 Refresh</button>
          <button onClick={()=>setView("home")} style={{background:"rgba(255,255,255,0.2)",color:"#fff",border:"none",borderRadius:20,padding:"7px 16px",cursor:"pointer",fontFamily:FF.body,fontWeight:700,fontSize:"0.85rem"}}>🏠 Toko</button>
          <button onClick={()=>setAuth(false)} style={{background:"transparent",color:"#fff",border:"2px solid rgba(255,255,255,0.5)",borderRadius:20,padding:"7px 16px",cursor:"pointer",fontFamily:FF.body,fontWeight:700,fontSize:"0.85rem"}}>Logout</button>
        </div>
      </nav>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,padding:"20px 20px 0"}}>
        {stats.map(([icon,l,v,col])=>(
          <div key={l} style={{background:"#fff",borderRadius:14,padding:"16px",border:`2px solid ${C.border}`,textAlign:"center"}}>
            <div style={{fontSize:"1.8rem",marginBottom:2}}>{icon}</div>
            <div style={{fontFamily:FF.display,fontSize:"2rem",color:col}}>{v}</div>
            <div style={{fontSize:"0.78rem",color:C.muted,fontWeight:700}}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{padding:"16px 20px 0",display:"flex",gap:8,flexWrap:"wrap"}}>
        {[["orders","📋 Kelola Order"],["products","📚 Daftar Produk"],["add","➕ Tambah Produk"]].map(([t,l])=>(
          <button key={t} onClick={()=>setTab(t)} style={{padding:"9px 18px",borderRadius:20,cursor:"pointer",fontFamily:FF.body,fontWeight:700,fontSize:"0.88rem",background:tab===t?C.orange:"#fff",color:tab===t?"#fff":C.muted,border:`2px solid ${tab===t?C.orange:C.border}`}}>{l}</button>
        ))}
      </div>
      <div style={{padding:"16px 20px 48px"}}>
        {/* ORDERS */}
        {tab==="orders"&&(
          loadingOrd?(
            <div style={{textAlign:"center",padding:"60px",color:C.muted}}><div style={{fontSize:"3rem"}}>⏳</div><p style={{fontFamily:FF.display,fontSize:"1.2rem",marginTop:12}}>Memuat pesanan...</p></div>
          ):orders.length===0?(
            <div style={{textAlign:"center",padding:"60px",color:C.muted}}><div style={{fontSize:"4rem"}}>📭</div><p style={{fontFamily:FF.display,fontSize:"1.3rem"}}>Belum ada pesanan masuk</p></div>
          ):orders.map(ord=>{
            const buyerPhone=(ord.form?.f?.phone||"").replace(/^0/,"62").replace(/\D/g,"");
            const waUpdate=encodeURIComponent(`Halo ${ord.form?.f?.name}! 👋\n\nUpdate pesanan BukuKiddo:\n📦 ID: ${ord.id}\n📊 Status: ${ord.status}${ord.courier?`\n🚚 Kurir: ${ord.courier}`:""}${ord.resi?`\n📋 Resi: ${ord.resi}`:""}\n\nTerima kasih sudah belanja di BukuKiddo! 📚`);
            return (
              <div key={ord.id} style={{background:"#fff",borderRadius:16,padding:"20px",marginBottom:14,border:`2px solid ${C.border}`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12,flexWrap:"wrap",gap:8}}>
                  <div>
                    <div style={{fontFamily:FF.display,fontSize:"1.1rem",color:C.text}}>{ord.id}</div>
                    <div style={{fontSize:"0.8rem",color:C.muted}}>{ord.form?.f?.name} · {ord.form?.f?.phone} · {ord.form?.f?.city}</div>
                    <div style={{fontSize:"0.78rem",color:C.muted}}>{new Date(ord.date).toLocaleString("id-ID")}</div>
                  </div>
                  <StatusPill s={ord.status}/>
                </div>
                <div style={{background:C.bg,borderRadius:10,padding:"10px 14px",marginBottom:12,fontSize:"0.84rem"}}>
                  {ord.cart.map(({product:p,qty},ci)=>(
                    <div key={ci} style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                      <span>{p.emoji||"📗"} {p.name} <span style={{color:C.muted}}>×{qty}</span></span>
                      <span style={{fontWeight:700}}>{fmt(p.price*qty)}</span>
                    </div>
                  ))}
                  <div style={{borderTop:`1px solid ${C.border}`,marginTop:6,paddingTop:6}}>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.84rem",color:C.muted,marginBottom:3}}>
                      <span>Ongkos Kirim</span>
                      <span style={{color:ord.ongkir?C.text:C.warn}}>{ord.ongkir?fmt(ord.ongkir):"⚠️ Belum diisi"}</span>
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between",fontWeight:800,color:C.orange,fontSize:"0.9rem"}}>
                      <span>Total</span><span>{fmt(ord.total)}</span>
                    </div>
                  </div>
                </div>
                <div style={{fontSize:"0.8rem",color:C.muted,marginBottom:10}}>
                  💳 {ord.form?.f?.payment==="transfer"?"Transfer Bank":"QRIS"} · 🚚 Kurir: <strong>{ord.courier||<span style={{color:C.warn}}>Belum ditentukan</span>}</strong> · 📍 {ord.form?.f?.address}, {ord.form?.f?.city}
                </div>
                <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
                  <select value={ord.status} onChange={e=>updOrder(ord.id,{status:e.target.value})}
                    style={{padding:"8px 12px",borderRadius:10,border:`2px solid ${C.border}`,fontFamily:FF.body,fontSize:"0.85rem",cursor:"pointer",background:"#fff"}}>
                    {STATUSES.map(s=><option key={s}>{s}</option>)}
                  </select>
                  <select value={ord.courier||""} onChange={e=>updOrder(ord.id,{courier:e.target.value})}
                    style={{padding:"8px 12px",borderRadius:10,border:`2px solid ${ord.courier?C.border:C.warn}`,fontFamily:FF.body,fontSize:"0.85rem",cursor:"pointer",background:ord.courier?"#fff":"#FFFBF0"}}>
                    <option value="">🚚 Pilih Kurir...</option>
                    {COURIERS.map(c=><option key={c}>{c}</option>)}
                  </select>
                  <input defaultValue={ord.ongkir||""} placeholder="💰 Ongkir (Rp)..." onBlur={e=>updOrder(ord.id,{ongkir:e.target.value})}
                    style={{width:130,padding:"8px 12px",borderRadius:10,border:`2px solid ${ord.ongkir?C.border:C.warn}`,fontFamily:FF.body,fontSize:"0.85rem",background:ord.ongkir?"#fff":"#FFFBF0"}}/>
                  <input defaultValue={ord.resi||""} placeholder="✏️ Nomor resi..." onBlur={e=>updOrder(ord.id,{resi:e.target.value})}
                    style={{flex:1,padding:"8px 12px",borderRadius:10,border:`2px solid ${C.border}`,fontFamily:FF.body,fontSize:"0.85rem",minWidth:160}}/>
                  <a href={`https://wa.me/${buyerPhone}?text=${waUpdate}`} target="_blank" rel="noreferrer"
                    style={{background:"#25D366",color:"#fff",borderRadius:10,padding:"8px 14px",textDecoration:"none",fontFamily:FF.body,fontWeight:700,fontSize:"0.82rem",whiteSpace:"nowrap"}}>
                    📱 WA Buyer
                  </a>
                </div>
              </div>
            );
          })
        )}
        {/* PRODUCTS */}
        {tab==="products"&&(
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))",gap:14}}>
            {products.length===0&&<div style={{gridColumn:"1/-1",textAlign:"center",padding:"60px",color:C.muted}}><div style={{fontSize:"4rem"}}>📭</div><p style={{fontFamily:FF.display,fontSize:"1.2rem",marginTop:12}}>Belum ada produk. Tambahkan lewat tab ➕ Tambah Produk</p></div>}
            {products.map(p=>(
              <div key={p.id} style={{background:"#fff",borderRadius:14,padding:"16px",border:`2px solid ${C.border}`}}>
                <div style={{display:"flex",gap:12,alignItems:"flex-start",marginBottom:10}}>
                  <div style={{fontSize:"2.4rem",background:C.poBg,borderRadius:10,padding:"8px",lineHeight:1,flexShrink:0}}>{p.emoji||"📗"}</div>
                  <div style={{flex:1}}>
                    <div style={{fontFamily:FF.display,fontSize:"0.92rem",color:C.text,lineHeight:1.3,marginBottom:4}}>{p.name}</div>
                    <Badge type={p.status}/>
                  </div>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{fontFamily:FF.display,fontSize:"1.1rem",color:C.orange}}>{fmt(p.price)}</div>
                  <button onClick={()=>delProd(p.id)} style={{background:"#fff0f0",color:"#e74c3c",border:"1.5px solid #fcc",borderRadius:10,padding:"5px 12px",cursor:"pointer",fontFamily:FF.body,fontWeight:700,fontSize:"0.78rem"}}>🗑️ Hapus</button>
                </div>
                {p.status==="preorder"&&p.deadline&&<div style={{fontSize:"0.73rem",color:C.po,marginTop:6}}>Deadline: {new Date(p.deadline).toLocaleDateString("id-ID",{dateStyle:"medium"})}</div>}
                {p.status==="ready"&&<div style={{fontSize:"0.73rem",color:C.muted,marginTop:6}}>Stok: {p.stock||"∞"} · {p.origin||""}</div>}
              </div>
            ))}
          </div>
        )}
        {/* ADD PRODUCT */}
        {tab==="add"&&(
          <div style={{maxWidth:640,background:"#fff",borderRadius:16,padding:"24px",border:`2px solid ${C.border}`}}>
            <h3 style={{fontFamily:FF.display,color:C.text,margin:"0 0 20px"}}>➕ Tambah Produk Baru</h3>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              {[["name","Nama Buku *","text","Judul buku..."],["emoji","Emoji Cover","text","📗"],["price","Harga (Rp) *","number","75000"],["category","Kategori","text","Petualangan"],["origin","Asal Pengiriman","text","Jakarta"],["age","Usia Pembaca","text","5–9 tahun"],["pages","Jumlah Halaman","number","100"],["weight","Berat","text","300g"]].map(([k,l,type,ph])=>(
                <div key={k} style={{gridColumn:k==="name"?"1/-1":undefined}}>
                  <label style={{display:"block",fontSize:"0.8rem",fontWeight:700,color:C.text,marginBottom:4}}>{l}</label>
                  <input type={type} placeholder={ph} value={np[k]} onChange={e=>setnp(k,e.target.value)}
                    style={{width:"100%",padding:"10px 12px",borderRadius:10,border:`2px solid ${C.border}`,fontFamily:FF.body,fontSize:"0.88rem",boxSizing:"border-box",outline:"none"}}/>
                </div>
              ))}
            </div>
            <div style={{marginTop:12}}>
              <label style={{display:"block",fontSize:"0.8rem",fontWeight:700,color:C.text,marginBottom:4}}>Deskripsi</label>
              <textarea value={np.desc} onChange={e=>setnp("desc",e.target.value)} rows={3} placeholder="Deskripsi singkat buku..."
                style={{width:"100%",padding:"10px 12px",borderRadius:10,border:`2px solid ${C.border}`,fontFamily:FF.body,fontSize:"0.88rem",boxSizing:"border-box",resize:"none",outline:"none"}}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginTop:12}}>
              <div>
                <label style={{display:"block",fontSize:"0.8rem",fontWeight:700,color:C.text,marginBottom:4}}>Status</label>
                <select value={np.status} onChange={e=>setnp("status",e.target.value)} style={{width:"100%",padding:"10px 12px",borderRadius:10,border:`2px solid ${C.border}`,fontFamily:FF.body,fontSize:"0.88rem"}}>
                  <option value="ready">✅ Ready Stock</option>
                  <option value="preorder">⏳ Pre-Order</option>
                </select>
              </div>
              {np.status==="ready"&&(
                <div>
                  <label style={{display:"block",fontSize:"0.8rem",fontWeight:700,color:C.text,marginBottom:4}}>Jumlah Stok</label>
                  <input type="number" value={np.stock} onChange={e=>setnp("stock",e.target.value)} placeholder="0"
                    style={{width:"100%",padding:"10px 12px",borderRadius:10,border:`2px solid ${C.border}`,fontFamily:FF.body,fontSize:"0.88rem",boxSizing:"border-box"}}/>
                </div>
              )}
              {np.status==="preorder"&&(
                <div>
                  <label style={{display:"block",fontSize:"0.8rem",fontWeight:700,color:C.text,marginBottom:4}}>Deadline Pre-Order</label>
                  <input type="datetime-local" value={np.deadline} onChange={e=>setnp("deadline",e.target.value)}
                    style={{width:"100%",padding:"10px 12px",borderRadius:10,border:`2px solid ${C.border}`,fontFamily:FF.body,fontSize:"0.88rem",boxSizing:"border-box"}}/>
                </div>
              )}
            </div>
            <button onClick={addProd} style={{width:"100%",background:C.orange,color:"#fff",border:"none",borderRadius:20,padding:"14px",fontFamily:FF.display,fontSize:"1.1rem",cursor:"pointer",marginTop:20}}>
              ➕ Tambahkan Produk
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [view,setView]           = useState("home");
  const [products,setProducts]   = useState([]);
  const [loading,setLoading]     = useState(true);
  const [cart,setCart]           = useState([]);
  const [selected,setSelected]   = useState(null);
  const [currentOrder,setCurOrd] = useState(null);
  const [auth,setAuth]           = useState(false);
  const [filter,setFilter]       = useState("all");
  const [search,setSearch]       = useState("");

  useEffect(()=>{ fetchProducts(); },[]);

  const fetchProducts = async () => {
    setLoading(true);
    const {data} = await supabase.from("products").select("*").order("created_at",{ascending:false});
    if(data) setProducts(data.map(mapProduct));
    setLoading(false);
  };

  const addToCart = (product,qty)=>setCart(c=>{
    const ex=c.find(i=>i.product.id===product.id);
    return ex?c.map(i=>i.product.id===product.id?{...i,qty:i.qty+qty}:i):[...c,{product,qty}];
  });

  const placeOrder = async ({f,cart,sub,total})=>{
    const id=genId();
    const payload={ id, buyer_name:f.name, buyer_phone:f.phone, buyer_address:f.address, buyer_city:f.city, payment:f.payment, notes:f.notes, cart, sub, ongkir:0, total, status:"Menunggu Pembayaran" };
    const {error} = await supabase.from("orders").insert([payload]);
    if(error){ alert("Gagal membuat pesanan: "+error.message); return; }
    setCurOrd(mapOrder({...payload,created_at:new Date().toISOString()}));
    setCart([]);
    setView("payment");
  };

  const cartCount = cart.reduce((s,i)=>s+i.qty,0);

  return (
    <>
      {view==="home"     && <HomePage     products={products} loading={loading} cart={cart} setView={setView} setSelected={setSelected} filter={filter} setFilter={setFilter} search={search} setSearch={setSearch}/>}
      {view==="product"  && selected      && <ProductPage  product={selected} onAdd={addToCart} setView={setView} cart={cart}/>}
      {view==="cart"     && <CartPage     cart={cart} setCart={setCart} setView={setView}/>}
      {view==="checkout" && <CheckoutPage cart={cart} setView={setView} onPlace={placeOrder}/>}
      {view==="payment"  && currentOrder  && <PaymentPage  order={currentOrder} setView={setView}/>}
      {view==="track"    && <TrackPage    setView={setView}/>}
      {view==="admin"    && <AdminPage    products={products} fetchProducts={fetchProducts} setView={setView} auth={auth} setAuth={setAuth}/>}
    </>
  );
}
