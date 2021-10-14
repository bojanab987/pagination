const btnPrev=document.querySelector('.js-btn-prev');
const btnNext=document.querySelector('.js-btn-next');
const displayDiv=document.querySelector('.js-display-users');
const pageEl=document.querySelector('.js-current-pg');
const totalPages=document.querySelector('.js-pg-total')

let current_page = 0;
let page_limit = 0;
const CURRENT_PG = 1;
const LIMIT = 10;
let morePgs=true;

document.addEventListener('DOMContentLoaded', async () => {
    current_page = await getParam('page');
    page_limit = await getParam('limit');

    if (!current_page || !page_limit) {
        page_limit = LIMIT
        await getUsers(CURRENT_PG, LIMIT);
        pageEl.innerHTML = CURRENT_PG;
        await updateURL(CURRENT_PG, LIMIT);
    } else {

        await getUsers(current_page, page_limit);
    }
})

async function getParam(parameter) {
    const query = window.location.search;
    const paramsUrl = new URLSearchParams(query);
    const pageOrLim = paramsUrl.get(parameter);
    return pageOrLim;
}

async function updateURL(page, limit) {
    var newRelativePathQuery = window.location.pathname + `?page=${page}&limit=${limit}`
    window.history.pushState(null, '', newRelativePathQuery);

}

async function getUsers(page, limit) {
    const response=await fetch(`http://localhost:3001/api/users?page=${page}&limit=${limit}`)    
    const data = await response.json();
    const users = data.results;
    //    console.log(data)
    displayDiv.innerHTML = "";
    for (let i = 0; i < users.length; i++) {
        // console.log(data.results[i])
             const list=
                 `<ul class="list">  ${users[i].name}  
                <li>Id: ${users[i].id}</li>
                <li>Email: ${users[i].email}</li>
                <li>Address: ${users[i].address}</li>
                <li>Country: ${users[i].country}</li>
                <li>Company: ${users[i].company}</li>
                </ul><br>`;
            displayDiv.insertAdjacentHTML("beforeend",list)
    }
    
    morePgs = data.hasMore;
    enableDisableBtns(page, morePgs);
    pageEl.textContent = page;
    totalPages.textContent = countTotalPages(limit);
    updateURL(page, limit)
    console.log(page)
    console.log(limit)
}

function enableDisableBtns(page, morePgs) {
    if (page === 1) {
        btnPrev.disabled = true;
        btnNext.disabled = false;
    } else btnPrev.disabled = false;

    if (morePgs === false) {
        btnNext.disabled = true;
        btnPrev.disabled = false;
    } else btnNext.disabled = false;
}


btnPrev.addEventListener('click', async () => {
    current_page = await getParam('page');
    if(current_page > 1){
        current_page--;
        getUsers(current_page,page_limit)
        await updateURL(current_page, page_limit)
    } else {
        return;
    }
    pageEl.textContent = current_page;

})

btnNext.addEventListener('click', async () => {
    current_page = await getParam('page');

    if(morePgs){
        current_page++;
        getUsers(current_page, page_limit)
        await updateURL(current_page, page_limit)
    }
    pageEl.textContent = current_page;
});

function countTotalPages(limit) {
    let total = Math.ceil(45 / limit);
    return total;
}