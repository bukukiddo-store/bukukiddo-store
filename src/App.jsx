import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://kvjjchtormcchtucdnmz.supabase.co",
  "sb_publishable_vAY5Tqx5mZ-1EOqfd2AQHw_Ypc7kQog"
);

const C={orange:"#E8612A",orangeL:"#FF8F5E",bg:"#FFF9F4",text:"#2A1A0E",muted:"#9B8577",border:"#FFE0CC",yellow:"#FFD166",yellowL:"#FFF5D6",po:"#E8612A",poBg:"#FFF0E8",rs:"#1DB87A",rsBg:"#E6FAF6",warn:"#F59E0B",mint:"#3ECFB2"};
const FF={display:"'Fredoka One',cursive",body:"'Nunito',sans-serif"};
const fmt=(n)=>"Rp "+Number(n).toLocaleString("id-ID");
const genId=()=>"BK"+Date.now().toString(36).toUpperCase().slice(-8);
const COURIERS=["JNE","J&T Express","SiCepat","Anteraja","Ninja Xpress"];
const STATUSES=["Menunggu Pembayaran","Pembayaran Dikonfirmasi","Diproses","Dikirim","Selesai"];
const WA="6281234567890";
const ADMIN_PASS="bukukiddo2025";
const MAX_IMG=7;
const SESSION_KEY="bukukiddo_buyer";
const COURIER_URLS={"JNE":"https://www.jne.co.id/id/tracking/trace?awb=","J&T Express":"https://jet.co.id/track?awb=","SiCepat":"https://sicepat.com/checkAwb?awb=","Anteraja":"https://anteraja.id/tracking?awb=","Ninja Xpress":"https://www.ninjaxpress.co/id-id/tracking?id="};

const hashPassword=async(pw)=>{const buf=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(pw));return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,"0")).join("");};
const normalizePhone=(p)=>p.trim().replace(/\D/g,"").replace(/^0/,"62");
const mapProduct=(p)=>({...p,desc:p.description,preview_images:p.preview_images||[]});
const uploadImage=async(file,path)=>{const{error}=await supabase.storage.from("book-previews").upload(path,file,{upsert:true});if(error)throw error;const{data}=supabase.storage.from("book-previews").getPublicUrl(path);return data.publicUrl;};
const deleteImage=async(url)=>{try{const p=url.split("/book-previews/")[1];if(p)await supabase.storage.from("book-previews").remove([p]);}catch(e){}};

function Badge({type}){const po=type==="preorder";return <span style={{background:po?C.poBg:C.rsBg,color:po?C.po:C.rs,border:`1.5px solid ${po?C.po:C.rs}`,borderRadius:20,padding:"3px 11px",fontSize:"0.7rem",fontWeight:800,fontFamily:FF.body,textTransform:"uppercase",whiteSpace:"nowrap"}}>{po?"⏳ Pre-Order":"✅ Ready Stock"}</span>;}
function StatusPill({s}){const map={"Menunggu Pembayaran":["#FFF3E0","#E65100"],"Pembayaran Dikonfirmasi":["#E8F5E9","#1B5E20"],"Diproses":["#E3F2FD","#0D47A1"],"Dikirim":["#F3E5F5","#6A1B9A"],"Selesai":[C.rsBg,C.rs]};const[bg,col]=map[s]||[C.bg,C.muted];return <span style={{background:bg,color:col,borderRadius:20,padding:"4px 12px",fontSize:"0.75rem",fontWeight:800,fontFamily:FF.body}}>{s}</span>;}
function Countdown({deadline}){const[t,setT]=useState({d:0,h:0,m:0,s:0});useEffect(()=>{const tick=()=>{const diff=new Date(deadline)-new Date();if(diff<=0)return setT({d:0,h:0,m:0,s:0});setT({d:Math.floor(diff/864e5),h:Math.floor(diff%864e5/36e5),m:Math.floor(diff%36e5/6e4),s:Math.floor(diff%6e4/1000)});};tick();const id=setInterval(tick,1000);return()=>clearInterval(id);},[deadline]);return <div style={{display:"flex",gap:6}}>{[["d","Hari"],["h","Jam"],["m","Mnt"],["s","Dtk"]].map(([k,l])=>(<div key={k} style={{textAlign:"center"}}><div style={{background:C.orange,color:"#fff",borderRadius:8,padding:"5px 8px",fontFamily:FF.display,fontSize:"1rem",minWidth:36}}>{String(t[k]).padStart(2,"0")}</div><div style={{fontSize:"0.62rem",color:C.muted,marginTop:2}}>{l}</div></div>))}</div>;}
function Card({title,children}){return <div style={{background:"#fff",borderRadius:16,padding:"20px",marginBottom:16,border:`2px solid ${C.border}`}}><h3 style={{fontFamily:FF.display,color:C.text,margin:"0 0 16px",fontSize:"1.05rem"}}>{title}</h3>{children}</div>;}

function Nav({setView,cartCount,back,backLabel,buyer,onLogout}){
  return(<nav style={{background:"#fff",borderBottom:`3px solid ${C.yellow}`,padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100,boxShadow:"0 2px 16px rgba(232,97,42,0.07)"}}>
    <button onClick={()=>setView(back||"home")} style={{background:"none",border:"none",cursor:"pointer",fontFamily:FF.display,fontSize:"1.2rem",color:C.orange}}>{back?"←":"📚"} {backLabel||"BukuKiddo"}</button>
    <div style={{display:"flex",gap:6,alignItems:"center"}}>
      {buyer?(<>
        <button onClick={()=>setView("dashboard")} style={{background:C.poBg,border:`2px solid ${C.orange}`,borderRadius:20,padding:"6px 12px",color:C.orange,cursor:"pointer",fontFamily:FF.body,fontWeight:800,fontSize:"0.8rem"}}>📦 Pesananku</button>
        <div style={{display:"flex",alignItems:"center",gap:6,background:C.bg,border:`2px solid ${C.border}`,borderRadius:20,padding:"5px 10px",cursor:"pointer"}} onClick={onLogout}>
          <div style={{width:24,height:24,borderRadius:"50%",background:C.orange,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.8rem",color:"#fff",fontWeight:800}}>{buyer.name[0].toUpperCase()}</div>
          <span style={{fontSize:"0.78rem",fontWeight:700,color:C.text,maxWidth:70,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{buyer.name.split(" ")[0]}</span>
          <span style={{fontSize:"0.68rem",color:C.muted}}>↩</span>
        </div>
      </>):(
        <button onClick={()=>setView("auth")} style={{background:"none",border:`2px solid ${C.border}`,borderRadius:20,padding:"6px 12px",color:C.muted,cursor:"pointer",fontFamily:FF.body,fontWeight:700,fontSize:"0.8rem"}}>👤 Masuk</button>
      )}
      <button onClick={()=>setView("admin")} style={{background:"none",border:`2px solid ${C.border}`,borderRadius:20,padding:"6px 10px",color:C.muted,cursor:"pointer",fontFamily:FF.body,fontWeight:700,fontSize:"0.8rem"}}>⚙️</button>
      <button onClick={()=>setView("cart")} style={{background:C.orange,color:"#fff",border:"none",borderRadius:20,padding:"8px 14px",cursor:"pointer",fontFamily:FF.display,fontSize:"1rem",display:"flex",alignItems:"center",gap:5}}>🛒{cartCount>0&&<span style={{background:C.yellow,color:C.text,borderRadius:10,padding:"1px 6px",fontSize:"0.75rem",fontWeight:800}}>{cartCount}</span>}</button>
    </div>
  </nav>);
}

function BuyerAuth({setView,onLogin,hasCart}){
  const[mode,setMode]=useState("login");
  const[form,setForm]=useState({name:"",phone:"",password:"",confirm:""});
  const[loading,setLoading]=useState(false);
  const[showPw,setShowPw]=useState(false);
  const[err,setErr]=useState("");
  const set=(k,v)=>{setForm(x=>({...x,[k]:v}));setErr("");};

  const doLogin=async()=>{
    if(!form.phone||!form.password)return setErr("Nomor WA dan password wajib diisi");
    setLoading(true);
    const hash=await hashPassword(form.password);
    const phone=normalizePhone(form.phone);
    const alt="0"+phone.slice(2);
    const{data}=await supabase.from("buyers").select("*").or(`phone.eq.${phone},phone.eq.${alt},phone.eq.${form.phone.trim()}`).eq("password_hash",hash).maybeSingle();
    setLoading(false);
    if(!data)return setErr("Nomor WA atau password salah.");
    onLogin({id:data.id,name:data.name,phone:data.phone});
    setView(hasCart?"checkout":"dashboard");
  };

  const doRegister=async()=>{
    if(!form.name.trim())return setErr("Nama lengkap wajib diisi");
    if(!form.phone.trim())return setErr("Nomor WhatsApp wajib diisi");
    if(form.password.length<6)return setErr("Password minimal 6 karakter");
    if(form.password!==form.confirm)return setErr("Password tidak cocok");
    setLoading(true);
    const phone=normalizePhone(form.phone);
    const{data:exist}=await supabase.from("buyers").select("id").or(`phone.eq.${phone},phone.eq.0${phone.slice(2)}`).maybeSingle();
    if(exist){setLoading(false);return setErr("Nomor WA ini sudah terdaftar. Silakan login.");}
    const hash=await hashPassword(form.password);
    const{data,error}=await supabase.from("buyers").insert([{name:form.name.trim(),phone,password_hash:hash}]).select().maybeSingle();
    setLoading(false);
    if(error)return setErr("Gagal mendaftar: "+error.message);
    onLogin({id:data.id,name:data.name,phone:data.phone});
    setView(hasCart?"checkout":"dashboard");
  };

  return(
    <div style={{fontFamily:FF.body,background:C.bg,minHeight:"100vh",display:"flex",flexDirection:"column"}}>
      <nav style={{background:"#fff",borderBottom:`3px solid ${C.yellow}`,padding:"12px 20px",display:"flex",alignItems:"center",gap:12}}>
        <button onClick={()=>setView("home")} style={{background:"none",border:"none",cursor:"pointer",fontFamily:FF.display,fontSize:"1.2rem",color:C.orange}}>←</button>
        <span style={{fontFamily:FF.display,fontSize:"1.2rem",color:C.text}}>👤 {mode==="login"?"Masuk":"Daftar Akun"}</span>
      </nav>
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"24px 20px"}}>
        <div style={{width:"100%",maxWidth:400}}>
          <div style={{textAlign:"center",marginBottom:24}}>
            <div style={{fontSize:"3.5rem",marginBottom:6}}>📚</div>
            <h2 style={{fontFamily:FF.display,color:C.orange,margin:"0 0 4px",fontSize:"1.8rem"}}>BukuKiddo</h2>
            <p style={{color:C.muted,fontSize:"0.88rem",margin:0}}>{mode==="login"?"Masuk ke akun kamu":"Buat akun baru gratis"}</p>
          </div>
          {hasCart&&<div style={{background:C.rsBg,border:`2px solid ${C.rs}30`,borderRadius:12,padding:"12px 14px",marginBottom:16,display:"flex",gap:8,alignItems:"center"}}>
            <span style={{fontSize:"1.2rem",flexShrink:0}}>🛒</span>
            <p style={{margin:0,fontSize:"0.82rem",color:"#0f6e5a",fontWeight:700,lineHeight:1.5}}>Kamu punya item di keranjang! Login atau daftar dulu untuk melanjutkan checkout.</p>
          </div>}
          <div style={{display:"flex",background:"#fff",borderRadius:20,border:`2px solid ${C.border}`,padding:4,marginBottom:20}}>
            {[["login","Masuk"],["register","Daftar"]].map(([m,l])=>(<button key={m} onClick={()=>{setMode(m);setErr("");setForm({name:"",phone:"",password:"",confirm:""}); }} style={{flex:1,padding:"9px",borderRadius:16,border:"none",background:mode===m?C.orange:"transparent",color:mode===m?"#fff":C.muted,fontFamily:FF.display,fontSize:"0.95rem",cursor:"pointer"}}>{l}</button>))}
          </div>
          <div style={{background:"#fff",borderRadius:20,padding:"24px",border:`2px solid ${C.border}`,boxShadow:"0 4px 24px rgba(232,97,42,0.07)"}}>
            {mode==="register"&&(<div style={{marginBottom:14}}><label style={{display:"block",fontSize:"0.82rem",fontWeight:700,color:C.text,marginBottom:5}}>👤 Nama Lengkap</label><input value={form.name} onChange={e=>set("name",e.target.value)} placeholder="Nama kamu" style={{width:"100%",padding:"11px 14px",borderRadius:10,border:`2px solid ${C.border}`,fontSize:"0.92rem",fontFamily:FF.body,boxSizing:"border-box",outline:"none"}}/></div>)}
            <div style={{marginBottom:14}}><label style={{display:"block",fontSize:"0.82rem",fontWeight:700,color:C.text,marginBottom:5}}>📱 Nomor WhatsApp</label><input value={form.phone} onChange={e=>set("phone",e.target.value)} placeholder="08xxxxxxxxxx" type="tel" style={{width:"100%",padding:"11px 14px",borderRadius:10,border:`2px solid ${C.border}`,fontSize:"0.92rem",fontFamily:FF.body,boxSizing:"border-box",outline:"none"}}/></div>
            <div style={{marginBottom:mode==="register"?14:20,position:"relative"}}>
              <label style={{display:"block",fontSize:"0.82rem",fontWeight:700,color:C.text,marginBottom:5}}>🔒 Password</label>
              <div style={{position:"relative"}}>
                <input value={form.password} onChange={e=>set("password",e.target.value)} onKeyDown={e=>e.key==="Enter"&&mode==="login"&&doLogin()} placeholder={mode==="register"?"Minimal 6 karakter":"Password kamu"} type={showPw?"text":"password"} style={{width:"100%",padding:"11px 44px 11px 14px",borderRadius:10,border:`2px solid ${C.border}`,fontSize:"0.92rem",fontFamily:FF.body,boxSizing:"border-box",outline:"none"}}/>
                <button onClick={()=>setShowPw(v=>!v)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",fontSize:"1.1rem",color:C.muted}}>{showPw?"🙈":"👁️"}</button>
              </div>
            </div>
            {mode==="register"&&(<div style={{marginBottom:20}}><label style={{display:"block",fontSize:"0.82rem",fontWeight:700,color:C.text,marginBottom:5}}>🔒 Konfirmasi Password</label><input value={form.confirm} onChange={e=>set("confirm",e.target.value)} placeholder="Ulangi password" type={showPw?"text":"password"} style={{width:"100%",padding:"11px 14px",borderRadius:10,border:`2px solid ${form.confirm&&form.confirm!==form.password?"#e74c3c":C.border}`,fontSize:"0.92rem",fontFamily:FF.body,boxSizing:"border-box",outline:"none"}}/>{form.confirm&&form.confirm!==form.password&&<p style={{fontSize:"0.75rem",color:"#e74c3c",margin:"4px 0 0"}}>Password tidak cocok</p>}</div>)}
            {err&&<div style={{background:"#FFF0F0",border:"2px solid #fcc",borderRadius:10,padding:"10px 14px",marginBottom:14,fontSize:"0.83rem",color:"#c0392b",fontWeight:700}}>⚠️ {err}</div>}
            <button onClick={mode==="login"?doLogin:doRegister} disabled={loading} style={{width:"100%",background:loading?"#ccc":C.orange,color:"#fff",border:"none",borderRadius:20,padding:"14px",fontFamily:FF.display,fontSize:"1.1rem",cursor:loading?"not-allowed":"pointer"}}>
              {loading?"⏳ Memproses...":(mode==="login"?"Masuk ke Akun 🚀":"Buat Akun Gratis ✨")}
            </button>
          </div>
          {mode==="register"&&(<div style={{background:"#E6FAF6",border:"2px solid #3ECFB240",borderRadius:12,padding:"12px 16px",marginTop:14}}><p style={{margin:0,fontSize:"0.8rem",color:"#0f6e5a",lineHeight:1.6}}>🔐 Password disimpan terenkripsi (SHA-256). Kami tidak menyimpan password asli kamu.</p></div>)}
          <p style={{textAlign:"center",fontSize:"0.83rem",color:C.muted,margin:"16px 0 0"}}>
            {mode==="login"?"Belum punya akun? ":"Sudah punya akun? "}
            <button onClick={()=>{setMode(mode==="login"?"register":"login");setErr("");}} style={{background:"none",border:"none",color:C.orange,fontWeight:800,cursor:"pointer",fontFamily:FF.body,fontSize:"0.83rem"}}>{mode==="login"?"Daftar sekarang →":"Masuk →"}</button>
          </p>
        </div>
      </div>
    </div>
  );
}

function ImageGallery({images,emoji}){
  const[active,setActive]=useState(0);
  if(!images||images.length===0)return <div style={{background:"linear-gradient(135deg,#FFF0E4,#FFF5D6)",borderRadius:20,height:380,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"9rem",border:`2px solid ${C.border}`}}>{emoji||"📗"}</div>;
  return(<div>
    <div style={{position:"relative",borderRadius:20,overflow:"hidden",border:`2px solid ${C.border}`,marginBottom:12,background:"#f9f9f9"}}>
      <img src={images[active]} alt="" style={{width:"100%",height:380,objectFit:"cover",display:"block"}}/>
      {images.length>1&&<>
        <button onClick={()=>setActive(a=>(a-1+images.length)%images.length)} style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",background:"rgba(0,0,0,0.4)",color:"#fff",border:"none",borderRadius:"50%",width:36,height:36,fontSize:"1.2rem",cursor:"pointer"}}>&#8249;</button>
        <button onClick={()=>setActive(a=>(a+1)%images.length)} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"rgba(0,0,0,0.4)",color:"#fff",border:"none",borderRadius:"50%",width:36,height:36,fontSize:"1.2rem",cursor:"pointer"}}>&#8250;</button>
        <div style={{position:"absolute",bottom:10,left:"50%",transform:"translateX(-50%)",background:"rgba(0,0,0,0.45)",color:"#fff",borderRadius:20,padding:"3px 10px",fontSize:"0.75rem",fontWeight:700}}>{active+1}/{images.length}</div>
      </>}
    </div>
    {images.length>1&&<div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:4}}>{images.map((img,i)=>(<div key={i} onClick={()=>setActive(i)} style={{flexShrink:0,width:72,height:72,borderRadius:10,overflow:"hidden",border:`2.5px solid ${active===i?C.orange:C.border}`,cursor:"pointer"}}><img src={img} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/></div>))}</div>}
  </div>);
}

function ImageUploader({images,setImages,productId,uploading,setUploading}){
  const ref=useRef();
  const handleFiles=async(files)=>{const rem=MAX_IMG-images.length;if(rem<=0)return alert("Maks "+MAX_IMG+" gambar");const toUp=Array.from(files).slice(0,rem);setUploading(true);try{const pid=productId||"temp_"+Date.now();const urls=await Promise.all(toUp.map(f=>uploadImage(f,pid+"/"+Date.now()+"_"+f.name)));setImages(p=>[...p,...urls]);}catch(e){alert("Gagal upload: "+e.message);}setUploading(false);};
  const remove=async(idx)=>{if(!window.confirm("Hapus gambar?"))return;await deleteImage(images[idx]);setImages(p=>p.filter((_,i)=>i!==idx));};
  return(<div>
    <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><label style={{fontSize:"0.8rem",fontWeight:700,color:C.text}}>📸 Preview Isi Buku</label><span style={{fontSize:"0.75rem",color:C.muted,fontWeight:700}}>{images.length}/{MAX_IMG} foto</span></div>
    {images.length>0&&<div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:10}}>{images.map((url,i)=>(<div key={i} style={{position:"relative",aspectRatio:"1",borderRadius:10,overflow:"hidden",border:`2px solid ${C.border}`}}><img src={url} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/><button onClick={()=>remove(i)} style={{position:"absolute",top:3,right:3,background:"rgba(231,76,60,0.9)",color:"#fff",border:"none",borderRadius:"50%",width:22,height:22,fontSize:"0.7rem",cursor:"pointer"}}>&#x2715;</button>{i===0&&<div style={{position:"absolute",bottom:3,left:3,background:"rgba(232,97,42,0.85)",color:"#fff",borderRadius:6,padding:"1px 5px",fontSize:"0.6rem",fontWeight:800}}>Cover</div>}</div>))}</div>}
    {images.length<MAX_IMG&&<div onClick={()=>!uploading&&ref.current.click()} style={{border:`2px dashed ${uploading?C.mint:C.border}`,borderRadius:12,padding:"16px",textAlign:"center",cursor:uploading?"not-allowed":"pointer",background:uploading?"#E6FAF6":"#fafafa"}}><input ref={ref} type="file" accept="image/*" multiple style={{display:"none"}} onChange={e=>handleFiles(e.target.files)}/>{uploading?<><div style={{fontSize:"1.8rem"}}>&#x23F3;</div><p style={{margin:"4px 0 0",fontSize:"0.82rem",color:C.mint,fontWeight:700}}>Mengupload...</p></>:<><div style={{fontSize:"1.8rem"}}>&#x1F4F7;</div><p style={{margin:"4px 0 0",fontSize:"0.82rem",color:C.muted,fontWeight:700}}>Tap untuk pilih foto</p><p style={{margin:"4px 0 0",fontSize:"0.72rem",color:C.muted}}>Sisa: {MAX_IMG-images.length} slot</p></>}</div>}
  </div>);
}

function HomePage({products,loading,cart,setView,setSelected,filter,setFilter,search,setSearch,buyer,onLogout}){
  const cartCount=cart.reduce((s,i)=>s+i.qty,0);
  const filtered=products.filter(p=>{const mf=filter==="all"||p.status===filter;const ms=p.name.toLowerCase().includes(search.toLowerCase())||(p.category||"").toLowerCase().includes(search.toLowerCase());return mf&&ms;});
  return(<div style={{fontFamily:FF.body,background:C.bg,minHeight:"100vh"}}>
    <Nav setView={setView} cartCount={cartCount} buyer={buyer} onLogout={onLogout}/>
    <div style={{background:"linear-gradient(135deg,#FFF0E4,#FFEBD0)",padding:"36px 20px 28px",textAlign:"center"}}>
      <div style={{fontSize:"5rem",marginBottom:4}}>&#x1F4DA;</div>
      <h1 style={{fontFamily:FF.display,fontSize:"2.2rem",color:C.orange,margin:"0 0 6px"}}>BukuKiddo &#x1F4DA;</h1>
      <p style={{color:C.muted,fontSize:"1rem",fontWeight:700,margin:"0 0 22px"}}>Teman Baca Terbaik untuk Si Kecil yang Penasaran!</p>
      <div style={{maxWidth:400,margin:"0 auto"}}><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="&#x1F50D;  Cari judul atau kategori buku..." style={{width:"100%",padding:"13px 20px",borderRadius:30,border:`2.5px solid ${C.border}`,fontSize:"0.92rem",fontFamily:FF.body,outline:"none",boxSizing:"border-box",background:"#fff",boxShadow:"0 4px 20px rgba(232,97,42,0.1)"}}/></div>
    </div>
    <div style={{padding:"18px 20px 4px",display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap"}}>
      {[["all","&#x1F4DA; Semua"],["preorder","&#x23F3; Pre-Order"],["ready","&#x2705; Ready Stock"]].map(([v,l])=>(<button key={v} onClick={()=>setFilter(v)} style={{padding:"8px 18px",borderRadius:20,cursor:"pointer",fontFamily:FF.body,fontWeight:700,fontSize:"0.88rem",background:filter===v?C.orange:"#fff",color:filter===v?"#fff":C.muted,border:`2px solid ${filter===v?C.orange:C.border}`}} dangerouslySetInnerHTML={{__html:l}}/>))}
    </div>
    {loading&&<div style={{textAlign:"center",padding:"60px",color:C.muted}}><div style={{fontSize:"3rem"}}>&#x23F3;</div><p style={{fontFamily:FF.display,fontSize:"1.2rem",marginTop:12}}>Memuat produk...</p></div>}
    {!loading&&<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))",gap:18,padding:"16px 20px 48px",maxWidth:1120,margin:"0 auto"}}>
      {filtered.map(p=>{const cover=p.preview_images&&p.preview_images.length>0?p.preview_images[0]:null;return(
        <div key={p.id} onClick={()=>{setSelected(p);setView("product");}} style={{background:"#fff",borderRadius:18,overflow:"hidden",border:`2px solid ${C.border}`,cursor:"pointer",transition:"transform .2s,box-shadow .2s",boxShadow:"0 2px 12px rgba(232,97,42,0.05)"}} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-5px)";e.currentTarget.style.boxShadow="0 10px 28px rgba(232,97,42,0.14)";}} onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="0 2px 12px rgba(232,97,42,0.05)";}}>
          <div style={{height:190,position:"relative",overflow:"hidden",background:"linear-gradient(135deg,#FFF0E4,#FFF5D6)"}}>
            {cover?<img src={cover} alt={p.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"5rem"}}>{p.emoji||"&#x1F4D7;"}</div>}
            <div style={{position:"absolute",top:10,left:10}}><Badge type={p.status}/></div>
            {p.preview_images&&p.preview_images.length>1&&<div style={{position:"absolute",bottom:8,right:8,background:"rgba(0,0,0,0.5)",color:"#fff",borderRadius:12,padding:"2px 8px",fontSize:"0.68rem",fontWeight:700}}>&#x1F4F8; {p.preview_images.length}</div>}
          </div>
          <div style={{padding:"14px 16px"}}>
            <div style={{fontSize:"0.72rem",color:C.muted,fontWeight:700,marginBottom:3,textTransform:"uppercase"}}>{p.category||"Umum"} &middot; {p.origin||""}</div>
            <h3 style={{fontFamily:FF.display,fontSize:"0.97rem",color:C.text,margin:"0 0 6px"}}>{p.name}</h3>
            <p style={{fontSize:"0.8rem",color:C.muted,margin:"0 0 10px",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{p.desc||""}</p>
            {p.status==="preorder"&&p.deadline&&<div style={{marginBottom:8}}><div style={{fontSize:"0.7rem",color:C.po,fontWeight:800,marginBottom:4}}>&#x23F0; Ditutup dalam:</div><Countdown deadline={p.deadline}/></div>}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:10}}>
              <div style={{fontFamily:FF.display,fontSize:"1.15rem",color:C.orange}}>{fmt(p.price)}</div>
              <div style={{fontSize:"0.73rem",color:C.muted}}>{p.status==="ready"?"Stok: "+(p.stock||"&#x221E;"):p.age||""}</div>
            </div>
          </div>
        </div>
      );})}
    </div>}
    {!loading&&filtered.length===0&&<div style={{textAlign:"center",padding:"60px",color:C.muted}}><div style={{fontSize:"4rem"}}>&#x1F4EB;</div><p style={{fontFamily:FF.display,fontSize:"1.3rem",margin:"12px 0 6px"}}>{products.length===0?"Belum ada produk":"Tidak ditemukan"}</p></div>}
    <footer style={{background:C.text,color:"#fff",padding:"28px 24px",textAlign:"center"}}><div style={{fontFamily:FF.display,fontSize:"1.4rem",marginBottom:6}}>&#x1F4DA; BukuKiddo</div><p style={{color:"#aaa",fontSize:"0.82rem",margin:"0 0 4px"}}>Pengiriman dari Jakarta &middot; Semarang &middot; Jawa Tengah</p><p style={{color:"#666",fontSize:"0.75rem",margin:0}}>&copy; 2025 BukuKiddo.</p></footer>
  </div>);
}

function ProductPage({product:p,onAdd,setView,cart,buyer,onLogout}){
  const[qty,setQty]=useState(1);const[added,setAdded]=useState(false);
  const cartCount=cart.reduce((s,i)=>s+i.qty,0);
  const doAdd=()=>{onAdd(p,qty);setAdded(true);setTimeout(()=>setAdded(false),2200);};
  return(<div style={{fontFamily:FF.body,background:C.bg,minHeight:"100vh"}}>
    <Nav setView={setView} cartCount={cartCount} back="home" backLabel="BukuKiddo" buyer={buyer} onLogout={onLogout}/>
    <div style={{maxWidth:900,margin:"0 auto",padding:"28px 20px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:36}}>
      <div>
        <ImageGallery images={p.preview_images||[]} emoji={p.emoji||"&#x1F4D7;"}/>
        {p.preview_images&&p.preview_images.length>0&&<div style={{background:C.poBg,borderRadius:10,padding:"8px 14px",marginTop:12,display:"flex",gap:8}}><span>&#x1F440;</span><p style={{margin:0,fontSize:"0.78rem",color:C.po,fontWeight:700}}>Preview Isi Buku &mdash; {p.preview_images.length} halaman sample</p></div>}
      </div>
      <div>
        <div style={{marginBottom:10}}><Badge type={p.status}/></div>
        <div style={{fontSize:"0.78rem",color:C.muted,fontWeight:700,textTransform:"uppercase",marginBottom:6}}>{p.category||"Umum"} &middot; Dikirim dari {p.origin||""}</div>
        <h1 style={{fontFamily:FF.display,fontSize:"1.7rem",color:C.text,margin:"0 0 10px"}}>{p.name}</h1>
        <div style={{fontFamily:FF.display,fontSize:"2rem",color:C.orange,marginBottom:14}}>{fmt(p.price)}</div>
        <p style={{color:C.muted,lineHeight:1.75,marginBottom:16,fontSize:"0.93rem"}}>{p.desc||""}</p>
        <div style={{background:C.bg,borderRadius:12,padding:"12px 16px",marginBottom:16,border:`2px solid ${C.border}`}}>
          {[["&#x1F4D6;","Halaman",(p.pages||"-")+" hal"],["&#x1F476;","Usia",p.age||"-"],["&#x1F4E6;","Berat",p.weight||"-"],["&#x1F4CD;","Asal",p.origin||"-"]].map(([icon,l,v])=>(<div key={l} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",fontSize:"0.86rem"}}><span style={{color:C.muted}} dangerouslySetInnerHTML={{__html:icon+" "+l}}/><span style={{fontWeight:800,color:C.text}}>{v}</span></div>))}
        </div>
        {p.status==="preorder"&&p.deadline&&<div style={{background:C.poBg,borderRadius:12,padding:"12px 16px",marginBottom:16,border:`2px solid ${C.po}30`}}><div style={{fontSize:"0.8rem",color:C.po,fontWeight:800,marginBottom:8}}>&#x23F0; Pre-Order Ditutup Dalam:</div><Countdown deadline={p.deadline}/></div>}
        {p.status==="ready"&&p.stock&&p.stock<=5&&<div style={{background:"#FFF3E0",borderRadius:12,padding:"10px 14px",marginBottom:14,border:"2px solid #FFC947"}}><span style={{color:"#E65100",fontWeight:800}}>&#x1F525; Stok tersisa {p.stock} pcs!</span></div>}
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,background:"#fff",border:`2px solid ${C.border}`,borderRadius:30,padding:"4px 8px"}}>
            <button onClick={()=>setQty(Math.max(1,qty-1))} style={{width:32,height:32,borderRadius:"50%",border:"none",background:C.bg,cursor:"pointer",fontSize:"1.2rem",fontWeight:800,color:C.orange}}>&#x2212;</button>
            <span style={{fontFamily:FF.display,fontSize:"1.1rem",minWidth:24,textAlign:"center"}}>{qty}</span>
            <button onClick={()=>setQty(qty+1)} style={{width:32,height:32,borderRadius:"50%",border:"none",background:C.orange,cursor:"pointer",fontSize:"1.1rem",fontWeight:800,color:"#fff"}}>&#x2B;</button>
          </div>
          <button onClick={doAdd} style={{flex:1,background:added?C.rs:C.orange,color:"#fff",border:"none",borderRadius:30,padding:"14px 20px",fontFamily:FF.display,fontSize:"1.05rem",cursor:"pointer",transition:"background .3s"}}>{added?"&#x2705; Ditambahkan!":"&#x1F6D2; Tambah ke Keranjang"}</button>
        </div>
        {added&&<div style={{background:C.rsBg,borderRadius:10,padding:"10px 14px",marginTop:10,textAlign:"center"}}><button onClick={()=>setView("cart")} style={{background:"none",border:"none",color:C.rs,fontFamily:FF.body,fontWeight:800,cursor:"pointer"}}>Lihat Keranjang &amp; Checkout &#x2192;</button></div>}
      </div>
    </div>
  </div>);
}

function CartPage({cart,setCart,setView,buyer,onLogout}){
  const total=cart.reduce((s,i)=>s+i.product.price*i.qty,0);const count=cart.reduce((s,i)=>s+i.qty,0);
  const upd=(id,d)=>setCart(c=>c.map(i=>i.product.id===id?{...i,qty:Math.max(1,i.qty+d)}:i));
  const del=(id)=>setCart(c=>c.filter(i=>i.product.id!==id));
  return(<div style={{fontFamily:FF.body,background:C.bg,minHeight:"100vh"}}>
    <nav style={{background:"#fff",borderBottom:`3px solid ${C.yellow}`,padding:"12px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100}}>
      <button onClick={()=>setView("home")} style={{background:"none",border:"none",cursor:"pointer",fontFamily:FF.display,fontSize:"1.2rem",color:C.orange}}>&#x2190; Lanjut Belanja</button>
      <span style={{fontFamily:FF.display,fontSize:"1.3rem",color:C.text}}>&#x1F6D2; Keranjang</span><div style={{width:80}}/>
    </nav>
    <div style={{maxWidth:680,margin:"0 auto",padding:"24px 20px"}}>
      {cart.length===0?(<div style={{textAlign:"center",padding:"80px 0",color:C.muted}}><div style={{fontSize:"5rem"}}>&#x1F6D2;</div><p style={{fontFamily:FF.display,fontSize:"1.4rem",margin:"14px 0 6px"}}>Keranjang Masih Kosong</p><button onClick={()=>setView("home")} style={{background:C.orange,color:"#fff",border:"none",borderRadius:20,padding:"12px 28px",fontFamily:FF.display,cursor:"pointer",marginTop:16}}>Lihat Buku</button></div>):(
        <>{cart.map(({product:p,qty})=>{const thumb=p.preview_images&&p.preview_images.length>0?p.preview_images[0]:null;return(
          <div key={p.id} style={{background:"#fff",borderRadius:16,padding:"16px",marginBottom:12,border:`2px solid ${C.border}`,display:"flex",gap:14,alignItems:"center"}}>
            <div style={{width:70,height:70,borderRadius:12,overflow:"hidden",flexShrink:0,border:`2px solid ${C.border}`,background:"linear-gradient(135deg,#FFF0E4,#FFF5D6)",display:"flex",alignItems:"center",justifyContent:"center"}}>{thumb?<img src={thumb} alt={p.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span style={{fontSize:"2.2rem"}}>{p.emoji||"&#x1F4D7;"}</span>}</div>
            <div style={{flex:1}}><div style={{fontFamily:FF.display,fontSize:"0.97rem",color:C.text,marginBottom:3}}>{p.name}</div><Badge type={p.status}/><div style={{fontFamily:FF.display,color:C.orange,marginTop:5}}>{fmt(p.price*qty)}</div></div>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <button onClick={()=>upd(p.id,-1)} style={{width:28,height:28,borderRadius:"50%",border:`2px solid ${C.border}`,background:"#fff",cursor:"pointer",fontWeight:700}}>&#x2212;</button>
                <span style={{fontWeight:800,minWidth:20,textAlign:"center",fontFamily:FF.display}}>{qty}</span>
                <button onClick={()=>upd(p.id,1)} style={{width:28,height:28,borderRadius:"50%",border:"none",background:C.orange,cursor:"pointer",fontWeight:700,color:"#fff"}}>&#x2B;</button>
              </div>
              <button onClick={()=>del(p.id)} style={{background:"none",border:"none",color:"#e74c3c",cursor:"pointer",fontSize:"0.78rem",fontWeight:700}}>&#x1F5D1;&#xFE0F; Hapus</button>
            </div>
          </div>
        );})}
        <div style={{background:"#fff",borderRadius:16,padding:"20px",border:`2px solid ${C.border}`}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:8,color:C.muted,fontSize:"0.88rem"}}><span>Subtotal ({count} item)</span><span style={{fontWeight:700,color:C.text}}>{fmt(total)}</span></div>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:14,color:C.muted,fontSize:"0.88rem"}}><span>Ongkos kirim</span><span style={{color:C.mint,fontWeight:700}}>Ditentukan agen</span></div>
          <div style={{borderTop:`2px dashed ${C.border}`,paddingTop:14,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div><div style={{fontSize:"0.82rem",color:C.muted}}>Total Belanja</div><div style={{fontFamily:FF.display,fontSize:"1.6rem",color:C.orange}}>{fmt(total)}</div></div>
            <button onClick={()=>buyer?setView("checkout"):setView("auth")} style={{background:C.orange,color:"#fff",border:"none",borderRadius:20,padding:"14px 26px",fontFamily:FF.display,fontSize:"1.05rem",cursor:"pointer"}}>Checkout &#x2192;</button>
          </div>
          {!buyer&&<div style={{background:"#FFF8E1",border:"2px solid #F59E0B",borderRadius:12,padding:"12px 14px",marginTop:12,display:"flex",gap:10,alignItems:"center"}}>
            <span style={{fontSize:"1.2rem",flexShrink:0}}>🔐</span>
            <div>
              <p style={{margin:"0 0 4px",fontWeight:800,color:"#92400E",fontSize:"0.85rem"}}>Login diperlukan untuk checkout</p>
              <p style={{margin:0,fontSize:"0.78rem",color:"#78350F",lineHeight:1.5}}>Kamu akan diarahkan ke halaman masuk. Daftar gratis hanya 1 menit! ✨</p>
            </div>
          </div>}
        </div></>
      )}
    </div>
  </div>);
}

function CheckoutPage({cart,setView,onPlace,banks,qrisUrl,buyer}){
  const[f,setF]=useState({name:buyer?.name||"",phone:buyer?.phone?"0"+buyer.phone.slice(2):"",address:"",city:"",province:"",zip:"",payment:"transfer",notes:""});
  const[selBank,setSelBank]=useState(null);
  const sub=cart.reduce((s,i)=>s+i.product.price*i.qty,0);
  const set=(k,v)=>setF(x=>({...x,[k]:v}));
  const activeBanks=banks.filter(b=>b.is_active);
  const valid=f.name&&f.phone&&f.address&&f.city&&(f.payment==="qris"||(f.payment==="transfer"&&selBank));
  const submit=()=>{if(!valid)return alert(f.payment==="transfer"&&!selBank?"Pilih bank tujuan transfer":"Mohon lengkapi semua data wajib.");onPlace({f,cart,sub,total:sub,bank:selBank});};
  const inp=(k,label,type,ph,disabled)=>(<div style={{marginBottom:12}}><label style={{display:"block",fontSize:"0.82rem",fontWeight:700,color:C.text,marginBottom:4}}>{label}</label><input type={type||"text"} placeholder={ph||""} value={f[k]} onChange={e=>set(k,e.target.value)} disabled={!!disabled} style={{width:"100%",padding:"10px 14px",borderRadius:10,border:`2px solid ${disabled?"#eee":C.border}`,fontSize:"0.9rem",fontFamily:FF.body,boxSizing:"border-box",outline:"none",background:disabled?"#f9f9f9":"#fff",color:disabled?C.muted:C.text}}/></div>);
  return(<div style={{fontFamily:FF.body,background:C.bg,minHeight:"100vh"}}>
    <nav style={{background:"#fff",borderBottom:`3px solid ${C.yellow}`,padding:"12px 20px",display:"flex",alignItems:"center",gap:14,position:"sticky",top:0,zIndex:100}}>
      <button onClick={()=>setView("cart")} style={{background:"none",border:"none",cursor:"pointer",fontFamily:FF.display,fontSize:"1.2rem",color:C.orange}}>&#x2190;</button>
      <span style={{fontFamily:FF.display,fontSize:"1.3rem",color:C.text}}>&#x1F4DD; Checkout</span>
      {buyer&&<div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:6,background:C.rsBg,borderRadius:20,padding:"4px 12px"}}><span style={{fontSize:"0.75rem",color:C.rs,fontWeight:800}}>&#x2705; {buyer.name.split(" ")[0]}</span></div>}
    </nav>
    <div style={{maxWidth:860,margin:"0 auto",padding:"24px 20px",display:"grid",gridTemplateColumns:"1fr 360px",gap:22}}>
      <div>
        <Card title="&#x1F4CD; Data Pengiriman">
          {buyer&&<div style={{background:C.rsBg,border:`2px solid ${C.rs}30`,borderRadius:10,padding:"8px 14px",marginBottom:14,fontSize:"0.82rem",color:C.rs,fontWeight:700}}>&#x2705; Nama &amp; nomor WA otomatis dari akun kamu</div>}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 14px"}}>
            <div style={{gridColumn:"1/-1"}}>{inp("name","Nama Lengkap *","text","Nama penerima",!!buyer)}</div>
            {inp("phone","Nomor HP / WA *","tel","08xx-xxxx-xxxx",!!buyer)}{inp("zip","Kode Pos","text","12345")}
            <div style={{gridColumn:"1/-1"}}>{inp("address","Alamat Lengkap *","text","Jl. Contoh No. 1")}</div>
            {inp("city","Kota/Kabupaten *","text","Jakarta Selatan")}{inp("province","Provinsi","text","DKI Jakarta")}
          </div>
          <div style={{background:C.yellowL,border:`2px solid ${C.yellow}`,borderRadius:10,padding:"10px 14px",marginBottom:12}}><p style={{margin:0,fontSize:"0.83rem",color:"#7A5C00",fontWeight:700}}>&#x1F69A; Kurir ditentukan agen &amp; dikonfirmasi admin setelah pesanan diproses.</p></div>
          <div><label style={{display:"block",fontSize:"0.82rem",fontWeight:700,color:C.text,marginBottom:4}}>Catatan (opsional)</label><textarea value={f.notes} onChange={e=>set("notes",e.target.value)} rows={2} style={{width:"100%",padding:"10px 14px",borderRadius:10,border:`2px solid ${C.border}`,fontSize:"0.9rem",fontFamily:FF.body,boxSizing:"border-box",resize:"none"}}/></div>
        </Card>
        <Card title="&#x1F4B3; Metode Pembayaran">
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
            {[["transfer","&#x1F3E6; Transfer Bank"],["qris","&#x26A1; QRIS"]].map(([v,l])=>(<div key={v} onClick={()=>{set("payment",v);setSelBank(null);}} style={{border:`2.5px solid ${f.payment===v?C.orange:C.border}`,borderRadius:12,padding:"14px",cursor:"pointer",background:f.payment===v?C.poBg:"#fff",textAlign:"center"}}><div style={{fontSize:"1.6rem",marginBottom:4}} dangerouslySetInnerHTML={{__html:v==="transfer"?"&#x1F3E6;":"&#x26A1;"}}/><div style={{fontWeight:700,color:f.payment===v?C.orange:C.text,fontSize:"0.9rem",fontFamily:FF.display}} dangerouslySetInnerHTML={{__html:l}}/></div>))}
          </div>
          {f.payment==="transfer"&&(<div>
            <p style={{fontSize:"0.82rem",fontWeight:700,color:C.text,margin:"0 0 10px"}}>Pilih Bank Tujuan Transfer:</p>
            {activeBanks.length===0&&<p style={{fontSize:"0.83rem",color:C.muted,textAlign:"center",padding:"20px 0"}}>&#x26A0;&#xFE0F; Belum ada rekening aktif. Hubungi admin.</p>}
            {activeBanks.map(b=>(<div key={b.id} onClick={()=>setSelBank(b)} style={{border:`2.5px solid ${selBank?.id===b.id?C.orange:C.border}`,borderRadius:12,padding:"12px 16px",marginBottom:8,cursor:"pointer",background:selBank?.id===b.id?C.poBg:"#fff",display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:22,height:22,borderRadius:"50%",border:`2.5px solid ${selBank?.id===b.id?C.orange:C.border}`,background:selBank?.id===b.id?C.orange:"#fff",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{selBank?.id===b.id&&<div style={{width:8,height:8,borderRadius:"50%",background:"#fff"}}/>}</div>
              <div style={{fontSize:"1.4rem"}}>{b.logo_emoji||"&#x1F3E6;"}</div>
              <div><div style={{fontWeight:800,color:C.text,fontSize:"0.92rem"}}>{b.bank_name}</div><div style={{fontSize:"0.8rem",color:C.muted}}>{b.account_number} &middot; a.n. {b.account_name}</div></div>
            </div>))}
          </div>)}
          {f.payment==="qris"&&<div style={{background:C.rsBg,border:`2px solid ${C.rs}30`,borderRadius:12,padding:"12px 16px",display:"flex",gap:10,alignItems:"center"}}><span style={{fontSize:"1.5rem"}}>&#x26A1;</span><div><div style={{fontWeight:800,color:C.rs,fontSize:"0.9rem"}}>Bayar via QRIS</div><div style={{fontSize:"0.8rem",color:C.muted}}>QR Code tampil di halaman berikutnya</div></div></div>}
        </Card>
      </div>
      <div>
        <div style={{background:"#fff",borderRadius:16,padding:"20px",border:`2px solid ${C.border}`,position:"sticky",top:80}}>
          <h3 style={{fontFamily:FF.display,color:C.text,margin:"0 0 14px",fontSize:"1.1rem"}}>&#x1F4CB; Ringkasan Order</h3>
          {cart.map(({product:p,qty})=>(<div key={p.id} style={{display:"flex",justifyContent:"space-between",marginBottom:8,fontSize:"0.85rem"}}><span style={{flex:1}}>{p.emoji||"&#x1F4D7;"} {p.name} <span style={{color:C.muted}}>&#xD7;{qty}</span></span><span style={{fontWeight:700,marginLeft:8}}>{fmt(p.price*qty)}</span></div>))}
          <div style={{borderTop:`2px dashed ${C.border}`,marginTop:12,paddingTop:12}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6,fontSize:"0.85rem",color:C.muted}}><span>Subtotal</span><span>{fmt(sub)}</span></div>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:14,fontSize:"0.85rem",color:C.warn}}><span>Ongkos Kirim</span><span>Ditentukan agen</span></div>
            {selBank&&<div style={{background:C.poBg,borderRadius:10,padding:"8px 12px",marginBottom:12,fontSize:"0.82rem"}}><span style={{color:C.muted}}>Transfer ke: </span><strong style={{color:C.orange}}>{selBank.bank_name}</strong></div>}
            <div style={{display:"flex",justifyContent:"space-between",fontFamily:FF.display,fontSize:"1.2rem",color:C.orange,margin:"10px 0 16px"}}><span>Total</span><span>{fmt(sub)}</span></div>
            <button onClick={submit} style={{width:"100%",background:valid?C.orange:"#ccc",color:"#fff",border:"none",borderRadius:20,padding:"14px",fontFamily:FF.display,fontSize:"1.05rem",cursor:valid?"pointer":"not-allowed"}}>Pesan Sekarang &#x1F680;</button>
            {!valid&&<p style={{fontSize:"0.75rem",color:C.muted,textAlign:"center",margin:"8px 0 0"}}>{f.payment==="transfer"&&!selBank?"* Pilih bank dahulu":"* Lengkapi data wajib"}</p>}
          </div>
        </div>
      </div>
    </div>
  </div>);
}

function PaymentPage({order,setView,qrisUrl}){
  const[proof,setProof]=useState(null);const[sent,setSent]=useState(false);
  const isTransfer=order.payment==="transfer";
  const waMsg=encodeURIComponent("Halo BukuKiddo! &#x1F44B;\nSaya sudah "+(isTransfer?"transfer":"bayar via QRIS")+":\n\nID: "+order.id+"\nNama: "+(order.buyer_name||"")+"\nTotal: "+fmt(order.total)+"\n\nMohon dikonfirmasi &#x1F64F;");
  return(<div style={{fontFamily:FF.body,background:C.bg,minHeight:"100vh"}}>
    <nav style={{background:"#fff",borderBottom:`3px solid ${C.yellow}`,padding:"12px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100}}>
      <span style={{fontFamily:FF.display,fontSize:"1.3rem",color:C.text}}>&#x1F4B3; Pembayaran</span>
      <button onClick={()=>setView("home")} style={{background:"none",border:`2px solid ${C.border}`,borderRadius:20,padding:"6px 14px",color:C.muted,cursor:"pointer",fontFamily:FF.body,fontWeight:700}}>&#x1F3E0; Beranda</button>
    </nav>
    <div style={{maxWidth:580,margin:"0 auto",padding:"28px 20px"}}>
      <div style={{background:`linear-gradient(135deg,${C.orange},${C.orangeL})`,color:"#fff",borderRadius:18,padding:"22px",marginBottom:22,textAlign:"center"}}>
        <div style={{fontSize:"0.82rem",opacity:0.85,marginBottom:4}}>&#x1F389; Pesanan Berhasil Dibuat!</div>
        <div style={{fontFamily:FF.display,fontSize:"2rem",letterSpacing:3}}>{order.id}</div>
        <div style={{fontSize:"0.78rem",opacity:0.8,marginTop:6}}>&#x1F4CC; Simpan ID ini untuk referensi</div>
      </div>
      {isTransfer?(<>
        <Card title={"&#x1F3E6; Rekening Tujuan &mdash; "+(order.bank_name||"Bank")}>
          <div style={{textAlign:"center",background:C.poBg,borderRadius:12,padding:"18px",marginBottom:14}}>
            <div style={{fontFamily:FF.display,fontSize:"1.8rem",color:C.orange}}>{order.bank_name}</div>
            <div style={{fontSize:"1.5rem",fontWeight:900,letterSpacing:3,color:C.text,margin:"6px 0"}}>{order.bank_number}</div>
            <div style={{color:C.muted,fontSize:"0.88rem"}}>a.n. <strong>{order.bank_account_name}</strong></div>
          </div>
          <div style={{background:"#fff",border:`2px solid ${C.border}`,borderRadius:12,padding:"14px",marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8,fontSize:"0.88rem"}}><span style={{color:C.muted}}>Subtotal produk</span><span style={{fontWeight:700}}>{fmt(order.sub||order.total)}</span></div>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:10,fontSize:"0.88rem"}}><span style={{color:C.muted}}>Ongkos kirim</span><span style={{fontWeight:700,color:C.warn}}>&#x23F3; Menunggu konfirmasi</span></div>
            <div style={{borderTop:`2px dashed ${C.border}`,paddingTop:10,display:"flex",justifyContent:"space-between"}}><span style={{fontFamily:FF.display,color:C.text}}>Total Akhir</span><span style={{fontFamily:FF.display,color:C.warn}}>Menunggu konfirmasi</span></div>
          </div>
          <div style={{background:"#FFF8E1",border:"2.5px solid #F59E0B",borderRadius:12,padding:"14px 16px"}}>
            <div style={{display:"flex",gap:10}}><span style={{fontSize:"1.5rem",flexShrink:0}}>&#x26A0;&#xFE0F;</span><div><p style={{margin:"0 0 6px",fontWeight:800,color:"#92400E",fontSize:"0.92rem"}}>Jangan transfer dulu!</p><p style={{margin:0,fontSize:"0.82rem",color:"#78350F",lineHeight:1.6}}>Pantau <strong>dashboard pesananmu</strong> untuk melihat total akhir setelah admin konfirmasi ongkir. &#x1F64F;</p></div></div>
          </div>
        </Card>
        <Card title="&#x1F4E4; Konfirmasi Setelah Transfer">
          <p style={{fontSize:"0.85rem",color:C.muted,margin:"0 0 12px"}}>Setelah menerima konfirmasi total dari admin dan sudah transfer, upload bukti bayar di sini.</p>
          <a href={"https://wa.me/"+WA+"?text="+waMsg} target="_blank" rel="noreferrer" style={{display:"block",background:"#25D366",color:"#fff",borderRadius:20,padding:"14px",textAlign:"center",textDecoration:"none",fontFamily:FF.display,fontSize:"1.05rem",marginBottom:12}}>&#x1F4F1; Konfirmasi via WhatsApp</a>
          {!sent?(<div style={{border:`2px dashed ${C.border}`,borderRadius:12,padding:"20px",textAlign:"center",cursor:"pointer"}} onClick={()=>document.getElementById("pf").click()}><input id="pf" type="file" accept="image/*" style={{display:"none"}} onChange={e=>{if(e.target.files[0]){setProof(URL.createObjectURL(e.target.files[0]));setSent(true);}}}/>{proof?<img src={proof} alt="bukti" style={{maxWidth:"100%",borderRadius:8}}/>:<><div style={{fontSize:"2rem",marginBottom:6}}>&#x1F4CE;</div><p style={{color:C.muted,fontSize:"0.85rem",margin:0}}>Upload bukti transfer (JPG/PNG)</p></>}</div>
          ):(<div style={{background:C.rsBg,borderRadius:12,padding:"16px",textAlign:"center"}}><div style={{fontSize:"2rem"}}>&#x2705;</div><p style={{color:C.rs,fontWeight:800,margin:"4px 0"}}>Bukti Berhasil Diupload!</p></div>)}
        </Card>
      </>):(<Card title="&#x26A1; Bayar via QRIS">
        <div style={{textAlign:"center",padding:"10px 0"}}>
          {qrisUrl?(<><div style={{background:"#fff",border:`3px solid ${C.orange}`,borderRadius:16,padding:"16px",display:"inline-block",marginBottom:14}}><img src={qrisUrl} alt="QRIS" style={{width:220,height:220,objectFit:"contain",display:"block"}}/></div><div style={{fontFamily:FF.display,fontSize:"1.6rem",color:C.orange,marginBottom:4}}>{fmt(order.total)}</div><p style={{fontSize:"0.83rem",color:C.muted,margin:"0 0 16px"}}>Scan QR menggunakan aplikasi banking / e-wallet</p></>
          ):(<div style={{background:"#f9f9f9",border:`2px dashed ${C.border}`,borderRadius:16,padding:"32px",marginBottom:14}}><div style={{fontSize:"3rem",marginBottom:8}}>&#x26A1;</div><p style={{color:C.muted,fontSize:"0.85rem",margin:0}}>QR Code belum tersedia. Hubungi admin.</p></div>)}
          <a href={"https://wa.me/"+WA+"?text="+waMsg} target="_blank" rel="noreferrer" style={{display:"inline-block",background:"#25D366",color:"#fff",borderRadius:20,padding:"12px 28px",textDecoration:"none",fontFamily:FF.display,fontSize:"1rem"}}>&#x1F4F1; Konfirmasi via WhatsApp</a>
        </div>
      </Card>)}
      <div style={{background:C.rsBg,borderRadius:12,padding:"16px",textAlign:"center"}}>
        <p style={{margin:"0 0 8px",fontSize:"0.88rem",color:C.rs,fontWeight:800}}>&#x1F4E6; Pantau pesananmu secara real-time!</p>
        <p style={{margin:"0 0 12px",fontSize:"0.8rem",color:C.muted}}>Lihat status, ongkir, dan nomor resi kapan saja di dashboard kamu.</p>
        <button onClick={()=>setView("dashboard")} style={{width:"100%",background:C.rs,color:"#fff",border:"none",borderRadius:20,padding:"12px",fontFamily:FF.display,fontSize:"1rem",cursor:"pointer"}}>&#x1F4E6; Lihat Status Pesanan &#x2192;</button>
      </div>
    </div>
  </div>);
}

function BuyerDashboard({setView,buyer,onLogout}){
  const[orders,setOrders]=useState([]);
  const[loading,setLoading]=useState(true);
  const[expanded,setExpanded]=useState(null);
  const[lastRefresh,setLastRefresh]=useState(null);
  const fetchOrders=async()=>{
    if(!buyer)return;
    setLoading(true);
    const{data}=await supabase.from("orders").select("*")
      .or("buyer_id.eq."+buyer.id+",buyer_phone.eq."+buyer.phone+",buyer_phone.eq.0"+buyer.phone.slice(2))
      .order("created_at",{ascending:false});
    setOrders(data||[]);setLastRefresh(new Date());setLoading(false);
  };
  useEffect(()=>{fetchOrders();},[buyer]);
  useEffect(()=>{if(!buyer)return;const id=setInterval(fetchOrders,60000);return()=>clearInterval(id);},[buyer]);

  const trackUrl=(courier,resi)=>{const base=COURIER_URLS[courier];return base?base+resi:"https://www.google.com/search?q=lacak+resi+"+courier+"+"+resi;};
  const statusIcon={"Menunggu Pembayaran":"&#x23F3;","Pembayaran Dikonfirmasi":"&#x2705;","Diproses":"&#x2699;&#xFE0F;","Dikirim":"&#x1F69A;","Selesai":"&#x1F389;"};
  const statusColor={"Menunggu Pembayaran":["#FFF3E0","#E65100"],"Pembayaran Dikonfirmasi":["#E8F5E9","#1B5E20"],"Diproses":["#E3F2FD","#0D47A1"],"Dikirim":["#F3E5F5","#6A1B9A"],"Selesai":[C.rsBg,C.rs]};

  if(!buyer)return(
    <div style={{fontFamily:FF.body,background:C.bg,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",padding:24}}>
      <div style={{textAlign:"center",maxWidth:360}}>
        <div style={{fontSize:"4rem",marginBottom:14}}>&#x1F510;</div>
        <h2 style={{fontFamily:FF.display,color:C.text,margin:"0 0 8px"}}>Login Diperlukan</h2>
        <p style={{color:C.muted,fontSize:"0.9rem",lineHeight:1.6,marginBottom:20}}>Untuk melihat pesananmu, silakan masuk ke akun BukuKiddo terlebih dahulu.</p>
        <button onClick={()=>setView("auth")} style={{background:C.orange,color:"#fff",border:"none",borderRadius:20,padding:"13px 28px",fontFamily:FF.display,fontSize:"1.05rem",cursor:"pointer",marginBottom:12,width:"100%"}}>&#x1F464; Masuk / Daftar Akun</button>
        <button onClick={()=>setView("home")} style={{background:"none",border:`2px solid ${C.border}`,borderRadius:20,padding:"11px 28px",fontFamily:FF.body,fontWeight:700,fontSize:"0.9rem",cursor:"pointer",color:C.muted,width:"100%"}}>&#x2190; Kembali ke Toko</button>
      </div>
    </div>
  );

  return(<div style={{fontFamily:FF.body,background:C.bg,minHeight:"100vh"}}>
    <nav style={{background:"#fff",borderBottom:`3px solid ${C.yellow}`,padding:"12px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100,boxShadow:"0 2px 16px rgba(232,97,42,0.07)"}}>
      <button onClick={()=>setView("home")} style={{background:"none",border:"none",cursor:"pointer",fontFamily:FF.display,fontSize:"1.2rem",color:C.orange}}>&#x2190; Toko</button>
      <span style={{fontFamily:FF.display,fontSize:"1.2rem",color:C.text}}>&#x1F4E6; Pesanan Saya</span>
      <button onClick={fetchOrders} style={{background:"none",border:`2px solid ${C.border}`,borderRadius:20,padding:"5px 12px",color:C.muted,cursor:"pointer",fontFamily:FF.body,fontWeight:700,fontSize:"0.78rem"}}>&#x1F504; Refresh</button>
    </nav>
    <div style={{maxWidth:640,margin:"0 auto",padding:"20px"}}>
      <div style={{background:`linear-gradient(135deg,${C.orange},${C.orangeL})`,borderRadius:16,padding:"18px 20px",marginBottom:18,display:"flex",alignItems:"center",gap:14}}>
        <div style={{width:52,height:52,borderRadius:"50%",background:"rgba(255,255,255,0.3)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:FF.display,fontSize:"1.5rem",color:"#fff",flexShrink:0}}>{buyer.name[0].toUpperCase()}</div>
        <div style={{flex:1}}>
          <div style={{fontFamily:FF.display,fontSize:"1.15rem",color:"#fff"}}>{buyer.name}</div>
          <div style={{fontSize:"0.8rem",color:"rgba(255,255,255,0.8)"}}>&#x1F4F1; 0{buyer.phone.slice(2)}</div>
          {lastRefresh&&<div style={{fontSize:"0.7rem",color:"rgba(255,255,255,0.65)",marginTop:2}}>&#x1F504; Update: {lastRefresh.toLocaleTimeString("id-ID")}</div>}
        </div>
        <button onClick={()=>{onLogout();setView("home");}} style={{background:"rgba(255,255,255,0.2)",color:"#fff",border:"2px solid rgba(255,255,255,0.4)",borderRadius:16,padding:"6px 14px",cursor:"pointer",fontFamily:FF.body,fontWeight:700,fontSize:"0.8rem"}}>&#x21A9; Keluar</button>
      </div>

      {loading&&<div style={{textAlign:"center",padding:"48px",color:C.muted}}><div style={{fontSize:"3rem"}}>&#x23F3;</div><p style={{fontFamily:FF.display,fontSize:"1.2rem",marginTop:12}}>Memuat pesanan...</p></div>}
      {!loading&&orders.length===0&&<div style={{textAlign:"center",padding:"48px 20px",background:"#fff",borderRadius:16,border:`2px solid ${C.border}`}}><div style={{fontSize:"3.5rem",marginBottom:10}}>&#x1F6CD;&#xFE0F;</div><p style={{fontFamily:FF.display,fontSize:"1.2rem",color:C.text,margin:"0 0 6px"}}>Belum ada pesanan</p><p style={{fontSize:"0.85rem",color:C.muted,marginBottom:18}}>Yuk mulai belanja buku untuk si kecil!</p><button onClick={()=>setView("home")} style={{background:C.orange,color:"#fff",border:"none",borderRadius:20,padding:"12px 24px",fontFamily:FF.display,cursor:"pointer"}}>&#x1F4DA; Lihat Katalog</button></div>}

      {orders.map(ord=>{
        const isOpen=expanded===ord.id;
        const[bg,col]=statusColor[ord.status]||[C.bg,C.muted];
        const icon=statusIcon[ord.status]||"&#x1F4E6;";
        const hasResi=ord.resi&&ord.courier;
        const hasOngkir=ord.ongkir&&parseInt(ord.ongkir)>0;
        const curIdx=STATUSES.indexOf(ord.status);
        return(<div key={ord.id} style={{background:"#fff",borderRadius:16,marginBottom:14,border:`2px solid ${isOpen?C.orange:C.border}`,overflow:"hidden",transition:"border .2s"}}>
          <div onClick={()=>setExpanded(isOpen?null:ord.id)} style={{padding:"16px 18px",cursor:"pointer",display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:46,height:46,borderRadius:12,background:bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.4rem",flexShrink:0}} dangerouslySetInnerHTML={{__html:icon}}/>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:6}}>
                <div style={{fontFamily:FF.display,fontSize:"1rem",color:C.text}}>{ord.id}</div>
                <span style={{background:bg,color:col,borderRadius:20,padding:"3px 10px",fontSize:"0.68rem",fontWeight:800,whiteSpace:"nowrap",flexShrink:0}}>{ord.status}</span>
              </div>
              <div style={{fontSize:"0.77rem",color:C.muted,marginTop:2}}>{new Date(ord.created_at).toLocaleDateString("id-ID",{dateStyle:"long"})}</div>
              <div style={{fontSize:"0.83rem",fontWeight:700,color:hasOngkir?C.orange:C.warn,marginTop:3}}>{hasOngkir?"Total: "+fmt(ord.total):"&#x23F3; Menunggu konfirmasi total"}</div>
            </div>
            <div style={{color:C.muted,fontSize:"1.1rem",transform:isOpen?"rotate(180deg)":"none",transition:"transform .2s",flexShrink:0}}>&#x25BE;</div>
          </div>
          {isOpen&&<div style={{borderTop:`2px dashed ${C.border}`,padding:"16px 18px"}}>
            <div style={{marginBottom:16}}>
              {STATUSES.map((s,i)=>{const done=i<=curIdx;const current=i===curIdx;return(
                <div key={s} style={{display:"flex",gap:10}}>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                    <div style={{width:26,height:26,borderRadius:"50%",background:done?C.orange:C.border,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{done&&<span style={{color:"#fff",fontSize:"0.75rem"}}>&#x2713;</span>}</div>
                    {i<STATUSES.length-1&&<div style={{width:2,height:24,background:done&&i<curIdx?C.orange:C.border}}/>}
                  </div>
                  <div style={{paddingBottom:i<STATUSES.length-1?16:0,paddingTop:2,display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:"0.86rem",fontWeight:done?800:400,color:done?C.text:C.muted}}>{s}</span>
                    {current&&<span style={{background:C.poBg,color:C.po,fontSize:"0.68rem",fontWeight:800,borderRadius:6,padding:"2px 7px"}}>Sekarang</span>}
                  </div>
                </div>
              );})}
            </div>
            <div style={{background:C.bg,borderRadius:10,padding:"10px 14px",marginBottom:10}}>
              <p style={{fontSize:"0.75rem",fontWeight:800,color:C.muted,margin:"0 0 8px",textTransform:"uppercase",letterSpacing:"0.5px"}}>Produk Dipesan</p>
              {(ord.cart||[]).map(({product:p,qty},i)=>(<div key={i} style={{display:"flex",justifyContent:"space-between",marginBottom:5,fontSize:"0.85rem"}}><span>{p.emoji||"&#x1F4D7;"} {p.name} <span style={{color:C.muted}}>&times;{qty}</span></span><span style={{fontWeight:700}}>{fmt(p.price*qty)}</span></div>))}
              <div style={{borderTop:`1.5px dashed ${C.border}`,marginTop:8,paddingTop:8}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.83rem",color:C.muted,marginBottom:4}}><span>Subtotal</span><span style={{fontWeight:700,color:C.text}}>{fmt(ord.sub||0)}</span></div>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.83rem",marginBottom:4}}><span style={{color:C.muted}}>Ongkos kirim</span><span style={{fontWeight:700,color:hasOngkir?C.text:C.warn}}>{hasOngkir?fmt(ord.ongkir):"&#x23F3; Menunggu konfirmasi"}</span></div>
                <div style={{display:"flex",justifyContent:"space-between",fontFamily:FF.display,fontSize:"1rem",color:C.orange}}><span>Total Akhir</span><span>{hasOngkir?fmt(ord.total):"&mdash;"}</span></div>
              </div>
            </div>
            {(ord.bank_name||ord.payment==="qris")&&<div style={{background:"#fff",border:`2px solid ${C.border}`,borderRadius:10,padding:"10px 14px",marginBottom:10,fontSize:"0.83rem"}}>
              <p style={{fontSize:"0.75rem",fontWeight:800,color:C.muted,margin:"0 0 6px",textTransform:"uppercase",letterSpacing:"0.5px"}}>Info Pembayaran</p>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{color:C.muted}}>Metode</span><span style={{fontWeight:700}}>{ord.payment==="transfer"?"&#x1F3E6; Transfer Bank":"&#x26A1; QRIS"}</span></div>
              {ord.bank_name&&<div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{color:C.muted}}>Bank</span><span style={{fontWeight:700}}>{ord.bank_name}</span></div>}
              {ord.bank_number&&<div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:C.muted}}>No. Rekening</span><span style={{fontWeight:700}}>{ord.bank_number}</span></div>}
            </div>}
            {(ord.courier||ord.resi)&&<div style={{background:hasResi?C.rsBg:C.poBg,border:`2px solid ${hasResi?C.rs:C.po}30`,borderRadius:10,padding:"12px 14px",marginBottom:10}}>
              <p style={{fontSize:"0.75rem",fontWeight:800,color:C.muted,margin:"0 0 8px",textTransform:"uppercase",letterSpacing:"0.5px"}}>Info Pengiriman</p>
              {ord.courier&&<div style={{display:"flex",justifyContent:"space-between",fontSize:"0.83rem",marginBottom:4}}><span style={{color:C.muted}}>Kurir</span><span style={{fontWeight:700}}>{ord.courier}</span></div>}
              {ord.resi&&<div>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.83rem",marginBottom:10}}><span style={{color:C.muted}}>No. Resi</span><span style={{fontFamily:FF.display,fontSize:"0.95rem",color:C.rs,letterSpacing:1}}>{ord.resi}</span></div>
                <a href={trackUrl(ord.courier,ord.resi)} target="_blank" rel="noreferrer" style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,background:C.rs,color:"#fff",borderRadius:20,padding:"10px",textDecoration:"none",fontFamily:FF.display,fontSize:"0.95rem"}}>&#x1F50D; Lacak Paket di {ord.courier}</a>
              </div>}
              {!ord.resi&&ord.status==="Diproses"&&<p style={{fontSize:"0.8rem",color:C.po,margin:0,fontWeight:700}}>&#x1F4E6; Nomor resi muncul setelah dikirim</p>}
            </div>}
            <div style={{background:C.bg,borderRadius:10,padding:"10px 14px",fontSize:"0.83rem"}}>
              <p style={{fontSize:"0.75rem",fontWeight:800,color:C.muted,margin:"0 0 4px",textTransform:"uppercase",letterSpacing:"0.5px"}}>Alamat Pengiriman</p>
              <p style={{margin:0,color:C.text,lineHeight:1.6}}>{ord.buyer_address}, {ord.buyer_city}</p>
            </div>
            {ord.status==="Menunggu Pembayaran"&&!hasOngkir&&<div style={{background:"#FFF8E1",border:"2px solid #F59E0B",borderRadius:10,padding:"12px 14px",marginTop:10,display:"flex",gap:8}}><span style={{fontSize:"1.1rem",flexShrink:0}}>&#x23F3;</span><p style={{margin:0,fontSize:"0.82rem",color:"#78350F",lineHeight:1.6}}>Admin sedang konfirmasi ongkir. Halaman ini auto-refresh tiap 60 detik.</p></div>}
          </div>}
        </div>);
      })}
      {!loading&&orders.length>0&&<div style={{background:"#fff",borderRadius:12,padding:"12px 16px",border:`2px solid ${C.border}`,textAlign:"center"}}><p style={{margin:0,fontSize:"0.78rem",color:C.muted}}>&#x1F4A1; Status otomatis diperbarui setiap 60 detik &middot; Tap pesanan untuk detail lengkap</p></div>}
    </div>
  </div>);
}

function ProductForm({initial,onSave,onCancel,title}){
  const isEdit=!!initial?.id;
  const[f,setF]=useState({name:initial?.name||"",desc:initial?.description||initial?.desc||"",price:initial?.price||"",status:initial?.status||"ready",deadline:initial?.deadline?new Date(initial.deadline).toISOString().slice(0,16):"",category:initial?.category||"",origin:initial?.origin||"Jakarta",emoji:initial?.emoji||"&#x1F4D7;",pages:initial?.pages||"",age:initial?.age||"",weight:initial?.weight||"",stock:initial?.stock||""});
  const[images,setImages]=useState(initial?.preview_images||[]);
  const[uploading,setUploading]=useState(false);const[saving,setSaving]=useState(false);
  const set=(k,v)=>setF(x=>({...x,[k]:v}));
  const save=async()=>{if(!f.name||!f.price)return alert("Nama dan harga wajib diisi");setSaving(true);const payload={name:f.name,description:f.desc,price:parseInt(f.price),status:f.status,deadline:f.status==="preorder"&&f.deadline?new Date(f.deadline).toISOString():null,category:f.category,origin:f.origin,emoji:f.emoji||"&#x1F4D7;",pages:parseInt(f.pages)||null,age:f.age,weight:f.weight,stock:f.status==="ready"?(parseInt(f.stock)||null):null,preview_images:images};let error;if(isEdit){({error}=await supabase.from("products").update(payload).eq("id",initial.id));}else{({error}=await supabase.from("products").insert([payload]));}setSaving(false);if(error)return alert("Gagal: "+error.message);onSave();};
  const inp=(k,label,type,ph,full)=>(<div style={{marginBottom:10,gridColumn:full?"1/-1":undefined}}><label style={{display:"block",fontSize:"0.78rem",fontWeight:700,color:C.text,marginBottom:3}}>{label}</label><input type={type||"text"} placeholder={ph||""} value={f[k]} onChange={e=>set(k,e.target.value)} style={{width:"100%",padding:"9px 12px",borderRadius:8,border:`2px solid ${C.border}`,fontFamily:FF.body,fontSize:"0.88rem",boxSizing:"border-box",outline:"none"}}/></div>);
  const content=(<>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 12px"}}>
      {inp("name","Nama Buku *","text","Judul buku...",true)}{inp("emoji","Emoji","text","&#x1F4D7;")}{inp("price","Harga (Rp) *","number","75000")}
      {inp("category","Kategori","text","Petualangan")}{inp("origin","Asal Pengiriman","text","Jakarta")}
      {inp("age","Usia Pembaca","text","5-9 tahun")}{inp("pages","Halaman","number","100")}{inp("weight","Berat","text","300g")}
    </div>
    <div style={{marginBottom:10}}><label style={{display:"block",fontSize:"0.78rem",fontWeight:700,color:C.text,marginBottom:3}}>Deskripsi</label><textarea value={f.desc} onChange={e=>set("desc",e.target.value)} rows={3} style={{width:"100%",padding:"9px 12px",borderRadius:8,border:`2px solid ${C.border}`,fontFamily:FF.body,fontSize:"0.88rem",boxSizing:"border-box",resize:"none",outline:"none"}}/></div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
      <div><label style={{display:"block",fontSize:"0.78rem",fontWeight:700,color:C.text,marginBottom:3}}>Status</label><select value={f.status} onChange={e=>set("status",e.target.value)} style={{width:"100%",padding:"9px 12px",borderRadius:8,border:`2px solid ${C.border}`,fontFamily:FF.body,fontSize:"0.88rem"}}><option value="ready">&#x2705; Ready Stock</option><option value="preorder">&#x23F3; Pre-Order</option></select></div>
      {f.status==="ready"&&<div><label style={{display:"block",fontSize:"0.78rem",fontWeight:700,color:C.text,marginBottom:3}}>Stok</label><input type="number" value={f.stock} onChange={e=>set("stock",e.target.value)} placeholder="0" style={{width:"100%",padding:"9px 12px",borderRadius:8,border:`2px solid ${C.border}`,fontFamily:FF.body,fontSize:"0.88rem",boxSizing:"border-box"}}/></div>}
      {f.status==="preorder"&&<div><label style={{display:"block",fontSize:"0.78rem",fontWeight:700,color:C.text,marginBottom:3}}>Deadline</label><input type="datetime-local" value={f.deadline} onChange={e=>set("deadline",e.target.value)} style={{width:"100%",padding:"9px 12px",borderRadius:8,border:`2px solid ${C.border}`,fontFamily:FF.body,fontSize:"0.88rem",boxSizing:"border-box"}}/></div>}
    </div>
    <div style={{background:C.bg,borderRadius:12,padding:"14px",marginBottom:16,border:`2px solid ${C.border}`}}><ImageUploader images={images} setImages={setImages} productId={initial?.id||null} uploading={uploading} setUploading={setUploading}/></div>
    <div style={{display:"flex",gap:10}}>
      {onCancel&&<button onClick={onCancel} style={{flex:1,background:"#f5f5f5",color:C.muted,border:"none",borderRadius:16,padding:"12px",fontFamily:FF.display,fontSize:"1rem",cursor:"pointer"}}>Batal</button>}
      <button onClick={save} disabled={saving||uploading} style={{flex:2,background:saving||uploading?"#ccc":C.orange,color:"#fff",border:"none",borderRadius:16,padding:"12px",fontFamily:FF.display,fontSize:"1rem",cursor:saving||uploading?"not-allowed":"pointer"}}>{saving?"&#x23F3; Menyimpan...":uploading?"&#x23F3; Mengupload...":isEdit?"&#x1F4BE; Simpan":"&#x2795; Tambahkan"}</button>
    </div>
  </>);
  if(isEdit)return(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:999,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}><div style={{background:"#fff",borderRadius:20,padding:"24px",width:"100%",maxWidth:580,maxHeight:"92vh",overflowY:"auto",boxShadow:"0 20px 60px rgba(0,0,0,0.2)"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}><h3 style={{fontFamily:FF.display,color:C.text,margin:0,fontSize:"1.2rem"}}>{title||"&#x270F;&#xFE0F; Edit Produk"}</h3><button onClick={onCancel} style={{background:"#f5f5f5",border:"none",borderRadius:"50%",width:32,height:32,cursor:"pointer",fontSize:"1rem"}}>&#x2715;</button></div>{content}</div></div>);
  return <div style={{maxWidth:640,background:"#fff",borderRadius:16,padding:"24px",border:`2px solid ${C.border}`}}><h3 style={{fontFamily:FF.display,color:C.text,margin:"0 0 20px"}}>{title||"&#x2795; Tambah Produk Baru"}</h3>{content}</div>;
}

function BankManager({banks,fetchBanks,qrisUrl,fetchQris}){
  const[form,setForm]=useState({bank_name:"",account_number:"",account_name:"",logo_emoji:"&#x1F3E6;"});
  const[editId,setEditId]=useState(null);const[uploadingQris,setUploadingQris]=useState(false);
  const qrisRef=useRef();const setf=(k,v)=>setForm(x=>({...x,[k]:v}));
  const saveBank=async()=>{if(!form.bank_name||!form.account_number||!form.account_name)return alert("Semua field wajib diisi");if(editId){await supabase.from("bank_accounts").update(form).eq("id",editId);setEditId(null);}else{await supabase.from("bank_accounts").insert([{...form,is_active:true}]);}setForm({bank_name:"",account_number:"",account_name:"",logo_emoji:"&#x1F3E6;"});fetchBanks();};
  const toggleActive=async(id,val)=>{await supabase.from("bank_accounts").update({is_active:val}).eq("id",id);fetchBanks();};
  const deleteBank=async(id)=>{if(!window.confirm("Hapus rekening?"))return;await supabase.from("bank_accounts").delete().eq("id",id);fetchBanks();};
  const startEdit=(b)=>{setEditId(b.id);setForm({bank_name:b.bank_name,account_number:b.account_number,account_name:b.account_name,logo_emoji:b.logo_emoji||"&#x1F3E6;"});};
  const uploadQris=async(file)=>{setUploadingQris(true);try{const url=await uploadImage(file,"qris/qr-code.jpg");await supabase.from("settings").upsert({key:"qris_url",value:url},{onConflict:"key"});fetchQris();alert("&#x2705; QRIS berhasil diupload!");}catch(e){alert("Gagal: "+e.message);}setUploadingQris(false);};
  const deleteQris=async()=>{if(!window.confirm("Hapus QR Code?"))return;await deleteImage(qrisUrl);await supabase.from("settings").upsert({key:"qris_url",value:""},{onConflict:"key"});fetchQris();};
  const EMOJIS=["&#x1F3E6;","&#x1F3DB;&#xFE0F;","&#x262A;&#xFE0F;","&#x1F406;","&#x1F4B0;","&#x1F33F;","&#x2B50;"];
  return(<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
    <div>
      <h3 style={{fontFamily:FF.display,color:C.text,margin:"0 0 14px",fontSize:"1.1rem"}}>&#x1F3E6; Daftar Rekening Bank</h3>
      {banks.length===0&&<div style={{textAlign:"center",padding:"30px",color:C.muted,background:"#fff",borderRadius:14,border:`2px solid ${C.border}`}}><div style={{fontSize:"2.5rem"}}>&#x1F3E6;</div><p style={{margin:"8px 0 0",fontSize:"0.85rem"}}>Belum ada rekening</p></div>}
      {banks.map(b=>(<div key={b.id} style={{background:"#fff",borderRadius:14,padding:"14px 16px",marginBottom:10,border:`2px solid ${b.is_active?C.border:"#eee"}`,opacity:b.is_active?1:0.6}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
          <span style={{fontSize:"1.6rem"}} dangerouslySetInnerHTML={{__html:b.logo_emoji||"&#x1F3E6;"}}/>
          <div style={{flex:1}}><div style={{fontFamily:FF.display,fontSize:"0.97rem",color:C.text}}>{b.bank_name}</div><div style={{fontSize:"0.78rem",color:C.muted}}>{b.account_number}</div><div style={{fontSize:"0.75rem",color:C.muted}}>a.n. {b.account_name}</div></div>
          <div onClick={()=>toggleActive(b.id,!b.is_active)} style={{width:40,height:22,borderRadius:11,background:b.is_active?C.rs:"#ddd",cursor:"pointer",position:"relative",flexShrink:0}}><div style={{position:"absolute",top:2,left:b.is_active?20:2,width:18,height:18,borderRadius:"50%",background:"#fff",transition:"left .2s",boxShadow:"0 1px 4px rgba(0,0,0,0.2)"}}/></div>
        </div>
        <div style={{display:"flex",gap:6}}>
          <button onClick={()=>startEdit(b)} style={{flex:1,background:C.poBg,color:C.orange,border:`1.5px solid ${C.orange}`,borderRadius:8,padding:"5px",cursor:"pointer",fontFamily:FF.body,fontWeight:700,fontSize:"0.78rem"}}>&#x270F;&#xFE0F; Edit</button>
          <button onClick={()=>deleteBank(b.id)} style={{flex:1,background:"#fff0f0",color:"#e74c3c",border:"1.5px solid #fcc",borderRadius:8,padding:"5px",cursor:"pointer",fontFamily:FF.body,fontWeight:700,fontSize:"0.78rem"}}>&#x1F5D1;&#xFE0F; Hapus</button>
        </div>
      </div>))}
      <h3 style={{fontFamily:FF.display,color:C.text,margin:"20px 0 12px",fontSize:"1.1rem"}}>&#x26A1; QR Code QRIS</h3>
      <div style={{background:"#fff",borderRadius:14,padding:"16px",border:`2px solid ${C.border}`}}>
        {qrisUrl?(<><div style={{textAlign:"center",marginBottom:12}}><img src={qrisUrl} alt="QRIS" style={{width:160,height:160,objectFit:"contain",border:`2px solid ${C.border}`,borderRadius:12}}/><p style={{fontSize:"0.75rem",color:C.rs,fontWeight:700,margin:"6px 0 0"}}>&#x2705; QRIS aktif</p></div><div style={{display:"flex",gap:8}}><button onClick={()=>qrisRef.current.click()} style={{flex:1,background:C.poBg,color:C.orange,border:`1.5px solid ${C.orange}`,borderRadius:8,padding:"7px",cursor:"pointer",fontFamily:FF.body,fontWeight:700,fontSize:"0.8rem"}}>&#x1F504; Ganti</button><button onClick={deleteQris} style={{flex:1,background:"#fff0f0",color:"#e74c3c",border:"1.5px solid #fcc",borderRadius:8,padding:"7px",cursor:"pointer",fontFamily:FF.body,fontWeight:700,fontSize:"0.8rem"}}>&#x1F5D1;&#xFE0F; Hapus</button></div></>
        ):(<div onClick={()=>!uploadingQris&&qrisRef.current.click()} style={{border:`2px dashed ${uploadingQris?C.mint:C.border}`,borderRadius:12,padding:"24px",textAlign:"center",cursor:"pointer",background:uploadingQris?"#E6FAF6":"#fafafa"}}>{uploadingQris?<><div style={{fontSize:"2rem"}}>&#x23F3;</div><p style={{color:C.mint,fontWeight:700,margin:"6px 0 0",fontSize:"0.85rem"}}>Mengupload...</p></>:<><div style={{fontSize:"2.5rem"}}>&#x26A1;</div><p style={{color:C.muted,fontWeight:700,margin:"6px 0 0",fontSize:"0.85rem"}}>Tap untuk upload QR Code</p></>}</div>)}
        <input ref={qrisRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>{if(e.target.files[0])uploadQris(e.target.files[0]);}}/>
      </div>
    </div>
    <div>
      <h3 style={{fontFamily:FF.display,color:C.text,margin:"0 0 14px",fontSize:"1.1rem"}}>{editId?"&#x270F;&#xFE0F; Edit Rekening":"&#x2795; Tambah Rekening Baru"}</h3>
      <div style={{background:"#fff",borderRadius:14,padding:"18px",border:`2px solid ${C.border}`}}>
        {[["bank_name","Nama Bank *","BCA / Mandiri..."],["account_number","Nomor Rekening *","1234-5678-90"],["account_name","Nama Pemilik *","Nama Lengkap"]].map(([k,l,ph])=>(<div key={k} style={{marginBottom:12}}><label style={{display:"block",fontSize:"0.8rem",fontWeight:700,color:C.text,marginBottom:4}}>{l}</label><input type="text" placeholder={ph} value={form[k]} onChange={e=>setf(k,e.target.value)} style={{width:"100%",padding:"10px 12px",borderRadius:10,border:`2px solid ${C.border}`,fontFamily:FF.body,fontSize:"0.88rem",boxSizing:"border-box",outline:"none"}}/></div>))}
        <div style={{marginBottom:14}}><label style={{display:"block",fontSize:"0.8rem",fontWeight:700,color:C.text,marginBottom:6}}>Emoji Bank</label><div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{EMOJIS.map(e=>(<button key={e} onClick={()=>setf("logo_emoji",e)} style={{fontSize:"1.5rem",background:form.logo_emoji===e?C.poBg:"#f5f5f5",border:`2px solid ${form.logo_emoji===e?C.orange:"#eee"}`,borderRadius:10,padding:"6px 10px",cursor:"pointer"}} dangerouslySetInnerHTML={{__html:e}}/>))}</div></div>
        <div style={{display:"flex",gap:8}}>{editId&&<button onClick={()=>{setEditId(null);setForm({bank_name:"",account_number:"",account_name:"",logo_emoji:"&#x1F3E6;"});}} style={{flex:1,background:"#f5f5f5",color:C.muted,border:"none",borderRadius:12,padding:"11px",fontFamily:FF.display,cursor:"pointer"}}>Batal</button>}<button onClick={saveBank} style={{flex:2,background:C.orange,color:"#fff",border:"none",borderRadius:12,padding:"11px",fontFamily:FF.display,fontSize:"1rem",cursor:"pointer"}}>{editId?"&#x1F4BE; Simpan":"&#x2795; Tambah Bank"}</button></div>
      </div>
    </div>
  </div>);
}

function BuyerManager(){
  const[buyers,setBuyers]=useState([]);const[loading,setLoading]=useState(true);const[search,setSearch]=useState("");
  useEffect(()=>{fetchBuyers();},[]);
  const fetchBuyers=async()=>{setLoading(true);const{data}=await supabase.from("buyers").select("*").order("created_at",{ascending:false});if(data)setBuyers(data);setLoading(false);};
  const filtered=buyers.filter(b=>b.name.toLowerCase().includes(search.toLowerCase())||b.phone.includes(search));
  return(<div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:10}}>
      <div><h3 style={{fontFamily:FF.display,color:C.text,margin:"0 0 2px",fontSize:"1.1rem"}}>&#x1F465; Data Buyer Terdaftar</h3><p style={{color:C.muted,fontSize:"0.8rem",margin:0}}>Total {buyers.length} akun</p></div>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="&#x1F50D; Cari nama atau nomor..." style={{padding:"8px 14px",borderRadius:20,border:`2px solid ${C.border}`,fontFamily:FF.body,fontSize:"0.85rem",outline:"none",width:220}}/>
    </div>
    {loading&&<div style={{textAlign:"center",padding:"40px",color:C.muted}}><div style={{fontSize:"2.5rem"}}>&#x23F3;</div><p style={{marginTop:10,fontFamily:FF.display}}>Memuat data...</p></div>}
    {!loading&&filtered.length===0&&<div style={{textAlign:"center",padding:"40px",color:C.muted,background:"#fff",borderRadius:14,border:`2px solid ${C.border}`}}><div style={{fontSize:"3rem"}}>&#x1F465;</div><p style={{fontFamily:FF.display,fontSize:"1.1rem",marginTop:10}}>{buyers.length===0?"Belum ada buyer terdaftar":"Tidak ditemukan"}</p></div>}
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:12}}>
      {filtered.map(b=>(<div key={b.id} style={{background:"#fff",borderRadius:14,padding:"16px",border:`2px solid ${C.border}`}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
          <div style={{width:42,height:42,borderRadius:"50%",background:C.poBg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:FF.display,fontSize:"1.2rem",color:C.orange,flexShrink:0}}>{b.name[0].toUpperCase()}</div>
          <div style={{flex:1,minWidth:0}}><div style={{fontFamily:FF.display,fontSize:"0.97rem",color:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{b.name}</div><div style={{fontSize:"0.78rem",color:C.muted}}>&#x1F4F1; 0{b.phone.slice(2)}</div></div>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.8rem",color:C.muted,marginBottom:10}}><span>&#x1F4C5; Daftar</span><span style={{fontWeight:700,color:C.text}}>{new Date(b.created_at).toLocaleDateString("id-ID",{dateStyle:"medium"})}</span></div>
        <a href={"https://wa.me/"+b.phone+"?text="+encodeURIComponent("Halo "+b.name+"! &#x1F44B; Ada yang bisa kami bantu dari BukuKiddo? &#x1F4DA;")} target="_blank" rel="noreferrer" style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,background:"#25D366",color:"#fff",borderRadius:10,padding:"7px",textDecoration:"none",fontFamily:FF.body,fontWeight:700,fontSize:"0.82rem"}}>&#x1F4F1; WA Buyer</a>
      </div>))}
    </div>
  </div>);
}

function AdminPage({products,fetchProducts,setView,auth,setAuth,banks,fetchBanks,qrisUrl,fetchQris}){
  const[pass,setPass]=useState("");const[tab,setTab]=useState("orders");
  const[orders,setOrders]=useState([]);const[loadingOrd,setLO]=useState(false);
  const[editProd,setEditProd]=useState(null);
  useEffect(()=>{if(auth)loadOrders();},[auth]);
  const loadOrders=async()=>{setLO(true);const{data}=await supabase.from("orders").select("*").order("created_at",{ascending:false});if(data)setOrders(data);setLO(false);};
  const updOrder=async(id,updates)=>{const db={};if(updates.status!==undefined)db.status=updates.status;if(updates.courier!==undefined)db.courier=updates.courier;if(updates.resi!==undefined)db.resi=updates.resi;if(updates.ongkir!==undefined){const val=parseInt(updates.ongkir)||0;const ord=orders.find(o=>o.id===id);db.ongkir=val;db.total=(ord?.sub||0)+val;updates.total=db.total;}await supabase.from("orders").update(db).eq("id",id);setOrders(prev=>prev.map(o=>o.id===id?{...o,...updates}:o));};
  const delProd=async(id)=>{if(!window.confirm("Hapus produk?"))return;await supabase.from("products").delete().eq("id",id);fetchProducts();};
  if(!auth)return(<div style={{fontFamily:FF.body,background:C.bg,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{background:"#fff",borderRadius:20,padding:"40px",width:360,border:`2px solid ${C.border}`,textAlign:"center"}}><div style={{fontSize:"3rem",marginBottom:10}}>&#x1F510;</div><h2 style={{fontFamily:FF.display,color:C.text,margin:"0 0 6px"}}>Admin Login</h2><input type="password" placeholder="Password admin" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&(pass===ADMIN_PASS?setAuth(true):alert("Password salah!"))} style={{width:"100%",padding:"12px",borderRadius:10,border:`2px solid ${C.border}`,fontSize:"1rem",fontFamily:FF.body,boxSizing:"border-box",marginBottom:12,outline:"none"}}/><button onClick={()=>pass===ADMIN_PASS?setAuth(true):alert("Password salah!")} style={{width:"100%",background:C.orange,color:"#fff",border:"none",borderRadius:20,padding:"13px",fontFamily:FF.display,fontSize:"1.05rem",cursor:"pointer"}}>Masuk</button><button onClick={()=>setView("home")} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",marginTop:12,fontFamily:FF.body,fontSize:"0.85rem"}}>&#x2190; Kembali ke Toko</button></div></div>);
  const stats=[["&#x1F4E6;","Total Order",orders.length,C.orange],["&#x23F3;","Pending",orders.filter(o=>o.status==="Menunggu Pembayaran").length,"#E65100"],["&#x1F69A;","Dikirim",orders.filter(o=>o.status==="Dikirim").length,"#6A1B9A"],["&#x2705;","Selesai",orders.filter(o=>o.status==="Selesai").length,C.rs]];
  return(<div style={{fontFamily:FF.body,background:C.bg,minHeight:"100vh"}}>
    {editProd&&<ProductForm initial={editProd} title="&#x270F;&#xFE0F; Edit Produk" onSave={()=>{fetchProducts();setEditProd(null);}} onCancel={()=>setEditProd(null)}/>}
    <nav style={{background:C.orange,padding:"13px 20px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
      <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:"1.3rem"}}>&#x1F4DA;</span><span style={{fontFamily:FF.display,fontSize:"1.3rem",color:"#fff"}}>BukuKiddo Admin</span></div>
      <div style={{display:"flex",gap:8}}>
        <button onClick={loadOrders} style={{background:"rgba(255,255,255,0.2)",color:"#fff",border:"none",borderRadius:20,padding:"7px 14px",cursor:"pointer",fontFamily:FF.body,fontWeight:700,fontSize:"0.85rem"}}>&#x1F504;</button>
        <button onClick={()=>setView("home")} style={{background:"rgba(255,255,255,0.2)",color:"#fff",border:"none",borderRadius:20,padding:"7px 14px",cursor:"pointer",fontFamily:FF.body,fontWeight:700,fontSize:"0.85rem"}}>&#x1F3E0; Toko</button>
        <button onClick={()=>setAuth(false)} style={{background:"transparent",color:"#fff",border:"2px solid rgba(255,255,255,0.5)",borderRadius:20,padding:"7px 14px",cursor:"pointer",fontFamily:FF.body,fontWeight:700,fontSize:"0.85rem"}}>Logout</button>
      </div>
    </nav>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,padding:"20px 20px 0"}}>
      {stats.map(([icon,l,v,col])=>(<div key={l} style={{background:"#fff",borderRadius:14,padding:"16px",border:`2px solid ${C.border}`,textAlign:"center"}}><div style={{fontSize:"1.8rem",marginBottom:2}} dangerouslySetInnerHTML={{__html:icon}}/><div style={{fontFamily:FF.display,fontSize:"2rem",color:col}}>{v}</div><div style={{fontSize:"0.78rem",color:C.muted,fontWeight:700}}>{l}</div></div>))}
    </div>
    <div style={{padding:"16px 20px 0",display:"flex",gap:8,flexWrap:"wrap"}}>
      {[["orders","&#x1F4CB; Order"],["products","&#x1F4DA; Produk"],["add","&#x2795; Tambah"],["payment","&#x1F3E6; Pembayaran"],["buyers","&#x1F465; Buyer"]].map(([t,l])=>(<button key={t} onClick={()=>setTab(t)} style={{padding:"9px 16px",borderRadius:20,cursor:"pointer",fontFamily:FF.body,fontWeight:700,fontSize:"0.85rem",background:tab===t?C.orange:"#fff",color:tab===t?"#fff":C.muted,border:`2px solid ${tab===t?C.orange:C.border}`}} dangerouslySetInnerHTML={{__html:l}}/>))}
    </div>
    <div style={{padding:"16px 20px 48px"}}>
      {tab==="orders"&&(loadingOrd?<div style={{textAlign:"center",padding:"60px",color:C.muted}}><div style={{fontSize:"3rem"}}>&#x23F3;</div><p style={{fontFamily:FF.display,fontSize:"1.2rem",marginTop:12}}>Memuat...</p></div>:orders.length===0?<div style={{textAlign:"center",padding:"60px",color:C.muted}}><div style={{fontSize:"4rem"}}>&#x1F4EB;</div><p style={{fontFamily:FF.display,fontSize:"1.3rem"}}>Belum ada pesanan</p></div>:orders.map(ord=>{
        const buyerPhone=(ord.buyer_phone||"").replace(/^0/,"62").replace(/\D/g,"");
        const hasOngkir=ord.ongkir&&parseInt(ord.ongkir)>0;
        const waMsg=encodeURIComponent("Halo "+ord.buyer_name+"! &#x1F44B;\n\nUpdate pesanan BukuKiddo:\n&#x1F4E6; ID: "+ord.id+"\n&#x1F4CA; Status: "+ord.status+(ord.courier?"\n&#x1F69A; Kurir: "+ord.courier:"")+(ord.resi?"\n&#x1F4CB; Resi: "+ord.resi:"")+(hasOngkir?"\n\n&#x1F4B0; Rincian:\n   Subtotal: "+fmt(ord.sub||0)+"\n   Ongkir  : "+fmt(ord.ongkir)+"\n   Total   : "+fmt(ord.total)+(ord.bank_name?"\n\n&#x1F3E6; Transfer ke "+ord.bank_name+": "+ord.bank_number+" a.n. "+ord.bank_account_name:"")+"\n&#x26A0;&#xFE0F; Transfer tepat sesuai nominal ya!":"")+"\n\nCek status di dashboard Pesanan Saya &#x1F4E6;\n\nTerima kasih! &#x1F4DA;");
        return(<div key={ord.id} style={{background:"#fff",borderRadius:16,padding:"20px",marginBottom:14,border:`2px solid ${C.border}`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12,flexWrap:"wrap",gap:8}}>
            <div><div style={{fontFamily:FF.display,fontSize:"1.1rem",color:C.text}}>{ord.id}</div><div style={{fontSize:"0.8rem",color:C.muted}}>{ord.buyer_name} &middot; {ord.buyer_phone} &middot; {ord.buyer_city}</div><div style={{fontSize:"0.78rem",color:C.muted}}>{new Date(ord.created_at).toLocaleString("id-ID")}</div></div>
            <StatusPill s={ord.status}/>
          </div>
          <div style={{background:C.bg,borderRadius:10,padding:"10px 14px",marginBottom:10,fontSize:"0.84rem"}}>
            {(ord.cart||[]).map(({product:p,qty},ci)=>(<div key={ci} style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span>{p.emoji||"&#x1F4D7;"} {p.name} <span style={{color:C.muted}}>&times;{qty}</span></span><span style={{fontWeight:700}}>{fmt(p.price*qty)}</span></div>))}
            <div style={{borderTop:`1px solid ${C.border}`,marginTop:6,paddingTop:6}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.84rem",color:C.muted,marginBottom:3}}><span>Ongkos Kirim</span><span style={{color:hasOngkir?C.text:C.warn}}>{hasOngkir?fmt(ord.ongkir):"&#x26A0;&#xFE0F; Belum diisi"}</span></div>
              <div style={{display:"flex",justifyContent:"space-between",fontWeight:800,color:C.orange}}><span>Total</span><span>{fmt(ord.total)}</span></div>
            </div>
          </div>
          <div style={{fontSize:"0.8rem",color:C.muted,marginBottom:10}}>&#x1F4B3; {ord.payment==="transfer"?"Transfer &#x2192; "+(ord.bank_name||"&mdash;"):"QRIS"} &middot; &#x1F69A; {ord.courier||"Belum ditentukan"} &middot; &#x1F4CD; {ord.buyer_address}, {ord.buyer_city}</div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
            <select value={ord.status} onChange={e=>updOrder(ord.id,{status:e.target.value})} style={{padding:"8px 12px",borderRadius:10,border:`2px solid ${C.border}`,fontFamily:FF.body,fontSize:"0.85rem",cursor:"pointer",background:"#fff"}}>{STATUSES.map(s=><option key={s}>{s}</option>)}</select>
            <select value={ord.courier||""} onChange={e=>updOrder(ord.id,{courier:e.target.value})} style={{padding:"8px 12px",borderRadius:10,border:`2px solid ${ord.courier?C.border:C.warn}`,fontFamily:FF.body,fontSize:"0.85rem",cursor:"pointer",background:ord.courier?"#fff":"#FFFBF0"}}><option value="">&#x1F69A; Pilih Kurir...</option>{COURIERS.map(c=><option key={c}>{c}</option>)}</select>
            <input defaultValue={ord.ongkir||""} placeholder="&#x1F4B0; Ongkir (Rp)..." onBlur={e=>updOrder(ord.id,{ongkir:e.target.value})} style={{width:130,padding:"8px 12px",borderRadius:10,border:`2px solid ${ord.ongkir?C.border:C.warn}`,fontFamily:FF.body,fontSize:"0.85rem",background:ord.ongkir?"#fff":"#FFFBF0"}}/>
            <input defaultValue={ord.resi||""} placeholder="&#x270F;&#xFE0F; Nomor resi..." onBlur={e=>updOrder(ord.id,{resi:e.target.value})} style={{flex:1,padding:"8px 12px",borderRadius:10,border:`2px solid ${C.border}`,fontFamily:FF.body,fontSize:"0.85rem",minWidth:150}}/>
            <a href={"https://wa.me/"+buyerPhone+"?text="+waMsg} target="_blank" rel="noreferrer" style={{background:"#25D366",color:"#fff",borderRadius:10,padding:"8px 12px",textDecoration:"none",fontFamily:FF.body,fontWeight:700,fontSize:"0.82rem",whiteSpace:"nowrap"}}>&#x1F4F1; WA</a>
          </div>
        </div>);
      }))}
      {tab==="products"&&(<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))",gap:14}}>
        {products.length===0&&<div style={{gridColumn:"1/-1",textAlign:"center",padding:"60px",color:C.muted}}><div style={{fontSize:"4rem"}}>&#x1F4EB;</div><p style={{fontFamily:FF.display,fontSize:"1.2rem",marginTop:12}}>Belum ada produk</p></div>}
        {products.map(p=>{const cover=p.preview_images&&p.preview_images.length>0?p.preview_images[0]:null;return(
          <div key={p.id} style={{background:"#fff",borderRadius:14,overflow:"hidden",border:`2px solid ${C.border}`}}>
            <div style={{height:140,background:"linear-gradient(135deg,#FFF0E4,#FFF5D6)",position:"relative",display:"flex",alignItems:"center",justifyContent:"center"}}>
              {cover?<img src={cover} alt={p.name} style={{width:"100%",height:"100%",objectFit:"cover"}}/>:<span style={{fontSize:"4rem"}} dangerouslySetInnerHTML={{__html:p.emoji||"&#x1F4D7;"}}/>}
              <div style={{position:"absolute",top:8,left:8}}><Badge type={p.status}/></div>
              {p.preview_images&&p.preview_images.length>0&&<div style={{position:"absolute",bottom:8,right:8,background:"rgba(0,0,0,0.5)",color:"#fff",borderRadius:10,padding:"2px 8px",fontSize:"0.68rem",fontWeight:700}}>&#x1F4F8; {p.preview_images.length}</div>}
            </div>
            <div style={{padding:"12px 14px"}}>
              <div style={{fontFamily:FF.display,fontSize:"0.92rem",color:C.text,marginBottom:4}}>{p.name}</div>
              <p style={{fontSize:"0.78rem",color:C.muted,margin:"0 0 8px",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{p.desc||p.description||"-"}</p>
              <div style={{fontFamily:FF.display,fontSize:"1.05rem",color:C.orange,marginBottom:10}}>{fmt(p.price)}</div>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>setEditProd(p)} style={{flex:1,background:C.poBg,color:C.orange,border:`1.5px solid ${C.orange}`,borderRadius:10,padding:"7px",cursor:"pointer",fontFamily:FF.body,fontWeight:700,fontSize:"0.82rem"}}>&#x270F;&#xFE0F; Edit</button>
                <button onClick={()=>delProd(p.id)} style={{flex:1,background:"#fff0f0",color:"#e74c3c",border:"1.5px solid #fcc",borderRadius:10,padding:"7px",cursor:"pointer",fontFamily:FF.body,fontWeight:700,fontSize:"0.82rem"}}>&#x1F5D1;&#xFE0F; Hapus</button>
              </div>
            </div>
          </div>
        );})}
      </div>)}
      {tab==="add"&&<ProductForm title="&#x2795; Tambah Produk Baru" onSave={()=>{fetchProducts();alert("&#x2705; Produk berhasil ditambahkan!");}}/>}
      {tab==="payment"&&<BankManager banks={banks} fetchBanks={fetchBanks} qrisUrl={qrisUrl} fetchQris={fetchQris}/>}
      {tab==="buyers"&&<BuyerManager/>}
    </div>
  </div>);
}

export default function App(){
  const[view,setView]=useState("home");
  const[products,setProducts]=useState([]);const[loading,setLoading]=useState(true);
  const[cart,setCart]=useState([]);const[selected,setSelected]=useState(null);
  const[currentOrder,setCurOrd]=useState(null);
  const[auth,setAuth]=useState(false);
  const[filter,setFilter]=useState("all");const[search,setSearch]=useState("");
  const[banks,setBanks]=useState([]);const[qrisUrl,setQrisUrl]=useState("");
  const[buyer,setBuyer]=useState(()=>{try{const s=sessionStorage.getItem(SESSION_KEY);return s?JSON.parse(s):null;}catch{return null;}});
  const onLogin=(b)=>{
    setBuyer(b);
    try{sessionStorage.setItem(SESSION_KEY,JSON.stringify(b));}catch{}
  };
  const onLogout=()=>{setBuyer(null);try{sessionStorage.removeItem(SESSION_KEY);}catch{}};
  useEffect(()=>{fetchProducts();fetchBanks();fetchQris();},[]);
  const fetchProducts=async()=>{setLoading(true);const{data}=await supabase.from("products").select("*").order("created_at",{ascending:false});if(data)setProducts(data.map(mapProduct));setLoading(false);};
  const fetchBanks=async()=>{const{data}=await supabase.from("bank_accounts").select("*").order("created_at");if(data)setBanks(data);};
  const fetchQris=async()=>{const{data}=await supabase.from("settings").select("value").eq("key","qris_url").maybeSingle();if(data)setQrisUrl(data.value||"");};
  const addToCart=(product,qty)=>setCart(c=>{const ex=c.find(i=>i.product.id===product.id);return ex?c.map(i=>i.product.id===product.id?{...i,qty:i.qty+qty}:i):[...c,{product,qty}];});
  const placeOrder=async({f,cart,sub,total,bank})=>{
    const id=genId();
    const payload={id,buyer_name:f.name,buyer_phone:normalizePhone(f.phone),buyer_address:f.address,buyer_city:f.city,payment:f.payment,notes:f.notes,bank_name:bank?.bank_name||null,bank_number:bank?.account_number||null,bank_account_name:bank?.account_name||null,cart,sub,ongkir:0,total,status:"Menunggu Pembayaran",buyer_id:buyer?.id||null};
    const{error}=await supabase.from("orders").insert([payload]);
    if(error){alert("Gagal: "+error.message);return;}
    setCurOrd({...payload,created_at:new Date().toISOString()});setCart([]);setView("payment");
  };
  const cartCount=cart.reduce((s,i)=>s+i.qty,0);
  const sp={buyer,onLogout};
  return(<>
    {view==="home"&&<HomePage products={products} loading={loading} cart={cart} setView={setView} setSelected={setSelected} filter={filter} setFilter={setFilter} search={search} setSearch={setSearch} {...sp}/>}
    {view==="product"&&selected&&<ProductPage product={selected} onAdd={addToCart} setView={setView} cart={cart} {...sp}/>}
    {view==="cart"&&<CartPage cart={cart} setCart={setCart} setView={setView} {...sp}/>}
    {view==="checkout"&&<CheckoutPage cart={cart} setView={setView} onPlace={placeOrder} banks={banks} qrisUrl={qrisUrl} buyer={buyer}/>}
    {view==="payment"&&currentOrder&&<PaymentPage order={currentOrder} setView={setView} qrisUrl={qrisUrl}/>}
    {view==="auth"&&<BuyerAuth setView={setView} onLogin={onLogin} hasCart={cart.length>0}/>}
    {view==="dashboard"&&<BuyerDashboard setView={setView} {...sp}/>}
    {view==="admin"&&<AdminPage products={products} fetchProducts={fetchProducts} setView={setView} auth={auth} setAuth={setAuth} banks={banks} fetchBanks={fetchBanks} qrisUrl={qrisUrl} fetchQris={fetchQris}/>}
  </>);
}
