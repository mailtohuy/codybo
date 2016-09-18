var qrcode=function(){function r(t,e){if(void 0===t.length)throw Error(t.length+"/"+e)
var n=function(){for(var r=0;r<t.length&&0==t[r];)r+=1
for(var n=Array(t.length-r+e),o=0;o<t.length-r;o+=1)n[o]=t[o+r]
return n}(),o={}
return o.getAt=function(r){return n[r]},o.getLength=function(){return n.length},o.multiply=function(t){for(var e=Array(o.getLength()+t.getLength()-1),n=0;n<o.getLength();n+=1)for(var a=0;a<t.getLength();a+=1)e[n+a]^=i.gexp(i.glog(o.getAt(n))+i.glog(t.getAt(a)))
return r(e,0)},o.mod=function(t){if(o.getLength()-t.getLength()<0)return o
for(var e=i.glog(o.getAt(0))-i.glog(t.getAt(0)),n=Array(o.getLength()),a=0;a<o.getLength();a+=1)n[a]=o.getAt(a)
for(var a=0;a<t.getLength();a+=1)n[a]^=i.gexp(i.glog(t.getAt(a))+e)
return r(n,0).mod(t)},o}var t=function(t,e){var o=236,i=17,c=t,h=n[e],v=null,l=0,d=null,w=[],y={},B=function(r,t){l=4*c+17,v=function(r){for(var t=Array(r),e=0;r>e;e+=1){t[e]=Array(r)
for(var n=0;r>n;n+=1)t[e][n]=null}return t}(l),E(0,0),E(l-7,0),E(0,l-7),T(),p(),D(r,t),c>=7&&M(r),null==d&&(d=m(c,h,w)),k(d,t)},E=function(r,t){for(var e=-1;7>=e;e+=1)if(!(-1>=r+e||r+e>=l))for(var n=-1;7>=n;n+=1)-1>=t+n||t+n>=l||(e>=0&&6>=e&&(0==n||6==n)||n>=0&&6>=n&&(0==e||6==e)||e>=2&&4>=e&&n>=2&&4>=n?v[r+e][t+n]=!0:v[r+e][t+n]=!1)},A=function(){for(var r=0,t=0,e=0;8>e;e+=1){B(!0,e)
var n=a.getLostPoint(y);(0==e||r>n)&&(r=n,t=e)}return t},p=function(){for(var r=8;l-8>r;r+=1)null==v[r][6]&&(v[r][6]=r%2==0)
for(var t=8;l-8>t;t+=1)null==v[6][t]&&(v[6][t]=t%2==0)},T=function(){for(var r=a.getPatternPosition(c),t=0;t<r.length;t+=1)for(var e=0;e<r.length;e+=1){var n=r[t],o=r[e]
if(null==v[n][o])for(var i=-2;2>=i;i+=1)for(var u=-2;2>=u;u+=1)-2==i||2==i||-2==u||2==u||0==i&&0==u?v[n+i][o+u]=!0:v[n+i][o+u]=!1}},M=function(r){for(var t=a.getBCHTypeNumber(c),e=0;18>e;e+=1){var n=!r&&1==(t>>e&1)
v[Math.floor(e/3)][e%3+l-8-3]=n}for(var e=0;18>e;e+=1){var n=!r&&1==(t>>e&1)
v[e%3+l-8-3][Math.floor(e/3)]=n}},D=function(r,t){for(var e=h<<3|t,n=a.getBCHTypeInfo(e),o=0;15>o;o+=1){var i=!r&&1==(n>>o&1)
6>o?v[o][8]=i:8>o?v[o+1][8]=i:v[l-15+o][8]=i}for(var o=0;15>o;o+=1){var i=!r&&1==(n>>o&1)
8>o?v[8][l-o-1]=i:9>o?v[8][15-o-1+1]=i:v[8][15-o-1]=i}v[l-8][8]=!r},k=function(r,t){for(var e=-1,n=l-1,o=7,i=0,u=a.getMaskFunction(t),f=l-1;f>0;f-=2)for(6==f&&(f-=1);;){for(var g=0;2>g;g+=1)if(null==v[n][f-g]){var c=!1
i<r.length&&(c=1==(r[i]>>>o&1))
var h=u(n,f-g)
h&&(c=!c),v[n][f-g]=c,o-=1,-1==o&&(i+=1,o=7)}if(n+=e,0>n||n>=l){n-=e,e=-e
break}}},C=function(t,e){for(var n=0,o=0,i=0,u=Array(e.length),f=Array(e.length),g=0;g<e.length;g+=1){var c=e[g].dataCount,h=e[g].totalCount-c
o=Math.max(o,c),i=Math.max(i,h),u[g]=Array(c)
for(var v=0;v<u[g].length;v+=1)u[g][v]=255&t.getBuffer()[v+n]
n+=c
var l=a.getErrorCorrectPolynomial(h),s=r(u[g],l.getLength()-1),d=s.mod(l)
f[g]=Array(l.getLength()-1)
for(var v=0;v<f[g].length;v+=1){var w=v+d.getLength()-f[g].length
f[g][v]=w>=0?d.getAt(w):0}}for(var y=0,v=0;v<e.length;v+=1)y+=e[v].totalCount
for(var B=Array(y),E=0,v=0;o>v;v+=1)for(var g=0;g<e.length;g+=1)v<u[g].length&&(B[E]=u[g][v],E+=1)
for(var v=0;i>v;v+=1)for(var g=0;g<e.length;g+=1)v<f[g].length&&(B[E]=f[g][v],E+=1)
return B},m=function(r,t,e){for(var n=u.getRSBlocks(r,t),g=f(),c=0;c<e.length;c+=1){var h=e[c]
g.put(h.getMode(),4),g.put(h.getLength(),a.getLengthInBits(h.getMode(),r)),h.write(g)}for(var v=0,c=0;c<n.length;c+=1)v+=n[c].dataCount
if(g.getLengthInBits()>8*v)throw Error("code length overflow. ("+g.getLengthInBits()+">"+8*v+")")
for(g.getLengthInBits()+4<=8*v&&g.put(0,4);g.getLengthInBits()%8!=0;)g.putBit(!1)
for(;;){if(g.getLengthInBits()>=8*v)break
if(g.put(o,8),g.getLengthInBits()>=8*v)break
g.put(i,8)}return C(g,n)}
return y.addData=function(r){var t=g(r)
w.push(t),d=null},y.isDark=function(r,t){if(0>r||r>=l||0>t||t>=l)throw Error(r+","+t)
return v[r][t]},y.getModuleCount=function(){return l},y.make=function(){B(!1,A())},y.createTableTag=function(r,t){r=r||2,t=void 0===t?4*r:t
var e=""
e+='<table style="',e+=" border-width: 0px; border-style: none;",e+=" border-collapse: collapse;",e+=" padding: 0px; margin: "+t+"px;",e+='">',e+="<tbody>"
for(var n=0;n<y.getModuleCount();n+=1){e+="<tr>"
for(var o=0;o<y.getModuleCount();o+=1)e+='<td style="',e+=" border-width: 0px; border-style: none;",e+=" border-collapse: collapse;",e+=" padding: 0px; margin: 0px;",e+=" width: "+r+"px;",e+=" height: "+r+"px;",e+=" background-color: ",e+=y.isDark(n,o)?"#000000":"#ffffff",e+=";",e+='"/>'
e+="</tr>"}return e+="</tbody>",e+="</table>"},y.createSvgTag=function(r,t){r=r||2,t=void 0===t?4*r:t
var e,n,o,a,i,u=y.getModuleCount()*r+2*t,f=""
for(i="l"+r+",0 0,"+r+" -"+r+",0 0,-"+r+"z ",f+="<svg",f+=' width="'+u+'px"',f+=' height="'+u+'px"',f+=' xmlns="http://www.w3.org/2000/svg"',f+=">",f+='<path d="',o=0;o<y.getModuleCount();o+=1)for(a=o*r+t,e=0;e<y.getModuleCount();e+=1)y.isDark(o,e)&&(n=e*r+t,f+="M"+n+","+a+i)
return f+='" stroke="transparent" fill="black"/>',f+="</svg>"},y.createImgTag=function(r,t){r=r||2,t=void 0===t?4*r:t
var e=y.getModuleCount()*r+2*t,n=t,o=e-t
return s(e,e,function(t,e){if(t>=n&&o>t&&e>=n&&o>e){var a=Math.floor((t-n)/r),i=Math.floor((e-n)/r)
return y.isDark(i,a)?0:1}return 1})},y}
t.stringToBytes=function(r){for(var t=[],e=0;e<r.length;e+=1){var n=r.charCodeAt(e)
t.push(255&n)}return t},t.createStringToBytes=function(r,t){var e=function(){for(var e=v(r),n=function(){var r=e.read()
if(-1==r)throw Error()
return r},o=0,a={};;){var i=e.read()
if(-1==i)break
var u=n(),f=n(),g=n(),c=String.fromCharCode(i<<8|u),h=f<<8|g
a[c]=h,o+=1}if(o!=t)throw Error(o+" != "+t)
return a}(),n="?".charCodeAt(0)
return function(r){for(var t=[],o=0;o<r.length;o+=1){var a=r.charCodeAt(o)
if(128>a)t.push(a)
else{var i=e[r.charAt(o)]
"number"==typeof i?(255&i)==i?t.push(i):(t.push(i>>>8),t.push(255&i)):t.push(n)}}return t}}
var e={MODE_NUMBER:1,MODE_ALPHA_NUM:2,MODE_8BIT_BYTE:4,MODE_KANJI:8},n={L:1,M:0,Q:3,H:2},o={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7},a=function(){var t=[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],n=1335,a=7973,u=21522,f={},g=function(r){for(var t=0;0!=r;)t+=1,r>>>=1
return t}
return f.getBCHTypeInfo=function(r){for(var t=r<<10;g(t)-g(n)>=0;)t^=n<<g(t)-g(n)
return(r<<10|t)^u},f.getBCHTypeNumber=function(r){for(var t=r<<12;g(t)-g(a)>=0;)t^=a<<g(t)-g(a)
return r<<12|t},f.getPatternPosition=function(r){return t[r-1]},f.getMaskFunction=function(r){switch(r){case o.PATTERN000:return function(r,t){return(r+t)%2==0}
case o.PATTERN001:return function(r,t){return r%2==0}
case o.PATTERN010:return function(r,t){return t%3==0}
case o.PATTERN011:return function(r,t){return(r+t)%3==0}
case o.PATTERN100:return function(r,t){return(Math.floor(r/2)+Math.floor(t/3))%2==0}
case o.PATTERN101:return function(r,t){return r*t%2+r*t%3==0}
case o.PATTERN110:return function(r,t){return(r*t%2+r*t%3)%2==0}
case o.PATTERN111:return function(r,t){return(r*t%3+(r+t)%2)%2==0}
default:throw Error("bad maskPattern:"+r)}},f.getErrorCorrectPolynomial=function(t){for(var e=r([1],0),n=0;t>n;n+=1)e=e.multiply(r([1,i.gexp(n)],0))
return e},f.getLengthInBits=function(r,t){if(t>=1&&10>t)switch(r){case e.MODE_NUMBER:return 10
case e.MODE_ALPHA_NUM:return 9
case e.MODE_8BIT_BYTE:return 8
case e.MODE_KANJI:return 8
default:throw Error("mode:"+r)}else if(27>t)switch(r){case e.MODE_NUMBER:return 12
case e.MODE_ALPHA_NUM:return 11
case e.MODE_8BIT_BYTE:return 16
case e.MODE_KANJI:return 10
default:throw Error("mode:"+r)}else{if(!(41>t))throw Error("type:"+t)
switch(r){case e.MODE_NUMBER:return 14
case e.MODE_ALPHA_NUM:return 13
case e.MODE_8BIT_BYTE:return 16
case e.MODE_KANJI:return 12
default:throw Error("mode:"+r)}}},f.getLostPoint=function(r){for(var t=r.getModuleCount(),e=0,n=0;t>n;n+=1)for(var o=0;t>o;o+=1){for(var a=0,i=r.isDark(n,o),u=-1;1>=u;u+=1)if(!(0>n+u||n+u>=t))for(var f=-1;1>=f;f+=1)0>o+f||o+f>=t||(0!=u||0!=f)&&i==r.isDark(n+u,o+f)&&(a+=1)
a>5&&(e+=3+a-5)}for(var n=0;t-1>n;n+=1)for(var o=0;t-1>o;o+=1){var g=0
r.isDark(n,o)&&(g+=1),r.isDark(n+1,o)&&(g+=1),r.isDark(n,o+1)&&(g+=1),r.isDark(n+1,o+1)&&(g+=1),(0==g||4==g)&&(e+=3)}for(var n=0;t>n;n+=1)for(var o=0;t-6>o;o+=1)r.isDark(n,o)&&!r.isDark(n,o+1)&&r.isDark(n,o+2)&&r.isDark(n,o+3)&&r.isDark(n,o+4)&&!r.isDark(n,o+5)&&r.isDark(n,o+6)&&(e+=40)
for(var o=0;t>o;o+=1)for(var n=0;t-6>n;n+=1)r.isDark(n,o)&&!r.isDark(n+1,o)&&r.isDark(n+2,o)&&r.isDark(n+3,o)&&r.isDark(n+4,o)&&!r.isDark(n+5,o)&&r.isDark(n+6,o)&&(e+=40)
for(var c=0,o=0;t>o;o+=1)for(var n=0;t>n;n+=1)r.isDark(n,o)&&(c+=1)
var h=Math.abs(100*c/t/t-50)/5
return e+=10*h},f}(),i=function(){for(var r=Array(256),t=Array(256),e=0;8>e;e+=1)r[e]=1<<e
for(var e=8;256>e;e+=1)r[e]=r[e-4]^r[e-5]^r[e-6]^r[e-8]
for(var e=0;255>e;e+=1)t[r[e]]=e
var n={}
return n.glog=function(r){if(1>r)throw Error("glog("+r+")")
return t[r]},n.gexp=function(t){for(;0>t;)t+=255
for(;t>=256;)t-=255
return r[t]},n}(),u=function(){var r=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12,7,37,13],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],t=function(r,t){var e={}
return e.totalCount=r,e.dataCount=t,e},e={},o=function(t,e){switch(e){case n.L:return r[4*(t-1)+0]
case n.M:return r[4*(t-1)+1]
case n.Q:return r[4*(t-1)+2]
case n.H:return r[4*(t-1)+3]
default:return}}
return e.getRSBlocks=function(r,e){var n=o(r,e)
if(void 0===n)throw Error("bad rs block @ typeNumber:"+r+"/errorCorrectionLevel:"+e)
for(var a=n.length/3,i=[],u=0;a>u;u+=1)for(var f=n[3*u+0],g=n[3*u+1],c=n[3*u+2],h=0;f>h;h+=1)i.push(t(g,c))
return i},e}(),f=function(){var r=[],t=0,e={}
return e.getBuffer=function(){return r},e.getAt=function(t){var e=Math.floor(t/8)
return 1==(r[e]>>>7-t%8&1)},e.put=function(r,t){for(var n=0;t>n;n+=1)e.putBit(1==(r>>>t-n-1&1))},e.getLengthInBits=function(){return t},e.putBit=function(e){var n=Math.floor(t/8)
r.length<=n&&r.push(0),e&&(r[n]|=128>>>t%8),t+=1},e},g=function(r){var n=e.MODE_8BIT_BYTE,o=t.stringToBytes(r),a={}
return a.getMode=function(){return n},a.getLength=function(r){return o.length},a.write=function(r){for(var t=0;t<o.length;t+=1)r.put(o[t],8)},a},c=function(){var r=[],t={}
return t.writeByte=function(t){r.push(255&t)},t.writeShort=function(r){t.writeByte(r),t.writeByte(r>>>8)},t.writeBytes=function(r,e,n){e=e||0,n=n||r.length
for(var o=0;n>o;o+=1)t.writeByte(r[o+e])},t.writeString=function(r){for(var e=0;e<r.length;e+=1)t.writeByte(r.charCodeAt(e))},t.toByteArray=function(){return r},t.toString=function(){var t=""
t+="["
for(var e=0;e<r.length;e+=1)e>0&&(t+=","),t+=r[e]
return t+="]"},t},h=function(){var r=0,t=0,e=0,n="",o={},a=function(r){n+=String.fromCharCode(i(63&r))},i=function(r){if(0>r);else{if(26>r)return 65+r
if(52>r)return 97+(r-26)
if(62>r)return 48+(r-52)
if(62==r)return 43
if(63==r)return 47}throw Error("n:"+r)}
return o.writeByte=function(n){for(r=r<<8|255&n,t+=8,e+=1;t>=6;)a(r>>>t-6),t-=6},o.flush=function(){if(t>0&&(a(r<<6-t),r=0,t=0),e%3!=0)for(var o=3-e%3,i=0;o>i;i+=1)n+="="},o.toString=function(){return n},o},v=function(r){var t=r,e=0,n=0,o=0,a={}
a.read=function(){for(;8>o;){if(e>=t.length){if(0==o)return-1
throw Error("unexpected end of file./"+o)}var r=t.charAt(e)
if(e+=1,"="==r)return o=0,-1
r.match(/^\s$/)||(n=n<<6|i(r.charCodeAt(0)),o+=6)}var a=n>>>o-8&255
return o-=8,a}
var i=function(r){if(r>=65&&90>=r)return r-65
if(r>=97&&122>=r)return r-97+26
if(r>=48&&57>=r)return r-48+52
if(43==r)return 62
if(47==r)return 63
throw Error("c:"+r)}
return a},l=function(r,t){var e=r,n=t,o=Array(r*t),a={}
a.setPixel=function(r,t,n){o[t*e+r]=n},a.write=function(r){r.writeString("GIF87a"),r.writeShort(e),r.writeShort(n),r.writeByte(128),r.writeByte(0),r.writeByte(0),r.writeByte(0),r.writeByte(0),r.writeByte(0),r.writeByte(255),r.writeByte(255),r.writeByte(255),r.writeString(","),r.writeShort(0),r.writeShort(0),r.writeShort(e),r.writeShort(n),r.writeByte(0)
var t=2,o=u(t)
r.writeByte(t)
for(var a=0;o.length-a>255;)r.writeByte(255),r.writeBytes(o,a,255),a+=255
r.writeByte(o.length-a),r.writeBytes(o,a,o.length-a),r.writeByte(0),r.writeString(";")}
var i=function(r){var t=r,e=0,n=0,o={}
return o.write=function(r,o){if(r>>>o!=0)throw Error("length over")
for(;e+o>=8;)t.writeByte(255&(r<<e|n)),o-=8-e,r>>>=8-e,n=0,e=0
n=r<<e|n,e+=o},o.flush=function(){e>0&&t.writeByte(n)},o},u=function(r){for(var t=1<<r,e=(1<<r)+1,n=r+1,a=f(),u=0;t>u;u+=1)a.add(String.fromCharCode(u))
a.add(String.fromCharCode(t)),a.add(String.fromCharCode(e))
var g=c(),h=i(g)
h.write(t,n)
var v=0,l=String.fromCharCode(o[v])
for(v+=1;v<o.length;){var s=String.fromCharCode(o[v])
v+=1,a.contains(l+s)?l+=s:(h.write(a.indexOf(l),n),a.size()<4095&&(a.size()==1<<n&&(n+=1),a.add(l+s)),l=s)}return h.write(a.indexOf(l),n),h.write(e,n),h.flush(),g.toByteArray()},f=function(){var r={},t=0,e={}
return e.add=function(n){if(e.contains(n))throw Error("dup key:"+n)
r[n]=t,t+=1},e.size=function(){return t},e.indexOf=function(t){return r[t]},e.contains=function(t){return void 0!==r[t]},e}
return a},s=function(r,t,e,n){for(var o=l(r,t),a=0;t>a;a+=1)for(var i=0;r>i;i+=1)o.setPixel(i,a,e(i,a))
var u=c()
o.write(u)
for(var f=h(),g=u.toByteArray(),v=0;v<g.length;v+=1)f.writeByte(g[v])
f.flush()
var s=""
return s+="<img",s+=' src="',s+="data:image/gif;base64,",s+=f,s+='"',s+=' width="',s+=r,s+='"',s+=' height="',s+=t,s+='"',n&&(s+=' alt="',s+=n,s+='"'),s+="/>"}
return t}()
!function(r){"function"==typeof define&&define.amd?define([],r):"object"==typeof exports&&(module.exports=r())}(function(){return qrcode})
