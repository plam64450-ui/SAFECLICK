// SAFECLICK: chức năng dùng chung giữa các trang
const firebaseConfig = {apiKey:"AIzaSyB3M95o_urYwuzCQH9ZZDFFl79LpxSR8P8",authDomain:"safeclick-8ec95.firebaseapp.com",projectId:"safeclick-8ec95",storageBucket:"safeclick-8ec95.firebasestorage.app",messagingSenderId:"9844163325",appId:"1:9844163325:web:cb82510e2791d0fb78b494"};
if(window.firebase && !firebase.apps.length) firebase.initializeApp(firebaseConfig);
const $=id=>document.getElementById(id);
const data=[
{id:"otp",icon:"🔐",title:"Bẫy mã xác thực",level:"Cơ bản",skill:"Bảo vệ thông tin",desc:"Người lạ yêu cầu OTP để giữ tài khoản.",sender:"Trung tâm bảo mật (giả danh)",msg:"Phát hiện đăng nhập lạ! Đọc mã xác thực vừa nhận để chúng tôi hủy phiên đăng nhập. Tài khoản sẽ bị khóa trong 5 phút.",opts:["Đọc mã để nhân viên xử lý","Không chia sẻ mã; tự mở ứng dụng chính thức để kiểm tra","Bấm link gửi kèm rồi đăng nhập"],correct:1,why:"Mã xác thực là bí mật. Không đọc mã cho người khác; tự mở ứng dụng hoặc website chính thức để kiểm tra."},
{id:"delivery",icon:"📦",title:"Phí giao hàng bất thường",level:"Cơ bản",skill:"Xác minh độc lập",desc:"Tin nhắn đòi trả phí nhỏ ngay qua link lạ.",sender:"Thông báo giao hàng (giả lập)",msg:"Đơn hàng đang bị giữ. Thanh toán phí bổ sung trong 5 phút tại liên kết này để tránh hoàn đơn.",opts:["Thanh toán ngay vì số tiền nhỏ","Mở link và nhập thông tin để xem đơn","Tự kiểm tra mã vận đơn trên ứng dụng/website chính thức"],correct:2,why:"Đừng dùng liên kết trong tin nhắn đáng ngờ. Tự tìm ứng dụng hoặc kênh liên hệ chính thức để xác minh."},
{id:"friend",icon:"👥",title:"Bạn bè nhờ chuyển tiền",level:"Trung cấp",skill:"Xác minh độc lập",desc:"Tài khoản quen thúc giục chuyển tiền và né cuộc gọi.",sender:"Tài khoản giống bạn học (giả lập)",msg:"Tớ đang rất gấp, chuyển tiền vào tài khoản mới này ngay nhé. Đừng gọi, tớ không tiện nghe máy.",opts:["Chuyển ngay vì đúng ảnh đại diện","Xác minh qua số đã lưu hoặc kênh khác đã biết","Yêu cầu gửi ảnh giấy tờ cá nhân"],correct:1,why:"Tài khoản có thể bị chiếm quyền hoặc giả mạo. Xác minh độc lập trước khi chuyển tiền."},
{id:"authority",icon:"⚖️",title:"Giả danh cơ quan chức năng",level:"Nâng cao",skill:"Kiểm soát áp lực",desc:"Người gọi dọa hậu quả và yêu cầu giữ bí mật.",sender:"Người tự xưng cán bộ (giả lập)",msg:"Hồ sơ của bạn có vấn đề. Làm theo ngay, không được kể với gia đình nếu không sẽ bị xử lý.",opts:["Làm theo vì sợ rắc rối","Bình tĩnh kết thúc liên hệ, trao đổi với người tin cậy và tự xác minh","Gửi ảnh giấy tờ để chứng minh"],correct:1,why:"Dọa nạt, yêu cầu bí mật và ép hành động ngay là dấu hiệu cần cảnh giác. Kết thúc liên hệ và tự tìm kênh chính thức."},
{id:"file",icon:"📎",title:"Tệp đính kèm đáng ngờ",level:"Nâng cao",skill:"Nhận biết dấu hiệu",desc:"Tệp lạ yêu cầu cài ứng dụng mới để mở.",sender:"Tài khoản chưa xác minh (giả lập)",msg:"Có ảnh lớp ở đây. Tải file rồi cài ứng dụng đính kèm để xem nhé.",opts:["Tải và cài ứng dụng","Chuyển tệp vào nhóm để mọi người thử","Xác minh người gửi qua kênh khác và không cài ứng dụng không rõ nguồn"],correct:2,why:"Tệp bất ngờ kèm yêu cầu cài ứng dụng là dấu hiệu đáng ngờ. Chỉ tải phần mềm từ nguồn đáng tin cậy."},
{id:"voice",icon:"🎙️",title:"Giọng nói giả mạo",level:"Thử thách",skill:"Xác minh độc lập",desc:"Giọng nói giống người thân yêu cầu chuyển tiền khẩn cấp.",sender:"Tình huống giọng nói giả lập",msg:"Người thân gọi nhờ chuyển tiền vào tài khoản mới, nói đang gặp việc gấp và không thể gọi lại số cũ.",opts:["Chuyển ngay vì giọng nghe giống","Gửi thông tin cá nhân để kiểm tra","Dừng lại, gọi số đã lưu hoặc xác minh bằng kênh độc lập"],correct:2,why:"Giọng nói có thể bị giả mạo. Không dựa riêng vào giọng; hãy xác minh bằng số đã lưu hoặc cách liên hệ riêng."}
];
const calls=[
{who:"“Nhân viên ngân hàng”",line:"Tài khoản có giao dịch đáng ngờ. Đọc mã OTP để tôi khóa giao dịch ngay, nếu chậm bạn có thể mất tiền!",opts:["Đọc OTP để khóa giao dịch","Kết thúc cuộc gọi, không chia sẻ mã và tự gọi số chính thức của ngân hàng","Hỏi họ tên rồi cung cấp mã"],correct:1,skill:"Bảo vệ thông tin",why:"Không ai cần bạn đọc OTP để bảo vệ tài khoản. Kết thúc và tự liên hệ ngân hàng qua số chính thức."},
{who:"“Người thân cần giúp gấp”",line:"Mình đang gặp chuyện, chuyển tiền vào tài khoản mới ngay nhé. Đừng gọi số cũ, không có thời gian giải thích!",opts:["Chuyển ngay vì giọng quen","Hỏi thêm dữ liệu riêng tư qua cuộc gọi này","Kết thúc và gọi lại số đã lưu hoặc xác minh qua người thân khác"],correct:2,skill:"Xác minh độc lập",why:"Giọng nói và câu chuyện khẩn cấp không đủ xác thực danh tính. Xác minh bằng kênh khác."},
{who:"“Cơ quan điều tra”",line:"Bạn có liên quan đến vụ việc. Giữ bí mật, gửi ảnh giấy tờ và làm theo ngay để tránh bị phạt.",opts:["Gửi ảnh giấy tờ","Kết thúc cuộc gọi, nói với người tin cậy và tự xác minh qua cơ quan chính thức","Tiếp tục làm theo để biết thêm"],correct:1,skill:"Kiểm soát áp lực",why:"Đe dọa, ép giữ bí mật và đòi dữ liệu nhạy cảm là dấu hiệu cảnh báo. Không gửi giấy tờ qua cuộc gọi chưa xác minh."}
];
// Kết quả được tách theo tài khoản để tránh người dùng chung máy xem nhầm dữ liệu.
let currentUser = null;
let cloudSyncReady = false;
function resultStorageKey(){return currentUser ? `safeclickResults_${currentUser.uid}` : 'safeclickResultsGuest'}
function isPlainObject(value){
  return !!value && typeof value === 'object' && !Array.isArray(value);
}
function sanitizeResults(value){
  if(!isPlainObject(value)) return {};
  const clean={};
  for(const [key,item] of Object.entries(value)){
    if(!/^[a-zA-Z0-9_-]{1,80}$/.test(key) || !isPlainObject(item)) continue;
    clean[key]={
      title:String(item.title??'').slice(0,200),
      skill:String(item.skill??'').slice(0,120),
      points:Math.max(0,Math.min(100,Number(item.points)||0)),
      correct:item.correct===true,
      choice:String(item.choice??'').slice(0,500),
      date:String(item.date??'').slice(0,100),
      updatedAtMs:Math.max(0,Number(item.updatedAtMs)||0)
    };
  }
  return clean;
}
function getResults(){
  try {
    const key=resultStorageKey();
    let raw=localStorage.getItem(key);
    if(!currentUser && raw===null){
      const old=localStorage.getItem('safeclickResults');
      if(old!==null){
        localStorage.setItem('safeclickResultsGuest',old);
        localStorage.removeItem('safeclickResults');
        raw=old;
      }
    }
    return sanitizeResults(JSON.parse(raw||'{}'));
  } catch(err) {
    console.warn('Dữ liệu SAFECLICK trên thiết bị không hợp lệ:',err);
    return {};
  }
}
function mergeResults(localResults, cloudResults){
  const merged={...(isPlainObject(cloudResults)?cloudResults:{})};
  for(const [key,localItem] of Object.entries(isPlainObject(localResults)?localResults:{})){
    if(!isPlainObject(localItem)) continue;
    const cloudItem=merged[key];
    if(!isPlainObject(cloudItem)){merged[key]=localItem;continue;}
    const localTime=Number(localItem.updatedAtMs)||0;
    const cloudTime=Number(cloudItem.updatedAtMs)||0;
    // Giữ dữ liệu trên thiết bị nếu không có dấu thời gian hoặc mới hơn cloud.
    if(localTime===0 || localTime>=cloudTime) merged[key]=localItem;
  }
  return sanitizeResults(merged);
}
function setResults(r){
  const safeResults=sanitizeResults(r);
  try {
    localStorage.setItem(resultStorageKey(),JSON.stringify(safeResults));
  } catch(err) {
    console.error('Không thể lưu kết quả trên thiết bị:',err);
    setSyncStatus('Không lưu được trên thiết bị. Hãy kiểm tra dung lượng trình duyệt.','bad');
  }
  if(currentUser) saveResultsToCloud(safeResults);
}
function setSyncStatus(message,kind=''){
  const el=$('syncStatus');
  if(!el)return;
  el.textContent=message;
  el.className='feedback '+kind;
  el.classList.remove('hidden');
}
async function saveResultsToCloud(results){
  if(!currentUser || !window.firebase || !firebase.firestore)return;
  const userAtStart=currentUser;
  const ref=firebase.firestore().collection('users').doc(userAtStart.uid).collection('progress').doc('main');
  try {
    const snap=await ref.get();
    if(!currentUser || currentUser.uid!==userAtStart.uid)return;
    const cloudResults=snap.exists && isPlainObject(snap.data().results)?sanitizeResults(snap.data().results):{};
    const merged=mergeResults(getResults(),mergeResults(results,cloudResults));
    await ref.set({results:merged,updatedAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:true});
    if(!currentUser || currentUser.uid!==userAtStart.uid)return;
    localStorage.setItem(`safeclickResults_${userAtStart.uid}`,JSON.stringify(merged));
    cloudSyncReady=true;
    setSyncStatus('✓ Kết quả đã đồng bộ lên tài khoản Firebase.','good');
  } catch(err) {
    cloudSyncReady=false;
    console.error('Không thể đồng bộ SAFECLICK:',err);
    setSyncStatus('Chưa đồng bộ được. Hãy kiểm tra Firestore Rules và việc bật Cloud Firestore.','bad');
  }
}
async function loadResultsFromCloud(user){
  if(!user || !window.firebase || !firebase.firestore){
    setSyncStatus('Firebase Firestore chưa được nạp. Kiểm tra kết nối hoặc các thẻ script.','bad');
    return;
  }
  setSyncStatus('Đang tải dữ liệu luyện tập của tài khoản…');
  try {
    const ref=firebase.firestore().collection('users').doc(user.uid).collection('progress').doc('main');
    const snap=await ref.get();
    if(!currentUser || currentUser.uid!==user.uid)return;
    const cloudResults=snap.exists && isPlainObject(snap.data().results)?sanitizeResults(snap.data().results):{};
    const localResults=getResults();
    const merged=mergeResults(localResults,cloudResults);
    localStorage.setItem(`safeclickResults_${user.uid}`,JSON.stringify(merged));
    cloudSyncReady=true;
    setSyncStatus(snap.exists?'✓ Đã hợp nhất dữ liệu trên thiết bị và Firebase.':'Tài khoản mới: kết quả trên thiết bị sẽ được giữ và đồng bộ lên Firebase.','good');
    renderRooms();updateHome();report();
    if(JSON.stringify(merged)!==JSON.stringify(cloudResults)){
      await ref.set({results:merged,updatedAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:true});
    }
  } catch(err) {
    cloudSyncReady=false;
    console.error('Không thể tải dữ liệu SAFECLICK:',err);
    setSyncStatus('Không tải được dữ liệu. Hãy kiểm tra Firestore Rules và việc bật Cloud Firestore.','bad');
  }
}
function escapeHTML(value){
  return String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
}
function updateHome(){const r=getResults(),a=Object.values(r);const sum=a.reduce((n,x)=>n+x.points,0),good=a.filter(x=>x.correct).length;if($('score'))$('score').textContent=sum;if($('done'))$('done').textContent=a.length;if($('rate'))$('rate').textContent=a.length?Math.round(good/a.length*100)+'%':'—';if($('overall'))$('overall').style.width=Math.min(100,a.length/9*100)+'%';if($('progressText'))$('progressText').textContent=a.length?`Đã ghi nhận ${a.length} lượt tình huống.`:'Bắt đầu với một phòng tập bất kỳ.'}
function renderRooms(){const el=$('rooms');if(!el)return;const r=getResults();el.innerHTML=data.map(x=>{const done=r[x.id];return `<article class="room"><div class="emoji">${x.icon}</div><div class="meta"><span>${x.level}</span><span class="pill">${done?'Đã hoàn thành':'Chưa hoàn thành'}</span></div><h3>${x.title}</h3><p>${x.desc}</p><div class="meta"><span>🎯 ${x.skill}</span><span>${done?escapeHTML(Number(done.points)||0)+'/100':'1 tình huống'}</span></div><button class="${done?'':'primary'}" data-start="${x.id}">${done?'Luyện lại':'Bắt đầu phòng'} →</button></article>`}).join('');el.querySelectorAll('[data-start]').forEach(b=>b.onclick=()=>startRoom(b.dataset.start))}
function startRoom(id){const x=data.find(y=>y.id===id);if(!x)return;const area=$('playArea');area.classList.remove('hidden');$('playTitle').textContent=x.title;$('playLevel').textContent=x.icon+' PHÒNG TẬP · '+x.level;$('playProgress').style.width='30%';$('playBody').innerHTML=`<div class="chat"><div class="sender"><span>${x.sender}</span><span>● GIẢ LẬP</span></div><div class="bubble">${x.msg}</div></div><b>Bạn sẽ xử lý thế nào?</b><div class="choices">${x.opts.map((o,i)=>`<button class="choice" data-o="${i}"><span class="letter">${String.fromCharCode(65+i)}</span><span>${o}</span></button>`).join('')}</div>`;$('playFeedback').classList.add('hidden');$('nextPlay').classList.add('hidden');$('playBody').querySelectorAll('[data-o]').forEach(b=>b.onclick=()=>answerRoom(x,+b.dataset.o));area.scrollIntoView({behavior:'smooth',block:'start'})}
function answerRoom(x,i){const buttons=$('playBody').querySelectorAll('button');if([...buttons].every(b=>b.disabled))return;const ok=i===x.correct,points=ok?100:35,r=getResults();r[x.id]={title:x.title,skill:x.skill,points,correct:ok,choice:x.opts[i],date:new Date().toLocaleString('vi-VN'),updatedAtMs:Date.now()};setResults(r);buttons.forEach(b=>b.disabled=true);$('playProgress').style.width='100%';$('playFeedback').className='feedback '+(ok?'good':'bad');$('playFeedback').innerHTML=`<h3>${ok?'✓ Lựa chọn an toàn hơn':'↻ Có cách xử lý an toàn hơn'}</h3><p><b>Kỹ năng:</b> ${x.skill}</p><p>${x.why}</p><p><b>Điểm tình huống:</b> ${points}/100</p>`;$('playFeedback').classList.remove('hidden');$('nextPlay').classList.remove('hidden');updateHome();renderRooms()}
let callI=0,callDone=false;function resetCall(){if(!$('caller'))return;callDone=false;callI=(callI+1)%calls.length;$('caller').textContent=calls[callI].who;$('callStatus').textContent='Cuộc gọi mô phỏng đang đến…';['transcript','callChoices','callFeedback'].forEach(id=>$(id).classList.add('hidden'));$('answer').disabled=false;$('decline').disabled=false}
function feedbackCall(ok,msg){$('callFeedback').className='feedback '+(ok?'good':'bad');$('callFeedback').textContent=msg;$('callFeedback').classList.remove('hidden')}
function handleCall(answer){if(callDone)return;callDone=true;const c=calls[callI];$('answer').disabled=true;$('decline').disabled=true;$('callStatus').textContent=answer?'Đã nghe cuộc gọi mô phỏng':'Bạn đã từ chối cuộc gọi';$('transcript').classList.remove('hidden');$('transcript').innerHTML=`<div class="sender"><span>${c.who}</span><span>HỘI THOẠI HƯ CẤU</span></div><div class="bubble">${answer?c.line:'Bạn không nghe máy. Nếu cần kiểm tra, hãy tự liên hệ qua kênh chính thức.'}</div>`;if(!answer){saveCall(true,'Từ chối và xác minh',c);feedbackCall(true,'Từ chối cuộc gọi chưa xác minh là lựa chọn thận trọng.');return}$('callChoices').innerHTML=c.opts.map((o,i)=>`<button class="choice" data-c="${i}"><span class="letter">${String.fromCharCode(65+i)}</span><span>${o}</span></button>`).join('');$('callChoices').classList.remove('hidden');$('callChoices').querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>{const i=+b.dataset.c,ok=i===c.correct;saveCall(ok,c.opts[i],c);feedbackCall(ok,c.why);$('callChoices').querySelectorAll('button').forEach(x=>x.disabled=true)})}
function saveCall(ok,choice,c){const r=getResults();r['call'+callI]={title:'Cuộc gọi: '+c.who,skill:c.skill,points:ok?100:35,correct:ok,choice,date:new Date().toLocaleString('vi-VN'),updatedAtMs:Date.now()};setResults(r);updateHome()}
function report(){const el=$('history');if(!el)return;const a=Object.values(getResults()),sum=a.reduce((n,x)=>n+x.points,0),good=a.filter(x=>x.correct).length;$('rScore').textContent=sum;$('rDone').textContent=a.length;$('rRate').textContent=a.length?Math.round(good/a.length*100)+'%':'—';const skills=['Nhận biết dấu hiệu','Xác minh độc lập','Bảo vệ thông tin','Kiểm soát áp lực'];$('skillBars').innerHTML=skills.map(s=>{const b=a.filter(x=>x.skill===s),v=b.length?Math.round(b.reduce((n,z)=>n+z.points,0)/b.length):0;return `<div class="barrow"><div class="barlabel"><span>${s}</span><b>${b.length?v+'%':'Chưa có dữ liệu'}</b></div><div class="bar"><div style="width:${v}%"></div></div></div>`}).join('');el.innerHTML=a.length?`<table><tr><th>Tình huống</th><th>Kỹ năng</th><th>Điểm</th></tr>${a.map(x=>`<tr><td>${escapeHTML(x.title)}</td><td>${escapeHTML(x.skill)}</td><td>${escapeHTML(Number(x.points)||0)}/100</td></tr>`).join('')}</table>`:'<p class="small">Chưa có lượt chơi nào.</p>';const low=skills.map(s=>({s,b:a.filter(x=>x.skill===s)})).filter(x=>x.b.length).sort((x,y)=>x.b.reduce((n,z)=>n+z.points,0)/x.b.length-y.b.reduce((n,z)=>n+z.points,0)/y.b.length)[0];$('recommend').textContent=low?`Nên luyện thêm kỹ năng “${escapeHTML(low.s)}”. Đọc phản hồi sau mỗi lựa chọn rồi thử lại.`:'Hoàn thành vài phòng tập để nhận gợi ý.'}
function downloadCSV(){const a=Object.values(getResults());if(!a.length){alert('Chưa có kết quả để tải.');return}const rows=[['Tình huống','Kỹ năng','Điểm','Lựa chọn','Thời gian'],...a.map(x=>[x.title,x.skill,x.points,x.choice,x.date])];const csv='\ufeff'+rows.map(r=>r.map(v=>'"'+String(v??'').replace(/"/g,'""')+'"').join(',')).join('\n');const link=document.createElement('a');link.href=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));link.download='safeclick-bao-cao-demo.csv';link.click();URL.revokeObjectURL(link.href)}
function authMessage(t,c){if(!$('authMsg'))return;$('authMsg').className='feedback '+c;$('authMsg').textContent=t;$('authMsg').classList.remove('hidden')}
let mode='login';function setMode(m){mode=m;if(!$('loginTab'))return;$('loginTab').classList.toggle('primary',m==='login');$('registerTab').classList.toggle('primary',m==='register');$('authSubmit').textContent=m==='login'?'Đăng nhập với Firebase':'Đăng ký tài khoản Firebase';$('authMsg').classList.add('hidden')}
if(window.firebase){
  firebase.auth().onAuthStateChanged(async user=>{
    currentUser=user||null;
    setProfileEditorVisible(user);
    if(user) loadProfile(user);
    if($('userBadge'))$('userBadge').textContent=user?(user.email||user.displayName||'Đã đăng nhập'):'Khách trải nghiệm';
    if($('welcome'))$('welcome').textContent=user?'Chào mừng, '+(user.displayName||user.email):'Chào mừng bạn!';
    if($('authBtn'))$('authBtn').textContent=user?'Tài khoản':'Đăng nhập';
    if($('authForm'))$('authForm').classList.toggle('hidden',!!user);
    if($('googleLogin'))$('googleLogin').classList.toggle('hidden',!!user);
    if($('logout'))$('logout').classList.toggle('hidden',!user);
    if($('resetPassword'))$('resetPassword').classList.toggle('hidden',!!user);
    if(user){
      if($('profileEmail'))$('profileEmail').textContent=user.email||user.displayName||'Đã đăng nhập bằng Google';
      if($('profileProvider'))$('profileProvider').textContent=(user.providerData||[]).map(p=>p.providerId==='google.com'?'Google':p.providerId==='password'?'Email và mật khẩu':p.providerId).join(', ')||'Firebase Authentication';
      await loadResultsFromCloud(user);
    } else {
      cloudSyncReady=false;
      if($('profileEmail'))$('profileEmail').textContent='Chưa đăng nhập';
      if($('profileProvider'))$('profileProvider').textContent='Khách trải nghiệm';
      if($('syncStatus')){$('syncStatus').textContent='Kết quả khách được lưu trên thiết bị này. Đăng nhập để đồng bộ kết quả riêng của tài khoản.';$('syncStatus').className='notice';}
      renderRooms();updateHome();report();
    }
  });
}
if($('loginTab'))$('loginTab').onclick=()=>setMode('login');
if($('registerTab'))$('registerTab').onclick=()=>setMode('register');
if($('authForm'))$('authForm').onsubmit=async e=>{
  e.preventDefault();
  const email=$('email').value.trim(),password=$('pin').value;
  const submit=$('authSubmit');if(submit)submit.disabled=true;
  try {
    if(!window.firebase)throw new Error('Firebase chưa được tải. Hãy tải lại trang.');
    if(mode==='register'){
      const cred=await firebase.auth().createUserWithEmailAndPassword(email,password);
      try{await cred.user.sendEmailVerification();authMessage('Đăng ký thành công! Firebase đã gửi email xác minh nếu dịch vụ email được bật.','good');}
      catch{authMessage('Đăng ký thành công. Có thể đăng nhập; chưa gửi được email xác minh.','good');}
    } else {
      await firebase.auth().signInWithEmailAndPassword(email,password);
      authMessage('Đăng nhập thành công! Đang tải dữ liệu luyện tập của bạn…','good');
    }
    $('pin').value='';
  } catch(err) {
    const messages={
      'auth/email-already-in-use':'Email này đã có tài khoản. Hãy chuyển sang Đăng nhập.',
      'auth/invalid-email':'Địa chỉ email chưa đúng định dạng.',
      'auth/weak-password':'Mật khẩu quá yếu. Hãy dùng ít nhất 6 ký tự.',
      'auth/user-not-found':'Không tìm thấy tài khoản này.',
      'auth/wrong-password':'Mật khẩu chưa đúng.',
      'auth/invalid-credential':'Email hoặc mật khẩu chưa đúng.',
      'auth/too-many-requests':'Có quá nhiều lần thử. Hãy chờ một lúc rồi thử lại.',
      'auth/operation-not-allowed':'Chưa bật phương thức Email/Mật khẩu trong Firebase Authentication.'
    };
    authMessage(messages[err.code]||('Không thực hiện được: '+err.message),'bad');
  } finally {if(submit)submit.disabled=false;}
};
if($('resetPassword'))$('resetPassword').onclick=async()=>{
  const email=$('email')?.value.trim();
  if(!email){authMessage('Nhập email vào ô phía trên trước, rồi bấm Quên mật khẩu.','bad');return;}
  try{await firebase.auth().sendPasswordResetEmail(email);authMessage('Đã yêu cầu gửi email đặt lại mật khẩu. Kiểm tra cả thư mục Spam.','good');}
  catch(err){authMessage(err.code==='auth/user-not-found'?'Không tìm thấy tài khoản với email này.':'Chưa gửi được email đặt lại mật khẩu: '+err.message,'bad');}
};
if($('googleLogin'))$('googleLogin').onclick=async()=>{
  try{const p=new firebase.auth.GoogleAuthProvider();p.setCustomParameters({prompt:'select_account'});await firebase.auth().signInWithPopup(p);authMessage('Đăng nhập Google thành công!','good');}
  catch(err){const m={'auth/unauthorized-domain':'Tên miền website chưa có trong Firebase Authentication → Settings → Authorized domains.','auth/operation-not-allowed':'Chưa bật Google trong Firebase Authentication → Sign-in method.','auth/popup-blocked':'Trình duyệt chặn cửa sổ đăng nhập. Hãy cho phép cửa sổ bật lên rồi thử lại.'};authMessage(m[err.code]||('Lỗi Google: '+err.message),'bad');}
};
if($('logout'))$('logout').onclick=()=>firebase.auth().signOut().then(()=>authMessage('Đã đăng xuất. Dữ liệu tài khoản vẫn được lưu trên Firebase.','good')).catch(err=>authMessage('Chưa đăng xuất được: '+err.message,'bad'));
if($('exitPlay'))$('exitPlay').onclick=()=>{$('playArea').classList.add('hidden');window.scrollTo({top:0,behavior:'smooth'})};if($('nextPlay'))$('nextPlay').onclick=()=>{$('playArea').classList.add('hidden');window.scrollTo({top:0,behavior:'smooth'})};if($('answer'))$('answer').onclick=()=>handleCall(true);if($('decline'))$('decline').onclick=()=>handleCall(false);if($('newCall'))$('newCall').onclick=resetCall;if($('downloadCSV'))$('downloadCSV').onclick=downloadCSV;if($('resetResults'))$('resetResults').onclick=()=>{if(confirm(currentUser?'Xóa kết quả luyện tập của tài khoản này khỏi Firebase và thiết bị?':'Xóa kết quả khách trên thiết bị này?')){if(currentUser && window.firebase && firebase.firestore){firebase.firestore().collection('users').doc(currentUser.uid).collection('progress').doc('main').delete().then(()=>{localStorage.setItem(resultStorageKey(),'{}');report();updateHome();renderRooms();setSyncStatus('Đã xóa kết quả luyện tập của tài khoản.','good')}).catch(()=>alert('Không xóa được dữ liệu trên Firebase. Kiểm tra Firestore Rules.'))}else{localStorage.removeItem('safeclickResultsGuest');localStorage.removeItem('safeclickResults');report();updateHome();renderRooms()}}};
renderRooms();updateHome();report();if($('caller')){callI=-1;resetCall()}


// --- SAFECLICK: quản lý hồ sơ người dùng ---
const defaultAvatar = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='50' fill='%23e6eefb'/%3E%3Ccircle cx='50' cy='36' r='18' fill='%236b86b5'/%3E%3Cpath d='M17 91c2-22 15-34 33-34s31 12 33 34' fill='%236b86b5'/%3E%3C/svg%3E";
let selectedAvatarData = null;
let profileLoadedUid = null;
function profileMessage(id, message, kind=''){
  const el=$(id); if(!el)return;
  el.textContent=message; el.className='feedback '+kind; el.classList.remove('hidden');
}
function setProfileEditorVisible(user){
  const editor=$('profileEditor'); if(editor)editor.classList.toggle('hidden',!user);
  const summary=document.querySelector('.profile-summary'); if(summary)summary.classList.toggle('hidden',!user);
}
function compressAvatar(file){
  return new Promise((resolve,reject)=>{
    if(!file || !/^image\/(jpeg|png|webp)$/.test(file.type)){reject(new Error('Hãy chọn ảnh JPG, PNG hoặc WebP.'));return;}
    if(file.size>5*1024*1024){reject(new Error('Ảnh gốc phải nhỏ hơn 5 MB.'));return;}
    const reader=new FileReader();
    reader.onerror=()=>reject(new Error('Không đọc được ảnh.'));
    reader.onload=()=>{
      const img=new Image();
      img.onerror=()=>reject(new Error('Tệp ảnh không hợp lệ.'));
      img.onload=()=>{
        const canvas=document.createElement('canvas');
        const scale=Math.min(1,400/Math.max(img.width,img.height));
        canvas.width=Math.max(1,Math.round(img.width*scale));canvas.height=Math.max(1,Math.round(img.height*scale));
        const ctx=canvas.getContext('2d');ctx.drawImage(img,0,0,canvas.width,canvas.height);
        let data=canvas.toDataURL('image/jpeg',0.78);
        if(data.length>350000)data=canvas.toDataURL('image/jpeg',0.55);
        if(data.length>450000){reject(new Error('Ảnh vẫn quá lớn sau khi nén. Hãy chọn ảnh khác.'));return;}
        resolve(data);
      };
      img.src=reader.result;
    };
    reader.readAsDataURL(file);
  });
}
async function loadProfile(user){
  if(!user || !window.firebase || !firebase.firestore)return;
  profileLoadedUid=user.uid;selectedAvatarData=user.photoURL||null;
  if($('displayNameInput'))$('displayNameInput').value=user.displayName||'';
  if($('profileUid'))$('profileUid').value=user.uid;
  if($('profileAvatar'))$('profileAvatar').src=user.photoURL||defaultAvatar;
  if($('profilePhone'))$('profilePhone').value='';
  try{
    const snap=await firebase.firestore().collection('users').doc(user.uid).collection('profile').doc('main').get();
    if(!currentUser || currentUser.uid!==user.uid)return;
    if(snap.exists){
      const data=snap.data()||{};
      if($('profilePhone'))$('profilePhone').value=String(data.phone||'').slice(0,25);
      if(data.avatarData){selectedAvatarData=data.avatarData;if($('profileAvatar'))$('profileAvatar').src=data.avatarData;}
      if(data.displayName && !$('displayNameInput').value)$('displayNameInput').value=data.displayName;
    }
  }catch(err){console.warn('Không tải được hồ sơ phụ:',err);}
}
if($('avatarFile'))$('avatarFile').addEventListener('change',async e=>{
  const file=e.target.files&&e.target.files[0];if(!file)return;
  try{selectedAvatarData=await compressAvatar(file);if($('profileAvatar'))$('profileAvatar').src=selectedAvatarData;profileMessage('profileMsg','Ảnh đã chọn. Nhấn “Lưu hồ sơ” để lưu.','good');}
  catch(err){profileMessage('profileMsg',err.message,'bad');}
});
if($('removeAvatar'))$('removeAvatar').onclick=()=>{selectedAvatarData='';if($('profileAvatar'))$('profileAvatar').src=defaultAvatar;profileMessage('profileMsg','Đã chọn ảnh mặc định. Nhấn “Lưu hồ sơ” để áp dụng.','');};
if($('copyUid'))$('copyUid').onclick=async()=>{
  const value=$('profileUid')?.value||'';if(!value)return;
  try{await navigator.clipboard.writeText(value);profileMessage('profileMsg','Đã sao chép ID người dùng.','good');}
  catch{const input=$('profileUid');input.select();profileMessage('profileMsg','ID đã được chọn; nhấn Ctrl+C để sao chép.','');}
};
if($('saveProfile'))$('saveProfile').onclick=async()=>{
  const user=currentUser;if(!user){profileMessage('profileMsg','Hãy đăng nhập trước.','bad');return;}
  const name=$('displayNameInput').value.trim().slice(0,60);
  const phone=$('profilePhone').value.trim().slice(0,25);
  if(phone && !/^[+()\d\s.-]{7,25}$/.test(phone)){profileMessage('profileMsg','Số điện thoại chưa đúng định dạng.','bad');return;}
  const btn=$('saveProfile');btn.disabled=true;
  try{
    const update={displayName:name||null};
    if(selectedAvatarData)update.photoURL=selectedAvatarData;
    else if(selectedAvatarData==='')update.photoURL=null;
    await user.updateProfile(update);
    await firebase.firestore().collection('users').doc(user.uid).collection('profile').doc('main').set({
      displayName:name,phone,
      avatarData:selectedAvatarData===null?(user.photoURL||''):selectedAvatarData,
      updatedAt:firebase.firestore.FieldValue.serverTimestamp()
    },{merge:true});
    if($('userBadge'))$('userBadge').textContent=name||user.email||'Đã đăng nhập';
    if($('welcome'))$('welcome').textContent='Chào mừng, '+(name||user.email||'bạn');
    profileMessage('profileMsg','Đã lưu hồ sơ thành công. Số điện thoại hiện chưa được xác minh OTP.','good');
  }catch(err){
    console.error('Lưu hồ sơ thất bại:',err);
    profileMessage('profileMsg','Chưa lưu được hồ sơ. Kiểm tra kết nối và Firestore Rules rồi thử lại.','bad');
  }finally{btn.disabled=false;}
};
if($('passwordForm'))$('passwordForm').onsubmit=async e=>{
  e.preventDefault();const user=currentUser;
  if(!user){profileMessage('passwordMsg','Hãy đăng nhập trước.','bad');return;}
  const providers=(user.providerData||[]).map(p=>p.providerId);
  if(!providers.includes('password')){profileMessage('passwordMsg','Tài khoản này dùng Google hoặc nhà cung cấp khác. Hãy đổi mật khẩu tại nhà cung cấp đó.','bad');return;}
  const current=$('currentPassword').value,newPass=$('newPassword').value,confirmPass=$('confirmPassword').value;
  if(newPass.length<6){profileMessage('passwordMsg','Mật khẩu mới cần ít nhất 6 ký tự.','bad');return;}
  if(newPass!==confirmPass){profileMessage('passwordMsg','Hai mật khẩu mới không khớp.','bad');return;}
  const btn=$('changePassword');btn.disabled=true;
  try{
    const credential=firebase.auth.EmailAuthProvider.credential(user.email,current);
    await user.reauthenticateWithCredential(credential);
    await user.updatePassword(newPass);
    $('passwordForm').reset();profileMessage('passwordMsg','Đổi mật khẩu thành công.','good');
  }catch(err){
    const msg=err.code==='auth/wrong-password'||err.code==='auth/invalid-credential'?'Mật khẩu hiện tại chưa đúng.':err.code==='auth/requires-recent-login'?'Hãy đăng nhập lại rồi thử đổi mật khẩu.':'Chưa đổi được mật khẩu: '+(err.message||'lỗi không xác định');
    profileMessage('passwordMsg',msg,'bad');
  }finally{btn.disabled=false;}
};
