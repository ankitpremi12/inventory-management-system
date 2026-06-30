/* Advanced To-Do List — App Logic (Vanilla JS, LocalStorage) */
(function(){
  const LS_KEYS = {TASKS:'adv_todo_tasks', CATEGORIES:'adv_todo_cats', SETTINGS:'adv_todo_settings'}

  const q = sel => document.querySelector(sel)
  const qa = sel => Array.from(document.querySelectorAll(sel))

  // Elements
  const taskListEl = q('#task-list')
  const addBtn = q('#add-task-btn')
  const modal = q('#modal')
  const form = q('#task-form')
  const cancelBtn = q('#cancel-btn')
  const searchInput = q('#search')
  const categoryListEl = q('#category-list')
  const newCategoryInput = q('#new-category-input')
  const addCategoryBtn = q('#add-category-btn')
  const filterPriority = q('#filter-priority')
  const filterStatus = q('#filter-status')
  const sortBy = q('#sort-by')
  const progressText = q('#progress-text')
  const progressFill = q('#progress-fill')
  const settingsBtn = q('#open-settings')
  const settingsPanel = q('#settings')
  const closeSettings = q('#close-settings')
  const themeSelect = q('#theme-select')
  const toggleTheme = q('#toggle-theme')

  let tasks = []
  let categories = []
  let settings = {theme:'system'}

  // Storage helpers
  function load(){
    try{tasks = JSON.parse(localStorage.getItem(LS_KEYS.TASKS) || '[]')}
    catch(e){tasks=[]}
    try{categories = JSON.parse(localStorage.getItem(LS_KEYS.CATEGORIES) || '[]')}
    catch(e){categories=[]}
    try{settings = JSON.parse(localStorage.getItem(LS_KEYS.SETTINGS) || JSON.stringify(settings))}
    catch(e){}
    applyTheme(settings.theme)
  }
  function save(){
    localStorage.setItem(LS_KEYS.TASKS, JSON.stringify(tasks))
    localStorage.setItem(LS_KEYS.CATEGORIES, JSON.stringify(categories))
    localStorage.setItem(LS_KEYS.SETTINGS, JSON.stringify(settings))
  }

  // UI helpers
  function openModal(editTask){
    modal.classList.remove('hidden')
    if(editTask){
      q('#modal-title').textContent = 'Edit Task'
      q('#task-id').value = editTask.id
      q('#task-title').value = editTask.title
      q('#task-desc').value = editTask.description || ''
      q('#task-due').value = editTask.dueDate || ''
      q('#task-priority').value = editTask.priority || 'medium'
      q('#task-category').value = editTask.category || ''
    } else {
      q('#modal-title').textContent = 'Add Task'
      form.reset(); q('#task-id').value = ''
    }
  }
  function closeModal(){modal.classList.add('hidden')}

  function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,8)}

  // Task CRUD
  function addTask(data){
    const t = Object.assign({
      id: uid(), title:'',description:'',dueDate:null,priority:'medium',category:'',completed:false,createdAt:Date.now(),updatedAt:Date.now()
    }, data)
    tasks.push(t)
    if(t.category && !categories.includes(t.category)) categories.push(t.category)
    save(); render()
  }
  function updateTask(id, patch){
    const i = tasks.findIndex(x=>x.id===id); if(i===-1) return
    tasks[i] = {...tasks[i], ...patch, updatedAt:Date.now()}
    if(tasks[i].category && !categories.includes(tasks[i].category)) categories.push(tasks[i].category)
    save(); render()
  }
  function removeTask(id){tasks = tasks.filter(x=>x.id!==id); save(); render()}
  function toggleComplete(id){const t = tasks.find(x=>x.id===id); if(!t) return; t.completed = !t.completed; t.updatedAt=Date.now(); save(); render()}

  // Rendering
  function renderCategories(){
    categoryListEl.innerHTML = ''
    const all = document.createElement('li'); all.textContent='All'; all.classList.add('active'); all.dataset.cat=''; categoryListEl.appendChild(all)
    categories.forEach(cat=>{
      const li = document.createElement('li'); li.textContent = cat; li.dataset.cat = cat; categoryListEl.appendChild(li)
    })
  }

  function getFiltered(){
    const qText = searchInput.value.trim().toLowerCase()
    const p = filterPriority.value
    const s = filterStatus.value
    const sort = sortBy.value
    const selectedCatLi = categoryListEl.querySelector('li.active')
    const cat = selectedCatLi ? selectedCatLi.dataset.cat : ''

    let res = tasks.slice()
    if(qText) res = res.filter(t=> (t.title||'').toLowerCase().includes(qText) || (t.description||'').toLowerCase().includes(qText))
    if(p!=='all') res = res.filter(t=>t.priority===p)
    if(s==='active') res = res.filter(t=>!t.completed)
    if(s==='completed') res = res.filter(t=>t.completed)
    if(cat) res = res.filter(t=>t.category===cat)

    // sort
    if(sort==='createdDesc') res.sort((a,b)=>b.createdAt-a.createdAt)
    else if(sort==='createdAsc') res.sort((a,b)=>a.createdAt-b.createdAt)
    else if(sort==='dueAsc') res.sort((a,b)=> (a.dueDate||'') > (b.dueDate||'') ? 1:-1)
    else if(sort==='dueDesc') res.sort((a,b)=> (a.dueDate||'') < (b.dueDate||'') ? 1:-1)
    else if(sort==='priorityDesc'){
      const map={high:3,medium:2,low:1}; res.sort((a,b)=> (map[b.priority]||0)-(map[a.priority]||0))
    }

    return res
  }

  function render(){
    renderCategories()
    const list = getFiltered()
    taskListEl.innerHTML = ''
    if(list.length===0){taskListEl.innerHTML='<p style="color:var(--muted)">No tasks found.</p>';}
    list.forEach(task=>{
      const card = document.createElement('article'); card.className='task-card'
      const top = document.createElement('div'); top.className='task-row'
      const left = document.createElement('div')
      const title = document.createElement('div'); title.className='task-title'; title.textContent = task.title
      const meta = document.createElement('div'); meta.className='task-meta'; meta.textContent = `${task.category || 'No category'} · ${task.dueDate||'No due'}`
      left.appendChild(title); left.appendChild(meta)

      const right = document.createElement('div'); right.className='actions'
      const completeBtn = document.createElement('button'); completeBtn.className='icon-small'; completeBtn.textContent = task.completed ? '✅' : '◻️'
      completeBtn.onclick = ()=>toggleComplete(task.id)
      const editBtn = document.createElement('button'); editBtn.className='icon-small'; editBtn.textContent='✏️'; editBtn.onclick = ()=>openModal(task)
      const delBtn = document.createElement('button'); delBtn.className='icon-small'; delBtn.textContent='🗑️'; delBtn.onclick = ()=>{ if(confirm('Delete task?')) removeTask(task.id)}
      const pri = document.createElement('span'); pri.className = `chip ${task.priority||'medium'}`; pri.textContent = task.priority
      right.appendChild(pri); right.appendChild(completeBtn); right.appendChild(editBtn); right.appendChild(delBtn)

      top.appendChild(left); top.appendChild(right)
      card.appendChild(top)
      const desc = document.createElement('div'); desc.textContent = task.description || ''; desc.className='task-desc'
      card.appendChild(desc)
      taskListEl.appendChild(card)
    })

    // progress
    const total = tasks.length; const done = tasks.filter(t=>t.completed).length
    progressText.textContent = `${done} / ${total}`
    const percent = total? Math.round((done/total)*100):0
    progressFill.style.width = percent + '%'
    save()
  }

  // Events
  addBtn.addEventListener('click', ()=>openModal())
  cancelBtn.addEventListener('click', ()=>closeModal())
  modal.addEventListener('click', e=>{ if(e.target===modal) closeModal() })
  form.addEventListener('submit', e=>{
    e.preventDefault(); const id = q('#task-id').value; const payload = {
      title: q('#task-title').value.trim(), description: q('#task-desc').value.trim(), dueDate: q('#task-due').value||null,
      priority: q('#task-priority').value, category: q('#task-category').value.trim()
    }
    if(!payload.title) return alert('Title required')
    if(id) updateTask(id, payload)
    else addTask(payload)
    form.reset(); closeModal()
  })

  searchInput.addEventListener('input', ()=>render())
  filterPriority.addEventListener('change', ()=>render())
  filterStatus.addEventListener('change', ()=>render())
  sortBy.addEventListener('change', ()=>render())

  categoryListEl.addEventListener('click', e=>{
    if(e.target.tagName!=='LI') return
    qa('#category-list li').forEach(li=>li.classList.remove('active'))
    e.target.classList.add('active'); render()
  })

  addCategoryBtn.addEventListener('click', ()=>{
    const v = newCategoryInput.value.trim(); if(!v) return; if(!categories.includes(v)) categories.push(v); newCategoryInput.value=''; save(); render()
  })

  settingsBtn.addEventListener('click', ()=>settingsPanel.classList.toggle('hidden'))
  closeSettings.addEventListener('click', ()=>settingsPanel.classList.add('hidden'))
  themeSelect.value = settings.theme || 'system'
  themeSelect.addEventListener('change', ()=>{ settings.theme = themeSelect.value; applyTheme(settings.theme); save() })
  toggleTheme.addEventListener('click', ()=>{ settings.theme = settings.theme==='dark'?'light':'dark'; applyTheme(settings.theme); save() })

  function applyTheme(mode){
    if(mode==='system'){
      document.documentElement.removeAttribute('data-theme')
    } else {
      document.documentElement.setAttribute('data-theme', mode)
    }
  }

  // init
  load(); render();

  // Expose small API for debugging
  window.advTodo = {addTask, updateTask, removeTask, tasks, categories}

})();
