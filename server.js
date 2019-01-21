// --------- server gerekli
var express = require('express');
var path = require('path')
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
app.use(express.static(path.join(__dirname, '/client')));
// --------------------------
//  =================  kodlar ============================= // 


	// ---------- obje tabanlı oyuncu
	oyuncu = function(_id) {
		this.id=_id;
		this.skor=0;
		this.yPuani=0;
		this.hamleleri=["x","x","x","x","x","x","x","x","x","x"];
		this.tHasar=1;
		this.mHasar=1;
		this.kHasar=1;
		this.cezaPuani=0;
    	this.cezali="";
		this.sira = "h";
		this.odasi ="";
		this.tAdet=0;
		this.mAdet=0;
		this.kAdet=0;
  }
  let oyuncuS = [];
	// ---------------------
 
// -------- SOKET BAĞLANDI -----------
io.sockets.on('connection',function(socket){
	let odaSayisi;
// ---------- ODA AÇ --------- 
socket.on('odaAc', function(data){
		let odaIci = io.sockets.adapter.rooms['oda-'+data];
		if(odaIci == undefined){
		oyuncuS[socket.id] = new oyuncu(socket.id);
		oyuncuS[socket.id].sira = "e";
		oyuncuS[socket.id].odasi = data;
		odaSayisi = data;
		console.log("yeni oda: " +'oda-'+odaSayisi);
		socket.join('oda-' + odaSayisi);
		io.to('oda-'+data).emit('oyuncu1Bilgi',oyuncuS[socket.id]);
		socket.emit('odabilgisi',"acildi");
		}else{
			socket.emit('asiri',"Oda şuan kurulu!");
		}
});
// ----------------------------------

// -------- YENI BAĞLANTI ------------
	 socket.emit("yeniOyuncu",socket.id);
// -----------------------------------

// -------------- ODA BAĞLAN --------------
socket.on('odayaBaglan', function(data){
			
			let odaIci = io.sockets.adapter.rooms['oda-'+data];

			if(odaIci != undefined){

				if(odaIci.length<2){
					oyuncuS[socket.id] = new oyuncu(socket.id);
					oyuncuS[socket.id].sira = "h";
					oyuncuS[socket.id].odasi = data;
					odaSayisi = data;
					console.log("bağlanılan oda: " +'oda-'+odaSayisi);
					socket.join('oda-' + odaSayisi);
					io.of('/').in('oda-'+odaSayisi).clients((error, clients) => {
						if (error) throw error;
						io.to('oda-'+data).emit('oyuncu1Bilgi',oyuncuS[clients[0]]);
						io.to('oda-'+data).emit('oyuncu2Bilgi',oyuncuS[socket.id]);
						io.to('oda-'+data).emit('oyunuBaslat','Oyun başlasın');
					});
				}else if(odaIci.length>=2){
					socket.emit('asiri',"Odada şuan 2 kişi var. Bağlanamazsın!");
				}
				
			}else{
				socket.emit('asiri','Oda henüz açılmamış.');
			}

});
// -------------------------------------

// ------------ SERVER > CLIENT ---------------- 
bilgiGonder = (o1,o2)=>{
	io.to('oda-'+oyuncuS[o2].odasi).emit('oyuncu1Bilgi',oyuncuS[o1]);
	io.to('oda-'+oyuncuS[o2].odasi).emit('oyuncu2Bilgi',oyuncuS[o2]);
	io.to('oda-'+oyuncuS[o2].odasi).emit('siralar',oyuncuS[o2].sira);
}
// ---------------------------------------------

// --------- HAMLE LIMIT -----
hamleLimit = (oyuncu,o1,o2)=>{
		oyuncu.tAdet = 0;
		oyuncu.mAdet = 0;
		oyuncu.kAdet = 0;
		oyuncu.hamleleri.forEach(element => {
		  if(element == "t"){
			oyuncu.tAdet++
		  }
		  if(element == "m"){
			oyuncu.mAdet++;
		  }
		  if(element == "k"){
			oyuncu.kAdet++;
		  }
		});
		if(oyuncu.cezali == ""){
		  if(oyuncu.tAdet >= 7){
			oyuncu.cezaPuani = 3;
			oyuncu.cezali = "t";
			oyuncu.tAdet=0;
			oyuncu.mAdet=0;
			oyuncu.kAdet=0;
			oyuncu.hamleleri=["x","x","x","x","x","x","x","x","x",oyuncu.hamleleri[9]];
			bilgiGonder(o1,o2);
		  }
		  if(oyuncu.mAdet >= 7){
			oyuncu.cezaPuani = 3;
			oyuncu.cezali = "m";
			oyuncu.tAdet=0;
			oyuncu.mAdet=0;
			oyuncu.kAdet=0;
			oyuncu.hamleleri=["x","x","x","x","x","x","x","x","x",oyuncu.hamleleri[9]];
			bilgiGonder(o1,o2);
		  }
		  if(oyuncu.kAdet >= 7){
			oyuncu.cezaPuani = 3;
			oyuncu.cezali = "k";
			oyuncu.tAdet=0;
			oyuncu.mAdet=0;
			oyuncu.kAdet=0;
			oyuncu.hamleleri=["x","x","x","x","x","x","x","x","x",oyuncu.hamleleri[9]];
			bilgiGonder(o1,o2);
		  }
		}
		bilgiGonder(o1,o2);
	}
// --------------------

// ---------  HAMLE AL & KAYDET --------------
socket.on('hamleKaydet',(data)=>{
	if(data[0]=='oyuncu1'){
		if(oyuncuS[data[2]].cezali == data[1] && oyuncuS[data[2]].cezaPuani > 0 ){
		}else{
			oyuncuS[data[3]].sira = "e";
			oyuncuS[data[2]].sira = "h";
			bilgiGonder(data[2],data[3]);
			hamleKaydet(data[1],oyuncuS[data[2]],data[2],data[3]);
		}
	}else if(data[0] == 'oyuncu2'){
		if(oyuncuS[data[3]].cezali == data[1] && oyuncuS[data[3]].cezaPuani > 0){ 
		}else{
			oyuncuS[data[3]].sira = "h";
			oyuncuS[data[2]].sira = "e";
			bilgiGonder(data[2],data[3]);
			hamleKaydet(data[1],oyuncuS[data[3]],data[2],data[3]);
			savasiBaslat(oyuncuS[data[2]],oyuncuS[data[3]]);
			}
	}
	io.to('oda-'+data[1].odasi).emit('oyuncu1Bilgi',oyuncuS[data[2]]);
	io.to('oda-'+data[1].odasi).emit('oyuncu2Bilgi',oyuncuS[data[3]]);
});
// ------------------------------------------


//  ----------- HAMLE DEPOLA ---------------
hamleKaydet = (yeniHamle,oyuncu,o1,o2) =>{
	oyuncu.hamleleri[0] = oyuncu.hamleleri[1];
	oyuncu.hamleleri[1] = oyuncu.hamleleri[2];
	oyuncu.hamleleri[2] = oyuncu.hamleleri[3];
	oyuncu.hamleleri[3] = oyuncu.hamleleri[4];
	oyuncu.hamleleri[4] = oyuncu.hamleleri[5];
	oyuncu.hamleleri[5] = oyuncu.hamleleri[6];
	oyuncu.hamleleri[6] = oyuncu.hamleleri[7];
	oyuncu.hamleleri[7] = oyuncu.hamleleri[8];
	oyuncu.hamleleri[8] = oyuncu.hamleleri[9];
	oyuncu.hamleleri[9] = yeniHamle;
  
	oyuncu.cezaPuani--;
  
	if(oyuncu.cezaPuani <= 0){
	  oyuncu.cezaPuani = 0;
	  oyuncu.cezali="";
	}
	hamleLimit(oyuncu,o1,o2);
	bilgiGonder(o1,o2);
  }
// -------------------------------------------

// ----------------- SAVAŞI BAŞLAT ------------ 
savasiBaslat = (o1,o2) => {
	insan = o1.hamleleri[9];
	pc = o2.hamleleri[9];
	switch (insan+pc) {
	  case 'tm':
	  if(oyuncuS[o1.id].tHasar >= oyuncuS[o2.id].mHasar){
		oyuncuS[o1.id].skor++;
		oyuncuS[o1.id].yPuani++;
		bilgiGonder(o1.id,o2.id);
		io.to('oda-'+o1.odasi).emit('kazanan',oyuncuS[o1.id]);
	  }
	  else{
		oyuncuS[o2.id].skor++;
		oyuncuS[o2.id].yPuani++;
		bilgiGonder(o1.id,o2.id);
		io.to('oda-'+o1.odasi).emit('kazanan',oyuncuS[o2.id]);
	  }
	  break;
	  case 'kt':
	  if(oyuncuS[o1.id].mHasar >= oyuncuS[o2.id].tHasar){
		oyuncuS[o1.id].skor++;
		oyuncuS[o1.id].yPuani++;
		bilgiGonder(o1.id,o2.id);
		io.to('oda-'+o1.odasi).emit('kazanan',oyuncuS[o1.id]);
	  }
	  else{
		oyuncuS[o2.id].skor++;
		oyuncuS[o2.id].yPuani++;
		bilgiGonder(o1.id,o2.id);
		io.to('oda-'+o1.odasi).emit('kazanan',oyuncuS[o2.id]);
	  }
	  break;
	  case 'mk':
	  if(oyuncuS[o1.id].mHasar >= oyuncuS[o2.id].kHasar){
		oyuncuS[o1.id].skor++;
		oyuncuS[o1.id].yPuani++;
		bilgiGonder(o1.id,o2.id);
		io.to('oda-'+o1.odasi).emit('kazanan',oyuncuS[o1.id]);
	  }
	  else{
		oyuncuS[o2.id].skor++;
		oyuncuS[o2.id].yPuani++;
		bilgiGonder(o1.id,o2.id);
		io.to('oda-'+o1.odasi).emit('kazanan',oyuncuS[o2.id]);
	  }
	  break;


	  case 'mt':
	  if(oyuncuS[o1.id].mHasar > oyuncuS[o2.id].tHasar){
		oyuncuS[o1.id].skor++;
		oyuncuS[o1.id].yPuani++;
		bilgiGonder(o1.id,o2.id);
		io.to('oda-'+o1.odasi).emit('kazanan',oyuncuS[o1.id]);
	  }
	  else{
		oyuncuS[o2.id].skor++;
		oyuncuS[o2.id].yPuani++;
		bilgiGonder(o1.id,o2.id);
		io.to('oda-'+o1.odasi).emit('kazanan',oyuncuS[o2.id]);
	  }
	  break;
	  case 'tk':
	  if(oyuncuS[o1.id].tHasar > oyuncuS[o2.id].kHasar){
		oyuncuS[o1.id].skor++;
		oyuncuS[o1.id].yPuani++;
		bilgiGonder(o1.id,o2.id);
		io.to('oda-'+o1.odasi).emit('kazanan',oyuncuS[o1.id]);
	  }
	  else{
		oyuncuS[o2.id].skor++;
		oyuncuS[o2.id].yPuani++;
		bilgiGonder(o1.id,o2.id);
		io.to('oda-'+o1.odasi).emit('kazanan',oyuncuS[o2.id]);
	  }
	  break;
	  case 'km':
	  if(oyuncuS[o1.id].kHasar > oyuncuS[o2.id].mHasar){
		oyuncuS[o1.id].skor++;
		oyuncuS[o1.id].yPuani++;
		bilgiGonder(o1.id,o2.id);
		io.to('oda-'+o1.odasi).emit('kazanan',oyuncuS[o1.id]);
	  }
	  else{
		oyuncuS[o2.id].skor++;
		oyuncuS[o2.id].yPuani++;
		bilgiGonder(o1.id,o2.id);
		io.to('oda-'+o1.odasi).emit('kazanan',oyuncuS[o2.id]);
	  }
	  break;


	  case 'mm':
	  if(oyuncuS[o1.id].mHasar > oyuncuS[o2.id].mHasar){
		oyuncuS[o1.id].skor++;
		oyuncuS[o1.id].yPuani++;
		bilgiGonder(o1.id,o2.id);
		io.to('oda-'+o1.odasi).emit('kazanan',oyuncuS[o1.id]);
	  }
	  else if(oyuncuS[o2.id].mHasar > oyuncuS[o1.id].mHasar){
		oyuncuS[o2.id].skor++;
		oyuncuS[o2.id].yPuani++;
		bilgiGonder(o1.id,o2.id);
		io.to('oda-'+o1.odasi).emit('kazanan',oyuncuS[o2.id]);
	  }else{
		bilgiGonder(o1.id,o2.id);
		io.to('oda-'+o1.odasi).emit('kazanan','berabere');
	  }
	  break;
	  case 'tt':
	  if(oyuncuS[o1.id].tHasar > oyuncuS[o2.id].tHasar){
		oyuncuS[o1.id].skor++;
		oyuncuS[o1.id].yPuani++;
		bilgiGonder(o1.id,o2.id);
		io.to('oda-'+o1.odasi).emit('kazanan',oyuncuS[o1.id]);
	  }
	  else if(oyuncuS[o2.id].tHasar > oyuncuS[o1.id].tHasar){
		oyuncuS[o2.id].skor++;
		oyuncuS[o2.id].yPuani++;
		bilgiGonder(o1.id,o2.id);
		io.to('oda-'+o1.odasi).emit('kazanan',oyuncuS[o2.id]);
	  }else{
		bilgiGonder(o1.id,o2.id);
		io.to('oda-'+o1.odasi).emit('kazanan','berabere');
	  }
	  break;
	  case 'kk':
	  if(oyuncuS[o1.id].kHasar > oyuncuS[o2.id].kHasar){
		oyuncuS[o1.id].skor++;
		oyuncuS[o1.id].yPuani++;
		bilgiGonder(o1.id,o2.id);
		io.to('oda-'+o1.odasi).emit('kazanan',oyuncuS[o1.id]);
	  }
	  else if(oyuncuS[o2.id].kHasar > oyuncuS[o1.id].kHasar){
		oyuncuS[o2.id].skor++;
		oyuncuS[o2.id].yPuani++;
		bilgiGonder(o1.id,o2.id);
		io.to('oda-'+o1.odasi).emit('kazanan',oyuncuS[o2.id]);
	  }else{
		bilgiGonder(o1.id,o2.id);
		io.to('oda-'+o1.odasi).emit('kazanan','berabere');
	  }
	  break;
	}
}
// -----------------------


// ------- YÜK KULLANMA ------ (UI1 = OYUNCU1 B1Y = OYUNCU2)
socket.on('U1Y',(data)=>{
	if(data[2]=="t"){
		oyuncuS[data[0]].tHasar++;
		oyuncuS[data[0]].yPuani--;
		bilgiGonder(oyuncuS[data[0]].id,oyuncuS[data[1]].id);
	}
	if(data[2]=="m"){
		oyuncuS[data[0]].mHasar++;
		oyuncuS[data[0]].yPuani--;
		bilgiGonder(oyuncuS[data[0]].id,oyuncuS[data[1]].id);
	}
	if(data[2]=="k"){
		oyuncuS[data[0]].kHasar++;
		oyuncuS[data[0]].yPuani--;
		bilgiGonder(oyuncuS[data[0]].id,oyuncuS[data[1]].id);
	}
});
socket.on('B1Y',(data)=>{
	if(data[2]=="t"){
		oyuncuS[data[1]].tHasar++;
		oyuncuS[data[1]].yPuani--;
		bilgiGonder(oyuncuS[data[0]].id,oyuncuS[data[1]].id);
	}
	if(data[2]=="m"){
		oyuncuS[data[1]].mHasar++;
		oyuncuS[data[1]].yPuani--;
		bilgiGonder(oyuncuS[data[0]].id,oyuncuS[data[1]].id);
	}
	if(data[2]=="k"){
		oyuncuS[data[1]].kHasar++;
		oyuncuS[data[1]].yPuani--;
		bilgiGonder(oyuncuS[data[0]].id,oyuncuS[data[1]].id);
	}
});
// -------------------------------

// ------- PANIK FARK ÖLÇER ---------
socket.on('kurtaricianlik',(data)=>{
	let p1icinfark = oyuncuS[data[1]].skor - oyuncuS[data[0]].skor;
	let p2icinfark = oyuncuS[data[0]].skor - oyuncuS[data[1]].skor;
	if(data[2] == "o1"){
		io.to('oda-'+oyuncuS[data[0]].odasi).emit('kurtarici',['o1',p1icinfark]);
	}else if(data[2] == "o2"){
		io.to('oda-'+oyuncuS[data[0]].odasi).emit('kurtarici',['o2',p2icinfark]);
	}
});
// ----------------------------------
// ----------- PANIK KULLAN ------------
socket.on('kButonB',(data)=>{
	console.log("kurtarma isteği!");
	let p1icinfark = oyuncuS[data[1]].skor - oyuncuS[data[0]].skor;
	let p2icinfark = oyuncuS[data[0]].skor - oyuncuS[data[1]].skor;
	if(data[2] == "o1"){
		if(p1icinfark > 12){
			oyuncuS[data[0]].yPuani += 7;
			oyuncuS[data[1]].skor -= 3;
			bilgiGonder(oyuncuS[data[0]].id,oyuncuS[data[1]].id);
		}
	}
	if(data[2] == "o2"){
		if(p2icinfark > 12){
			oyuncuS[data[1]].yPuani += 7;
			oyuncuS[data[0]].skor -= 3;
			bilgiGonder(oyuncuS[data[0]].id,oyuncuS[data[1]].id);
		}
	}
});
// -----------------------------------------

setInterval(()=>{
			socket.broadcast.emit('aktifodasayisi',Object.keys(io.sockets.adapter.rooms).length);
},1000);

});
//  =================  kodlar ============================= // 

// ---- SUNUCU ----------
http.listen(8080,function(){
console.log("connected server");
});

