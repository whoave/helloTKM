// soket bağlantısı
var socket = io();
let oyuncu;
let oyuncu1,oyuncu2;
socket.on('oyuncu1Bilgi',(data)=>{
  oyuncu1 = data;
});
socket.on('oyuncu2Bilgi',(data)=>{
  oyuncu2 = data;
});
// oyuncu tanımlama
oyuncuTanimla = () =>{
  socket.on('oyuncu1Bilgi',(data)=>{
    oyuncu1 = data;
  });
  socket.on('oyuncu2Bilgi',(data)=>{
    oyuncu2 = data;
  });
}
// DOM elementler
const oyun = "helloTMK v1.0.0 multi beta"
const idBar1 = document.getElementById('insan');
const idBar2 = document.getElementById('bilgisayar');
const skorInsan_span = document.getElementById("skorInsan");
const skorBilgisayar_span = document.getElementById("skorBilgisayar");
const secimTas = document.getElementById("secimTas");
const secimKagit = document.getElementById("secimKagit");
const secimMakas = document.getElementById("secimMakas");
const bilgi = document.getElementById('bilgi');
const durum = document.querySelector('.durum');
const kurtarici = document.getElementById("kurtar");
const yukPuani_i = document.getElementsByClassName('yukPuani')[0].getElementsByTagName("i")[0];
const odaAc = document.getElementById("odaAc");
const odayaBaglan = document.getElementById("odayaBaglan");
let odaID = document.getElementById("odaID");
// DOM yuk butonlar
const yukseltTas = document.getElementById("yukseltTas");
const yukseltKagit = document.getElementById("yukseltKagit");
const yukseltMakas = document.getElementById("yukseltMakas");
// DOM kilitler
const tasKilit = document.getElementById("tasLimit");
const kagitKilit = document.getElementById("kagitLimit");
const makasKilit = document.getElementById("makasLimit");
let sira;

// --------  ODA AÇ
odaAc.addEventListener('click',()=>{
  odaIDRast = Math.random().toString(36).slice(-5);
  socket.emit('odaAc',odaIDRast);
  socket.on('odabilgisi',(data)=>{
    if(data == 'acildi'){
      bilgi.innerHTML="Oda: '"+odaIDRast+"' açıldı! 2. Oyuncu Bekleniyor...";
      odaAc.setAttribute('style','display:none;');
      odayaBaglan.setAttribute('style','display:none;');
      odaID.setAttribute('style','display:none;');
      document.getElementById('odaForm').setAttribute('style','display:none;');
    }     

  });
});
// ---------
// --------- ODA BAĞLAN
odayaBaglan.addEventListener('click',()=>{
  socket.emit('odayaBaglan',odaID.value);
});
// ---------
// --------- Oyuncu T.
let benimID = "";
socket.on("yeniOyuncu",(data)=>{
  document.getElementById("baglantiID").innerHTML=oyun;
  benimID = data;
});
// ---------

// -------- ALERT BOXs
socket.on("asiri",(data)=>{
  alert(data);
});
// --------



// --------------------  OYUN BAŞLAT
socket.on('oyunuBaslat',(data)=>{
  oyuncuTanimla();
  bilgi.innerHTML = "Oyun Başladı! Senin Sıran!";
  if(benimID == oyuncu1.id){
    idBar1.innerHTML="Sen";
    idBar2.innerHTML="Rakip";
    idBar2.setAttribute('style','right:-20px');
    bilgi.innerHTML="Oyun Başladı! Senin Sıran!";
  } 
  if(benimID == oyuncu2.id){
    idBar1.setAttribute('style','left:-20px');
    idBar1.innerHTML="Rakip";
    idBar2.innerHTML="Sen";
    bilgi.innerHTML="Oyun Başladı! Rakibin Sırası!";
  }

  odaAc.setAttribute('style','display:none;');
  odayaBaglan.setAttribute('style','display:none;');
  odaID.setAttribute('style','display:none;');
  document.getElementById('odaForm').setAttribute('style','display:none;');
  baslat();
  console.log(oyuncu1.id+" .VS. "+oyuncu2.id);
});
// -------------------------------------



  // ------ TAM BAŞLAMA ----- //
  // ------ HAMLE -----
  baslat = () =>{
    oyuncuTanimla();
    console.log("Oyun Başladı!");
      secimTas.addEventListener('click',() => {
        oyuncuTanimla();
        console.log("Sıradaki oyuncu: " + oyuncu1.id);
        if (oyuncu1.sira == "e"){
          if(benimID == oyuncu1.id){
            socket.emit('hamleKaydet',['oyuncu1','t',oyuncu1.id,oyuncu2.id]);
            oyuncuTanimla();
            durum.innerHTML="<img src='img/yukleniyor.svg'> Hamle yapıldı! Rakip Bekleniyor.";
          }else{
            durum.innerHTML="<img src='img/yukleniyor.svg'> Rakibin Sırası!";
          }
        }else if(oyuncu2.sira == "e"){
          if(benimID == oyuncu2.id){
            socket.emit('hamleKaydet',['oyuncu2','t',oyuncu1.id,oyuncu2.id]);
            oyuncuTanimla();
            durum.innerHTML="<img src='img/yukleniyor.svg'> Hamle yapıldı! Rakip Bekleniyor.";
          }else{
            durum.innerHTML="<img src='img/yukleniyor.svg'> Rakibin Sırası!";
          }
        }
          
      });

      secimMakas.addEventListener('click',() => {
        oyuncuTanimla();
        console.log("Sıradaki oyuncu: " + oyuncu1.id);
        if (oyuncu1.sira == "e"){
          if(benimID == oyuncu1.id){
            socket.emit('hamleKaydet',['oyuncu1','m',oyuncu1.id,oyuncu2.id]);
            oyuncuTanimla();
            durum.innerHTML="<img src='img/yukleniyor.svg'> Hamle yapıldı! Rakip Bekleniyor.";
          }else{
            durum.innerHTML="<img src='img/yukleniyor.svg'> Rakibin Sırası!";
          }
        }else if(oyuncu2.sira == "e"){
          if(benimID == oyuncu2.id){
            socket.emit('hamleKaydet',['oyuncu2','m',oyuncu1.id,oyuncu2.id]);
            oyuncuTanimla();
            durum.innerHTML="<img src='img/yukleniyor.svg'> Hamle yapıldı! Rakip Bekleniyor.";
          }else{
            durum.innerHTML="<img src='img/yukleniyor.svg'> Rakibin Sırası!";
          }
        }
          
      });

      secimKagit.addEventListener('click',() => {
        oyuncuTanimla();
        console.log("Sıradaki oyuncu: " + oyuncu1.id);
        if (oyuncu1.sira == "e"){
          if(benimID == oyuncu1.id){
            socket.emit('hamleKaydet',['oyuncu1','k',oyuncu1.id,oyuncu2.id]);
            oyuncuTanimla();
            durum.innerHTML="<img src='img/yukleniyor.svg'> Hamle yapıldı! Rakip Bekleniyor.";
          }else{
            durum.innerHTML="<img src='img/yukleniyor.svg'>  Rakibin Sırası!";
          }
        }else if(oyuncu2.sira == "e"){
          if(benimID == oyuncu2.id){
            socket.emit('hamleKaydet',['oyuncu2','k',oyuncu1.id,oyuncu2.id]);
            oyuncuTanimla();
            durum.innerHTML="<img src='img/yukleniyor.svg'> Hamle yapıldı! Rakip Bekleniyor.";
          }else{
            durum.innerHTML="<img src='img/yukleniyor.svg'>  Rakibin Sırası!";
          }
        }
          

      });
  // -------- HAMLE SON -------

  // HARF>METIN
      metinlestir = (harf) => {
          switch (harf) {
            case 't':
              return 'Taş';
            break;
            case 'k':
              return 'Kağıt';
            break;
            case 'm':
              return 'Makas';
            break;
          }
      }
  // ----------------

  // ----------- OYUN SONUC -------- //
    socket.on('kazanan',(data)=>{
      if(data.id==oyuncu1.id){
        bilgiVer('oyuncu1',oyuncu2.hamleleri[9],oyuncu1.hamleleri[9]);
      }else if(data.id==oyuncu2.id){
        bilgiVer('oyuncu2',oyuncu2.hamleleri[9],oyuncu1.hamleleri[9]);
      }else if(data=='berabere'){
        bilgiVer('berabere',oyuncu2.hamleleri[9],oyuncu1.hamleleri[9]);
      }
    });

    bilgiVer = (durumAtak,pc,insan) => {
      let oyuncu2Level;
      let oyuncu1Level;
      pc = oyuncu2.hamleleri[9];
      insan = oyuncu1.hamleleri[9];
      switch(pc){
        case "t":
        oyuncu2Level = oyuncu2.tHasar;
        break;
        case "k":
        oyuncu2Level = oyuncu2.kHasar;
        break;
        case "m":
        oyuncu2Level = oyuncu2.mHasar;
        break;
      }
      switch(insan){
        case "t":
        oyuncu1Level = oyuncu1.tHasar;
        break;
        case "k":
        oyuncu1Level = oyuncu1.kHasar;
        break;
        case "m":
        oyuncu1Level = oyuncu1.mHasar;
        break;
      }
      // --- YETENEK SEVIE BİLDİRGELERİ ----
      let pcKisa,insanKisa;
      if(benimID == oyuncu1.id){
        pcKisa= oyuncu2Level.toString().fontsize(2).sup().fontcolor('red');
        insanKisa = oyuncu1Level.toString().fontsize(2).sup().fontcolor('green');
      }else{
        pcKisa = oyuncu2Level.toString().fontsize(2).sup().fontcolor('green');
        insanKisa = oyuncu1Level.toString().fontsize(2).sup().fontcolor('red');
      }
      // --------------------------------
    
      
      if(durumAtak=="oyuncu1"){
        if(benimID == oyuncu1.id){
          bilgi.innerHTML=`${metinlestir(pc)}${pcKisa}, ${metinlestir(insan)}${insanKisa} ile yok edildi. Kazandın!`;
          skorInsan_span.innerHTML = oyuncu1.skor;
          document.getElementById(insan).classList.add('yesil');
          setInterval(()=>{document.getElementById(insan).classList.remove('yesil')},400);
          durum.innerHTML = "Sıra Sende!";
        }else{
          bilgi.innerHTML=`${metinlestir(pc)}${pcKisa}, ${metinlestir(insan)}${insanKisa} ile yok edildi. Kaybettin!`;
          skorInsan_span.innerHTML = oyuncu1.skor;
          document.getElementById(pc).classList.add('kirmizi');
          setInterval(()=>{document.getElementById(pc).classList.remove('kirmizi')},400);
          durum.innerHTML="<img src='img/yukleniyor.svg'> Rakip Bekleniyor.";
        }
      }
      if(durumAtak=="oyuncu2"){
        if(benimID == oyuncu2.id){
          bilgi.innerHTML=`${metinlestir(pc)}${pcKisa} ile ${metinlestir(insan)}${insanKisa} mahvedildi. Kazandın!`;
          skorBilgisayar_span.innerHTML = oyuncu2.skor;
          document.getElementById(pc).classList.add('yesil');
          setInterval(()=>{document.getElementById(pc).classList.remove('yesil')},400);
        }else{
          bilgi.innerHTML=`${metinlestir(pc)}${pcKisa} ile ${metinlestir(insan)}${insanKisa} mahvedildi. Kaybettin!`;
          skorBilgisayar_span.innerHTML = oyuncu2.skor;
          document.getElementById(insan).classList.add('kirmizi');
          setInterval(()=>{document.getElementById(insan).classList.remove('kirmizi')},400);
          durum.innerHTML="<img src='img/yukleniyor.svg'> Rakip Bekleniyor.";
        }
      }
      if(durumAtak=="berabere"){
        if(benimID == oyuncu1.id){
          bilgi.innerHTML=`${metinlestir(pc)}${pcKisa} ve ${metinlestir(insan)}${insanKisa}. Berabere!`;         
          document.getElementById(insan).classList.add('gri');
          setInterval(()=>{document.getElementById(insan).classList.remove('gri')},400);
          durum.innerHTML = "Sıra Sende!";
        }else{
          bilgi.innerHTML=`${metinlestir(pc)}${pcKisa} ve ${metinlestir(insan)}${insanKisa}. Berabere!`;
          document.getElementById(pc).classList.add('gri');
          setInterval(()=>{document.getElementById(pc).classList.remove('gri')},400);
          durum.innerHTML="<img src='img/yukleniyor.svg'> Rakip Bekleniyor.";
        }
      }
    }     
  // -----------------------------------------------
       
  // ---------------- ceza -----------------
    cezaci = () =>{
    if(benimID == oyuncu1.id){
      if(oyuncu1.cezali == "t"){
        if(oyuncu1.cezaPuani > 0){
          tasKilit.setAttribute("style","display:inline-block !important;");
          secimTas.setAttribute('style','cursor:not-allowed  !important;');
          secimTas.classList.add('limitKilidi');
          durum.innerHTML = "Taşa 3 Tur ceza".fontcolor("red");
          tasKilit.innerHTML=oyuncu1.cezaPuani;
        }
      }else if(oyuncu1.cezali == ""){
        tasKilit.setAttribute("style","display:none  !important;");
        secimTas.setAttribute('style','cursor:pointer  !important;');
        secimTas.classList.remove('limitKilidi');
      }
    
    
      if(oyuncu1.cezali == "k"){
        if(oyuncu1.cezaPuani > 0){
          kagitKilit.setAttribute("style","display:inline-block  !important;");
          secimKagit.setAttribute('style','cursor:not-allowed  !important;');
          secimKagit.classList.add('limitKilidi');
          durum.innerHTML = "Kağıda 3 Tur ceza".fontcolor("red");
          kagitKilit.innerHTML=oyuncu1.cezaPuani;
        }
      }else if(oyuncu1.cezali == ""){
        kagitKilit.setAttribute("style","display:none  !important;");
        secimKagit.setAttribute('style','cursor:pointer  !important;');
        secimKagit.classList.remove('limitKilidi');
      }

    
      if(oyuncu1.cezali == "m"){
        if(oyuncu1.cezaPuani > 0){
          makasKilit.setAttribute("style","display:inline-block  !important;");
          secimMakas.setAttribute('style','cursor:not-allowed  !important;');
          secimMakas.classList.add('limitKilidi');
          durum.innerHTML = "Makasa 3 Tur ceza".fontcolor("red");
          makasKilit.innerHTML=oyuncu1.cezaPuani;
        }
      }else if(oyuncu1.cezali == ""){
        makasKilit.setAttribute("style","display:none !important;");
        secimMakas.setAttribute('style','cursor:pointer !important;');
        secimMakas.classList.remove('limitKilidi');
      }





    
    }else{






      if(oyuncu2.cezali == "t"){
        if(oyuncu2.cezaPuani > 0){
          tasKilit.setAttribute("style","display:inline-block !important;");
          secimTas.setAttribute('style','cursor:not-allowed !important;');
          secimTas.classList.add('limitKilidi');
          durum.innerHTML = "Taşa 3 Tur ceza".fontcolor("red");
          tasKilit.innerHTML=oyuncu2.cezaPuani;
        }
      }else if(oyuncu2.cezali == ""){
        tasKilit.setAttribute("style","display:none !important;");
        secimTas.setAttribute('style','cursor:pointer !important;');
        secimTas.classList.remove('limitKilidi');
      }
  
    
      if(oyuncu2.cezali == "k"){
        if(oyuncu2.cezaPuani > 0){
          kagitKilit.setAttribute("style","display:inline-block !important;");
          secimKagit.setAttribute('style','cursor:not-allowed !important;');
          secimKagit.classList.add('limitKilidi');
          durum.innerHTML = "Kağıda 3 Tur ceza".fontcolor("red");
          kagitKilit.innerHTML=oyuncu2.cezaPuani;
        }
      }else if(oyuncu2.cezali == ""){
        kagitKilit.setAttribute("style","display:none; !important");
        secimKagit.setAttribute('style','cursor:pointer; !important');
        secimKagit.classList.remove('limitKilidi');
      }
    
    
      if(oyuncu2.cezali == "m"){
        if(oyuncu2.cezaPuani > 0){
          makasKilit.setAttribute("style","display:inline-block !important;");
          secimMakas.setAttribute('style','cursor:not-allowed !important;');
          secimMakas.classList.add('limitKilidi');
          durum.innerHTML = "Makasa 3 Tur ceza".fontcolor("red");
          makasKilit.innerHTML=oyuncu2.cezaPuani;
        }
      }else if(oyuncu2.cezali == ""){
        makasKilit.setAttribute("style","display:none !important;");
        secimMakas.setAttribute('style','cursor:pointer !important;');
        secimMakas.classList.remove('limitKilidi');
      }
    

    }

      
      
    }  
  // ----------------------------
  
  // ---- Yük kontrolleri -----
  yukseltmeKontrol = () => {
      if(benimID == oyuncu1.id){
        yukPuani_i.innerHTML = oyuncu1.yPuani;
        yukseltKagit.innerHTML = "+ ("+oyuncu1.kHasar+")";
        yukseltMakas.innerHTML = "+ ("+oyuncu1.mHasar+")";
        yukseltTas.innerHTML = "+ ("+oyuncu1.tHasar+")";
        if(oyuncu1.yPuani > 0){
          for(var x = 0;x<3;x++){
            document.querySelector(".secimler").getElementsByTagName("span")[x].classList.add('yesil');
          }
        }
        if(oyuncu1.yPuani <= 0){
          oyuncu1.yPuani=0;
          for(var x = 0;x<3;x++){
            document.querySelector(".secimler").getElementsByTagName("span")[x].classList.remove('yesil');
          }
        }
      }else{
        yukPuani_i.innerHTML = oyuncu2.yPuani;
        yukseltKagit.innerHTML = "+ ("+oyuncu2.kHasar+")";
        yukseltMakas.innerHTML = "+ ("+oyuncu2.mHasar+")";
        yukseltTas.innerHTML = "+ ("+oyuncu2.tHasar+")";
        if(oyuncu2.yPuani > 0){
          for(var x = 0;x<3;x++){
            document.querySelector(".secimler").getElementsByTagName("span")[x].classList.add('yesil');
          }
        }
        if(oyuncu2.yPuani <= 0){
          oyuncu2.yPuani=0;
          for(var x = 0;x<3;x++){
            document.querySelector(".secimler").getElementsByTagName("span")[x].classList.remove('yesil');
          }
        }
      }
  }
  //---------------------

  // ---- YÜK KULLAN -----
  yukseltmeYap = () =>{
    oyuncuTanimla();
    if(benimID == oyuncu1.id){
      yukseltKagit.addEventListener('click',()=>{
        if(oyuncu1.yPuani>0){
        socket.emit('U1Y',[oyuncu1.id,oyuncu2.id,"k"]);
        oyuncuTanimla();
        }
      });
      yukseltMakas.addEventListener('click',()=>{
        if(oyuncu1.yPuani>0){
        socket.emit('U1Y',[oyuncu1.id,oyuncu2.id,"m"]);
        oyuncuTanimla();
      }
      });
      yukseltTas.addEventListener('click',()=>{
        if(oyuncu1.yPuani>0){
        socket.emit('U1Y',[oyuncu1.id,oyuncu2.id,"t"]);
        oyuncuTanimla();
        }
      });
    }else if(benimID == oyuncu2.id){
      yukseltKagit.addEventListener('click',()=>{
        if(oyuncu2.yPuani>0){
        socket.emit('B1Y',[oyuncu1.id,oyuncu2.id,"k"]);
        oyuncuTanimla();
        }
      });
      yukseltMakas.addEventListener('click',()=>{
        if(oyuncu2.yPuani>0){
        socket.emit('B1Y',[oyuncu1.id,oyuncu2.id,"m"]);
        oyuncuTanimla();
      }
      });
      yukseltTas.addEventListener('click',()=>{
        if(oyuncu2.yPuani>0){
        socket.emit('B1Y',[oyuncu1.id,oyuncu2.id,"t"]);
        oyuncuTanimla();
        }
      });
    }
  }
  // -----------
  // ---------- PANIK -------------
      // PANIK KONTROL
    kurtariciFonk = () =>{
      if(benimID==oyuncu1.id){
        socket.emit('kurtaricianlik',[oyuncu1.id,oyuncu2.id,'o1']);
      }else if(benimID==oyuncu2.id){
        socket.emit('kurtaricianlik',[oyuncu1.id,oyuncu2.id,'o2']);
      }
      socket.on('kurtarici',(data)=>{
        if(data[0]=="o1" && data[1] > 12){
          if(benimID == oyuncu1.id){
            kurtarici.setAttribute("style","display:inline-block !important;");
          }
        }else if(data[0]=="o2" && data[1] > 12){
          if(benimID == oyuncu2.id){
            kurtarici.setAttribute("style","display:inline-block !important;");
          }
        }
      });
    }
      // ------------------------
      // PANIK AKTIF
      kurtariciButon = () =>{
        kurtarici.addEventListener("click",()=>{
          if(benimID == oyuncu1.id){
            kurtarici.setAttribute("style","display:none !important;");
            oyuncuTanimla();
            socket.emit('kButonB',[oyuncu1.id,oyuncu2.id,'o1']);
                oyuncuTanimla();
                skorBilgisayar_span.innerHTML = (oyuncu2.skor-2).toString().fontcolor("red");
                yukPuani_i.innerHTML = oyuncu1.yPuani.toString().fontcolor("green");
          }
          if(benimID == oyuncu2.id){
            kurtarici.setAttribute("style","display:none !important;");
            oyuncuTanimla();
            socket.emit('kButonB',[oyuncu1.id,oyuncu2.id,'o2']);
                oyuncuTanimla();
                skorInsan_span.innerHTML = (oyuncu1.skor-2).toString().fontcolor("red");
                yukPuani_i.innerHTML = oyuncu1.yPuani.toString().fontcolor("green");
          }
        });
      }
      // ----------------------
  //-----------

// ----- S.HAMLE SORGULA --------
sHamleSorgula = ()=>{
  socket.on('siralar',(data)=>{
    if(benimID==oyuncu2.id){
      if(data=="e"){
        durum.innerHTML="<img src='img/yukleniyor.svg'> Benim Sıram!";
      }
    }else{
      if(data!="e"){
        durum.innerHTML="<img src='img/yukleniyor.svg'> Benim Sıram!";
      }
    }
  });
}
// -------------------------------

setInterval(sHamleSorgula,500);
setInterval(cezaci,300);
setInterval(kurtariciFonk,300);
setInterval(yukseltmeKontrol,300);
yukseltmeYap();
kurtariciButon();
}

topOdaSay = ()=>{
  socket.on('aktifodasayisi',(data)=>{
    document.getElementById('aktifodasayisi').innerHTML = "Anlık Aktif Oda Sayısı : "+data;
  });
}
setInterval(topOdaSay,1000);

// mertcanuslu18@gmail.com
