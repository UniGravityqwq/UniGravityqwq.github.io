async function loadJSON(id) {
    try {
        const response = await fetch(`dat${id}.json`); // 同目录下的 JSON 文件
        if (!response.ok) throw new Error('文件加载失败');
        return await response.json();
    } catch (error) {
        console.error('加载JSON出错:', error);
        return []; // 返回空数组避免后续出错
    }
}

async function DoInputSearch() {
    const searchValue = document.getElementById('searchInput').value.trim().toUpperCase();
    
    searchContent(searchValue);
}

async function searchContent(searchValue) {
    const resultsContainer = document.getElementById('results');
    
    // 清空结果容器
    resultsContainer.innerHTML = '';
    
    let errInput=0;
    let jsonData=0,results=0;

    if (!searchValue) {
        errInput=1;
    }else{
        let searchValue2=searchValue.slice(1);
        numid=Number(searchValue2);
        if(Number.isNaN(numid))errInput=1;
        else{
            qryid=0;
            if(1000<=numid&&numid<2000)qryid=1;
            if(2000<=numid&&numid<3000)qryid=2;
            if(3000<=numid&&numid<4000)qryid=3;
            if(4000<=numid&&numid<5000)qryid=4;
            if(5000<=numid&&numid<6000)qryid=5;
            if(6000<=numid&&numid<7000)qryid=6;
            if(7000<=numid&&numid<8000)qryid=7;
            if(8000<=numid&&numid<9000)qryid=8;
            if(9000<=numid&&numid<10000)qryid=9;
            if(10000<=numid&&numid<11000)qryid=10;
            if(11000<=numid&&numid<12000)qryid=11;
            if(12000<=numid&&numid<13000)qryid=12;
            if(13000<=numid&&numid<14000)qryid=13;
            // if(14000<=numid&&numid<15000)qryid=14;

            /*
                冗余的 if 判断
                qryid 的判断可以用更简洁的数学方式或 switch/case，或者直接用公式计算。
                例如：qryid = Math.floor((numid - 1000) / 1000) + 1;，再判断范围。
            */

            if(!qryid)errInput=1;
            else{
                console.log(qryid);
                // 在JSON数据中查找匹配项
                // const 
                jsonData = await loadJSON(qryid);
                // const 
                results = jsonData.filter(item => item.id === searchValue);
                
                if (results.length === 0) {
                    errInput=1;
                }
            }
        }
    }
    
    if(errInput){
        resultsContainer.innerHTML = `
            <div class="problembox">
                <div style="display: flex;justify-content: center;">
                    <h2 style="color:#FE4C61;">未找到 ${searchValue}</h2>
                </div>
                <div style="display: flex;justify-content: center;color:#ddd;">
                    <div>
                        <p>这是一些预料内的可能原因：</p>
                        <p style="font-size:20px;">一、题目不存在或被隐藏。<a style="font-size:16px;">（目前只有洛谷主题库数据，即以 P 开头的题目）</a></p>
                        <p style="font-size:20px;color:#ddd;">二、难度过低（<a style="font-weight:bold;color:#52C41A;">绿题</a>及以下）的题目数据将暂时不会收录。<a style="font-size:16px;">（后续可能会进一步收录绿题相关 Hint）</a></p>
                        <p style="font-size:20px;">三、题目没有题解。<a style="font-size:16px;">（按照题解标题寻找，因此可能存在某些题解未被搜索到，可以根据下文进行反馈）</a></p>
                        <br>
                        <p>如果发现预料外的问题，<a style="font-size:20px;">请先确认该问题不属于上述原因</a></p>
                        <p>例如：<a style="font-size:20px;">题目为新增、题目的难度升为蓝题及以上、有人写了该题题解、题目或题解的爬取存在问题</a></p>
                        <p>如果确实存在问题，可以联系 <a href="https://www.luogu.com.cn/chat?uid=582360" style="font-size: 20px;font-weight:bold;color:#3498DB;text-decoration:none;">@UniGravity</a></p>
                        <br>
                    </div>
                </div>
            </div>
        `;
        return;
    }

    const diffcolor=["#BFBFBF","#FE4C61","#F39C11","#FFC31C","#52C41A","#3498DB","#9D3DCF","#0E1D69"];
    const difftext=["暂无评定","入门","普及-","普及/提高-","普及+/提高","提高+/省选-","省选/NOI-","NOI/NOI+/CTSC"];
    
    // 显示匹配结果
    results.forEach(item => {
        const resultElement = document.createElement('div');
        resultElement.className = 'result-item';
        
        // // 高亮显示搜索词
        // const highlightedContent = item.content.replace(
        //     new RegExp(searchValue, 'gi'), 
        //     match => `<span class="highlight">${match}</span>`
        // );
        
        resultElement.innerHTML = `
            <div class="problembox">
                <a style="margin-top:-3px;font-weight:bold;font-size:24px;">${item.title}</a><a style="float: right;" href="https://www.luogu.com.cn/chat?uid=582360"><button class="modal-button">反馈问题</button></a><br><br>
                <a class="difftag" style="background-color:#FE4C61;" href="https://www.luogu.com.cn/problem/${item.id}">&nbsp;原题链接&nbsp;</a>&nbsp;&nbsp;
                <a class="difftag" style="background-color:#F39C11;" href="https://www.luogu.com.cn/problem/solution/${item.id}">&nbsp;题解链接&nbsp;</a>&nbsp;&nbsp;
                <a class="difftag" style="background-color:${diffcolor[item.diff]};">&nbsp;${difftext[item.diff]}&nbsp;</a>
                <br><br>
            </div>
            <div class="ansbox" id="ansbox1">
                <button class="hintbtn" id="hintbtn1">提示 1</button>
                <p id="hintext1">${item.hint1}</p>
            </div>
            <div class="ansbox" id="ansbox2">
                <button class="hintbtn" id="hintbtn2">提示 2</button>
                <p id="hintext2">${item.hint2}</p>
            </div>
            <div class="ansbox" id="ansbox3">
                <button class="hintbtn" id="hintbtn3">提示 3</button>
                <p id="hintext3">${item.hint3}</p>
            </div>
            <div class="ansbox" id="ansbox4">
                <button class="hintbtn" id="hintbtn4">提示 4</button>
                <p id="hintext4">${item.hint4}</p>
            </div>
            <div class="ansbox" id="ansbox5">
                <button class="hintbtn" id="hintbtn5">提示 5</button>
                <p id="hintext5">${item.hint5}</p>
            </div>
            
        `;
        
        resultsContainer.appendChild(resultElement);
        
        const btn1=document.getElementById("hintbtn1");const div1=document.getElementById("hintext1");const box1=document.getElementById("ansbox1");const customConfirm1=document.getElementById('customConfirm1');const confirmYes1=document.getElementById('confirmYes1');const confirmNo1=document.getElementById('confirmNo1');btn1.addEventListener("click",()=>{if(btn1.classList.contains("hintbtndown")){btn1.classList.toggle("hintbtndown");div1.classList.toggle("transhint");box1.classList.toggle("bigansbox");}else{customConfirm1.style.display='flex';}});confirmYes1.addEventListener('click',()=>{customConfirm1.style.display='none';btn1.classList.toggle("hintbtndown");div1.classList.toggle("transhint");box1.classList.toggle("bigansbox");});confirmNo1.addEventListener('click',()=>{customConfirm1.style.display='none';});
        const btn2=document.getElementById("hintbtn2");const div2=document.getElementById("hintext2");const box2=document.getElementById("ansbox2");const customConfirm2=document.getElementById('customConfirm2');const confirmYes2=document.getElementById('confirmYes2');const confirmNo2=document.getElementById('confirmNo2');btn2.addEventListener("click",()=>{if(btn2.classList.contains("hintbtndown")){btn2.classList.toggle("hintbtndown");div2.classList.toggle("transhint");box2.classList.toggle("bigansbox");}else{customConfirm2.style.display='flex';}});confirmYes2.addEventListener('click',()=>{customConfirm2.style.display='none';btn2.classList.toggle("hintbtndown");div2.classList.toggle("transhint");box2.classList.toggle("bigansbox");});confirmNo2.addEventListener('click',()=>{customConfirm2.style.display='none';});
        const btn3=document.getElementById("hintbtn3");const div3=document.getElementById("hintext3");const box3=document.getElementById("ansbox3");const customConfirm3=document.getElementById('customConfirm3');const confirmYes3=document.getElementById('confirmYes3');const confirmNo3=document.getElementById('confirmNo3');btn3.addEventListener("click",()=>{if(btn3.classList.contains("hintbtndown")){btn3.classList.toggle("hintbtndown");div3.classList.toggle("transhint");box3.classList.toggle("bigansbox");}else{customConfirm3.style.display='flex';}});confirmYes3.addEventListener('click',()=>{customConfirm3.style.display='none';btn3.classList.toggle("hintbtndown");div3.classList.toggle("transhint");box3.classList.toggle("bigansbox");});confirmNo3.addEventListener('click',()=>{customConfirm3.style.display='none';});
        const btn4=document.getElementById("hintbtn4");const div4=document.getElementById("hintext4");const box4=document.getElementById("ansbox4");const customConfirm4=document.getElementById('customConfirm4');const confirmYes4=document.getElementById('confirmYes4');const confirmNo4=document.getElementById('confirmNo4');btn4.addEventListener("click",()=>{if(btn4.classList.contains("hintbtndown")){btn4.classList.toggle("hintbtndown");div4.classList.toggle("transhint");box4.classList.toggle("bigansbox");}else{customConfirm4.style.display='flex';}});confirmYes4.addEventListener('click',()=>{customConfirm4.style.display='none';btn4.classList.toggle("hintbtndown");div4.classList.toggle("transhint");box4.classList.toggle("bigansbox");});confirmNo4.addEventListener('click',()=>{customConfirm4.style.display='none';});
        const btn5=document.getElementById("hintbtn5");const div5=document.getElementById("hintext5");const box5=document.getElementById("ansbox5");const customConfirm5=document.getElementById('customConfirm5');const confirmYes5=document.getElementById('confirmYes5');const confirmNo5=document.getElementById('confirmNo5');btn5.addEventListener("click",()=>{if(btn5.classList.contains("hintbtndown")){btn5.classList.toggle("hintbtndown");div5.classList.toggle("transhint");box5.classList.toggle("bigansbox");}else{customConfirm5.style.display='flex';}});confirmYes5.addEventListener('click',()=>{customConfirm5.style.display='none';btn5.classList.toggle("hintbtndown");div5.classList.toggle("transhint");box5.classList.toggle("bigansbox");});confirmNo5.addEventListener('click',()=>{customConfirm5.style.display='none';});
    });
}

// 添加键盘支持
document.getElementById('searchInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        DoInputSearch();
    }
});


function getURLParams(url) {
    const params = {};
    const regex = /[?&]([^=#]+)=([^&#]*)/g;
    let match;
    while ((match = regex.exec(url)) !== null) {
        params[decodeURIComponent(match[1])] = decodeURIComponent(match[2]);
    }
    return params;
}

const url = window.location.href;
const params = getURLParams(url);

if (params.ask) {
    searchContent(params.ask);
}


// const actionBtn = document.getElementById('actionBtn');
// const customConfirm = document.getElementById('customConfirm');
// const confirmYes = document.getElementById('confirmYes');
// const confirmNo = document.getElementById('confirmNo');

// // 点击按钮显示弹窗
// actionBtn.addEventListener('click', () => {
//   customConfirm.style.display = 'flex';
// });

// // 点击"确定"
// confirmYes.addEventListener('click', () => {
//   customConfirm.style.display = 'none';
//   // 执行实际业务逻辑（如删除数据）
//   console.log("用户确认操作");
// });

// // 点击"取消"
// confirmNo.addEventListener('click', () => {
//   customConfirm.style.display = 'none';
// });