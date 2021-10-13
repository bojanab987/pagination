const btnPrev=document.querySelector('.js-btn-prev');
const btnNext=document.querySelector('.js-btn-next');
const displayDiv=document.querySelector('.js-display-users');
const pageEl=document.querySelector('.js-current-pg');
const totalPages=document.querySelector('.js-pg-total')

let current_page=1;
let page_limit=10;
let morePgs=true;

async function getUsers(page,limit){
    const response=await fetch(`http://localhost:3001/api/users?page=${page}&limit=${limit}`)    
    const data= await response.json();
   console.log(data)
   displayDiv.innerHTML="";     
    for(let i=0; i<data.results.length;i++){
        console.log(data.results[i])
             const list=
                `<ul class="list">  ${data.results[i].name}  
                <li>Id: ${data.results[i].id}</li>
                <li>Email: ${data.results[i].email}</li>
                <li>Address: ${data.results[i].address}</li>
                <li>Country: ${data.results[i].country}</li>
                <li>Company: ${data.results[i].company}</li>
                </ul><br>`;
            displayDiv.insertAdjacentHTML("beforeend",list)
       }    
    
       morePgs=data.hasMore;
       pageEl.textContent=page;
       
   console.log(morePgs)
   console.log(data.results.length)
}

getUsers(current_page,page_limit);

btnPrev.addEventListener('click', (e)=>{
    if(current_page > 1){
        current_page--;
        getUsers(current_page,page_limit)
    } else{  
        btnPrev.disapled=true;      
        return;
    }
    pageEl.textContent=current_page;
})

btnNext.addEventListener('click', (e)=>{
    if(morePgs){
        current_page++;
    getUsers(current_page,page_limit)
}else{
    btnNext.disapled=true;
}
pageEl.textContent=current_page;
})