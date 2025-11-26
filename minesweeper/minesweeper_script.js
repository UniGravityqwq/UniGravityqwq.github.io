let B=30;

document.addEventListener('DOMContentLoaded', function() {
    const dropArea = document.getElementById('drop-area');
    const fileInput = document.getElementById('file-input');
    const browseBtn = document.querySelector('.browse-btn');
    const uploadedImage = document.getElementById('uploaded-image');
    const imageCanvas = document.getElementById('image-canvas');
    const ctx = imageCanvas.getContext('2d');
    
    let imageData = null;
    let imageWidth = 0;
    let imageHeight = 0;
    
    // 点击浏览按钮触发文件选择
    browseBtn.addEventListener('click', function() {
        fileInput.click();
    });
    
    // 文件选择变化
    fileInput.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
            handleImageUpload(e.target.files[0]);
        }
    });
    
    // 拖放事件处理
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false);
    });
    
    function highlight() {
        dropArea.classList.add('dragover');
    }
    
    function unhighlight() {
        dropArea.classList.remove('dragover');
    }
    
    // 处理拖放文件
    dropArea.addEventListener('drop', function(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        
        if (files.length > 0) {
            handleImageUpload(files[0]);
        }
    }, false);
    
    // 处理图片上传
    function handleImageUpload(file) {
        if (!file.type.match('image.*')) {
            alert('请上传图片文件！');
            return;
        }
        
        const reader = new FileReader();
        
        reader.onload = function(e) {
            uploadedImage.src = e.target.result;
            
            uploadedImage.onload = function() {
                imageWidth = uploadedImage.width;
                imageHeight = uploadedImage.height;
                
                // 设置canvas尺寸与图片相同
                imageCanvas.width = imageWidth;
                imageCanvas.height = imageHeight;
                
                // 绘制图片到canvas
                ctx.drawImage(uploadedImage, 0, 0, imageWidth, imageHeight);

                getGrid(uploadedImage);
            };
        };
        
        reader.readAsDataURL(file);
    }
    let dat,w,h,imgW,imgH,imgDeltaX,imgDeltaY,bombCnt,notSureBombCnt;
    // 获取图片某位置的颜色
    function getColor(x,y){
        if(x>=imgW||y>=imgH)return [-1,-1,-1];
        const index = (y * imgW + x) * 4;
        const r = dat.data[index];
        const g = dat.data[index + 1];
        const b = dat.data[index + 2];
        return [r,g,b];
    }
    // 根据颜色生成对应字符串
    function getColorString(col){
        return `rgb(${col[0]},${col[1]},${col[2]})`;
    }

    const NumberColor=[[0,0,247],[0,119,0],[236,0,0],[0,0,128],[128,0,0],[0,128,128],[0,0,0],[112,112,112]];
    const UpColor=[255,255,255],DownColor=[198,198,198],BlackColor=[128,128,128];

    // ----------------------------------------------------------------------------------------------------------------------

    let number=[],flag=[],vis=[],dfn=[],searchFlag=[];

    // 该处是否为数字（即是否点开）
    function isNumber(i,j){
        return number[i][j]!=-1;
    }
    // 初始化数组
    function arrayInit(val){
        let t=[],t1;
        for(let i=0;i<w;i++){
            t1=[];
            for(let j=0;j<h;j++)t1.push(val);
            t.push(t1);
        }
        return t;
    }
    // 在范围内
    function inRect(i,j){
        if(i<0||i>=w||j<0||j>=h)return false;
        else return true;
    }
    // 组合数
    function C(n,m){
        if(n<0||m<0||n<m)return 0.0;
        if(m*2>n)m=n-m;
        let f=1.0;
        for(let i=1;i<=m;i++)f=f*(n-i+1)/i;
        return f;
    }

    function isSearchPoint(x,y){
        if(!inRect(x,y))return false;
        else if(vis[x][y]||flag[x][y])return false;
        else if(isNumber(x,y))return false;
        else if(!isNumberNearside(x,y))return false;
        else return true;
    }

    function getdfn(x,y){
        if(!isSearchPoint(x,y))return;
        vis[x][y]=true,dfn.push([x,y]);
        for(let u=-1;u<=1;u++)for(let v=-1;v<=1;v++)getdfn(x+u,y+v);
        for(let u=-2;u<=2;u++)for(let v=-2;v<=2;v++)getdfn(x+u,y+v);
    }
    function checkNumberBlock(x,y){
        let mn=0,mx=0;
        for(let u=-1;u<=1;u++)for(let v=-1;v<=1;v++){
            let x1=x+u,y1=y+v;
            if(!inRect(x1,y1))continue;
            if(!isNumber(x1,y1)){
                if(searchFlag[x1][y1]==0);
                else if(flag[x1][y1]||searchFlag[x1][y1]==1)mn++,mx++;
                else mx++;
            }
        }
        return mn<=number[x][y]&&number[x][y]<=mx;
    }
    function checkEmptyBlock(x,y){
        for(let u=-1;u<=1;u++)for(let v=-1;v<=1;v++){
            let x1=x+u,y1=y+v;
            if(!inRect(x1,y1))continue;
            if(isNumber(x1,y1)){
                if(!checkNumberBlock(x1,y1))return false;
            }
        }
        return true;
    }
    function isNumberNearside(x,y){
        for(let u=-1;u<=1;u++)for(let v=-1;v<=1;v++){
            let x1=x+u,y1=y+v;
            if(!inRect(x1,y1))continue;
            if(isNumber(x1,y1))return true;
        }
        return false;
    }

    class Poly{
        constructor(){
            this.a=[];
        }
        simplify(){
            while(this.a.length>0&&this.a[this.a.length-1]==0)this.a.pop();
        }
        add(p,v){
            while(this.a.length<=p)this.a.push(0);
            this.a[p]+=v;
        }
        empty(){
            this.simplify();
            return (this.a.length==0);
        }
        equal(o){
            this.simplify(),o.simplify();
            if(this.a.length!=o.a.length)return false;
            for(let i=0;i<this.a.length;i++)if(this.a[i]!=o.a[i])return false;
            return true;
        }
        sum(){
            let s=0;
            for(let v of this.a)s+=v;
            return s;
        }
    }
    function merge(x,y){
        x.simplify(),y.simplify();
        let z=new Poly();
        for(let i=0;i<x.a.length;i++)for(let j=0;j<y.a.length;j++){
            z.add(i+j,x.a[i]*y.a[j]);
        }
        z.simplify();
        return z;
    }

    // 搜索连通块方案数
    let mustBeSelected;
    function searchVaildSolution(h,bombCur,ans){
        if(bombCur>notSureBombCnt)return;
        if(h>=dfn.length){
            // console.log(bombCur);
            ans.add(bombCur,1);
            return;
        }
        let x=dfn[h][0],y=dfn[h][1];
        if(mustBeSelected==null||mustBeSelected[0]!=x||mustBeSelected[1]!=y){
            searchFlag[x][y]=0;
            if(checkEmptyBlock(x,y))searchVaildSolution(h+1,bombCur,ans);
        }
        searchFlag[x][y]=1;
        if(checkEmptyBlock(x,y))searchVaildSolution(h+1,bombCur+1,ans);
        searchFlag[x][y]=-1;
    }

    let bombProbability,isBomb,isNotBomb;
    function searchGrid(){
        bombCnt=getBoomNumber(),notSureBombCnt=bombCnt;
        let insideBlockCnt=0;
        for(let i=0;i<w;i++)for(let j=0;j<h;j++){
            if(flag[i][j])notSureBombCnt--;
            if(!isNumber(i,j)&&!isNumberNearside(i,j))insideBlockCnt++;
        }
        let chooseWeight=[];
        for(let i=0;i<=notSureBombCnt+5;i++){
            chooseWeight.push(C(insideBlockCnt,notSureBombCnt-i));
        }
        console.log("炸弹总数："+bombCnt);
        console.log("旗子数："+(bombCnt-notSureBombCnt));
        console.log("未确定炸弹数："+notSureBombCnt);
        console.log("内部格子数："+insideBlockCnt);
        console.log("组合系数："+chooseWeight);

        vis=arrayInit(false),searchFlag=arrayInit(-1);
        let blockDfn=[],blockFreeRes=[];
        let allBlockFreeRes=new Poly();allBlockFreeRes.add(0,1),searchUsedStep=0,searchUsedStepMul=1;
        for(let i=0;i<w;i++)for(let j=0;j<h;j++){
            if(!isSearchPoint(i,j))continue;
            dfn=[],getdfn(i,j);
            let cntarr=new Poly();
            mustBeSelected=null,searchVaildSolution(0,0,cntarr);
            allBlockFreeRes=merge(allBlockFreeRes,cntarr);
            // console.log(allBlockFreeRes.a);
            console.log("发现的连通块："+dfn+" | "+cntarr.a);
            blockDfn.push(dfn),blockFreeRes.push(cntarr);
            searchUsedStep+=cntarr.sum(),searchUsedStepMul*=cntarr.sum();
        }
        let validSolutionCnt=0;
        for(let i=0;i<allBlockFreeRes.a.length;i++)validSolutionCnt+=allBlockFreeRes.a[i]*chooseWeight[i];
        console.log("卷积后结果："+allBlockFreeRes.a);
        console.log("进行搜索次数："+searchUsedStep);
        console.log("边缘局面数："+searchUsedStepMul);
        console.log("全局局面数："+validSolutionCnt);
        bombProbability=arrayInit(0),isBomb=arrayInit(false),isNotBomb=arrayInit(false);
        let len=blockDfn.length;
        let usedE=0;
        for(let id=0;id<len;id++){
            let otherBlockRes=new Poly();otherBlockRes.add(0,1);
            for(let j=0;j<len;j++)if(j!=id){
                otherBlockRes=merge(otherBlockRes,blockFreeRes[j]);
            }
            for(let pos of blockDfn[id]){
                let blockLimRes=new Poly(),x=pos[0],y=pos[1];
                mustBeSelected=[x,y],dfn=blockDfn[id],searchVaildSolution(0,0,blockLimRes);
                searchUsedStep+=blockLimRes.sum();
                console.log("进行搜索次数："+searchUsedStep);
                if(blockLimRes.empty()){
                    isNotBomb[x][y]=true,bombProbability[x][y]=0.0;
                }else if(blockLimRes.equal(blockFreeRes[id])){
                    isBomb[x][y]=true,bombProbability[x][y]=1.0;
                }else{
                    let resArr=merge(otherBlockRes,blockLimRes),res=0;
                    for(let i=0;i<resArr.a.length;i++)res+=resArr.a[i]*chooseWeight[i];
                    bombProbability[x][y]=res/validSolutionCnt;
                }
                usedE+=bombProbability[x][y];
            }
        }
        let insideBlockP=(notSureBombCnt-usedE)/insideBlockCnt;
        for(let i=0;i<w;i++)for(let j=0;j<h;j++){
            if(!isNumber(i,j)&&!isNumberNearside(i,j))bombProbability[i][j]=insideBlockP;
        }

        let text=document.getElementById('search-res');
        text.innerHTML="炸弹总数："+bombCnt+"&emsp;旗数："+(bombCnt-notSureBombCnt)+"&emsp;未标旗数："+notSureBombCnt+"&emsp;内部格数："+insideBlockCnt+"<br>";
        text.innerHTML+="边缘局面数："+searchUsedStepMul+"&emsp;全局局面数："+validSolutionCnt+"<br>";
        text.innerHTML+="进行搜索次数："+searchUsedStep;
    }

    // ----------------------------------------------------------------------------------------------------------------------

    function interpolation(x,y,val,s,t){
        let p=(val-x)/(y-x);
        return s+(t-s)*p;
    }
    function getGrid(img){
        const grid=document.getElementById('grid');
        grid.innerHTML="";
        imgW=img.width;imgH=img.height;
        dat=ctx.getImageData(0, 0, img.width, img.height);

        imgDeltaX=0,imgDeltaY=0;
        // if(getColorString(getColor(0,0))!=getColorString(DownColor)){
        //     alert("局部截图 "+getColorString(getColor(0,0)));
        //     // 局部截图
        // }else{
            // 全局截图，找起始点
            for(let s=0;s<imgW+imgH;s++){
                let find=0;
                for(let i=0,j=s;i<=s;i++,j--){
                    if(i<10||j<90)continue;
                    if(i>=imgW||j>=imgH)continue;
                    if(getColorString(getColor(i,j))==getColorString(BlackColor)){
                        find=1,imgDeltaX=i+5,imgDeltaY=j+5;
                        break;
                    }
                }
                if(find==1)break;
            }
            // alert(imgDeltaX+' '+imgDeltaY);
        // }

        w=Math.floor(1.0*(img.width-imgDeltaX)/B);
        h=Math.floor(1.0*(img.height-imgDeltaY)/B);
        for(let i=0;i<w;i++){
            let number1=[],flag1=[];
            for(let j=0;j<h;j++){
                let colSet=new Map();
                for(let x=0;x<B;x++)for(let y=0;y<B;y++){
                    let pre=0,col=getColorString(getColor(i*B+x+imgDeltaX,j*B+y+imgDeltaY));
                    if(colSet.has(col))pre=colSet.get(col);
                    colSet.set(col,pre+1);
                }
                if(colSet.get(getColorString(UpColor))>=B){
                    if(colSet.get(getColorString([0,0,0]))>=B/2){
                        flag1.push(true);
                    }else{
                        flag1.push(false);
                    }
                    number1.push(-1);
                }
                else{
                    flag1.push(false);
                    let used=0;
                    for(let num=1;num<=8;num++){
                        let col=getColorString(NumberColor[num-1]);
                        if(colSet.get(col)>=B/2){
                            number1.push(num);used=1;
                            break;
                        }
                    }
                    if(!used){
                        number1.push(0);
                    }
                }
            }
            number.push(number1),flag.push(flag1);
        }

        searchGrid();

        for(let i=0;i<w;i++)for(let j=0;j<h;j++){
            const cur = document.createElement('div');
            cur.style.top=(j*30)+'px';
            cur.style.left=(i*30)+'px';
            cur.className="block";

            if(!isNumber(i,j)){
                const red=[255,0,0],green=[0,200,0],red1=[255,135,135];
                let c=[0,0,0];
                if(isBomb[i][j]||isNotBomb[i][j]||flag[i][j]){
                    if(isNotBomb[i][j])cur.innerHTML='空',c=green;
                    else{
                        if(flag[i][j])cur.innerHTML='旗',c=red1;
                        else cur.innerHTML='雷',c=red;
                    }
                }else{
                    cur.innerHTML=Math.round(bombProbability[i][j]*100);
                    c[0]=255,c[1]=Math.round(interpolation(0,1,bombProbability[i][j],255,50));
                }
                cur.style.backgroundColor=getColorString(c);
            }else{
                cur.style.backgroundColor='rgb(180,180,180)';
                cur.style.fontSize='20px';
                if(number[i][j]==0){
                    cur.innerHTML='';
                }else{
                    cur.style.color=getColorString(NumberColor[number[i][j]-1]);
                    cur.innerHTML=number[i][j];
                }
            }

            grid.appendChild(cur);
        }
        
        const cur = document.createElement('div');
        cur.style.top=(h*30)+'px';
        cur.style.left='0px';
        cur.className="block";
        cur.style.color=cur.style.backgroundColor='rgba(0,0,0,0)';
        grid.appendChild(cur);
    }
});

function isNumeric(str) {
    return !isNaN(str) && str.trim() !== '';
}
function getBoomNumber(){
    let cnt=localStorage.getItem('boomNumber');
    if(cnt==null||!isNumeric(cnt))cnt=0;
    else cnt=parseInt(cnt);
    let text=document.getElementById('boom-number');
    text.value=cnt;
    return cnt;
}
function getBlockSize(){
    let cnt=localStorage.getItem('blockSize');
    if(cnt==null||!isNumeric(cnt))cnt=0;
    else cnt=parseInt(cnt);
    let text=document.getElementById('block-size');
    text.value=cnt;
    return cnt;
}
function getInput(){
    getBoomNumber(),getBlockSize();
}
function changeBoomCnt(){
    let text=document.getElementById('boom-number');
    if(!isNumeric(text.value))return;
    text=parseInt(text.value);
    localStorage.setItem('boomNumber',text);
}
function changeBlockSize(){
    let text=document.getElementById('block-size');
    if(!isNumeric(text.value))return;
    text=parseInt(text.value);
    localStorage.setItem('blockSize',text);
    B=text;
}